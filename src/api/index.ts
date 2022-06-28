import request from '@/utils/request';

export const apiGET = (url: string, data?: any) => {
  let params = '';
  if (data) {
    const key = Object.keys(data);
    const value = Object.values(data);
    params = key
      .map((item, i) => `${i === 0 ? '?' : '&'}${item}=${value[i]}`)
      .join('');
  }
  return request.get(`${url}${params}`);
};
export const apiPOST = (url: string, data?: any) => request.post(url, data);
