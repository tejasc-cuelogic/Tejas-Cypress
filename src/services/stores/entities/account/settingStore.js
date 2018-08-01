import { observable } from 'mobx';

export class SettingStore {
  @observable settingsInfo = [
    { label: 'Type', value: 'Traditional' },
    { label: 'Funding Option', value: 'Direct rollover' },
    { label: 'Net Worth', value: '54022' },
    { label: 'Annual Income', value: '394293' },
    { label: 'Identification', value: 'Uploaded' },
    { label: 'Requested Date', value: '5/12/2018' },
    { label: 'Approval Date', value: '6/2/2018' },
  ]
}
export default new SettingStore();
