import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Form, Divider, Header } from 'semantic-ui-react';
import HtmlEditor from '../../../../../shared/HtmlEditor';
import ButtonGroup from '../ButtonGroup';

@inject('offeringCreationStore', 'userStore')
@observer
export default class Misc extends Component {
  componentWillMount() {
    this.props.offeringCreationStore.setFormData('OFFERING_MISC_FRM', 'offering.misc');
  }
  handleFormSubmit = (isApproved = null) => {
    const {
      OFFERING_MISC_FRM,
      updateOffering,
      currentOfferingId,
    } = this.props.offeringCreationStore;
    updateOffering(currentOfferingId, OFFERING_MISC_FRM.fields, 'offering', 'misc', true, undefined, isApproved);
  }
  render() {
    const { OFFERING_MISC_FRM, rtEditorChange } = this.props.offeringCreationStore;
    const formName = 'OFFERING_MISC_FRM';
    const access = this.props.userStore.myAccessForModule('OFFERINGS');
    const isApproved = false;
    return (
      <Form>
        <Header as="h4">Additional Bonus Rewards Content</Header>
        <HtmlEditor
          changed={rtEditorChange}
          name="additionalBonusRewardsContent"
          form={formName}
          overrides={{ height: '244px' }}
          content={OFFERING_MISC_FRM.fields.additionalBonusRewardsContent.value}
        />
        <Divider hidden />
        <ButtonGroup
          isManager={access.asManager}
          formValid={OFFERING_MISC_FRM.meta.isValid}
          isApproved={isApproved}
          updateOffer={this.handleFormSubmit}
        />
      </Form>
    );
  }
}
