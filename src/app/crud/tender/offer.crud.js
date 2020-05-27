import axios from "axios";

import { SERVER_URL } from './search.notice.crud';

export const OFFER_URL = SERVER_URL + "/api/offers";
export const STRUCTURE_URL = SERVER_URL + "/api/chapter-structures";
export const CHAPTERS_URL = SERVER_URL + "/api/chapters";
export const CHAPTERS_CONTENT_URL = SERVER_URL + "/api/chapter-contents";


export function getOffer(id) {
    return axios.get(OFFER_URL + '/' + id);
}

export function getMyOfferForNotice(noticeId) {
    return axios.get(OFFER_URL + '/me/' + noticeId);
}

export function putMyOfferForNotice(noticeId) {
    return axios.put(OFFER_URL + '/me/' + noticeId);
}

export function saveOffer(id, offer, state) {
    return axios.post(OFFER_URL + '/me/save/' + id + (state != null ? '?state=' + state : ''), offer);
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

export function getOffersForExpert(states, page, size) {
    return axios.get(OFFER_URL  + '/me/expert/'  + states.join(',') + '?page=' + page + '&size=' + size);
}

export function uploadTemplate(file) {
    return axios.post(OFFER_URL  + '/documents/templates', file, {headers: {'Content-Type': 'multipart/form-data'}});
}

export function getTemplateURI(fileId, fileName) {
    return OFFER_URL  + '/documents/templates/' + fileId + '/' + fileName;
}

export function getSectionURI(id, section) {
    return OFFER_URL  + '/content/' + id +  ( section != null ? '?section=' + section : '');
}

export function getStructuresSupervisor(e) {
    return axios.get(STRUCTURE_URL);
}

export function getChaptersForOffer(id) {
    return axios.get(CHAPTERS_URL + '/offer/' + id);
}

export function saveChapters(chapters) {
    return axios.post(CHAPTERS_URL, chapters);
}

export function getChaptersContent(id) {
    return axios.get(CHAPTERS_CONTENT_URL + '/uuid/' + id);
}

export function saveChaptersContent(content) {
    return axios.post(CHAPTERS_CONTENT_URL, content);
}