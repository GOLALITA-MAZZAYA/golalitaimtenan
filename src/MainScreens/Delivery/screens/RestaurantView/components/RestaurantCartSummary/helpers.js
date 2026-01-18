export const getTotalPriceAndAmount = (cartProducts, voucherDiscount = 0) => {
  const values = Object.values(cartProducts);

  if (!values?.length) {
    return { amount: 0, price: 0 };
  }

  let totalDiscountQar = 0;

  let price =
    values
      .map((item) => {
        const discount = item.product.discount;
        let discountQar = discount
          ? (item.price / 100) * discount * item.quantity
          : 0;
        const price = item.price * item.quantity;
        totalDiscountQar = totalDiscountQar + discountQar;

        return price - discountQar;
      })
      .reduce((a, b) => a + b, 0) - voucherDiscount;

  const amount = values.map((item) => item.quantity).reduce((a, b) => a + b, 0);

  return { amount, price, discount: totalDiscountQar };
};
