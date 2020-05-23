import axios from "axios";

import { SERVER_URL } from './../tender/search.notice.crud';

export const USERS_URL = SERVER_URL + "/api/jhi-user-details";
export const USERS_DTO_URL = SERVER_URL + "/api/users";


export function getUser(userId) {
    return axios.get(USERS_URL + '/' + userId);
}

export function saveUser(user) {
    return axios.put(USERS_URL, user);
}

export function expertsInternal() {
    return axios.get(USERS_DTO_URL + '/experts/internal');
}


export function getUserDisplay(id) {
    return axios.get(USERS_DTO_URL + '/get/' + id);
}
