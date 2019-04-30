import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Form, Divider, Header } from 'semantic-ui-react';
import HtmlEditor from '../../../../../shared/HtmlEditor';
import ButtonGroupType2 from '../ButtonGroupType2';

@inject('offeringCreationStore', 'userStore', 'offeringsStore')
@observer
export default class Misc extends Component {
  // componentWillMount() {
  //   this.props.offeringCreationStore.setFormData('OFFERING_MISC_FRM', 'offering.misc');
  // }
  handleFormSubmit = (isApproved = null) => {
    const {
      OFFERING_MISC_FRM,
      updateOffering,
      currentOfferingId,
    } = this.props.offeringCreationStore;
    updateOffering(currentOfferingId, OFFERING_MISC_FRM.fields, 'offering', 'misc', true, undefined, isApproved);
  }
  render() {
    const {
      OFFERING_MISC_FRM, rtEditorChange, currentOfferingId,
    } = this.props.offeringCreationStore;
    const formName = 'OFFERING_MISC_FRM';
    const { offer } = this.props.offeringsStore;
    const access = this.props.userStore.myAccessForModule('OFFERINGS');
    const isManager = access.asManager;
    const submitted = (offer && offer.offering && offer.offering.misc &&
      offer.offering.misc.submitted) ? offer.offering.misc.submitted : null;
    const approved = (offer && offer.offering && offer.offering.misc &&
      offer.offering.misc.approved) ? offer.offering.misc.approved : null;
    const isReadonly = ((submitted && !isManager) || (isManager && approved && approved.status));
    return (
      <Form>
        <Header as="h4">Additional Bonus Rewards Content</Header>
        <HtmlEditor
          imageUploadPath={`offerings/${currentOfferingId}`}
          readOnly={isReadonly}
          changed={rtEditorChange}
          name="additionalBonusRewardsContent"
          form={formName}
          content={OFFERING_MISC_FRM.fields.additionalBonusRewardsContent.value}
        />
        <Divider hidden />
        <ButtonGroupType2
          submitted={submitted}
          isManager={isManager}
          formValid={OFFERING_MISC_FRM.meta.isValid}
          approved={approved}
          updateOffer={this.handleFormSubmit}
        />
      </Form>
    );
  }
}
