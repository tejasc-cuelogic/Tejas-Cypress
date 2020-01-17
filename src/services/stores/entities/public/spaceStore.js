import { observable, decorate, action } from 'mobx';
import { FormValidator } from '../../../../helper';
import { CONTACT_META } from '../../../constants/space';
import { spaceHelpAndQuestion } from '../../queries/public';
import Helper from '../../../../helper/utility';
import DataModelStore, { decorateDefault } from '../shared/dataModelStore';


export class SpaceStore extends DataModelStore {
    constructor() {
        super({ spaceHelpAndQuestion });
    }

    CONTACT_FRM = FormValidator.prepareFormObject(CONTACT_META);

    spaceHelpAndQuestion = async () => {
        const payload = FormValidator.evaluateFormData(this.CONTACT_FRM.fields);
        try {
            await this.executeMutation({
              mutation: 'spaceHelpAndQuestion',
              clientType: 'PUBLIC',
              variables: { spaceDetails: payload },
              setLoader: 'spaceHelpAndQuestion',
            });
            Helper.toast('Your response is Submitted successfully.', 'success');
            Promise.resolve();
          } catch (error) {
            Helper.toast('Something went wrong. Please try again in some time.', 'error');
            Promise.reject();
          }
    }
}

decorate(SpaceStore, {
    ...decorateDefault,
    CONTACT_FRM: observable,
    spaceHelpAndQuestion: action,
  });

export default new SpaceStore();
