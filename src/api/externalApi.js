import request from 'superagent';

/**
 * @desc Service to make external API calls from system
 */
export class ExternalApi {
  post = params => (
    new Promise((resolve, reject) => {
      request
        .post(`${params.url}`)
        .set('Content-Type', params.contentType)
        .send(params.payload)
        .end((err, data) => {
          if (err) {
            reject(err);
          }
          resolve(data);
        });
    })
  )
}

export default new ExternalApi();
