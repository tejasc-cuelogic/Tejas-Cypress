import React, { Component } from 'react';
import Aux from 'react-aux';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Form, Grid, Input, Button, Pagination, Card, Table } from 'semantic-ui-react';
import { DropdownFilter } from '../../../../../theme/form/Filters';
import { FILTER_META } from '../../../../../constants/user';
// import { FormCheckbox } from '../../../../../theme/form';

@inject('helloWorldStore')
@observer
export default class AllApplications extends Component {
  componentWillMount() {
    this.props.helloWorldStore.initRequest(); // load data
  }
  render() {
    const { match, helloWorldStore } = this.props;
    const { allRecords } = helloWorldStore;
    return (
      <Aux>
        <Form>
          <Grid>
            <Grid.Row verticalAlign="bottom">
              <Grid.Column width={8}>
                <Input fluid icon={{ className: 'ns-search' }} iconPosition="left" placeholder="Search by keyword or phrase" />
              </Grid.Column>
              <Grid.Column width={3}>
                <DropdownFilter name="Status" keyName="accountStatus" options={FILTER_META.accountStatus} />
              </Grid.Column>
              <Grid.Column width={3} floated="right" textAlign="right">
                <Button primary className="relaxed" content="Export" />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column width={10}>
                <Form.Group inline>
                  <Form.Checkbox label="New (3)" />
                  <Form.Checkbox label="Offered (1)" />
                  <Form.Checkbox label="Review (1)" />
                  <Form.Checkbox label="Accepted (1)" />
                  <Form.Checkbox label="Deleted (1)" />
                </Form.Group>
              </Grid.Column>
              <Grid.Column width={6} textAlign="right">
                <Pagination defaultActivePage={1} totalPages={20} />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Form>
        <Card fluid>
          <div className="table-wrapper">
            <Table unstackable striped sortable className="user-list">
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Title</Table.HeaderCell>
                  <Table.HeaderCell>Created date</Table.HeaderCell>
                  <Table.HeaderCell textAlign="right">Action</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {
                  allRecords.map(record => (
                    <Table.Row key={record.id}>
                      <Table.Cell>{record.title}</Table.Cell>
                      <Table.Cell>{record.createdAt}</Table.Cell>
                      <Table.Cell textAlign="right">
                        <div className="actions">
                          <Link to={`${match.url}/${record.id}`} className="green">Details</Link>
                        </div>
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
