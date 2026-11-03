import { useQuery } from "react-query";
import { getSaloonAvailability } from "../../../../api/saloons";
import {removePastTimes} from "../../helpers";

const useStaffAvailability = (saloonId, date, staffId) => {
    return useQuery(
        ["salon-availability-new3", saloonId, date, staffId],
        async () => {
          const times = await  getSaloonAvailability(saloonId, date, staffId);

          return removePastTimes(times)
        },
        { enabled: !!saloonId && !!date }
    );
};

export default useStaffAvailability;
