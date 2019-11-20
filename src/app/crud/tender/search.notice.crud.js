import axios from "axios";

export const SERVER_URL = 'http://localhost:8080';

export const CPVS_URL = SERVER_URL + "/api/cpvs";
export const CA_URL = SERVER_URL + "/api/contracting-authorities";
export const BF_URL = SERVER_URL + "/api/business-fields";

export const NOTIFICATION_NOTICES_URL = SERVER_URL + "/api/notices";;

export function getCpvs() {
    return axios.get(CPVS_URL);
}

export function getContractingAuthorities() {
    return axios.get(CA_URL);
}

export function getBusinessFields() {
    return axios.get(BF_URL);
}

export function getNotifiationNotices(page, size) {
    return axios.get(NOTIFICATION_NOTICES_URL  + '?page=' + page + '&size=' + size);
}
