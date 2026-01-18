import BannerSwiper from "../BannerSwiper";

const AdwertSwiper = (props) => {
  const { isDark, data, onBannerPress, style } = props;

  return (
    <BannerSwiper
      banners={data}
      onBannerPress={(bannerItem) => {
        // BannerSwiper passes the full banner item when using banners prop
        onBannerPress(bannerItem);
      }}
      isDark={isDark}
      aspectRatio={1.93}
      resizeMode="cover"
      imageStyle={{ borderRadius: 8 }}
      autoplay={true}
      autoplayTimeout={5}
      loop={true}
      containerPadding={0}
      style={style}
    />
  );
};

export default AdwertSwiper;