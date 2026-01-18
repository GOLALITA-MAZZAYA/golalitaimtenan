import BannerSwiper from "../../../../../components/BannerSwiper";

const OfferInfoSwiper = ({ images, onImagePress }) => {
  return (
    <BannerSwiper
      images={images}
      onBannerPress={onImagePress}
      aspectRatio={16 / 9}
      resizeMode="stretch"
      imageStyle={{ borderRadius: 14 }}
      autoplay={true}
      autoplayTimeout={3}
      loop={true}
      containerPadding={0}
    />
  );
};

export default OfferInfoSwiper;
