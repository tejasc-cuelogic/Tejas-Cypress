import request from 'superagent';

import businessStore from './../stores/businessStore';
import { EDGAR_URL } from './../constants/business';

export class Business {
  getDocumentList = list => (
    Object.keys(list).filter(key => list[key])
  )

  generateDocxFile = () => {
    const { templateVariables, documentList } = businessStore;

    // TODO: Move the call to the service layer
    request
      .post(EDGAR_URL)
      .set('Content-Type', 'application/json')
      .set('Access-Control-Allow-Origin', '*')
      .send({
        templateVariables,
        documentList: this.getDocumentList(documentList),
      })
      .end((err, res) => {
        if (err) {
          console.log(err);
        }
        return res;
      });
  }
}

export default new Business();
