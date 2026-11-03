export type Merchant = {
  merchant_id: number;
  merchant_name: string;
  category_id: number | null;
  category_name: string | null;
  latitude: number | null;
  longitude: number | null;
  have_offers: boolean;
  local: boolean;
  global: boolean;
  // Present on API responses that back the AR screens (nearby-merchant
  // search) but not on every Merchant consumer in the app, so optional
  // rather than widening every other call site's expectations.
  x_arabic_name?: string | null;
  arabic_category_name?: string | null;
  category?: string | null;
  partner_latitude?: number | null;
  partner_longitude?: number | null;
};
export type RootStackParamList = {
  ARList: undefined;
  ARMap: {
    categoryId?: number | null;
    categoryName?: string | null;
    locality?: "local" | "global";
  };
};
