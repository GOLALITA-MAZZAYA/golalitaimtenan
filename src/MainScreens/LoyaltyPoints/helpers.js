import store from "../../redux/store";
import { org } from "../../org/config";

/**
 * /web/image/product.template/... is an Odoo portal URL. Without a session
 * cookie it returns a 256x44 placeholder PNG, which looks blank on Android.
 * /go/api/image/{id}/image_512/product.template serves the real JPEG publicly.
 */
export function getLoyaltyProductImageUri(item, size = "image_512") {
  if (!item) return "";
  const id = item.id ?? item.product_id ?? item.product_tmpl_id;
  if (id != null && String(id).length) {
    return `https://${org.baseUrl}/go/api/image/${id}/${size}/product.template`;
  }
  const raw = item.image_1920;
  if (typeof raw === "string" && raw.trim() && !raw.includes("/web/image/")) {
    return raw.trim();
  }
  return "";
}

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

export const removePastTimes = (times) => {
  if(!times){
    return []
  }

  const now = new Date();

  return  times.filter(time => {
  const [hours, minutes] = time.split(":").map(Number);

  const date = new Date();
  date.setHours(hours, minutes, 0, 0);

  return date > now;
 })

};

export const getItemsWithPriceAndDiscount = (items, discountValue, priceField="price") => {
 return items.map(item => ({ id: item.id, quantity: item.quantity, [priceField]: item[priceField] - (item[priceField] * discountValue / 100)})) 
}

export const getChartPrice = (itemsInsideForm, discountPercentage, type) => {
  let total = 0;
  let subtotal = 0;
  let totalItems = 0;
  let discount = 0


  if(type === 'booking' && !itemsInsideForm.length){
    return {total: 25, subtotal, discount, totalItems}
  }

  if(!itemsInsideForm){
    return {total, subtotal, discount, totalItems}
  }
  
  itemsInsideForm.forEach((item) => {
     if(item.quantity){
        totalItems = totalItems + item.quantity;
        subtotal = subtotal + (item.quantity * item.price)
     }else {
        totalItems = totalItems + 1;
        subtotal = subtotal + item.price
     }
  });

  if(discountPercentage && subtotal){
     discount = subtotal * discountPercentage / 100;
     total = (subtotal - discount).toFixed(2)
  }else {
    total = subtotal
  }


  return {total, totalItems, subtotal, discount}

};

export const getTotalProductsQuantity = (products) => {
  return products.reduce((acc, red) => acc + red.quantity,0)
}

export const getAmountInfo = (
  items,
  { order_type, discountPercentage, bookingFee=0, totalPeople = 1 }
) => {
  const { loyaltyReducer } = store.getState();
  const { isPointsEnabled, pointRate, userPoints } = loyaltyReducer;


  const calcItemsTotal = (items) =>
    items.reduce((acc, item) => acc + item.quantity * item.price, 0);

  const calcDiscount = (amount) =>
    discountPercentage ? (amount * discountPercentage) / 100 : 0;

  const applyPoints = (totalAmount) => {
    if (!isPointsEnabled) {
      return { total_amount: totalAmount };
    }

    if (!userPoints || !pointRate) {
      return {
        total_amount: totalAmount.toFixed(2),
        usedPoints: 0,
        remainingPoints: userPoints?.toFixed(2) || 0,
      };
    }

    const maxDiscount = totalAmount * 0.75;
    const pointsValue = userPoints / pointRate;
    const appliedDiscount = Math.min(pointsValue, maxDiscount);
    const usedPoints = appliedDiscount * pointRate;
    const finalTotal = totalAmount - appliedDiscount;

    return {
      total_amount: Number(finalTotal.toFixed(2)),
      usedPoints: Number(usedPoints.toFixed(2)),
      remainingPoints: Number((userPoints - usedPoints).toFixed(2)),
    };
  };

  const buildResponse = (amount, discount, total) => {
    if (isPointsEnabled) {
      const { total_amount, usedPoints, remainingPoints } =
        applyPoints(total);
      return { amount, discount, total_amount, usedPoints, remainingPoints };
    }

    return { amount, discount, total_amount: total };
  };

  if (order_type === "clinic-appointment") {
    return isPointsEnabled
      ? { amount: bookingFee, discount: 0, ...applyPoints(bookingFee) }
      : { amount: bookingFee, discount: 0, total_amount: bookingFee };
  }

  if (order_type === "reservation") {


    if (!items?.length) {
      return isPointsEnabled
        ? { amount: bookingFee , discount: 0, ...applyPoints(bookingFee ) }
        : { amount: bookingFee , discount: 0, total_amount: bookingFee  };
    }

    const amount = calcItemsTotal(items);
    const discount = calcDiscount(amount);
    const total = amount - discount;

    console.log(amount,'amount');
    console.log(discount,'discount');
    console.log(total,'total')

    return buildResponse(amount, discount, total);
  }

  if (
    order_type === "order" ||
    order_type === "delivery" ||
    order_type === "takeaway"
  ) {
    const amount = calcItemsTotal(items);
    const discount = calcDiscount(amount);
    const total = amount - discount;

    return buildResponse(amount, discount, total);
  }

  if (order_type === "saloon_order") {
    if (!items.length) {
      const totalFee = bookingFee * totalPeople;

      return isPointsEnabled
        ? { amount: totalFee, discount: 0, ...applyPoints(totalFee) }
        : { amount: totalFee, discount: 0, total_amount: totalFee };
    }

    const amount =
      items.reduce((acc, item) => acc + item.price, 0) * totalPeople;

    const discount = calcDiscount(amount);
    const total = amount - discount;

    return buildResponse(amount, discount, total);
  }

  return { amount: 0, discount: 0, total_amount: 0 };
};





