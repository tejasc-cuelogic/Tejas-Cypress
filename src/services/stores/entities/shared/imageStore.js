import { observable, action } from 'mobx';
import apiService from '../../../../api/restApi';

export class ImageStore {
  @observable data = {};

  @action
  getBase64Content = url => new Promise((resolve) => {
    if (this.data[url]) {
      resolve(this.data[url]);
    }
    apiService.getRemoteFile(url).then(action((res) => {
      this.data[url] = res.text;
      resolve(this.data[url]);
    }));
  });
}

export default new ImageStore();
