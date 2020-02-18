import axios from "axios";

import { SERVER_URL } from './search.notice.crud';
export const PROVIDERS_URL = SERVER_URL + "/api/providers";

export function searchProviders(canSearch, page, size) {
    return axios.post(PROVIDERS_URL  + '/search?page=' + page + '&size=' + size, canSearch);
}
