import i18next from "i18next";
import {colors} from "../../../components/colors";

export const formatDate = (dateString) => {
  const date = new Date(dateString);

  const options = {
    month: "short",
    day: "2-digit",
    year: "numeric",
  };

  return date.toLocaleDateString("en-US", options);
}

export const formatDateToISO = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const getOnlineStatusColor = (status) => {
  return status.toLowerCase() === 'active' ? colors.online : colors.offline
};


export const getStatusColor = status => {
    switch(status) {
      case 'pending' : return colors.pendingText;
      case 'new' : return colors.pendingText;
      case 'active' : return colors.online;
      case 'offline' : return colors.offline;
      case 'confirmed' : return colors.success;
      case "cancelled" : return colors.canceled;
      default: return colors.mainText
    }
}

export const isActive = (status) => {
   if(status.toLowerCase() === 'active' || status.toLowerCase() === 'confirmed'){
      return true
   } 

   return false
};


export const getStatusTranslation = (status) => {
    switch(status) {
      case 'pending' : return i18next.t(`Clinics.pending`);
      case 'active' : return i18next.t(`Clinics.active`);
      case 'offline' : return i18next.t(`Clinics.offline`);
      case 'confirmed' : return i18next.t(`Clinics.confirmed`);
      case 'cancelled' : return i18next.t(`Clinics.canceled`);
      case 'new' : return i18next.t(`Clinics.new`);
    }
};


export const canCancelAppointment = (status) => {
  return status !== 'cancelled'
}

export const canReBookAppointment = (status) => {
  return status !== 'cancelled'
}





