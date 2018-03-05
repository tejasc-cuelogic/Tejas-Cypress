import React from 'react';
import { Link } from 'react-router-dom';
import { Modal, Grid, Header, Button } from 'semantic-ui-react';

const investmentChooseType = props => (
  // <Modal size="tiny" open>
  //   <Modal.Header>
  //     What type of investment account would you like to start?
  //   </Modal.Header>
  //   <Modal.Content>
  //     <div>Individual</div>
  //     <div>Entity</div>
  //     <div>IRA</div>
  //     {props.authWizardStep}
  //   </Modal.Content>
  //   <Modal.Actions>
  //     <Button positive icon="checkmark" labelPosition="right" content="Accept" />
  //   </Modal.Actions>
  // </Modal>

  <Modal size="tiny" open>
    <Modal.Content scrolling className="signup-modal">
      <Grid textAlign="center">
        <Grid.Row>
          <Grid.Column>
            <Header as="h2">What type of Investment Account would you like to start?</Header>
            <p>Choose an account type</p>
          </Grid.Column>
        </Grid.Row>
        {/* <Grid.Row columns={2}>
          <Grid.Column>
            <div className="user-type">
              <Icon name="money" size="huge" />
              <h3>Invester</h3>
              <p>Invest in existing businesses and get revenue</p>
            </div>
          </Grid.Column>
          <Grid.Column>
            <div className="user-type">
              <Icon name="money" size="huge" />
              <h3>Business</h3>
              <p>Apply for funding with your business</p>
            </div>
          </Grid.Column>
        </Grid.Row> */}
        <Grid.Row>
          <Grid.Column>
            <Button circular color="green" onClick={() => props.setAuthWizardStep('InvestmentChooseType')} content="Start" />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Modal.Content>
    <Modal.Actions>
      <p>Already have an account? <Link to="login">Log in</Link></p>
    </Modal.Actions>
  </Modal>
);

export default investmentChooseType;
