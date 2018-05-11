import React from 'react';
import { Link } from 'react-router-dom';
import { Modal, Button, Header, Grid, Card, Statistic, Form, List } from 'semantic-ui-react';

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
      <p>We sent a verification PIN to your email:</p>
      <Form.Input
        fluid
        size="huge"
        type="email"
        value="isabel.ives@gmail.com"
        readOnly
        className="display-only"
      />
      <List horizontal divided relaxed="very" className="link-list">
        <List.Item>
          <Link to="">Change email address</Link>
        </List.Item>
        <List.Item>
          <Link to="">Resend message</Link>
        </List.Item>
      </List>
      <Form error onSubmit={this.handleSubmitForm}>
        <Form.Input
          label="Enter PIN here:"
          size="huge"
          containerclassname="otp-field"
        />
        <Button primary size="large" onClose={props.history.goBack} className="very relaxed">Redeem Reward</Button>
      </Form>
    </Modal.Content>
  </Modal>
);

export default Redeem;
