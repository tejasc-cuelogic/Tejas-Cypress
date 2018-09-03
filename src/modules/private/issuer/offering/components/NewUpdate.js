import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Modal, Header, Divider, Label, Button, Grid, Card, Form, List, Icon } from 'semantic-ui-react';
import { FormInput } from '../../../../../theme/form';

export default class NewUpdate extends Component {
  handleCloseModal = (e) => {
    e.stopPropagation();
    this.props.history.replace(this.props.refLink);
  };

  render() {
    return (
      <Modal closeIcon size="large" dimmer="inverted" open onClose={this.handleCloseModal} centered={false}>
        <Modal.Content className="transaction-detials">
          <Header as="h3">
            Edit update
            <span className="title-meta">
              <Label circular empty size="mini" color="red" /> Draft
            </span>
            <Button.Group compact floated="right">
              <Button inverted color="green" content="Save as draft" />
              <Button primary content="Submit for Approval" />
            </Button.Group>
          </Header>
          <Divider hidden />
          <Grid>
            <Grid.Row>
              <Grid.Column width={12}>
                <Form>
                  <FormInput
                    ishidelabel
                    fluid
                    type="text"
                    name="title"
                    fielddata={{ label: '', value: 'Design update', placeHolder: 'Update title' }}
                  />
                  <Card fluid>
                    <Card.Content>
                      <h4>Text editor will be here</h4>
                    </Card.Content>
                  </Card>
                </Form>
              </Grid.Column>
              <Grid.Column width={4}>
                <Card fluid>
                  <Card.Content>
                    <List relaxed>
                      <List.Item>
                        <Link to="/"><Icon className="ns-view" />See the update</Link>
                      </List.Item>
                      <List.Item>
                        <Link to="/"><Icon className="ns-envelope" />Send test email to me</Link>
                      </List.Item>
                    </List>
                  </Card.Content>
                </Card>
                <Card fluid>
                  <Card.Content>
                    <h4>Chat box will be here</h4>
                  </Card.Content>
                </Card>
                <Card fluid>
                  <Card.Content>
                    <h4>NextSeed Tips</h4>
                  </Card.Content>
                </Card>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Modal.Content>
      </Modal>
    );
  }
}
