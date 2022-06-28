import axios from 'axios';
import { getToken } from './token';
import { Notification } from '@arco-design/web-react';
const request = axios.create({
  baseURL: 'http://localhost:3001',
});
request.interceptors.request.use((config: any) => {
  const token = getToken();
  // console.log(token)
  if (token) {
    config.headers.Authorization = token;
  }
  // console.log(config)
  return config;
});
request.interceptors.response.use(
  (config) => {
    return config;
  },
  (err) => {
    Notification.error({
      title: '出现错误',
      content: err.response.data.message,
    });
  }
);
export default request;
