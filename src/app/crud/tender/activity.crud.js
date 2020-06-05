import axios from "axios";

import { SERVER_URL } from './search.notice.crud';
export const ACTIVITIES_URL = SERVER_URL + "/api/jhi-user-activities";

export function getLastActivities() {
    return axios.get(ACTIVITIES_URL + '/last');
}

export function getActivitiesForOffer(offer) {
    return axios.get(ACTIVITIES_URL + '/offer/' + offer);
}

export function getActivities(page, size) {
    return axios.get(ACTIVITIES_URL + (page != null ? '?page=' + page : '') + (size != null ? '&size=' + size : ''));
}