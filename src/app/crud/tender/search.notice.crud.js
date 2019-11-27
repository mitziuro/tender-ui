import axios from "axios";

export const SERVER_URL = 'http://localhost:8080';

export const CPVS_URL = SERVER_URL + "/api/cpvs?size=100000";
export const CA_URL = SERVER_URL + "/api/contracting-authorities?size=100000";
export const BF_URL = SERVER_URL + "/api/business-fields?size=100000";

export const NOTICE_CONTENT_URL = SERVER_URL + "/api/notice-contents";

export const NOTIFICATION_NOTICES_URL = SERVER_URL + "/api/notices";
export const NOTIFICATION_EXTERNAL_DOCUMENTS = SERVER_URL + '/api/notice-external-documents';

export function getCpvs() {
    return axios.get(CPVS_URL);
}

export function getContractingAuthorities() {
    return axios.get(CA_URL);
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

export function getNoticeContent(noticeId) {
    return axios.get(NOTICE_CONTENT_URL  + '/notice/'  + noticeId);
}

export function getNoticeDocuments(noticeId) {
    return axios.get(NOTIFICATION_EXTERNAL_DOCUMENTS  + '/notice/'  + noticeId);
}

export function getNoticeDocumentContentURI(id, filename) {
    return NOTIFICATION_EXTERNAL_DOCUMENTS  + '/notice/content/'  + filename + '?id=' + id;
}