import axios from "axios";

import { SERVER_URL } from './search.notice.crud';

export const FILES_URL = SERVER_URL + "/api/offers";
export const FILES_URL_URI = ( SERVER_URL.indexOf(':8080') >= 0 ? SERVER_URL : SERVER_URL  + ':8080' ) + '/api/offers';


export function uploadFile(offer, chapter, file) {
    return axios.post(FILES_URL  + '/documents/files/' + offer + '/' + chapter, file, {headers: {'Content-Type': 'multipart/form-data'}});
}

export function getFileURI(offer, chapter, fileName) {
    return FILES_URL_URI  + '/documents/files/' + offer + '/'  + chapter + '/'+ fileName;
}

export function getFiles(offer, chapter) {
    return axios.get(FILES_URL  + '/documents/files/' + offer + '/'  + chapter);
}


export function deleteFile(offer, chapter,  filename) {
    return axios.delete(FILES_URL  + '/documents/files/' + offer + '/'  + chapter + '/' + filename);
}