import axios from "axios";

import { SERVER_URL } from './search.notice.crud';
export const CAN_URL = SERVER_URL + "/api/cans";

export function searchCans(canSearch, page, size) {
    return axios.post(CAN_URL  + '/search?page=' + page + '&size=' + size, canSearch);
}