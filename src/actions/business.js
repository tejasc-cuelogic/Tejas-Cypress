import request from 'superagent';

import businessStore from './../stores/businessStore';
import { EDGAR_URL } from './../constants/business';

const getDocumentList = list => (
  Object.keys(list).filter(key => list[key])
);

export class Business {
  // _getDocumentList() {
  //   businessStore.documentList;
  // }

  generateDocxFile() {
    const { templateVeriables, documentList } = businessStore;
    console.log(this.businessStore);

    request
      .post(EDGAR_URL)
      .set('Content-Type', 'application/json')
      .send({
        templateVariables: templateVeriables,
        documentList: getDocumentList(documentList),
      })
      .end((err, res) => {
        if (err) {
          console.log(err);
        }
        console.log('yeah worked finally ', res);
        return res;
      });
  }
}

export default new Business();
