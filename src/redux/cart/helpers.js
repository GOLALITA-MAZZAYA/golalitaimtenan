export const calculateOrderPriceValues = (
  cartProducts,
  voucherDiscount = 0
) => {
  const values = Object.values(cartProducts);

  if (!values?.length) {
    return { amount: 0, price: 0, discount: 0 };
  }

  let totalDiscountQar = 0;
  let quantity = 0;
  let subtotal = 0;

  let price =
    values
      .map((item) => {
        const discount = item.product.discount;
        let discountQar = discount ? discount * item.quantity : 0;
        const price = item.price * item.quantity;
        totalDiscountQar = totalDiscountQar + discountQar;
        quantity = item.quantity + quantity;
        subtotal = item.quantity * item.price;

        return price - discountQar;
      })
      .reduce((a, b) => a + b, 0) - voucherDiscount;

  return { quantity, price, discount: totalDiscountQar, subtotal };
};
