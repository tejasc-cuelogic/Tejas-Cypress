import request from 'superagent';

/**
 * @desc Service to make asynchronous API calls from system
 */
export class UploadApi {
  put = url => (
    new Promise((resolve, reject) => {
      request
        .put(`${url}`)
        .end((err, data) => {
          if (err) {
            reject(err);
          }
          resolve(data);
        });
    })
  )
}

export default new UploadApi();
