import React from 'react';
import { Modal, Form, Button, Message } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { FormInput, MaskedInput } from '../../../../../theme/form';
import { ListErrors } from '../../../../../theme/shared';

@inject('uiStore', 'offeringsStore', 'offeringCreationStore')
@observer
export default class EditOffering extends React.Component {
  componentWillMount() {
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
    const { errors, inProgress } = this.props.uiStore;
    return (
      <Modal size="small" open closeIcon onClose={this.handleCloseModal}>
        <Modal.Header>Edit information</Modal.Header>
        <Modal.Content>
          <Form error onSubmit={() => this.handleSubmitForm()}>
            {['address'].map(field => ( // "name" is skipped due to lead id issue
              <FormInput
                name={field}
                fielddata={POC_DETAILS_FRM.fields[field]}
                changed={(e, result) => formChange(e, result, 'POC_DETAILS_FRM')}
              />
            ))}
            <MaskedInput
              name="targetDate"
              fielddata={POC_DETAILS_FRM.fields.targetDate}
              changed={(values, name) => maskChange(values, 'POC_DETAILS_FRM', name)}
              dateOfBirth
            />
            {!errors &&
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

