import { useInfiniteQuery } from "react-query";
import { getB1G1Offers } from "../../../api/offers";

const PAGE_SIZE = 10;

const useB1G1Offers = () => {
  return useInfiniteQuery(
    ["B1G11"],
    async ({ pageParam = 1 }) => {
      const offset = pageParam - 1;

      const offers = await getB1G1Offers({
        params: {
          offset,
          limit: PAGE_SIZE,
        },
      });

      return {
        offers: offers ?? [],
        page: pageParam,
      };
    },
    {

      getNextPageParam: (lastPage) => {
        if (lastPage.offers.length < PAGE_SIZE) {
          return undefined; 
        }
        return lastPage.page + 1;
      },

 
      select: (data) => {
        const seen = new Set();
        const pages = [];

        for (const page of data.pages) {
          const uniqueOffers = [];

          for (const offer of page.offers) {
            const merchantId = String(offer.merchant_id);

            if (!seen.has(merchantId)) {
              seen.add(merchantId);
              uniqueOffers.push(offer);
            }
          }

          pages.push({
            ...page,
            offers: uniqueOffers,
          });
        }

        return {
          ...data,
          pages,
        };
      },
    }
  );
};

export default useB1G1Offers;
