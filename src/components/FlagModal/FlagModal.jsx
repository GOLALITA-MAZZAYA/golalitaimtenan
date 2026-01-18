import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";

import PhoneInput from "react-native-phone-input";
import CountryPicker from "react-native-country-picker-modal";
import { getFlexDirection, getTextAlign, isRTL } from "../../../utils";
import { SCREEN_WIDTH } from "../../styles/mainStyles";
import { getPhoneInputSelection } from "./utils";

class FlagModal extends Component {
  constructor(props) {
    super(props);

    this.onPressFlag = this.onPressFlag.bind(this);
    this.selectCountry = this.selectCountry.bind(this);
    this.isRtl = props.disableRtl ? false : isRTL();

    this.state = {
      cca2: "US",
      isShowModal: false,
    };
  }

  componentDidMount() {
    this.setState({
      pickerData: this.phone.getPickerData(),
    });
  }

  onPressFlag() {
    this.setState({ ...this.state, isShowModal: true });
  }

  selectCountry(country) {
    this.phone.selectCountry(country.cca2.toLowerCase());
    this.setState({ cca2: country.cca2 });
  }

  render() {
    return (
      <View style={styles.container}>
        <PhoneInput
          ref={(ref) => {
            this.phone = ref;
          }}
          initialCountry={this.state.cca2}
          onPressFlag={this.onPressFlag}
          flagStyle={[
            this.isRtl && {
              position: "absolute",
              left: SCREEN_WIDTH - 90,
              top: -10,
            },
          ]}
          textProps={{
            selection: getPhoneInputSelection(
              this.isRtl,
              this.props.initialValue?.length
            ),
            flexDirection: "row",
            flex: 1,
          }}
          {...this.props}
        />

        <CountryPicker
          ref={(ref) => {
            this.countryPicker = ref;
          }}
          onSelect={(value) => this.selectCountry(value)}
          withCountryNameButton={false}
          renderFlagButton={() => <View />}
          translation="eng"
          cca2={this.state.cca2}
          visible={this.state.isShowModal}
        />
      </View>
    );
  }
}

let styles = StyleSheet.create({
  container: {
    // flex: 1,
    alignItems: "center",
    // padding: 20,
    // paddingTop: 60,
  },
});

export default FlagModal;
