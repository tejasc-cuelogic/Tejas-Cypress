import React, { Component } from 'react';
import Aux from 'react-aux';
import { inject, observer } from 'mobx-react';
import { withRouter, Link } from 'react-router-dom';
import { get } from 'lodash';
import { Card, Table, Button, Grid, Form, Checkbox, Icon } from 'semantic-ui-react';
import { DropdownFilter } from '../../../../../theme/form/Filters';
import { InlineLoader } from './../../../../../theme/shared';
import { FAQ_TYPE_ENUM } from '../../../../../services/constants/admin/faqs';

@inject('faqStore', 'uiStore', 'articleStore')
@withRouter
@observer
export default class AllFaqs extends Component {
  componentWillMount() {
    this.props.faqStore.initRequest(); // load data
  }
  handleAction = (action, faqId) => {
    if (action === 'Delete') {
      this.props.uiStore.setConfirmBox(action, faqId);
    } else if (action === 'Edit') {
      this.props.history.push(`${this.props.match.url}/${faqId}`);
    }
  }
  render() {
    const { globalAction } = this.props;
    const { allFaqs, loading } = this.props.faqStore;
    const actions = {
      edit: { label: 'Edit', icon: 'pencil' },
      delete: { label: 'Delete', icon: 'trash' },
    };
    if (loading) {
      return <InlineLoader />;
    }
    return (
      <Aux>
        <Form>
          <Grid columns="equal" verticalAlign="bottom">
            <Grid.Row>
              <Grid.Column>Selected 15 items</Grid.Column>
              <Grid.Column width={3} floated="right">
                <DropdownFilter value={globalAction} change={this.globalActionChange} name="globalAction" keyName="globalAction" label="Global actions" />
              </Grid.Column>
              <Grid.Column width={2}>
                <Button inverted color="green" compact fluid content="Apply" />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Form>
        <Card fluid>
          <div className="table-wrapper">
            <Table unstackable striped sortable className="user-list">
              <Table.Header>
                <Table.Row>
                  <Table.Cell collapsing><Checkbox /></Table.Cell>
                  <Table.HeaderCell width={5}>Title</Table.HeaderCell>
                  <Table.HeaderCell>Type</Table.HeaderCell>
                  <Table.HeaderCell>Category</Table.HeaderCell>
                  <Table.HeaderCell>Author</Table.HeaderCell>
                  <Table.HeaderCell>Status</Table.HeaderCell>
                  <Table.HeaderCell>Last update date</Table.HeaderCell>
                  <Table.HeaderCell textAlign="center" />
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {
                  allFaqs.map(record => (
                    <Table.Row key={record.id}>
                      <Table.Cell><Checkbox /></Table.Cell>
                      <Table.Cell><Link to={`${this.props.match.url}/${record.id}`}>{record.question}</Link></Table.Cell>
                      <Table.Cell>{FAQ_TYPE_ENUM[record.faqType]}</Table.Cell>
                      <Table.Cell>{record.categoryName}</Table.Cell>
                      <Table.Cell>{`${get(record, 'author.info.firstName') && get(record, 'author.info.firstName')} ${get(record, 'author.info.lastName') && get(record, 'author.info.lastName')}` || 'Admin' }</Table.Cell>
                      <Table.Cell>{record.itemStatus}</Table.Cell>
                      <Table.Cell>{record.updated.date}</Table.Cell>
                      <Table.Cell textAlign="center">
                        <Button.Group>
                          {Object.keys(actions).map(action => (
                            <Button className="link-button" >
                              <Icon className={`ns-${actions[action].icon}`} onClick={() => this.handleAction(actions[action].label, record.id)} />
                            </Button>
                          ))}
                        </Button.Group>
                      </Table.Cell>
                    </Table.Row>
                  ))
                }
              </Table.Body>
            </Table>
          </div>
        </Card>
      </Aux>
    );
  }
}
