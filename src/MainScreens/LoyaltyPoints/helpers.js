export function timeLeft(targetDateStr, language = "en") {
  const now = new Date();
  const target = new Date(targetDateStr);

  console.log(targetDateStr,'target');
  console.log(now,'now')

  let diffMs = target - now;
  if (diffMs <= 0) {
    return language === "ar" ? "انتهى الوقت" : "0d 0h 0m left";
  }

  const msInMin = 1000 * 60;
  const msInHour = msInMin * 60;
  const msInDay = msInHour * 24;

  const days = Math.floor(diffMs / msInDay);
  diffMs %= msInDay;

  const hours = Math.floor(diffMs / msInHour);
  diffMs %= msInHour;

  const minutes = Math.floor(diffMs / msInMin);

  if (language === "ar") {
    // Arabic labels (simple forms)
    const dayLabel = "يوم";
    const hourLabel = "ساعة";
    const minuteLabel = "دقيقة";

    return `${days} ${dayLabel} ${hours} ${hourLabel} ${minutes} ${minuteLabel} متبقية`;
  }

  // Default English
  return `${days}d ${hours}h ${minutes}m left`;
};

export function formatDate(datetimeStr, language = "en") {
  const date = new Date(datetimeStr);

  // Zero-padding helper
  const pad = (num) => num.toString().padStart(2, "0");

  // Month names
  const months = {
    en: [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ],
    ar: [
      "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
      "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
    ]
  };

  const day = date.getDate();
  const month = months[language][date.getMonth()];
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  if (language === "ar") {
    // Arabic format: "5 نوفمبر 14:23"
    return `${day} ${month} ${hours}:${minutes}`;
  }

  // English format: "5 November 14:23"
  return `${day} ${month} ${hours}:${minutes}`;
}





