import React from 'react';
import {Modal, TouchableOpacity, View} from "react-native";
import {styles} from "./styles";
import {colors} from "../colors";
import {BALOO_REGULAR, BALOO_SEMIBOLD} from "../../redux/types";
import {TypographyText} from "../Typography";
import {mainStyles} from "../../styles/mainStyles";
import SuccessSvg from '../../assets/success.svg'
import {sized} from "../../Svg";
import {useTranslation} from "react-i18next";

const SuccessIcon = sized(SuccessSvg, 50)

const ModalInfo = ({isSuccess, onSubmit, onCancel, title, description}) => {
  const {t} = useTranslation()
  return (
    <Modal transparent={true} onDismiss={onCancel}>
      <View style={styles.modalView}>
        <View style={styles.modal}>
          {isSuccess && <View style={[mainStyles.centeredRow, {marginBottom: 15}]}>
            <SuccessIcon />
          </View>}
          <TypographyText
            textColor={colors.darkBlue}
            size={18}
            font={BALOO_SEMIBOLD}
            title={title}
            style={[mainStyles.centeredText, {marginBottom: 16}]}
          />
          <TypographyText
            textColor={colors.darkBlue}
            size={14}
            font={BALOO_REGULAR}
            title={description}
            style={[mainStyles.centeredText, {marginBottom: 18}]}
          />
          <View style={styles.modal__line} />
          <View style={isSuccess ? mainStyles.centeredRow : mainStyles.betweenRow}>
            {!isSuccess && <TouchableOpacity onPress={onCancel} style={[styles.modal__button, {backgroundColor: '#E7EAF1'}]}>
              <TypographyText
                textColor={colors.darkBlue}
                size={14}
                font={BALOO_SEMIBOLD}
                title={t('Profile.no')}
              />
            </TouchableOpacity>}
            <TouchableOpacity onPress={onSubmit} style={[styles.modal__button, {backgroundColor: colors.orange}]}>
              <TypographyText
                textColor={colors.white}
                size={14}
                font={BALOO_SEMIBOLD}
                title={isSuccess ? 'Ok' : t('Profile.yes')}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ModalInfo;
