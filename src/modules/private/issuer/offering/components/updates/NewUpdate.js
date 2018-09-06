import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Modal, Header, Divider, Grid, Card, Form, List, Icon } from 'semantic-ui-react';
import { FormInput } from '../../../../../../theme/form';
import HtmlEditor from '../../../../../shared/HtmlEditor';
import Actions from './Actions';
import Status from './Status';

@inject('updateStore')
@observer
export default class NewUpdate extends Component {
  componentWillMount() {
    this.initiateFlow(this.props.match);
  }
  componentWillReceiveProps(nextProps) {
    this.initiateFlow(nextProps.match);
  }
  initiateFlow = (match) => {
    if (match.params.id !== 'new') {
      this.props.updateStore.getOne(match.params.id);
    } else {
      this.props.updateStore.reset();
    }
  }
  handleCloseModal = (e) => {
    e.stopPropagation();
    this.props.history.replace(this.props.refLink);
  };

  save = status => this.props.updateStore.save(this.props.match.params.id, status);

  render() {
    const { PBUILDER_FRM, UpdateChange } = this.props.updateStore;
    const isNew = this.props.match.params.id === 'new';
    return (
      <Modal closeIcon size="large" dimmer="inverted" open onClose={this.handleCloseModal} centered={false}>
        <Modal.Content className="transaction-detials">
          <Header as="h3">
            {isNew ? 'New' : 'Edit'} update
            <Status status={PBUILDER_FRM.fields.status.value} />
            <Actions save={this.save} meta={PBUILDER_FRM.meta} />
          </Header>
          <Divider hidden />
          <Grid>
            <Grid.Row>
              <Grid.Column width={12}>
                <Form onSubmit={this.save}>
                  <FormInput
                    ishidelabel
                    fluid
                    type="text"
                    name="title"
                    fielddata={PBUILDER_FRM.fields.title}
                    changed={UpdateChange}
                  />
                  <HtmlEditor />
                  {/* <Card fluid>
                    <Card.Content>
                    </Card.Content>
                  </Card> */}
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
