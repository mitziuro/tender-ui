import axios from "axios";

import { SERVER_URL } from './tender/search.notice.crud';

export const LOGIN_URL = SERVER_URL + "/api/authenticate";
export const REGISTER_URL = SERVER_URL +  "/api/register";
export const REQUEST_PASSWORD_URL = "api/auth/forgot-password";

export const ME_URL = SERVER_URL + "/api/me";

export function login(email, password, rememberMe) {
  return axios.post(LOGIN_URL, { username: email, password: password, rememberMe: rememberMe });
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
  return axios.post(REQUEST_PASSWORD_URL, { email });
}

export function getUserByToken() {
  return axios.get(ME_URL);
}

export function saveUserByToken(user) {
  return axios.post(ME_URL, user);
}
