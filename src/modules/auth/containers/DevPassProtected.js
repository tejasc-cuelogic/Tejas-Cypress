import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import Aux from 'react-aux';
import { Modal, Button, Form, Image, Divider } from 'semantic-ui-react';
import activityActions from '../../../actions/activity';
import { FieldError } from '../../../theme/common';
import Logo from '../../../assets/images/nextseed_logo_white_green.svg';

@inject('authStore', 'uiStore')
@withRouter
@observer
class DevPassProtected extends Component {
  state = { password: '', error: '' };
  componentWillMount() {
    this.setState({ password: '', error: '' });
  }
  submit = () => {
    activityActions.devAppLogin({ password: this.state.password })
      .then(() => {
        activityActions.log({ action: 'LOGIN', status: 'SUCCESS' });
        this.props.authStore.setDevAppAuthStatus(true);
        this.props.history.push('/');
      })
      .catch(() => {
        activityActions.log({ action: 'LOGIN', status: 'FAIL' });
        this.setState({ error: 'Entered password is invalid, please try again.' });
      });
  }
  render() {
    return (
      <Aux>
        <Modal size="mini" basic open className="multistep-modal">
          <Image className="medium" centered src={Logo} alt="NextSeed.com" />
          <Divider hidden />
          <Modal.Content className="signup-modal multistep">
            <Form onSubmit={this.submit}>
              <Form.Input
                onChange={e => this.setState({ password: e.target.value, error: '' })}
                fluid
                placeholder="Please enter password here"
                label="Password"
                value={this.state.password}
                type="password"
                name="password"
                error={this.state.error}
              />
              <FieldError error={this.state.error} />
              <div className="center-align">
                <Button disabled={!this.state.password} primary size="large" className="very relaxed">Log in</Button>
              </div>
            </Form>
          </Modal.Content>
        </Modal>
      </Aux>
    );
  }
}

export default DevPassProtected;
