import axios from "axios";

import { SERVER_URL } from './tender/search.notice.crud';

export const LOGIN_URL = SERVER_URL + "/api/authenticate";
export const ACTIVATE_URL = SERVER_URL + "/api/activate";
export const REGISTER_URL = SERVER_URL +  "/api/register";
export const REQUEST_PASSWORD_URL = SERVER_URL +  "/api/account/reset-password/init";
export const FINISH_PASSWORD_URL = SERVER_URL +  "/api/account/reset-password/finish";
export const CHANGE_PASSWORD_URL = SERVER_URL +  "/api/account/change-password";

export const ME_URL = SERVER_URL + "/api/me";

export function login(email, password, rememberMe) {
  return axios.post(LOGIN_URL, { username: email, password: password, rememberMe: rememberMe });
}

export function activateAccount(key) {
  return axios.get(ACTIVATE_URL + '?key=' + key);
}

export function register(email, firstname, lastname, password) {
  return axios.post(REGISTER_URL, {
    login : email,
    email: email,
    firstName: firstname,
    lastName: lastname,
    password: password });
}

export function requestPassword(email) {
  return axios.post(REQUEST_PASSWORD_URL, email);
}

export function finishPassword(key, password) {
  return axios.post(FINISH_PASSWORD_URL, {key: key, newPassword: password});
}

export function changePassword(password, newPassword) {
  return axios.post(CHANGE_PASSWORD_URL, {currentPassword: password, newPassword: newPassword});
}


export function getUserByToken() {
  return axios.get(ME_URL);
}

export function saveUserByToken(user) {
  return axios.post(ME_URL, user);
}
