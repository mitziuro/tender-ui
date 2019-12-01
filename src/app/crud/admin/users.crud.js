import axios from "axios";

import { SERVER_URL } from './../tender/search.notice.crud';

export const USERS_URL = SERVER_URL + "/api/users";


export function getUsers(page, size) {
    return axios.get(USERS_URL  + '?page=' + page + '&size=' + size);
}


export function saveUser(user) {
    return axios.put(USERS_URL, user);
}

export function deleteUser(id) {
    return axios.delete(USERS_URL + '/' + id);
}

export function doImport() {
    return axios.get(USERS_URL + '/import');
}