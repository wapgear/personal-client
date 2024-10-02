import { Api, HttpClient } from 'tonapi-sdk-js';

const httpClient = new HttpClient({
  baseUrl: 'https://tonapi.io',
  baseApiParams: {
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_TONAPI_KEY}`,
      'Content-type': 'application/json',
    },
  },
});

export const tonApiClient = new Api(httpClient);
