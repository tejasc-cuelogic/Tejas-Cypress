import { observable, computed, action } from 'mobx';

export class HelloWorldStore {
  @observable data = [];

  @observable details = 'This is just a hello world page details!';

  @action
  initRequest = () => {
    this.data = [{ id: 1, title: 'this is a title', createdAt: '03/03/2018' }];
  }

  @computed get allRecords() {
    return this.data;
  }

  @computed get currentRecord() {
    return this.details;
  }
}

export default new HelloWorldStore();
