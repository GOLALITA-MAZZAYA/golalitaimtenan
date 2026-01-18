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
};
export type RootStackParamList = {
  ARList: undefined;
  ARMap: {
    categoryId?: number | null;
    categoryName?: string | null;
    locality?: "local" | "global";
  };
};
