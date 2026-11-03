
import React from "react";
import { getQuickActionsData } from "./config";
import { StyleSheet, View } from "react-native";
import ListCard from "../../common/ListCard";
import { TypographyText } from "../../../../components/Typography";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../../../components/ThemeProvider";
import { BALOO_BOLD } from "../../../../redux/types";
import { isRTL } from "../../../../../utils";

const LoyaltyPointsList = () => {
  const { t } = useTranslation();
  const { isDark } = useTheme();

  const data = getQuickActionsData(isDark);

  return (
    <View style={styles.wrapper}>
      <View style={[styles.headerRow, { alignItems: isRTL() ? 'flex-end' : 'flex-start' }]}>
        <TypographyText
          title={t('LoyaltyMain.quickActions')}
          textColor={isDark ? '#FFFFFF' : '#111827'}
          size={16}
          font={BALOO_BOLD}
          style={styles.title}
        />
      </View>

      <View
        style={[
          styles.container,
          {
            backgroundColor: isDark ? '#18181B' : '#FFFFFF',
            borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
          },
        ]}
      >
        {data.map((item, index) => (
          <React.Fragment key={item.title}>
            <ListCard
              {...item}
              isDark={isDark}
              isGrouped={true}
            />
            {index < data.length - 1 && (
              <View
                style={[
                  styles.divider,
                  {
                    backgroundColor: isDark
                      ? 'rgba(255, 255, 255, 0.06)'
                      : 'rgba(0, 0, 0, 0.05)',
                  },
                ]}
              />
            )}
          </React.Fragment>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  headerRow: {
    marginBottom: 10,
  },
  title: {
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  container: {
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  divider: {
    height: 1,
    marginHorizontal: 16,
  },
});

export default LoyaltyPointsList;