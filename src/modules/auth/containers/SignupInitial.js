import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Modal, Button, Grid, Header, Icon } from 'semantic-ui-react';
import { USER_TYPES_META } from './../../../constants/user';

@inject('authStore', 'uiStore')
@observer
class signupInitial extends Component {
  chooseType = type => this.props.authStore.updatesignupFlow('type', type);

  render() {
    const userTypes = USER_TYPES_META.slice();
    const selectedType = this.props.authStore.signupFlow.type;
    return (
      <Modal size="tiny" dimmer="blurring" open onClose={() => this.props.setAuthWizardStep()}>
        <Modal.Header className="center-align signup-header">
          <Header as="h2">How can NextSeed Help you?</Header>
          <p>Do you want to invest or apply for funding?</p>
        </Modal.Header>
        <Modal.Content className="signup-content">
          <Grid stackable textAlign="center">
            <Grid.Row columns={2}>
              {userTypes.map(type => (
                <Grid.Column onClick={() => this.chooseType(type.value)} key={type.key}>
                  <div className={(selectedType === type.value ? 'user-type active' : 'user-type')}>
                    <Icon name="money" size="huge" />
                    <h3>{type.text}</h3>
                    <p>{type.desc}</p>
                  </div>
                </Grid.Column>
              ))}
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Button color="green" size="large" className="very relaxed" onClick={() => this.props.setAuthWizardStep('InvestorSignup')} content="Start" />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Modal.Content>
        <Modal.Actions className="signup-actions">
          <p>Already have an account? <Link to="" onClick={() => this.props.setAuthWizardStep('Login')}>Log in</Link></p>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default signupInitial;
