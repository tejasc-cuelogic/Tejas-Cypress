import React from 'react';
import { Header, Form, Input, Button } from 'semantic-ui-react';

export default class LinkBankAccountForm extends React.Component {
  render() {
    return (
      <div>
        <Header as="h2">Link Bank Account</Header>
        <Form error onSubmit={this.handleSubmitForm}>
          <Form.Field>
            { /*  eslint-disable jsx-a11y/label-has-for */ }
            <label>Your email</label>
            <Input
              className="u-full-width required"
              placeholder="test@mailbox.com"
              type="email"
            />
          </Form.Field>
          <Form.Field>
            <label>Confirm email</label>
            <Input
              className="u-full-width"
              placeholder="Confirm email"
              type="email"
            />
          </Form.Field>
          <div className="center-align">
            <Button primary size="large">Confirm</Button>
          </div>
          <div className="center-align">
            <Button className="cancel-link" onClick={this.props.toggleBankLinkInterface}>Or select your bank from the list</Button>
          </div>
        </Form>
      </div>
    );
  }
}
