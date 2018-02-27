import request from 'superagent';
import { API_ROOT } from '../constants/common';

export class Api {
  get = (url, payload) => (
    new Promise((resolve, reject) => {
      request
        .get(`${API_ROOT}${url}`)
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

  post = (url, payload) => (
    new Promise((resolve, reject) => {
      request
        .post(`${API_ROOT}${url}`)
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
        .send(payload)
        .end((err, data) => {
          if (err) {
            reject(err);
          }
          resolve(data);
        });
    })
  )
}

export default new Api();
