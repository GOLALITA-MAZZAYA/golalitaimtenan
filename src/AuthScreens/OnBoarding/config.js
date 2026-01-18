import OnBoardingEngImage1 from "../../assets/onboarding/en/1.jpg";
import OnBoardingEngImage2 from "../../assets/onboarding/en/2.jpg";
import OnBoardingEngImage3 from "../../assets/onboarding/en/3.jpg";
import OnBoardingEngImage4 from "../../assets/onboarding/en/4.jpg";
import OnBoardingArImage1 from "../../assets/onboarding/ar/1.jpg";
import OnBoardingArImage2 from "../../assets/onboarding/ar/2.jpg";
import OnBoardingArImage3 from "../../assets/onboarding/ar/3.jpg";
import OnBoardingArImage4 from "../../assets/onboarding/ar/4.jpg";

const IMAGES = {
  en: [
    OnBoardingEngImage1,
    OnBoardingEngImage2,
    OnBoardingEngImage3,
    OnBoardingEngImage4,
  ],
  ar: [
    OnBoardingArImage1,
    OnBoardingArImage2,
    OnBoardingArImage3,
    OnBoardingArImage4,
  ],
};

export const getConfig = (language) => {
  const CONFIG = [
    {
      key: 0,
    },
    {
      image: IMAGES[language][0],
      key: 1,
    },
    {
      image: IMAGES[language][1],
      key: 2,
    },
    {
      image: IMAGES[language][2],
      key: 3,
    },
    {
      image: IMAGES[language][3],
      key: 4,
    },
  ];

  return CONFIG;
};
