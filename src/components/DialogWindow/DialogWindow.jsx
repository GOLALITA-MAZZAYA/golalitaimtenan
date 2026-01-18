import React, {useEffect} from 'react'
import {View, Text, StyleSheet, TouchableOpacity, Modal} from "react-native";
import {mainStyles, SCREEN_WIDTH} from "../../styles/mainStyles";
import {colors} from "../colors";
import {BALOO_MEDIUM, BALOO_SEMIBOLD} from "../../redux/types";
import {TypographyText} from "../Typography";
import {useTheme} from "../ThemeProvider";
import {useTranslation} from "react-i18next";


export const DialogWindow = (props) => {
  const {t} = useTranslation()
  const {isDark} = useTheme()
  return <View style={mainStyles.overlay}>
    <Modal
      animationType={'slide'}
      transparent={true}
      visible={props.isVisible}>
      {!props.isClicked && <View style={styles.container}>
        <View style={styles.modalWrapper}>
          <View style={[styles.buttons, isDark && {backgroundColor: '#252621'}]}>
            {props.items.map((item, index) => {
              return <TouchableOpacity key={index} onPress={item.func}
                                       style={[styles.buttons__item,
                                         isDark && {borderBottomColor: '#2E2E2C'},
                                         index + 1 === props.items.length && {borderBottomColor: 'transparent'}]}
                                       activeOpacity={0.3}>
                <TypographyText
                  title={item.name}
                  textColor={item.color ?? colors.blue}
                  size={23}
                  font={BALOO_MEDIUM}
                />
              </TouchableOpacity>
            })}
          </View>
          <TouchableOpacity onPress={props.onCancel} activeOpacity={0.3} style={[styles.cancel, isDark && {backgroundColor: '#252621'}]}>
            <TypographyText
              title={t('Drawer.cancel')}
              textColor={colors.blue}
              size={23}
              font={BALOO_MEDIUM}
            />
          </TouchableOpacity>
        </View>
      </View>}
    </Modal>
  </View>
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
    marginBottom: 20,
    zIndex: 0
  },
  modalWrapper: {
    margin: 8,
    width: SCREEN_WIDTH - 20
  },
  cancel: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 17,
    alignItems: 'center',
    marginBottom: 60
  },
  cancel__label: {
    color: '#007AFF',
    fontFamily: 'SF_TEXT_SEMIBOLD',
    fontSize: 17
  },
  buttons: {
    marginBottom: 8,
    borderRadius: 14,
    backgroundColor: 'rgb(249, 249, 249)'
  },
  buttons__item: {
    padding: 18,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    borderStyle: 'solid'
  },
  buttons__label: {
    color: '#007AFF',
    fontFamily: 'SF_TEXT_REGULAR',
    fontSize: 17
  },
  title: {
    color: '#8F8F8F',
    fontSize: 13,
    fontFamily: 'SF_TEXT_SEMIBOLD',
  }
})
