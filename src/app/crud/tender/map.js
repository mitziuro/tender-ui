import axios from "axios";

import { SERVER_URL } from './search.notice.crud';
export const MAP_URL = SERVER_URL + "/api/map";

export function getMap() {
    return axios.get(MAP_URL);
}