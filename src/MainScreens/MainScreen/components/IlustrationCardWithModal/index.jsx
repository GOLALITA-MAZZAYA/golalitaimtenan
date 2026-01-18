import IlustrationCard from "../../../../components/IlustrationCard";
import { useTheme } from "../../../../components/ThemeProvider";
import { useState } from "react";
import BookNowModal from "./BookNowModal";

const IlustrationCardWithModal = ({ config, icon }) => {
  const { isDark } = useTheme();
  const [redirectModalVisible, setRedirectModalVisible] = useState(false);

  return (
    <>
      <IlustrationCard
        title={config.title}
        onPress={() => {
          setRedirectModalVisible(true);
        }}
        style={[
          { backgroundColor: isDark ? "#0B177E" : "#fff", marginTop: 16 },
        ]}
        Icon={icon}
      />
      <BookNowModal
        visible={redirectModalVisible}
        setModalVisible={setRedirectModalVisible}
        config={config}
      />
    </>
  );
};

export default IlustrationCardWithModal;
