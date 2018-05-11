import React from 'react';
import { Modal, Button, Header, Form } from 'semantic-ui-react';

const AddWithdrawFund = ({ match, history }) => (
  <Modal
    dimmer
    open
    size="mini"
    closeIcon
    onClose={history.goBack}
    className="reward-modal"
  >
    <Modal.Header className="left-align">
      <Header as="h1">{(match.params.action === 'add' ? 'Add' : 'Withdraw')} funds</Header>
    </Modal.Header>
    <Modal.Content className="center-align">
      <p>Form content goes here !!</p>
      <Form error onSubmit={this.handleSubmitForm}>
        <Button primary size="large" onClose={history.goBack} className="very relaxed">
          {(match.params.action === 'add' ? 'Add' : 'Withdraw')} funds
        </Button>
      </Form>
    </Modal.Content>
  </Modal>
);

export default AddWithdrawFund;
