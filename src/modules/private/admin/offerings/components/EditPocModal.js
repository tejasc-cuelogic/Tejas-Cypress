import React from 'react';
import { Modal, Form, Button, Message } from 'semantic-ui-react';
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
    return (
      <Modal size="mini" open closeIcon onClose={this.handleCloseModal}>
        <Modal.Header>Edit information</Modal.Header>
        <Modal.Content>
          {loading ?
            <InlineLoader />
            :
            <Form error onSubmit={() => this.handleSubmitForm()}>
              {['issuerId', 'id'].map(field => (
                <FormDropDown
                  search
                  name={field}
                  placeholder="Choose here"
                  containerclassname="dropdown-field"
                  fluid
                  selection
                  fielddata={POC_DETAILS_FRM.fields[field]}
                  onChange={(e, result) => formChange(e, result, 'POC_DETAILS_FRM')}
                  options={field === 'issuerId' ? usersOptionsForDropdown.issuer : usersOptionsForDropdown.admin}
                />
              ))}
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
          }
        </Modal.Content>
      </Modal>
    );
  }
}

