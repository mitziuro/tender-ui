import axios from "axios";

import { SERVER_URL } from './search.notice.crud';
export const COMPARISON_URL = SERVER_URL + "/api/comparison";

export function getQuantitative(cpv, nuts) {
    return axios.post(COMPARISON_URL + '/quantitative/' + cpv, nuts);
}
export function getValue(cpv, nuts) {
    return axios.post(COMPARISON_URL + '/value/' + cpv, nuts);
}

export function getAgg(cpv) {
    return axios.get(COMPARISON_URL + '/agg/' + cpv);
}