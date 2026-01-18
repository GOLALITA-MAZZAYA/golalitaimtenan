import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getContracts } from "../../../../../api/merchants";
import { useTheme } from "../../../../../components/ThemeProvider";
import { sized } from "../../../../../Svg";
import MenuBookSvg from "../../../../../assets/menu-book.svg";
import { colors } from "../../../../../components/colors";
import CommonButton from "../../../common/CommonButton";

const ContractBtn = ({ merchantId }) => {
  const [contractUrl, setContractUrl] = useState(null);
  const { isDark } = useTheme();

  const { t } = useTranslation();
  const navigation = useNavigation();

  const getContractUrl = async () => {
    try {
      const data = await getContracts(merchantId);

      const url = data?.[0]?.contract_file_url;

      if (url) {
        setContractUrl(url);
      }

      console.log(data);
    } catch (err) {
    } finally {
    }
  };

  useEffect(() => {
    getContractUrl();
  }, [merchantId]);

  if (!contractUrl) {
    return null;
  }

  const btnColor = isDark ? colors.mainDarkMode : colors.darkBlue;
  const MenuBookIcon = sized(MenuBookSvg, 16, 16, btnColor);

  return (
    <CommonButton
      text={t("Merchants.contract")}
      icon={<MenuBookIcon fill={btnColor} />}
      onPress={() =>
        navigation.navigate("merchant-menu", {
          company_contract_url: contractUrl,
        })
      }
      textStyle={{
        color: btnColor,
        fontSize: 11,
        marginLeft: 4,
      }}
      wrapperStyle={{
        borderColor: btnColor,
        paddingHorizontal: 10,
        marginLeft: 16,
      }}
    />
  );
};

export default ContractBtn;
