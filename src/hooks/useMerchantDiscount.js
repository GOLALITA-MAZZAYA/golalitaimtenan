import { useQuery } from "react-query";
import { getMerchantDisscountForOffers } from "../api/merchants";

const useMerchantDiscount = (merchantId) => {
  const { data: discount, isLoading: loading } = useQuery({
    queryKey: ["merchant-discount", merchantId],
    queryFn: () => getMerchantDisscountForOffers(merchantId),
    enabled: !!merchantId,
    staleTime: 1000 * 60 * 10, // 10 minutes
    cacheTime: 1000 * 60 * 30, // keep in cache
    retry: 1,
  });

  return { loading, discount };
};

export default useMerchantDiscount;