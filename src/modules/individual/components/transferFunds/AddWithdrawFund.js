import React from 'react';
import { Link } from 'react-router-dom';
import { Modal, Button, Header, Form, Icon, Input, Divider } from 'semantic-ui-react';

const AddWithdrawFund = ({ match, history, location }) => (
  <Modal
    dimmer
    open
    size="mini"
    closeIcon
    onClose={history.goBack}
    className="reward-modal"
  >
    <Modal.Header>
      <Header as="h2"><Icon className="ns-individual-line" color="teal" /> {(match.params.action === 'add' ? 'Add' : 'Withdraw')} funds</Header>
    </Modal.Header>
    <Modal.Content>
      <Header as="h5">
        <Header.Subheader>Bank account</Header.Subheader>
        Bank of America ...7545 <Link to={location}>Change</Link>
      </Header>
      <Form error onSubmit={this.handleSubmitForm}>
        <Form.Field>
          {/* eslint-disable jsx-a11y/label-has-for */}
          <label>Amount you want to {(match.params.action === 'add' ? 'deposit' : 'Withdraw')}</label>
          <Input
            label={{ basic: true, content: '$' }}
            placeholder="1000"
          />
        </Form.Field>
        <Divider hidden />
        <div className="center-align">
          <Button primary size="large" onClose={history.goBack} className="very relaxed">
            {(match.params.action === 'add' ? 'Add' : 'Withdraw')} funds
          </Button>
        </div>
      </Form>
    </Modal.Content>
  </Modal>
);

export default AddWithdrawFund;
