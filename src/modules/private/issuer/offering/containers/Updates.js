import React, { Component } from 'react';
import Aux from 'react-aux';
import { Route, Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { kebabCase } from 'lodash';
import { Card, Table, Button, Grid, Form } from 'semantic-ui-react';
import NewUpdate from '../components/NewUpdate';
import { InlineLoader, DateTimeFormat } from './../../../../../theme/shared';
import { ByKeyword } from './../../../../../theme/form/Filters';

@inject('updateStore')
@observer
export default class AllRepayments extends Component {
  componentWillMount() {
    this.props.updateStore.initRequest();
  }
  executeSearch = (e) => {
    if (e.charCode === 13) {
      this.props.updateStore.setInitiateSrch('keyword', e.target.value);
    }
  }
  render() {
    const { updateStore, match } = this.props;
    const {
      updates, loading, requestState, filters,
    } = updateStore;

    if (loading) {
      return <InlineLoader />;
    }
    return (
      <Aux>
        <Form>
          <Grid stackable>
            <Grid.Row>
              <ByKeyword
                executeSearch={this.executeSearch}
                w={[11]}
                placeholder="Search by keyword or phrase"
                requestState={requestState}
                filters={filters}
                more="no"
                addon={
                  <Grid.Column width={5} textAlign="right">
                    <Button color="green" as={Link} floated="right" to={`${match.url}/new`}>
                      Add new Update
                    </Button>
                  </Grid.Column>
                }
              />
            </Grid.Row>
          </Grid>
        </Form>
        <Card fluid>
          <div className="table-wrapper">
            <Table unstackable singleLine>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Title</Table.HeaderCell>
                  <Table.HeaderCell>Recipients</Table.HeaderCell>
                  <Table.HeaderCell>Last status change</Table.HeaderCell>
                  <Table.HeaderCell>Status</Table.HeaderCell>
                  <Table.HeaderCell>Last update</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {updates.length === 0 ? (
                  <Table.Row>
                    <Table.Cell textAlign="center" colSpan={5}>No update to display !</Table.Cell>
                  </Table.Row>
                  ) :
                  updates.map(record => (
                    <Table.Row key={record.id}>
                      <Table.Cell>{record.title}</Table.Cell>
                      <Table.Cell>Public</Table.Cell>
                      <Table.Cell><DateTimeFormat datetime={record.updatedAt} /></Table.Cell>
                      <Table.Cell className={`status ${kebabCase(record.status)}`}>{record.status}</Table.Cell>
                      <Table.Cell>{record.indexRS}</Table.Cell>
                    </Table.Row>
                  ))
                }
              </Table.Body>
            </Table>
          </div>
        </Card>
        <Route path={`${match.url}/new`} component={NewUpdate} />
      </Aux>
    );
  }
}
