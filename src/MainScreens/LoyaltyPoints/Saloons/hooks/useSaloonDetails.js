import { useQuery } from "react-query";
import { getSaloonById, getSaloonServices, getSaloonStaff } from "../../../../api/saloons";

const useSaloonDetails = (saloonId, enabledArg=true) => {
    const saloonQuery = useQuery(
        ["saloon", saloonId],
        () => getSaloonById(saloonId),
        { enabled: !!saloonId && enabledArg }
    );
    const servicesQuery = useQuery(
        ["saloon-services", saloonId],
        () => getSaloonServices(saloonId),
        { enabled: !!saloonId && enabledArg, retry: 1 }
    );
    const staffQuery = useQuery(
        ["saloon-staff", saloonId],
        () => getSaloonStaff(saloonId),
        { enabled: !!saloonId && enabledArg, retry: 1 }
    );

    return {
        saloon: saloonQuery.data,
        services: servicesQuery.data || [],
        staff: staffQuery.data || [],
        // Only block on saloon details, services & staff load independently
        loading: saloonQuery.isLoading,
        servicesLoading: servicesQuery.isLoading,
        staffLoading: staffQuery.isLoading,
        error: saloonQuery.error || servicesQuery.error || staffQuery.error
    };
};

export default useSaloonDetails;
