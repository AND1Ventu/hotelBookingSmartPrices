import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:3001/api', // Adjust for production
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as any;
    const token = state.auth?.accessToken;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const api = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: ['User', 'Hotel', 'Room', 'Booking'],
  endpoints: () => ({}),
});
