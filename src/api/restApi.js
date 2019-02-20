import request from 'superagent';
import { API_ROOT } from '../constants/common';
import { commonStore } from '../services/stores';

/**
 * @desc Service to make asynchronous API calls from system
 */
export class Api {
  get = (url, payload) => (
    new Promise((resolve, reject) => {
      request
        .get(`${API_ROOT}${url}`)
        .set('Content-Type', 'application/json')
        .set('Authorization', commonStore.token)
        .send(payload)
        .end((err, data) => {
          if (err) {
            reject(err);
          }
          resolve(data);
        });
    })
  )

  post = (url, payload) => (
    new Promise((resolve, reject) => {
      request
        .post(url.includes('https://') ? url : `${API_ROOT}${url}`)
        .set('Content-Type', 'application/json')
        .set('Authorization', commonStore.token)
        .send(payload)
        .end((err, data) => {
          if (err) {
            reject(err);
          }
          resolve(data);
        });
    })
  )

  postNoAuth = (url, payload) => (
    new Promise((resolve, reject) => {
      request
        .post(url.includes('https://') ? url : `${API_ROOT}${url}`)
        .set('Content-Type', 'application/json')
        .send(payload)
        .end((err, data) => {
          if (err) {
            reject(err);
          }
          resolve(data);
        });
    })
  )

  delete = (url, payload) => (
    new Promise((resolve, reject) => {
      request
        .delete(`${API_ROOT}${url}`)
        .set('Content-Type', 'application/json')
        .set('Authorization', commonStore.token)
        .send(payload)
        .end((err, data) => {
          if (err) {
            reject(err);
          }
          resolve(data);
        });
    })
  )

  put = (url, payload) => (
    new Promise((resolve, reject) => {
      request
        .put(`${API_ROOT}${url}`)
        .set('Content-Type', 'application/json')
        .set('Authorization', commonStore.token)
        .send(payload)
        .end((err, data) => {
          if (err) {
            reject(err);
          }
          resolve(data);
        });
    })
  )

  uploadOnS3 = (url, file, type = 'text/plain') => (
    new Promise((resolve, reject) => {
      request
        .put(`${url}`)
        .set('Content-Type', type) // File upload (Binary Mode)
        .send(file)
        .end((err, data) => {
          if (err) {
            reject(err);
          }
          resolve(data);
        });
    })
  )
  getRemoteFile = url => (
    new Promise((resolve, reject) => {
      request
        .get(url)
        .then((data) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        });
    })
  )
}

export default new Api();
