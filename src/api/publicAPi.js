import axios from 'axios';

const publicApi = axios.create({
  baseURL: 'https://story-reader-backend.vercel.app', 
});

export default publicApi;
