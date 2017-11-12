import superagentPromise from 'superagent-promise';
import _superagent from 'superagent';
import commonStore from './stores/commonStore';
import authStore from './stores/authStore';

const superagent = superagentPromise(_superagent, global.Promise);

const API_ROOT = 'http://localhost:8001';

const handleErrors = (err) => {
  if (err && err.response && err.response.status === 401) {
    authStore.logout();
  }
  return err;
};

const responseBody = res => res.body;

const tokenPlugin = (req) => {
  if (commonStore.token) {
    req.set('Authorization', `Bearer ${commonStore.token}`);
  }
};

const requests = {
  del: url =>
    superagent
      .del(`${API_ROOT}${url}`)
      .use(tokenPlugin)
      .end(handleErrors)
      .then(responseBody),
  get: url =>
    superagent
      .get(`${API_ROOT}${url}`)
      .use(tokenPlugin)
      .end(handleErrors)
      .then(responseBody),
  put: (url, body) =>
    superagent
      .put(`${API_ROOT}${url}`, body)
      .use(tokenPlugin)
      .end(handleErrors)
      .then(responseBody),
  post: (url, body) =>
    superagent
      .post(`${API_ROOT}${url}`, body)
      .use(tokenPlugin)
      .end(handleErrors)
      .then(responseBody),
};

const Auth = {
  current: () =>
    requests.get('/user'),
  login: (email, password) =>
    requests.post('/login', { email, password }),
  register: (username, email, password, verify) =>
    requests.post('/signup', {
      username, email, password, verify,
    }),
  save: user =>
    requests.put('/user', { user }),
};

const User = {
  get: id =>
    requests.get(`/user/${id}`),
  update: user =>
    requests.put(`/user/${user.id}`, { ...user }),
};

const Profile = {
  get: username =>
    requests.get(`/profiles/${username}`),
};

export default {
  Auth,
  Profile,
  User,
};
