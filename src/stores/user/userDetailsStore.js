/* eslint-disable class-methods-use-this */
import { toJS, observable, computed, action } from 'mobx';
import graphql from 'mobx-apollo';
import Validator from 'validatorjs';
import mapValues from 'lodash/mapValues';
import { GqlClient as client } from '../../services/graphql';
import { BENEFICIARY_FRM } from '../../constants/user';
import { userDetailsQuery } from '../queries/users';
import { allBeneficiaries, createBeneficiaryMutation, deleteBeneficiary } from '../queries/beneficiaries';
import Helper from '../../helper/utility';

export class UserDetailsStore {
  @observable currentUser = {};
  @observable beneficiariesData = [];
  @observable editCard = 0;
  @observable BENEFICIARY_META = { fields: { ...BENEFICIARY_FRM }, meta: { isValid: false, error: '' } };

  @computed get userDetails() {
    const details = (this.currentUser.data && toJS(this.currentUser.data.user)) || {};
    return details;
  }

  @action
  setEditCard = (cardIndex) => {
    this.editCard = cardIndex || 0;
  }

  @action
  save = () => {
    this.editCard = 0;
    Helper.toast('User details updated sucessfully', 'success');
  }

  @action
  getUser = (id) => {
    this.currentUser = graphql({
      client,
      query: userDetailsQuery,
      variables: {
        id,
      },
    });
  }

  @action
  getBeneficiaries = () => {
    this.beneficiariesData = graphql({
      client,
      query: allBeneficiaries,
    });
  }

  @computed get beneficiaries() {
    return (this.beneficiariesData.data
      && this.beneficiariesData.data.allBeneficiaries
      && toJS(this.beneficiariesData.data.allBeneficiaries)
    ) || [];
  }

  @computed get bErr() {
    return (this.beneficiariesData.error && this.beneficiariesData.error.message) || null;
  }

  @computed get bLoading() {
    return this.beneficiariesData.loading;
  }

  @action
  createBeneficiary = () => {
    const beneficiary = mapValues(this.BENEFICIARY_META.fields, f => f.value);
    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation: createBeneficiaryMutation,
          variables: {
            firstName: beneficiary.firstName,
            lastName: beneficiary.lastName,
            relationship: beneficiary.relationship,
            residentalStreet: beneficiary.residentalStreet,
            city: beneficiary.city,
            state: beneficiary.state,
            zipCode: parseInt(beneficiary.zipCode, 10),
            dob: beneficiary.dob,
          },
          refetchQueries: [{ query: allBeneficiaries }],
        })
        .then((data) => {
          console.log(data);
          resolve();
        })
        .catch((err) => {
          console.log(err);
          reject();
        });
    });
  }

  @action
  deleteBeneficiary = id =>
    client
      .mutate({
        mutation: deleteBeneficiary,
        variables: { id },
        refetchQueries: [{ query: allBeneficiaries }],
      })
      .then(() => Helper.toast('Beneficiary deleted!', 'success'))
      .catch(error => Helper.toast(`Error while deleting Beneficiary- ${error}`, 'warn'));

  @action
  beneficiaryEleChange = (e, result) => {
    const fieldName = typeof result === 'undefined' ? e.target.name : result.name;
    const fieldValue = typeof result === 'undefined' ? e.target.value : result.value;
    this.onFieldChange('BENEFICIARY_META', fieldName, fieldValue);
  };

  @action
  beneficiaryDateChange = (date) => {
    this.onFieldChange('BENEFICIARY_META', 'dob', date);
  };

  @action
  onFieldChange = (currentForm, field, value) => {
    const form = currentForm || 'formFinInfo';
    this[form].fields[field].value = value;
    const validation = new Validator(
      mapValues(this[form].fields, f => f.value),
      mapValues(this[form].fields, f => f.rule),
    );
    this[form].meta.isValid = validation.passes();
    this[form].fields[field].error = validation.errors.first(field);
  };

  @action
  setAddressFields = (place) => {
    const data = Helper.gAddressClean(place);
    this.onFieldChange('BENEFICIARY_META', 'residentalStreet', data.residentalStreet);
    this.onFieldChange('BENEFICIARY_META', 'city', data.city);
    this.onFieldChange('BENEFICIARY_META', 'state', data.state);
    this.onFieldChange('BENEFICIARY_META', 'zipCode', data.zipCode);
  }
}

export default new UserDetailsStore();
