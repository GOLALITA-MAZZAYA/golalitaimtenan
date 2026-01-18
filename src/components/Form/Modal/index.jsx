import React from "react";
import {
  Modal as NativeModal,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { TypographyText } from "../../Typography";
import { BALOO_SEMIBOLD } from "../../../redux/types";
import { useTranslation } from "react-i18next";

const Modal = (props) => {
  const { visible, onDismiss, title, children, width, onOk } = props;
  const { t } = useTranslation();

  return visible ? (
    <NativeModal
      visible={visible}
      onDismiss={onDismiss}
      transparent={true}
      onRequestClose={onDismiss}
      presentationStyle="overFullScreen"
    >
      <>
        <View style={style.centeredView}>
          <View
            style={{
              width: width || "100%",
              ...style.modalView,
            }}
          >
            <TouchableOpacity activeOpacity={1} style={style.innerTouchable}>
              <>
                {title && (
                  <View style={style.header}>
                    <TypographyText
                      textColor={"#08003B"}
                      size={20}
                      font={BALOO_SEMIBOLD}
                      title={title}
                      numberOfLines={1}
                    />

                    <TouchableOpacity
                      style={style.closeBtn}
                      onPress={onDismiss}
                    >
                      <TypographyText
                        textColor={"#08003B"}
                        size={14}
                        font={BALOO_SEMIBOLD}
                        title={t("General.close")}
                        numberOfLines={1}
                      />
                    </TouchableOpacity>
                  </View>
                )}
                {visible && <View style={style.body}>{children}</View>}
                {onOk && (
                  <View style={style.footer}>
                    <View style={style.footerLeft}>
                      <TouchableOpacity
                        type="default"
                        onPress={() => {
                          onDismiss();
                        }}
                      >
                        <TypographyText
                          textColor={"#08003B"}
                          size={14}
                          font={BALOO_SEMIBOLD}
                          title={t("General.cancel")}
                          numberOfLines={1}
                        />
                      </TouchableOpacity>
                    </View>
                    <View style={style.footerRight}>
                      <TouchableOpacity type="outlined" onPress={onOk}>
                        <TypographyText
                          textColor={"#08003B"}
                          size={14}
                          font={BALOO_SEMIBOLD}
                          title={t("General.confirm")}
                          numberOfLines={1}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </>
            </TouchableOpacity>
          </View>
        </View>
      </>
    </NativeModal>
  ) : null;
};

const paddingHorizontal = 24;

const style = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 10,
  },
  dismissBackground: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    flex: 1,
    backgroundColor: "red",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  innerTouchable: {
    padding: 0,
    alignItems: "center",
    width: "auto",
  },
  header: {
    paddingVertical: 16,
    paddingHorizontal,
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    borderStyle: "solid",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  title: {
    color: "#000",
    flex: 1,
  },
  closeBtn: {
    marginLeft: 20,
  },
  body: {
    display: "flex",
    width: "100%",
    paddingHorizontal,
    paddingVertical: 20,
  },
  footer: {
    flexDirection: "row",
    marginBottom: 17,
    paddingHorizontal,
  },
  footerLeft: {
    width: "50%",
    paddingRight: 5,
  },
  footerRight: {
    width: "50%",
    paddingLeft: 5,
  },
});

export default Modal;
