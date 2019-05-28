import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Modal, Header, Form, Button } from 'semantic-ui-react';
// import { FormInput } from '../../../theme/form';

@inject('authStore', 'uiStore')
@observer
export default class EsAudit extends Component {
  componentWillMount() {
    // this.props.authStore.resetForm('CHANGE_PASS_FRM');
  }
  handleCloseModal = (e) => {
    e.stopPropagation();
    this.props.history.goBack();
  }
  render() {
    return (
      <Modal open closeIcon onClose={this.handleCloseModal} size="mini" closeOnDimmerClick={false}>
        <Modal.Header className="center-align signup-header">
          <Header as="h3">ES Audit</Header>
        </Modal.Header>
        <Modal.Content className="signup-content">
          <Form error onSubmit={this.onSubmit}>
            Test
            {/* {
              <FormInput
                type={pwdInputType}
                // icon={(field === 'oldPasswd') ? togglePasswordType() : null}
                name={field}
                fielddata={CHANGE_PASS_FRM.fields[field]}
                changed={changePassChange}
              />
            } */}
            <div className="mt-30 center-align">
              <Button primary size="large" className="very relaxed" content="Set new password" loading disabled />
            </div>
          </Form>
        </Modal.Content>
      </Modal>
    );
  }
}
