import axios from "axios";

import { SERVER_URL } from './search.notice.crud';
export const LAST_URL = SERVER_URL + "/api/jhi-user-activities/last";

export function getLastActivities() {
    return axios.get(LAST_URL);
}