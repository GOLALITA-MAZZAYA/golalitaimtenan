import React, { useRef, useState } from "react";
import {
  Keyboard,
  Modal,
  ScrollView,
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import { colors } from "../../components/colors";
import { Formik } from "formik";
import * as Yup from "yup";
import { mainStyles } from "../../styles/mainStyles";
import Input from "../../components/Input/Input";
import FormikSelect from "../../components/Formik/FormikSelect";
import CommonButton from "../../components/CommonButton/CommonButton";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../components/ThemeProvider";
import { connect } from "react-redux";
import { isRTL } from "../../../utils";
import { sized } from "../../Svg";
import EditSvg from "../../assets/edit.svg";
import { phoneRegExp } from "../../../utils";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import ModalInfo from "../../components/ModalInfo/ModalInfo";
import Header from "../../components/Header";
import CloseSvg from "../../assets/close.svg";
import { submitComplaint } from "../../api/merchants";

const EditIcon = sized(EditSvg, 17, 19);
const CloseIcon = sized(CloseSvg, 24, 24);

const ComplaintModal = ({ 
  visible, 
  onClose, 
  user, 
  merchantData = {} 
}) => {
  const [isSuccessComplaint, setIsSuccessComplaint] = useState(false);
  const ref_to_input2 = useRef();
  const ref_to_input3 = useRef();
  const ref_to_input4 = useRef();
  const ref_to_input5 = useRef();
  const ref_to_input6 = useRef();
  const ref_to_input7 = useRef();
  const ref_to_input8 = useRef();
  const ref_to_input9 = useRef();
  const ref_to_input10 = useRef();
  const ref_to_input11 = useRef();
  const [isDateVisible, setIsDateVisible] = useState(false);
  const [isTimeVisible, setIsTimeVisible] = useState(false);
  const { t } = useTranslation();
  const { isDark } = useTheme();

  // Debug: Log the merchant data
  console.log("ComplaintModal merchantData:", merchantData);

  // Complaint type options - commented out for now
  // const complaintTypeOptions = [
  //   { value: "service_quality", label: t("Complaint.types.serviceQuality") },
  //   { value: "offer_promotion", label: t("Complaint.types.offerPromotion") },
  //   { value: "points_rewards", label: t("Complaint.types.pointsRewards") },
  //   { value: "merchant_experience", label: t("Complaint.types.merchantExperience") },
  //   { value: "technical_app", label: t("Complaint.types.technicalApp") },
  //   { value: "billing_payment", label: t("Complaint.types.billingPayment") },
  //   { value: "general_feedback", label: t("Complaint.types.generalFeedback") },
  // ];

  const getDateString = (date) => {
    if (!date.getFullYear) return "";
    return `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
  };

  const getTimeString = (time) => {
    if (!time.getHours) return "";
    return `${time.getHours().toString().padStart(2, "0")}:${time.getMinutes().toString().padStart(2, "0")}`;
  };

  const handleSubmitComplaint = async (values, { setFieldError, setSubmitting }) => {
    try {
      setSubmitting(true);
      
      // Format date and time for API
      const formattedDate = getDateString(values.incident_date);
      const formattedTime = getTimeString(values.incident_time);
      
      // Prepare API request data
      const complaintData = {
        merchant_id: merchantData?.merchant_id || null,
        merchant_name: values.merchant_name,
        date: formattedDate,
        time: formattedTime,
        subject: values.complaint_subject,
        description: values.complaint_description,
        rating: values.rating,
        communication_type: values.preferred_contact_method, // "phone" or "email"
        email: values.email,
        phone: values.phone,
      };
      
      // Make API call using the merchants.js function
      const result = await submitComplaint(complaintData);
      
      console.log("Complaint submitted successfully:", result);
      setIsSuccessComplaint(true);
      
    } catch (error) {
      console.error("Complaint submission error:", error);
      
      // Handle specific error cases
      if (error.message.includes('Invalid User Token')) {
        setFieldError('general', 'Authentication failed. Please try again.');
      } else if (error.message.includes('Missing:')) {
        setFieldError('general', 'Please fill in all required fields.');
      } else if (error.message.includes('rating must be between 1 and 5')) {
        setFieldError('rating', 'Rating must be between 1 and 5.');
      } else if (error.message.includes('communication_type must be')) {
        setFieldError('preferred_contact_method', 'Please select a valid contact method.');
      } else {
        setFieldError('general', error.message || 'Failed to submit complaint. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsSuccessComplaint(false);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={{
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 25,
      }}>
        <View style={{
          backgroundColor: isDark ? colors.darkBlue : colors.white,
          borderRadius: 12,
          width: '100%',
          maxHeight: '80%',
          minHeight: '60%',
          overflow: 'hidden',
        }}>
          {/* Header with close button */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 20,
            paddingTop: 20,
            paddingBottom: 15,
            borderBottomWidth: 1,
            borderBottomColor: isDark ? colors.darkGrey : colors.lightGrey,
          }}>
            <Text style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: isDark ? colors.white : colors.darkBlue,
            }}>
              {t("Complaint.title")}
            </Text>
            <TouchableOpacity onPress={handleClose}>
              <CloseIcon />
            </TouchableOpacity>
          </View>

          <Formik
            initialValues={{
              name: user.name ?? "",
              x_moi_last_name: user.x_moi_last_name ?? "",
              phone: user.phone ?? "+974",
              email: user.email ?? "",
              merchant_name: merchantData?.merchant_name ?? "",
              offer_name: merchantData?.offer_name ?? "",
              // complaint_type: "", // commented out for now
              incident_date: "",
              incident_time: "",
              complaint_subject: "",
              complaint_description: "",
              preferred_contact_method: "",
              rating: 0,
              additional_info: "",
            }}
            validationSchema={Yup.object({
              // Hidden fields validation removed since they're not shown in UI
              // name, phone, email, merchant_name, additional_info are auto-populated
              // complaint_type: Yup.string().required(t("Login.required")), // commented out for now
              incident_date: Yup.string().required(t("Login.required")),
              incident_time: Yup.string().required(t("Login.required")),
              complaint_subject: Yup.string().required(t("Login.required")),
              complaint_description: Yup.string().required(t("Login.required")),
              preferred_contact_method: Yup.string().required(t("Login.required")),
              rating: Yup.number().min(1, t("Complaint.ratingRequired")).required(t("Login.required")),
            })}
            onSubmit={handleSubmitComplaint}
          >
            {({
              values,
              handleChange,
              handleSubmit,
              errors,
              submitCount,
              setFieldValue,
              isSubmitting,
            }) => {
              errors = submitCount > 0 ? errors : {};
              return (
                <>
                  {isSuccessComplaint && (
                    <ModalInfo
                      isSuccess={true}
                      onCancel={handleClose}
                      onSubmit={handleClose}
                      title={t("Complaint.submittedSuccess")}
                      description={t("Complaint.submittedDescription")}
                    />
                  )}
                  <View style={{ flex: 1 }}>
                  <ScrollView
                    style={{ flex: 1, paddingHorizontal: 20 }}
                    contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
                    showsVerticalScrollIndicator={false}
                  >
                      <View style={{ marginTop: 20, marginHorizontal: 4 }}>
                        {/* General Error Display */}
                        {errors.general && (
                          <View style={{
                            backgroundColor: '#ffebee',
                            padding: 12,
                            borderRadius: 8,
                            marginBottom: 20,
                            borderLeftWidth: 4,
                            borderLeftColor: colors.red,
                          }}>
                            <Text style={{
                              color: colors.red,
                              fontSize: 14,
                              fontWeight: '500',
                            }}>
                              {errors.general}
                            </Text>
                          </View>
                        )}
                       
                          
                          {/* Hidden fields - not shown in UI but included in form data for API */}
                          {/* Name, Phone, Email, Merchant Name are automatically populated and sent to API */}
                          
                          {values.offer_name && (
                            <Input
                              innerRef={ref_to_input5}
                              label={t("Complaint.offerName")}
                              value={values.offer_name}
                              onChangeText={handleChange("offer_name")}
                              placeholder={t("Complaint.offerName")}
                              returnKeyType={"next"}
                              error={errors.offer_name}
                              wrapperStyle={{ marginBottom: 20 }}
                              onSubmitEditing={() => ref_to_input7.current.focus()}
                            />
                          )}
                          {/* Complaint type dropdown - commented out for now */}
                          {/* <FormikSelect
                            name="complaint_type"
                            label={t("Complaint.complaintType")}
                            placeholder={t("Complaint.complaintTypePlaceholder")}
                            options={complaintTypeOptions}
                            single={true}
                            wrapperStyle={{ marginBottom: 20 }}
                          /> */}
                          <Input
                            innerRef={ref_to_input7}
                            label={t("Complaint.incidentDate")}
                            value={getDateString(values.incident_date)}
                            onChangeText={() => {}}
                            placeholder={t("Complaint.incidentDate")}
                            returnKeyType={"next"}
                            error={errors.incident_date}
                            wrapperStyle={{ marginBottom: 20 }}
                            onFocus={() => setIsDateVisible(true)}
                            onSubmitEditing={() => Keyboard.dismiss}
                          />
                          <Input
                            innerRef={ref_to_input8}
                            label={t("Complaint.incidentTime")}
                            value={getTimeString(values.incident_time)}
                            onChangeText={() => {}}
                            placeholder={t("Complaint.incidentTime")}
                            returnKeyType={"next"}
                            error={errors.incident_time}
                            wrapperStyle={{ marginBottom: 20 }}
                            onFocus={() => setIsTimeVisible(true)}
                            onSubmitEditing={() => ref_to_input9.current.focus()}
                          />
                          <Input
                            innerRef={ref_to_input9}
                            label={t("Complaint.complaintSubject")}
                            value={values.complaint_subject}
                            onChangeText={handleChange("complaint_subject")}
                            placeholder={t("Complaint.complaintSubjectPlaceholder")}
                            returnKeyType={"next"}
                            error={errors.complaint_subject}
                            wrapperStyle={{ marginBottom: 20 }}
                            onSubmitEditing={() => ref_to_input10.current.focus()}
                          />
                          <Input
                            innerRef={ref_to_input10}
                            value={values.complaint_description}
                            onChangeText={handleChange("complaint_description")}
                            label={t("Complaint.complaintDescription")}
                            placeholder={t("Complaint.complaintDescriptionPlaceholder")}
                            wrapperStyle={{ marginBottom: 20 }}
                            returnKeyType={"next"}
                            onSubmitEditing={() => ref_to_input11.current.focus()}
                            height={120}
                            icon={<EditIcon />}
                            error={errors.complaint_description}
                          />
                          {/* Preferred Contact Method - Radio Buttons */}
                          <View style={{ 
                            marginBottom: 20,
                            alignItems: isRTL() ? 'flex-end' : 'flex-start',
                          }}>
                            <Text style={{
                              fontSize: 16,
                              fontWeight: '500',
                              color: isDark ? colors.white : colors.darkBlue,
                              marginBottom: 10,
                            }}>
                              {t("Complaint.preferredContactMethod")} *
                            </Text>
                            <View style={{ 
                              flexDirection: isRTL() ? 'row-reverse' : 'row', 
                              flexWrap: 'wrap',
                              justifyContent: isRTL() ? 'flex-end' : 'flex-start',
                            }}>
                              {[
                                { value: 'phone', label: t("Complaint.contactMethods.phone") },
                                { value: 'email', label: t("Complaint.contactMethods.email") },
                              ].map((option) => (
                                <TouchableOpacity
                                  key={option.value}
                                  onPress={() => setFieldValue("preferred_contact_method", option.value)}
                                  style={{
                                    flexDirection: isRTL() ? 'row-reverse' : 'row',
                                    alignItems: 'center',
                                    marginRight: isRTL() ? 0 : 20,
                                    marginLeft: isRTL() ? 20 : 0,
                                    marginBottom: 10,
                                    minWidth: 100,
                                  }}
                                >
                                  <View style={{
                                    width: 20,
                                    height: 20,
                                    borderRadius: 10,
                                    borderWidth: 2,
                                    borderColor: values.preferred_contact_method === option.value 
                                      ? (isDark ? colors.white : colors.darkBlue)
                                      : (isDark ? colors.darkGrey : colors.lightGrey),
                                    backgroundColor: values.preferred_contact_method === option.value 
                                      ? (isDark ? colors.white : colors.darkBlue)
                                      : 'transparent',
                                    marginRight: isRTL() ? 0 : 8,
                                    marginLeft: isRTL() ? 8 : 0,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                  }}>
                                    {values.preferred_contact_method === option.value && (
                                      <View style={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: 4,
                                        backgroundColor: isDark ? colors.darkBlue : colors.white,
                                      }} />
                                    )}
                                  </View>
                                  <Text style={{
                                    fontSize: 14,
                                    color: isDark ? colors.white : colors.darkBlue,
                                    textAlign: isRTL() ? 'right' : 'left',
                                    flex: 1,
                                  }}>
                                    {option.label}
                                  </Text>
                                </TouchableOpacity>
                              ))}
                            </View>
                            {errors.preferred_contact_method && (
                              <Text style={{
                                color: colors.red,
                                fontSize: 12,
                                marginTop: 5,
                                textAlign: isRTL() ? 'right' : 'left',
                              }}>
                                {errors.preferred_contact_method}
                              </Text>
                            )}
                          </View>
                          
                          {/* Rating Component */}
                          <View style={{ 
                            marginBottom: 20,
                            alignItems: isRTL() ? 'flex-end' : 'flex-start',
                          }}>
                            <Text style={{
                              fontSize: 16,
                              fontWeight: '500',
                              color: isDark ? colors.white : colors.darkBlue,
                              marginBottom: 10,
                            }}>
                              {t("Complaint.rating")} *
                            </Text>
                            <View style={{
                              flexDirection: isRTL() ? 'row-reverse' : 'row',
                              justifyContent: isRTL() ? 'flex-end' : 'flex-start',
                              alignItems: 'center',
                              flexWrap: 'wrap',
                            }}>
                              {[1, 2, 3, 4, 5].map((star) => (
                                <TouchableOpacity
                                  key={star}
                                  onPress={() => setFieldValue("rating", star)}
                                  style={{
                                    padding: 8,
                                    marginRight: isRTL() ? 0 : 5,
                                    marginLeft: isRTL() ? 5 : 0,
                                  }}
                                >
                                  <Text style={{
                                    fontSize: 28,
                                    color: star <= values.rating 
                                      ? '#FFD700' 
                                      : isDark ? colors.darkGrey : colors.lightGrey,
                                  }}>
                                    ★
                                  </Text>
                                </TouchableOpacity>
                              ))}
                            </View>
                            {errors.rating && (
                              <Text style={{
                                color: colors.red,
                                fontSize: 12,
                                marginTop: 5,
                                textAlign: isRTL() ? 'right' : 'left',
                              }}>
                                {errors.rating}
                              </Text>
                            )}
                          </View>
                          {/* Additional Information field - hidden from UI but included in API data */}
                          {/* <Input
                            value={values.additional_info}
                            onChangeText={handleChange("additional_info")}
                            label={t("Complaint.additionalInfo")}
                            placeholder={t("Complaint.additionalInfoPlaceholder")}
                            wrapperStyle={{ marginBottom: 20 }}
                            returnKeyType={"next"}
                            onSubmitEditing={Keyboard.dismiss}
                            height={100}
                            icon={<EditIcon />}
                            error={errors.additional_info}
                          /> */}
                      </View>
                    </ScrollView>
                  </View>
                
                {/* Submit Button - Fixed at bottom */}
                <View style={{ 
                  paddingHorizontal: 20, 
                  paddingBottom: 20, 
                  paddingTop: 15,
                  borderTopWidth: 1,
                  borderTopColor: isDark ? colors.darkGrey : colors.lightGrey,
                }}>
                  <CommonButton
                    onPress={handleSubmit}
                    label={isSubmitting ? t("Complaint.submitting") : t("Complaint.submitComplaint")}
                    disabled={isSubmitting}
                    loading={isSubmitting}
                  />
                </View>
                
                <DateTimePickerModal
                  isVisible={isDateVisible}
                  mode="date"
                  onConfirm={(date) => {
                    setIsDateVisible(false);
                    setFieldValue("incident_date", date);
                  }}
                  onCancel={() => setIsDateVisible(false)}
                />
                <DateTimePickerModal
                  isVisible={isTimeVisible}
                  mode="time"
                  onConfirm={(time) => {
                    setIsTimeVisible(false);
                    setFieldValue("incident_time", time);
                  }}
                  onCancel={() => setIsTimeVisible(false)}
                />
              </>
            );
          }}
        </Formik>
        </View>
      </View>
    </Modal>
  );
};

const mapStateToProps = (state) => ({
  user: state.authReducer.user,
});

export default connect(mapStateToProps)(ComplaintModal);
