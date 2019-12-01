import axios from "axios";

import { SERVER_URL } from './search.notice.crud';

export const OFFER_URL = SERVER_URL + "/api/offers";

export function getOffer(id) {
    return axios.get(OFFER_URL + '/' + id);
}

export function getMyOfferForNotice(noticeId) {
    return axios.get(OFFER_URL + '/me/' + noticeId);
}

export function putMyOfferForNotice(noticeId) {
    return axios.put(OFFER_URL + '/me/' + noticeId);
}

export function takeOffer(id) {
    return axios.put(OFFER_URL + '/me/take/' + id);
}

export function closeOffer(id) {
    return axios.put(OFFER_URL + '/me/close/' + id);
}

export function declineOffer(id, offer) {
    return axios.post(OFFER_URL + '/decline/' + id, offer);
}

export function getOffersForTender(states, page, size) {
    return axios.get(OFFER_URL  + '/me/tender/'  + states.join(',') + '?page=' + page + '&size=' + size);
}

export function getOffersForSupervisor(states, page, size) {
    return axios.get(OFFER_URL  + '/me/supervisor/'  + states.join(',') + '?page=' + page + '&size=' + size);
}
