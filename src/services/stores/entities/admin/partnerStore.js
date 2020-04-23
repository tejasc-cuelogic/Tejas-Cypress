import { decorate, observable, action } from 'mobx';
import { FormValidator as Validator } from '../../../../helper';
import { PARTNER } from '../../../constants/admin/partner';

import DataModelStore, { decorateDefault } from '../shared/dataModelStore';

class PartnerStore extends DataModelStore {
  records = [];

  PARTNER_FRM = Validator.prepareFormObject(PARTNER);

  initRequest = () => {
    this.records = [{ name: 'swap', lastName: 'Bhosale' }, { name: 'John', lastName: 'SMith' }];
  }
}
decorate(PartnerStore, {
    ...decorateDefault,
    records: observable,
    PARTNER_FRM: observable,
    initRequest: action,
});
export default new PartnerStore();
