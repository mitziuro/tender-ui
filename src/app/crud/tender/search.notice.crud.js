import axios from "axios";

import _SERVER_URL from 'base.server';

//export const SERVER_URL = 'http://51.140.219.10:8080';
export const SERVER_URL = _SERVER_URL;

export const NUTS_URL = SERVER_URL + "/api/nuts";
export const CPVS_URL = SERVER_URL + "/api/cpvs";
export const CA_URL = SERVER_URL + "/api/contracting-authorities";
export const BF_URL = SERVER_URL + "/api/business-fields?size=100000";

export const NOTICE_CONTENT_URL = SERVER_URL + "/api/notice-contents";

export const NOTIFICATION_NOTICES_URL = SERVER_URL + "/api/notices";
export const NOTIFICATION_EXTERNAL_DOCUMENTS = SERVER_URL + '/api/notice-external-documents';

export function getCpvs() {
    return axios.get(CPVS_URL + "?size=1000");
}

export function getNuts() {
    return axios.get(NUTS_URL + "?size=1000");
}

export function getContractingAuthorities() {
    return axios.get(CA_URL + "?size=1000");
}

export function searchCpvs(token) {
    return axios.post(CPVS_URL + "/search", token);
}

export function searchContractingAuthorities(token) {
    return axios.post(CA_URL + "/search", token);
}

export function getCpv(id: string) {
    return axios.get(CPVS_URL + "/" + id);
}

export function getContractingAuthority(id: string) {
    return axios.get(CA_URL + "/" + id);
}

export function getBusinessFields() {
    return axios.get(BF_URL);
}

export function getNotifiationNotices(page, size) {
    return axios.get(NOTIFICATION_NOTICES_URL  + '/me?page=' + page + '&size=' + size);
}

export function searchNotices(alert , page, size) {
    return axios.post(NOTIFICATION_NOTICES_URL  + '/search?page=' + page + '&size=' + size, alert);
}

export function getNotice(id) {
    return axios.get(NOTIFICATION_NOTICES_URL  + '/'  + id);
}

export function getNoticeContent(noticeId, type, language) {
    return axios.get(NOTICE_CONTENT_URL  + '/notice/'  + noticeId + '?type=' + type + '&lang=' + language);
}

export function getNoticeDocuments(noticeId) {
    return axios.get(NOTIFICATION_EXTERNAL_DOCUMENTS  + '/notice/'  + noticeId);
}

export function getNoticeDocumentContentURI(id, filename) {
    return NOTIFICATION_EXTERNAL_DOCUMENTS  + '/notice/content/'  + filename + '?id=' + id;
}