import {getDateString} from "./helpers";

export const OCCASION_CONSTANTS = {
    BIRTHDAY: 'birthday',
    ANNIVERSARY: 'anniversary',
    BUSSINESS: 'business',
    CASUAL: 'casual'
};

export const INITIAL_VALUES = {
    date: getDateString(new Date()),
    time: "",
    guests: 1,
    child_count: 0,
    seating_preference_id: '',
    occasion: OCCASION_CONSTANTS.CASUAL,
    note: ''
}