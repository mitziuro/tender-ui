import axios from "axios";

import { SERVER_URL } from './../tender/search.notice.crud';

export const BIDS_URL = SERVER_URL + "/api/bids";

export function getBidsForUserAndOffer(userId, id) {
    return axios.get(BIDS_URL + '/owner/' + userId + '/offer/' + id)
}

export function getBidsForOffer(id) {
    return axios.get(BIDS_URL + '/offer/get/' + id);
}

export function saveBids(bid, id) {
    return axios.post(BIDS_URL + '/offer/' + id, bid);
}

