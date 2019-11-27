import axios from "axios";

import { SERVER_URL } from './search.notice.crud';

export const ALERT_URL = SERVER_URL + "/api/alerts";
export const ALERT_DELETE_URL = SERVER_URL + "/api/alerts";


export function saveAlert(alert) {
    return axios.post(ALERT_URL, alert);
}

export function getAlert(id) {
    return axios.get(ALERT_URL + '/' + id);
}

export function getMyAlerts() {
    return axios.get(ALERT_URL);
}

export function deleteAlerts(id) {
    return axios.delete(ALERT_DELETE_URL + '/' + id);
}