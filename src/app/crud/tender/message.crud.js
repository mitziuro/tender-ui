import axios from "axios";

import { SERVER_URL } from './search.notice.crud';
export const MESSAGES_URL = SERVER_URL + "/api/messages";

export function getMessages(offerId) {
    return axios.get(MESSAGES_URL + '?offer=' + offerId);
}

export function saveMessage(message) {
    return axios.post(MESSAGES_URL, message);
}