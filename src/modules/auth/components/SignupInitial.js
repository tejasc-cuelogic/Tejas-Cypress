import React from 'react';
import { Link } from 'react-router-dom';
import { Modal, Button, Grid, Header, Icon } from 'semantic-ui-react';

const signupInitial = props => (
  <Modal size="tiny" open>
    <Modal.Header className="center-align signup-header">
      <Header as="h2">How can NextSeed Help you?</Header>
      <p>Do you want to invest or apply for funding?</p>
    </Modal.Header>
    <Modal.Content className="signup-content">
      <Grid stackable textAlign="center">
        <Grid.Row columns={2}>
          <Grid.Column>
            <div className="user-type">
              <Icon name="ns-investor" size="huge" />
              <h3>Invester</h3>
              <p>Invest in existing businesses and get revenue</p>
            </div>
          </Grid.Column>
          <Grid.Column>
            <div className="user-type">
              <Icon name="ns-business" size="huge" />
              <h3>Business</h3>
              <p>Apply for funding with your business</p>
            </div>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Button primary onClick={() => props.setAuthWizardStep('InvestorSignup')} content="Start" />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Modal.Content>
    <Modal.Actions className="signup-actions">
      <p>Already have an account? <Link to="" onClick={() => props.setAuthWizardStep('Login')}>Log in</Link></p>
    </Modal.Actions>
  </Modal>
);

export default signupInitial;
