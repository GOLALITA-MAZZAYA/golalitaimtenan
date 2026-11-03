import i18next from "i18next";
import {colors} from "../colors";

export const getStatusColor = status => {
    switch(status) {
      case 'pending' : return colors.pendingText;
      case 'payment_pending': return colors.pendingText;
      case 'not_paid' : return colors.pendingText;
      case 'paid' : return colors.success;
      case 'new' : return colors.pendingText;
      case 'active' : return colors.online;
      case 'offline' : return colors.offline;
      case 'confirmed' : return colors.success;
      case "cancelled" : return colors.canceled;
      case 'under_review': return colors.pendingText
      default: return colors.mainText
    }
}


export const getStatusTranslation = (status) => {
    switch(status) {
      case 'pending' : return i18next.t(`Clinics.pending`);
      case 'active' : return i18next.t(`Clinics.active`);
      case 'offline' : return i18next.t(`Clinics.offline`);
      case 'confirmed' : return i18next.t(`Clinics.confirmed`);
      case 'cancelled' : return i18next.t(`Clinics.canceled`);
      case 'new' : return i18next.t(`Clinics.new`);
      case 'under_review': return i18next.t(`Clinics.under_review`);
      case 'not_paid' : return i18next.t(`Clinics.not_paid`);
      case 'paid' : return i18next.t(`Clinics.paid`);
      case 'payment_pending': return i18next.t(`Clinics.paymentPending`);
    }
};
