import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Modal, Button, Header, Form, Message } from 'semantic-ui-react';
import Helper from '../../../../../helper/utility';
import { FormInput, MaskedInput, FormTextarea } from '../../../../../theme/form';
import { ListErrors } from '../../../../../theme/shared';

@inject('uiStore', 'businessAppStore')
@withRouter
@observer
export default class NeedHelpModal extends Component {
  handleCloseModal = (e) => {
    e.preventDefault();
    this.props.uiStore.setErrors(null);
    this.props.history.goBack();
  }
  submit = (e) => {
    e.preventDefault();
    this.props.businessAppStore.needHelpFormSubmit().then(() => {
      Helper.toast('Business application saved!', 'success');
      this.props.history.push('/app/dashboard');
    });
  }

  render() {
    const { inProgress } = this.props.uiStore;
    const { errors } = this.props.uiStore;
    const {
      NEED_HELP_FRM, businessAppEleChange, businessAppEleMaskChange,
    } = this.props.businessAppStore;
    const { fields } = NEED_HELP_FRM;
    return (
      <Modal size="mini" open closeIcon onClose={this.handleCloseModal} closeOnRootNodeClick={false}>
        <Modal.Header className="center-align signup-header">
          <Header as="h4">Need Help / Have Questions?</Header>
        </Modal.Header>
        <Modal.Content className="signup-content">
          {errors &&
            <Message error>
              <ListErrors errors={[errors]} />
            </Message>
          }
          <Form error onSubmit={this.submit}>
            {
              ['name', 'email'].map(field => (
                <FormInput
                  key={field}
                  type="text"
                  name={field}
                  fielddata={fields[field]}
                  changed={(e, res) => businessAppEleChange(e, res, 'NEED_HELP_FRM')}
                />
              ))
            }
            <MaskedInput
              name="phoneNumber"
              fielddata={fields.phoneNumber}
              changed={(values, field) => businessAppEleMaskChange(values, field, 'NEED_HELP_FRM')}
            />
            <FormTextarea
              type="text"
              name="question"
              fielddata={fields.question}
              containerclassname="secondary"
              changed={(e, res) => businessAppEleChange(e, res, 'NEED_HELP_FRM')}
            />
            <div className="center-align">
              <Button.Group>
                <Button inverted onClick={this.handleCloseModal} color="red" >Cancel</Button>
                <Button disabled={!NEED_HELP_FRM.meta.isValid} className="relaxed" loading={inProgress} color="green">Send</Button>
              </Button.Group>
            </div>
          </Form>
        </Modal.Content>
      </Modal>
    );
  }
}
