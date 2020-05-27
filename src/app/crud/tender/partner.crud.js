import axios from "axios";

import { SERVER_URL } from './search.notice.crud';
export const PARTNER_URL = SERVER_URL + "/api/partners";

export function getPartnersForOffer(id) {
    return axios.get(PARTNER_URL + '/offer/' + id);
}

export function savePartner(obj) {
    return axios.post(PARTNER_URL, obj);
}

export function deletePartnerByEntry(id) {
    return axios.delete(PARTNER_URL + '/' + id);
}

