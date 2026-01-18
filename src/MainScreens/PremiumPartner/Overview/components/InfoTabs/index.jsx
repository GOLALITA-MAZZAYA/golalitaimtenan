import { ScrollView } from "react-native";
import InfoTab from "../../../MerchantInfo/InfoTab";
import OfferTab from "./OffersTab";
import { useTranslation } from "react-i18next";
import Tabs from "../../../../../components/Tabs";
import RoomRatesTab from "../../../MerchantInfo/RoomRatesTab";

const InfoTabs = ({ merchantDetails }) => {
  const { i18n } = useTranslation();

  return (
    <Tabs>
      <ScrollView
        showsHorizontalScrollIndicator={true}
        contentContainerStyle={{
          flexDirection: "row",
        }}
        horizontal={true}
      >
        <Tabs.Tab 
          name="INFO"
          title={i18n.t("Merchants.info")}
        />

        <Tabs.Tab
          name="LOCATION"
          title={i18n.t("Merchants.location")}
          style={{ marginLeft: 10 }}
        />
        
        <Tabs.Tab
          name="OFFERS"
          title={i18n.t("Merchants.offers")}
          style={{ marginLeft: 10 }}
        />

        <Tabs.Tab
          name="ROOM_RATES"
          title={i18n.t("Merchants.roomRates")}
          style={{ marginLeft: 10 }}
        />
      </ScrollView>

      <Tabs.Content name="INFO">
        <InfoTab merchantDetails={merchantDetails} />
      </Tabs.Content>

      <Tabs.Content name="LOCATION">
        <InfoTab merchantDetails={merchantDetails} />
      </Tabs.Content>

      <Tabs.Content name="OFFERS">
          <OfferTab
            merchant={merchantDetails}
            isHotel={merchantDetails.is_business_hotel}
          />
      </Tabs.Content>

      <Tabs.Content name="ROOM_RATES">
          <RoomRatesTab
            merchant={merchantDetails}
            isHotel={merchantDetails.is_business_hotel}
          />
      </Tabs.Content>
    </Tabs>
  );
};

export default InfoTabs;
