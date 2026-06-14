export const storeAdminToken = (token) => {
  localStorage.setItem('adminToken', token);
};

export const getAdminToken = () => {
  return localStorage.getItem('adminToken');
};

export const clearAdminToken = () => {
  localStorage.removeItem('adminToken');
};

export const isAdminAuthenticated = () => {
  return !!getAdminToken();
};