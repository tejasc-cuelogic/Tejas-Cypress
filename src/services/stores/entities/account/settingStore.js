import { observable, action, toJS } from 'mobx';
import { isEmpty, find } from 'lodash';
import moment from 'moment';
import { userDetailsStore } from '../../index';
import Helper from '../../../../helper/utility';
import { DataFormatter } from '../../../../helper';

export class SettingStore {
  @observable settingsInfo = [];
  @observable includeData = [];

  @observable
  iraInfo = [
    { key: 'iraAccountType', label: 'Type', value: '' },
    { key: 'fundingType', label: 'Funding Option', value: '' },
    { key: 'netWorth', label: 'Net Worth', value: '' },
    { key: 'annualIncome', label: 'Annual Income', value: '' },
  ];

  @observable
  entityInfo = [
    { key: 'netAssets', label: 'Entity net assets', value: '' },
    { key: 'name', label: "Entity's name", value: '' },
    { key: 'taxId', label: 'Tax ID', value: '' },
  ];

  @observable
  individualInfo = [];

  setSettingsInfo = (accountType) => {
    if (!isEmpty(userDetailsStore.userDetails)) {
      const { roles } = userDetailsStore.userDetails;
      const accountData = find(roles, { name: accountType });
      this.setAccountInfo(accountType, accountData.details);
    }
  }

  @action
  setAccountInfo = (accountType, accountDetails) => {
    if (accountType === 'ira') {
      this.iraInfo.map((iraInfo) => {
        if (iraInfo.key) {
          const iraProperty = find(this.iraInfo, { key: iraInfo.key });
          iraProperty.value = (iraInfo.key === 'fundingType' || iraInfo.key === 'iraAccountType') ? DataFormatter.upperCamelCase(accountDetails[iraInfo.key]) : accountDetails[iraInfo.key];
        }
        return null;
      });
      if (!this.includeData.includes(accountType)) {
        this.iraInfo.push({ label: 'Identification', value: 'Uploaded' });
        this.iraInfo.push({ label: 'Requested Date', value: moment(accountDetails.created.date).format('MM/DD/YYYY') });
        this.iraInfo.push({ label: 'Approval Date', value: 'NA' });
        this.includeData.push(accountType);
      }
      this.settingsInfo = [...new Set(toJS(this.iraInfo))];
    } else if (accountType === 'entity') {
      this.entityInfo.map((entityInfo) => {
        if (entityInfo.key) {
          const iraProperty = find(this.entityInfo, { key: entityInfo.key });
          iraProperty.value = accountDetails[entityInfo.key];
        }
        return null;
      });
      if (!this.includeData.includes(accountType)) {
        this.entityInfo.splice(1, 0, { label: 'Other CF Investments', value: accountDetails.cfInvestment.amount });
        this.entityInfo.push({
          label: 'Entity address',
          value: `${accountDetails.address.street}, ${accountDetails.address.city}, ${accountDetails.address.state}, ${accountDetails.address.zipCode}`,
        });
        if (accountDetails.isTrust && accountDetails.isTrust.trustDate) {
          this.entityInfo.push({ label: 'Is Entity a trust?', value: `Yes, since ${accountDetails.isTrust.trustDate}` });
        } else {
          this.entityInfo.push({ label: 'Is Entity a trust?', value: 'No' });
        }
        this.entityInfo.push({ label: 'Title with the Entity', value: accountDetails.legalInfo.title });
        this.entityInfo.push({ label: 'Bank account', value: Helper.encryptNumber(accountDetails.linkedBank.accountNumber) });
        this.entityInfo.push({ label: 'Requested Date', value: moment(accountDetails.created.date).format('MM/DD/YYYY') });
        this.entityInfo.push({ label: 'Approval Date', value: 'NA' });
        this.includeData.push(accountType);
      }
      this.settingsInfo = [...new Set(toJS(this.entityInfo))];
    } else if (accountType === 'individual') {
      if (!this.includeData.includes(accountType)) {
        this.individualInfo.push({ label: 'Bank account', value: Helper.encryptNumber(accountDetails.linkedBank.accountNumber) });
        this.individualInfo.push({ label: 'Requested Date', value: moment(accountDetails.created.date).format('MM/DD/YYYY') });
        this.individualInfo.push({ label: 'Approval Date', value: 'NA' });
        this.includeData.push(accountType);
      }
      this.settingsInfo = [...new Set(toJS(this.individualInfo))];
    }
  }
}
export default new SettingStore();
