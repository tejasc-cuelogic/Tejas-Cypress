import request from 'superagent';

/**
 * @desc Service to make asynchronous API calls from system
 */
export class UploadApi {
  put = (url, file) => (
    new Promise((resolve, reject) => {
      request
        .put(`${url}`)
        .set('Content-Type', 'text/plain')
        .send(file)
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
