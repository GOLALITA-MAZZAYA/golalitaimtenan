import { getToken } from '../utils/secureStorage';
import instance from "../redux/instance";

// 1. List Salons
export const getSaloonsList = async (params = {}) => {
    const token = await getToken();

    const res = await instance.post("/salon/list", {
        params: {
            token,
            ...params
        },
    });

    if (!res.data.result?.saloons && !res.data.result?.salons && !res.data.result?.data) {
        console.log("getSaloonsList Error, response:", res.data);
        throw new Error("Saloons not found in response");
    }

    return res.data.result.saloons || res.data.result.salons || res.data.result.data || [];
};

// 2. Salon Details
export const getSaloonById = async (salon_id) => {
    const token = await getToken();

    const res = await instance.post("/salon/details", {
        params: {
            token,
            salon_id
        },
    });

    if (!res.data.result?.saloon && !res.data.result?.salon && !res.data.result?.data) {
        console.log("getSaloonById Error, response:", res.data);
        throw new Error("Saloon details not found in response");
    }

    const saloonData = res.data.result.saloon || res.data.result.salon || res.data.result.data;
    console.log("[DEBUG] Salon Details received:", JSON.stringify(saloonData));
    return saloonData;
};

// 3. Salon Services (Rate Card)
export const getSaloonServices = async (salon_id) => {
    const token = await getToken();

    console.log("[DEBUG] getSaloonServices called with salon_id:", salon_id, "type:", typeof salon_id);

    const res = await instance.post("/salon/services", {
        params: {
            token,
            salon_id
        },
    });

    if (!res.data.result?.services && !res.data.result?.data) {
        console.log("getSaloonServices Error, response:", res.data);
        throw new Error("Saloon services not found");
    }

    return res.data.result.services || res.data.result.data || [];
};

// 4. Salon Staff
export const getSaloonStaff = async (salon_id) => {
    const token = await getToken();

    const res = await instance.post("/salon/staff", {
        params: {
            token,
            salon_id
        },
    });

    if (!res.data.result?.staff && !res.data.result?.data) {
        console.log("getSaloonStaff Error, response:", res.data);
        throw new Error("Saloon staff not found");
    }

    return res.data.result.staff || res.data.result.data || [];
};

// 5. Salon Availability
export const getSaloonAvailability = async (salon_id, date, staff_id) => {
    const token = await getToken();

    const params = { token, salon_id, date };
    if (staff_id) {
        params.staff_id = staff_id;
    }

    const res = await instance.post("/salon/availability", { params });


    if (!res.data.result?.slots) {
        throw new Error();
    }

    return res.data.result.slots;
};

// 6. Book Appointment
export const bookSaloonAppointment = async (body = {}) => {
    const token = await getToken();

    const res = await instance.post("/salon/appointment/book", {
        params: {
            token,
            ...body
        },
    });

    if (!res.data.result) {
        console.log("bookSaloonAppointment ERROR:", res.data);
        return { error: res.data.message || res.data.error || "Booking failed" };
    }

    return res.data.result;
};

// 7. Customer Appointment Action (cancel / update)
export const saloonAppointmentAction = async (body = {}) => {
    const token = await getToken();

    const res = await instance.post("/salon/appointment/action", {
        params: {
            token,
            ...body
        },
    });

    if (!res.data.result) {
        console.log("saloonAppointmentAction ERROR:", res.data);
        return { error: res.data.message || res.data.error || "Action failed" };
    }

    return res.data.result;
};

// 7a. Update Appointment Wrapper
export const updateSaloonAppointment = async (body = {}) => {
    return saloonAppointmentAction({
        action: 'update',
        ...body
    });
};

// 8. Appointment History
export const getSaloonAppointmentHistory = async () => {
    const token = await getToken();

    const res = await instance.post("/salon/appointment/history", {
        params: {
            token,
        },
    });

    if (!res.data.result?.appointments) {
        throw new Error();
    }

    return res.data.result.appointments;
};

// 9. Appointment Details
export const getSaloonAppointmentDetails = async (appointment_id) => {
    const token = await getToken();

    const res = await instance.post("/salon/appointment/details", {
        params: {
            token,
            appointment_id
        },
    });

    if (!res.data.result?.appointment && !res.data.result?.data) {
        console.log("getSaloonAppointmentDetails Error, response:", res.data);
        throw new Error("Appointment details not found");
    }

    const appointmentData = res.data.result.appointment || res.data.result.data;
    console.log("[DEBUG] Appointment Details received:", JSON.stringify(appointmentData));
    return appointmentData;
};

export const checkSaloonPaymentStatus = async (appointment_id) => {
  const token = await getToken();

  const res = await instance.post(`/salon/appointment/payment/status`, {
    params: {
      token,
      appointment_id
    },
  });

  if (!res.data.result) {
    throw new Error();
  }

  return res.data.result;
};
