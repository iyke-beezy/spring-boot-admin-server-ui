import axios from 'axios';
import uiconfig from '../constants/uiconfig'

axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.xsrfHeaderName = uiconfig.csrf.headerName;

export const redirectOn401 = (predicate = () => true) => error => {
  if (error.response && error.response.status === 401 && predicate(error)) {
    window.location.assign(`login?redirectTo=${encodeURIComponent(window.location.href)}`);
  }
  return Promise.reject(error);

};

const instance = axios.create({withCredentials: true, headers: {'Accept': 'application/json'}});
instance.interceptors.response.use(response => response, redirectOn401());
instance.create = axios.create;

export default instance;