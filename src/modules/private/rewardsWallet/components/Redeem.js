import React from 'react';
import { Modal, Button, Header, Grid, Card, Statistic } from 'semantic-ui-react';

const Redeem = props => (
  <Modal
    dimmer
    open
    size="mini"
    closeIcon
    onClose={props.history.goBack}
    className="reward-modal"
  >
    <Modal.Header className="center-align">
      <Header as="h1">Cooking Classes</Header>
    </Modal.Header>
    <Modal.Content className="reward-deatils">
      <Grid divided padded="horizontally" columns={2}>
        <Grid.Column>
          <Card.Content>
            <Statistic size="mini">
              <Statistic.Label>Offering name</Statistic.Label>
              <Statistic.Value>California 88</Statistic.Value>
            </Statistic>
          </Card.Content>
        </Grid.Column>
        <Grid.Column>
          <Card.Content>
            <Statistic size="mini">
              <Statistic.Label>Issuer Name</Statistic.Label>
              <Statistic.Value>Isabel Ives</Statistic.Value>
            </Statistic>
          </Card.Content>
        </Grid.Column>
      </Grid>
    </Modal.Content>
    <Modal.Content className="center-align">
      <div className="reward-description">
        <Header as="h5">Description Header</Header>
        <p>
          The prime wagyu briskets from Akaushi Beef will go into the pit between midnight and 2am
          in preparation for lunch and dinner service that day.
        </p>
      </div>
      <p className="note">
        Please present this digital voucher (on your phone or printed up) to California 88 to
        finish the redemption process
      </p>
      <Button primary size="large" onClose={props.history.goBack} className="very relaxed">Redeem Reward</Button>
      <p className="note"><b>Serial #  326 5646 126</b></p>
    </Modal.Content>
  </Modal>
);

export default Redeem;
