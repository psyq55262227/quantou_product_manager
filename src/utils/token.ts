export const getToken = (): string | null => {
  return localStorage.getItem('qt_token');
};
export const setToken = (token: string): void => {
  localStorage.setItem('qt_token', token);
};
export const delToken = (): void => {
  if (getToken()) localStorage.removeItem('qt_token');
};
