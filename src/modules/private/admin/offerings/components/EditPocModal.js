import React from 'react';
import { Modal, Form, Button, Message, Header } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { MaskedInput, FormDropDown } from '../../../../../theme/form';
import { ListErrors, InlineLoader } from '../../../../../theme/shared';

@inject('uiStore', 'offeringsStore', 'offeringCreationStore', 'userListingStore')
@observer
export default class EditOffering extends React.Component {
  componentWillMount() {
    this.props.userListingStore.initiateSearch({ accountType: ['ADMIN', 'ISSUER'] });
    this.props.uiStore.clearErrors();
    this.props.offeringCreationStore.setFormData('POC_DETAILS_FRM', '');
  }
  handleCloseModal = () => {
    this.props.history.push(this.props.refLink);
  }
  handleSubmitForm = () => {
    const {
      updateOffering,
      currentOfferingId,
    } = this.props.offeringCreationStore;
    updateOffering(currentOfferingId, null, 'editPocForm').then(() => {
      this.props.history.push(this.props.refLink);
    });
  }
  render() {
    const {
      POC_DETAILS_FRM,
      formChange,
      maskChange,
    } = this.props.offeringCreationStore;
    const { loading, usersOptionsForDropdown } = this.props.userListingStore;
    const { errors, inProgress } = this.props.uiStore;
    if (loading) {
      return <InlineLoader />;
    }
    return (
      <Modal size="small" open closeIcon onClose={this.handleCloseModal}>
        <Modal.Header>Edit information</Modal.Header>
        <Modal.Content>
          {errors &&
            <Message error textAlign="left" className="mt-30">
              <ListErrors errors={errors.message ? [errors.message] : [errors]} />
            </Message>
          }
          <Form onSubmit={() => this.handleSubmitForm()}>
            <Header as="h6">POC</Header>
            <FormDropDown
              search
              name="issuerId"
              placeholder="Choose here"
              containerclassname="dropdown-field"
              fluid
              selection
              fielddata={POC_DETAILS_FRM.fields.issuerId}
              onChange={(e, result) => formChange(e, result, 'POC_DETAILS_FRM')}
              options={usersOptionsForDropdown.issuer}
            />
            <Header as="h6">Lead</Header>
            <FormDropDown
              search
              name="id"
              placeholder="Choose here"
              containerclassname="dropdown-field"
              fluid
              selection
              fielddata={POC_DETAILS_FRM.fields.id}
              onChange={(e, result) => formChange(e, result, 'POC_DETAILS_FRM')}
              options={usersOptionsForDropdown.admin}
            />
            <MaskedInput
              name="targetDate"
              fielddata={POC_DETAILS_FRM.fields.targetDate}
              changed={(values, name) => maskChange(values, 'POC_DETAILS_FRM', name)}
              dateOfBirth
            />
            {errors &&
              <Message error textAlign="left" className="mt-30">
                <ListErrors errors={errors.message ? [errors.message] : [errors]} />
              </Message>
            }
            <div className="center-align mt-30">
              <Button primary className="relaxed" content="Save Changes" loading={inProgress} disabled={!POC_DETAILS_FRM.meta.isValid} />
            </div>
          </Form>
        </Modal.Content>
      </Modal>
    );
  }
}

