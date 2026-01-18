import { isRTL } from "../../../utils";

export const getData = () => {
  const isArabic = isRTL();

  return [
    {
      title: isArabic ? "مرحبًا بك في مميزات\n" : "Welcome to Mumayizat\n",
      valueType: "string",
      value: isArabic
        ? "منصة الخصومات والمزايا الحصرية في عُمان.\n\n" +
          "مميزات هو تطبيق نمط حياة يقدم خصومات ومزايا للموظفين والعموم، بغض النظر عن الجنسية أو الجنس."
        : "Oman’s Exclusive Privilege & Discount Platform.\n\n" +
          "Mumayizat is your go-to lifestyle discounts and privileges app, designed for corporate employees and the general public—regardless of nationality or gender.",
    },
    {
      title: isArabic ? "مهمتنا\n" : "Our Mission:\n",
      valueType: "string",
      value: isArabic
        ? "نقدم لك إمكانية الوصول الحصري إلى خصومات تتراوح بين 5٪ إلى 80٪، وعروض خاصة، وصفقات اشترِ واحدة واحصل على أخرى مجانًا، ومكافآت حصرية في جميع أنحاء عُمان ودول مجلس التعاون الخليجي.\n\n" +
          "مع أكثر من 25,000 عضو نشط، و100+ شركة شريكة، و1000+ تاجر، تساعدك مميزات على توفير المال في 24 فئة نمط حياة، مثل الطعام، والموضة، والصحة، وخدمات السيارات، والمزيد.\n\n" +
          "سواء كنت تتناول الطعام أو تتسوق للاحتياجات الأساسية، مميزات يجعل التوفير سهلاً - في أي وقت ومن أي مكان."
        : "To give you exclusive access to discounts ranging from 5% to 80%, special offers, BOGO (Buy One, Get One Free) deals, and exclusive rewards across Oman and the GCC.\n\n" +
          "With a growing community of over 25,000 active members, 100+ partner companies, and 1,000+ trade partners, Mumayizat helps you unlock savings in 24 lifestyle categories, including dining, fashion, wellness, automotive services, and more.\n\n" +
          "Whether you're dining out or shopping for essentials, Mumayizat makes saving simple—anytime, anywhere.",
    },
    {
      title: isArabic ? "كيفية الاستخدام\n" : "How To Use\n",
      valueType: "string",
      value: isArabic
        ? "1. اضغط على الزر - تنزيل / فتح تطبيق مميزات.\n\n" +
          "2. سيتم توجيهك إلى صفحة ويب لتنزيل وتثبيت تطبيق مميزات.\n\n" +
          "3. عد إلى تطبيق Golalita واضغط على الزر مرة أخرى.\n\n" +
          "4. إذا كان تطبيق مميزات مثبتًا مسبقًا، سيتم فتحه تلقائيًا.\n\n" +
          "5. سيتم تسجيل الدخول تلقائيًا في تطبيق مميزات.\n\n" +
          "6. ابدأ بالاستمتاع بمزايا مميزات + Golalita فورًا."
        : "1. Tap on the button - Download / Open Mumayizat.\n\n" +
          "2. You'll be redirected to a web page to download Mumayizat App and install it.\n\n" +
          "3. Return to the Golalita app and tap the button (Download / Open Mumayizat) again.\n\n" +
          "4. If the Mumayizat app is already installed, it will open automatically when you tap the below button.\n\n" +
          "5. The Mumayizat app will open and auto sign-in will be completed.\n\n" +
          "6. Start enjoying Mumayizat + Golalita benefits instantly.",
      showButton: true,
    },
    {
      title: isArabic ? "دليل خطوات استخدام خصومات مميزات\n" : "How to Redeem Your Mumayizat Discount Step-by-Step Guide\n",
      valueType: "string",
      value: isArabic
        ? "1. اختر الفئة: استعرض فئات مثل الطعام، الموضة، الصحة، الجمال، السيارات وغيرها.\n\n" +
          "2. اختر الشريك التجاري: حدد العلامة التجارية أو المقهى أو المتجر أو مزود الخدمة.\n\n" +
          "3. اضغط على “استرداد” في القائمة: سيتم فتح الملف التعريفي للشريك التجاري وعرض العروض المتاحة.\n\n" +
          "4. حدد الفرع: اختر الفرع الذي تزوره.\n\n" +
          "5. افتح القسيمة: اضغط على العرض المطلوب لفتح قسيمة الخصم.\n\n" +
          "6. أظهرها للمحاسب: أعرض القسيمة على المحاسب ليُدخل المبلغ ورمز الخصم.\n\n" +
          "7. ملاحظة هامة: أخبر المحاسب مسبقًا أنك تستخدم خصم مميزات لضمان تطبيق العرض.\n\n" +
          "8. هذا كل شيء! استمتع بتوفير فوري بخطوات بسيطة.\n\n" +
          "9. استمتع مع مميزات!"
        : "1. Choose a Category: Browse from a wide range of categories like Food, Fashion, Health, Beauty, Automotive, and more.\n\n" +
          "2. Select a Trade Partner: Pick your favorite brand, café, store, or service provider from the listings.\n\n" +
          "3. Tap “Redeem” on the Listing: This opens the trade partner’s profile, where you can view the available offers.\n\n" +
          "4. Choose the Branch: Select the specific outlet or branch you’re visiting.\n\n" +
          "5. Open the Discount Coupon: Tap on the offer you'd like to use and open the discount coupon.\n\n" +
          "6. Show It to the Cashier: Present your phone to the cashier. They will enter the bill amount and TP Code to apply the discount.\n\n" +
          "7. Important: Always inform the cashier before billing that you’re using a Mumayizat discount to ensure the offer is correctly applied.\n\n" +
          "8. That’s it! Enjoy instant savings in just a few taps—smart, seamless, and rewarding with Mumayizat.\n\n" +
          "9. ENJOY MUMAYIZAT!",
    },
  ];
};
