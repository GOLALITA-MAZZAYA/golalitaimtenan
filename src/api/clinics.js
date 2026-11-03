import { getToken } from '../utils/secureStorage';
import instance from "../redux/instance";

export const getClinicsList = async (params) => {
  const token = await getToken();

  console.log(params,'params')

  const res = await instance.post("/clinic/list", {
    params: {
      token,
      ...params
    },
  });


  if (!res.data.result?.clinics) {
    throw new Error();
  }

  return res.data.result.clinics;
};

export const getAppointmentDetails = async (booking_reference) => {
  const token = await getToken();

  const res = await instance.post("/clinic/appointment/details", {
    params: {
      token,
      booking_reference
    },
  });


  if (!res.data.result?.appointment) {
    throw new Error();
  }

  return res.data.result.appointment;
};

export const cancelAppointment = async (appointment_id) => {
  const token = await getToken();

  const res = await instance.post("/appointment/cancel", {
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


export const getClinicsHistoryList = async () => {
  const token = await getToken();

  const res = await instance.post("clinic/appointments/history", {
    params: {
      token,
    },
  });

  if (!res.data.result?.appointments) {
    throw new Error();
  }

  return res.data.result?.appointments;
};

export const getClinicById = async (clinic_id) => {
  const token = await getToken();

  const res = await instance.post("clinic/details", {
    params: {
      token,
      clinic_id
    },
  });

  if (!res.data.result?.clinic) {
    throw new Error();
  }

  return res.data.result.clinic;
};

export const getDoctors = async (clinic_id) => {
  const token = await getToken();

  const res = await instance.post("clinic/doctors", {
    params: {
      token,
      clinic_id
    },
  });

  if (!res.data.result?.doctors) {
    throw new Error();
  }

  return res.data.result.doctors;
};

export const getDoctorAvailability = async (doctor_id, date) => {
  const token = await getToken();

  const res = await instance.post("doctor/availability", {
    params: {
      token,
      doctor_id,
      date
    },
  });


  if (!res.data.result?.slots) {
    throw new Error();
  }

  return res.data.result.slots;
};

export const bookAppointment = async (body={}) => {
  const token = await getToken();

  const res = await instance.post("clinic/appointment/book", {
    params: {
      token,
      ...body
    },
  });

  console.log(res.data,'book res')


  if (!res.data.result) {
    throw new Error();
  }

  return res.data.result;
};


export const resubmitAppointment = async ({appointment_id, appointment_date, appointment_time}) => {
  const token = await getToken();


  const res = await instance.post("/appointment/reschedule", {
    params: {
      token,
      appointment_id,
      appointment_date,
      appointment_time
    },
  });


  if (!res.data.result) {
    throw new Error();
  }

  return res.data.result;
};

export const checkClinicPaymentStatus = async (appointment_id) => {
  const token = await getToken();

  const res = await instance.post(`/clinic/appointment/payment/status`, {
    params: {
      token,
      appointment_id
    },
  });

  console.log(res,'checkClinicPaymentStatus checkClinicPaymentStatus')

  if (!res.data.result) {
    throw new Error();
  }

  return res.data.result;
};
