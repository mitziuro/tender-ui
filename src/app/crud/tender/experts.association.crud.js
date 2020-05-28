import axios from "axios";

import { SERVER_URL } from './search.notice.crud';

export const EXPERTS_ASSOCIATION_URL = SERVER_URL + "/api/experts-associations";


export function addAssociation(association) {
    return axios.post(EXPERTS_ASSOCIATION_URL, association);
}

export function deleteAssociationForUserId(userId) {
    return axios.delete(EXPERTS_ASSOCIATION_URL  + '/user/' + userId);
}