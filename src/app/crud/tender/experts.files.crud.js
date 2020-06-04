import axios from "axios";

import { SERVER_URL } from './search.notice.crud';

export const FILES_URL = SERVER_URL + "/api/experts";
export const FILES_URL_URI = ( SERVER_URL.indexOf(':8080') >= 0 ? SERVER_URL : SERVER_URL  + ':8080' ) + '/api/experts';


export function uploadFile(file, id) {
    return axios.post(FILES_URL  + '/documents' + (id != null ? '/' + id : ''), file, {headers: {'Content-Type': 'multipart/form-data'}});
}

export function getFileURI(fileName, id) {
    return FILES_URL_URI  + '/documents' + (id != null ? '/' + id : '') + '/'+ fileName ;
}

export function getFiles(id) {
    return axios.get(FILES_URL  + '/documents' + (id != null ? '/' + id : ''));
}


export function deleteFile(filename) {
    return axios.delete(FILES_URL  + '/documents/' + filename);
}