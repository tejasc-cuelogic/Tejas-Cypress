import { observable, computed } from 'mobx';
import teammember from '../../../../assets/images/owner-2.jpg';
import img from '../../../../assets/images/img.jpg';

export class UpdatesStore {
    generalData = {
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      name: 'Rassul Zarnifar ',
      avatar: teammember,
      title: 'Closing campaign early!',
    }
    @observable data = [
      {
        ...this.generalData,
        date: '2018-03-19T12:59-0500',
      },
      {
        ...this.generalData,
        date: '2018-03-19T12:59-0500',
        postImage: img,
        externalArticleLink: 'https://www.google.co.in/',
        extArticalImage: teammember,
        extArticalTitle: 'Search Anything Here',
      },
      {
        ...this.generalData,
        date: '2018-02-19T12:59-0500',
      },
      {
        ...this.generalData,
        date: '2018-02-19T12:59-0500',
      },
      {
        ...this.generalData,
        date: '2018-01-19T12:59-0500',
        postImage: img,
        externalArticleLink: 'https://www.google.co.in/',
        extArticalImage: teammember,
        extArticalTitle: 'Search Anything Here',
      },
      {
        ...this.generalData,
        date: '2018-01-19T12:59-0500',
      },
      {
        ...this.generalData,
        date: '2018-01-19T12:59-0500',
      },
      {
        ...this.generalData,
        date: '2017-12-19T12:59-0500',
      },
      {
        ...this.generalData,
        date: '2017-12-19T12:59-0500',
      }];

      @computed get allData() {
      return this.data;
    }
}

export default new UpdatesStore();
