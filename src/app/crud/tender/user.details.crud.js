import axios from "axios";

import { SERVER_URL } from './../tender/search.notice.crud';

export const USERS_URL = SERVER_URL + "/api/jhi-user-details";


export function getUser(userId) {
    return axios.get(USERS_URL + '/' + userId);
}

export function saveUser(user) {
    return axios.put(USERS_URL, user);
}