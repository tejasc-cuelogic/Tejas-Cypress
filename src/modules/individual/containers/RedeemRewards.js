import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Modal, Button, Header, Grid, Card, Statistic, Form, List } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
// import { FormInput } from '../../../theme/form/FormElements';

@inject('uiStore')
@observer
class RedeemRewards extends Component {
  state = { open: false }

  open = () => this.setState({ open: true })
  close = () => this.setState({ open: false })

  render() {
    const { open } = this.state;

    return (
      <Modal
        dimmer
        open={open}
        onOpen={this.open}
        onClose={this.close}
        size="mini"
        closeIcon
        className="reward-modal"
        trigger={<Button color="green">Redeem Reward</Button>}
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
          {/* eslint-disable jsx-a11y/label-has-for */}
          {/* <label>We sent a verification PIN to your email:</label> */}
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
            <Button primary size="large" className="very relaxed">Redeem Reward</Button>
          </Form>
        </Modal.Content>
      </Modal>
    );
  }
}
export default RedeemRewards;
