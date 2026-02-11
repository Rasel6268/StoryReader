import axios from 'axios';

const publicApi = axios.create({
  baseURL: 'https://story-reader-backendconfig.vercel.app', 
});

export default publicApi;
