import React from 'react';
import { ImageBackground, View, Image } from 'react-native';
import styles from './styles';
import { colors } from '../colors';
import { BALOO_MEDIUM, BALOO_REGULAR, BALOO_SEMIBOLD } from '../../redux/types';
import { TypographyText } from '../Typography';
import { mainStyles } from '../../styles/mainStyles';
import { useTranslation } from 'react-i18next';
import { getFlexDirection } from '../../../utils';
import useIsMumayz from '../../hooks/useIsMumayz';

const cardImage = require('../../assets/card_bg.jpg');
const MumayizatLogo = require('../../assets/MumayizatLogoWhite.png');

const Card = ({ name, lname, expiryDate, email, renderHeader }) => {
  const isMumayaz = useIsMumayz(email);
  const { t } = useTranslation();

  return (
    <View style={styles.wrapper}>
      {renderHeader?.()}
      <ImageBackground
        source={cardImage}
        style={styles.card}
        resizeMode="stretch"
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <TypographyText
            textColor={colors.white}
            size={16}
            font={BALOO_SEMIBOLD}
            title={'Golalita members'}
          />

          {isMumayaz && (
            <Image
              source={MumayizatLogo}
              style={{
                width: 140,
                height: 55,
                resizeMode: 'cover',
                marginRight: -10,
              }}
            />
          )}
        </View>
        <View
          style={[
            mainStyles.betweenRow,
            { alignItems: 'flex-end', flex: 1 },
            getFlexDirection(),
          ]}
        >
          <View style={styles.bottomTextWrapper}>
            {!isMumayaz && (
              <View>
                <TypographyText
                  textColor={colors.white}
                  size={12}
                  font={BALOO_REGULAR}
                  title={t('CardPage.exp')}
                />
                <TypographyText
                  textColor={colors.white}
                  size={19}
                  font={BALOO_SEMIBOLD}
                  title={expiryDate}
                  style={{ marginTop: -7 }}
                />
              </View>
            )}

            <View style={{ flex: 1, alignItems: 'flex-end' }}>
              <TypographyText
                textColor={colors.white}
                size={19}
                font={BALOO_MEDIUM}
                title={`${name || ''}  ${lname || ''}`}
                style={{
                  paddingLeft: 20,
                  flexWrap: 'wrap',
                  flexDirection: 'row',
                }}
                numberOfLines={2}
              />
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

export default Card;
