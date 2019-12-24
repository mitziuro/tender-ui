import axios from "axios";

import { SERVER_URL } from './search.notice.crud';
export const CAN_OFFER_URL = SERVER_URL + "/api/can-offers";

export function searchCans(canSearch, page, size) {
    return axios.post(CAN_OFFER_URL  + '/search?page=' + page + '&size=' + size, canSearch);
}