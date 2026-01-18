import React, { useEffect, useState } from "react";
import MainLayout from "../../components/MainLayout";
import { Image, ScrollView, TouchableOpacity, View } from "react-native";
import { mainStyles } from "../../styles/mainStyles";
import { TypographyText } from "../../components/Typography";
import { colors } from "../../components/colors";
import { BALOO_REGULAR } from "../../redux/types";
import styles from "./styles";
import PlusSvg from "../../assets/plus.svg";
import { sized } from "../../Svg";
import { useTheme } from "../../components/ThemeProvider";
import LinearGradient from "react-native-linear-gradient";
import PlusWhiteSvg from "../../assets/plus_white.svg";
import { connect } from "react-redux";
import {
  deleteFamilyMember,
  getFamilyMembers,
} from "../../redux/transactions/transactions-thunks";
import { useTranslation } from "react-i18next";
import { showMessage } from "react-native-flash-message";
import Header from "../../components/Header";
import {DialogWindow} from "../../components/DialogWindow/DialogWindow";

const PlusIcon = sized(PlusSvg, 20, 20);
const PlusWhiteIcon = sized(PlusWhiteSvg, 20, 20);

const Family = ({
  navigation,
  deleteFamilyMember,
  getFamilyMembers,
  familyMembers,
}) => {
  const [isDialogWindow, setIsDialogWindow] = useState(false);
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const [selectedFamily, setSelectedFamily] = useState(null);

  useEffect(() => {
    getFamilyMembers();
  }, []);

   let items = [
    {
      name: t("Profile.deleteMember"),
      func: () => {
        deleteFamilyMember(selectedFamily.id);
        setIsDialogWindow(false);
        setSelectedFamily(null);
      },
      color: colors.red,
    },
    {
      name: t("Profile.editMember"),
      func: () => {
        navigation.navigate("AddFamilyMember", {
          isEdit: true,
          selectedFamily,
        });

        setIsDialogWindow(false);
        setSelectedFamily(null);
      },
    },
  ];


  const handleAddFamilyMember = () => {
    if (familyMembers?.length === 10) {
      showMessage({
        message: t("Family.membersLimitError"),
        type: "danger",
      });

      return;
    }

    navigation.navigate("AddFamilyMember");
  };


  return (

            <MainLayout outsideScroll headerChildren={<Header label={t("Family.familyMembers")} btns={['back']}/>} headerHeight={40}>
              <View style={mainStyles.p20}>
                <>
                  <TypographyText
                        textColor={isDark ? colors.white : colors.grey}
                        size={18}
                        font={BALOO_REGULAR}
                        title={t("Family.addInfo")}
                        style={{marginVertical: 10}}
      
                  />
                {isDialogWindow && (
              <DialogWindow
                items={items}
                isVisible={isDialogWindow}
                onCancel={() => {
                  setSelectedFamily(null);
                  setIsDialogWindow(false);
                }}
              />
            )}
                  <ScrollView
                    style={{ marginTop: 12, marginBottom: 28 }}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                  >
                    <TouchableOpacity
                      onPress={handleAddFamilyMember}
                      style={styles.family}
                    >
                      <LinearGradient
                        colors={
                          isDark
                            ? [colors.mainDarkMode, colors.mainDarkMode]
                            : [colors.darkBlue, colors.darkBlue]
                        }
                        style={[
                          styles.circleFamily,
                          { backgroundColor: colors.darkBlue },
                        ]}
                      >
                        {isDark ? <PlusWhiteIcon /> : <PlusIcon />}
                      </LinearGradient>
                      <TypographyText
                        textColor={isDark ? colors.white : colors.grey}
                        size={14}
                        font={BALOO_REGULAR}
                        title={t("Family.add")}
                        style={{ marginTop: 3 }}
                      />
                    </TouchableOpacity>

                    {familyMembers.map((item, index) => (
                      <TouchableOpacity
                        onPress={() => {
                          setSelectedFamily(item);
                        }}
                        onLongPress={() => {
                          setSelectedFamily(item);
                          setIsDialogWindow(true);
                        }}
                        key={index}
                        style={[styles.family, { borderRadius: 50 }]}
                      >
                        <View
                          style={[
                            styles.circleFamily,
                            selectedFamily?.id === item.id && {
                              borderWidth: 2,
                              borderStyle: "solid",
                              borderColor: isDark
                                ? colors.mainDarkMode
                                : colors.darkBlue,
                              borderRadius: 50,
                            },
                          ]}
                        >
                          <Image
                            style={{ width: 64, height: 64, borderRadius: 50 }}
                            source={{ uri: item.image_url }}
                          />
                        </View>
                        <TypographyText
                          textColor={
                            isDark
                              ? selectedFamily?.id === item.id
                                ? colors.mainDarkMode
                                : colors.white
                              : selectedFamily?.id === item.id
                              ? colors.darkBlue
                              : colors.grey
                          }
                          size={14}
                          font={BALOO_REGULAR}
                          title={item.name}
                          style={{ marginTop: 3 }}
                        />
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </>
              </View>
            </MainLayout>

  );
};

const mapStateToProps = (state) => ({
  familyMembers: state.transactionsReducer.familyMembers,
  user: state.authReducer.user,
});

export default connect(mapStateToProps, {
  getFamilyMembers,
  deleteFamilyMember,
})(Family);
