import React from "react";
import MainLayout from "../../components/MainLayout";
import SettingsHeader from "./SettingsHeader";
import { SCREEN_HEIGHT } from "../../styles/mainStyles";
import Modes from "./components/Modes";

const Settings = () => {
  return (
    <MainLayout
      headerHeight={50}
      headerChildren={<SettingsHeader />}
      outsideScroll={false}
      contentStyle={{ height: SCREEN_HEIGHT - 120, paddingHorizontal: 20 }}
    >
      <Modes />
    </MainLayout>
  );
};

export default Settings;
