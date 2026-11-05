import React from "react";
import { ScrollView } from "react-native";
import MainLayout from "../../components/MainLayout";
import SettingsHeader from "./SettingsHeader";
import { SCREEN_HEIGHT } from "../../styles/mainStyles";
import Modes from "./components/Modes";
import Language from "./components/Language";

const Settings = () => {
  return (
    <MainLayout
      headerHeight={50}
      headerChildren={<SettingsHeader />}
      outsideScroll={false}
      contentStyle={{ height: SCREEN_HEIGHT - 120, paddingHorizontal: 20 }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <Language />
        <Modes />
      </ScrollView>
    </MainLayout>
  );
};

export default Settings;
