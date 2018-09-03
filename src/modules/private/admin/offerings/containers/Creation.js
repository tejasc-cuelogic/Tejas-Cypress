import React, { Component } from 'react';
import Aux from 'react-aux';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import moment from 'moment';
import { Card, Table, Grid, Form, Button } from 'semantic-ui-react';
import { InlineLoader } from './../../../../../theme/shared';
import { ByKeyword } from './../../../../../theme/form/Filters';

@inject('offeringsStore')
@observer
export default class Creation extends Component {
  componentWillMount() {
    this.props.offeringsStore.initRequest();
  }

  executeSearch = (e) => {
    if (e.charCode === 13) {
      this.props.offeringsStore.setInitiateSrch('keyword', e.target.value);
    }
  }

  toggleSearch = () => this.props.offeringsStore.toggleSearch();

  render() {
    const { offeringsStore } = this.props;
    const {
      offerings,
      loading,
      requestState,
      filters,
    } = offeringsStore;
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
                toggleSearch={this.toggleSearch}
                requestState={requestState}
                filters={filters}
                more="no"
                addon={
                  <Grid.Column width={5} textAlign="right">
                    <Button color="green" as={Link} floated="right" to={this.props.match.url}>
                      Export
                    </Button>
                  </Grid.Column>
                }
              />
            </Grid.Row>
          </Grid>
        </Form>
        <Card fluid>
          <div className="table-wrapper">
            <Table unstackable className="application-list">
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Name</Table.HeaderCell>
                  <Table.HeaderCell>Status</Table.HeaderCell>
                  <Table.HeaderCell>Created Date</Table.HeaderCell>
                  <Table.HeaderCell>Days till launch</Table.HeaderCell>
                  <Table.HeaderCell>Lead</Table.HeaderCell>
                  <Table.HeaderCell>POC</Table.HeaderCell>
                  <Table.HeaderCell textAlign="center" />
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {
                  offerings.map(offering => (
                    <Table.Row key={offering.id}>
                      <Table.Cell>
                        <b>{offering.campaignName}</b>
                      </Table.Cell>
                      <Table.Cell>{offering.status}</Table.Cell>
                      <Table.Cell>{ moment(offering.createdAt).format('MM/DD/YYYY')}</Table.Cell>
                      <Table.Cell>{offering.launchedDate}</Table.Cell>
                      <Table.Cell>{offering.lead}</Table.Cell>
                      <Table.Cell>
                        <p>
                          <b>{offering.pocName}</b><br />
                          {offering.pocEmail}<br />
                          {offering.pocPhone}
                        </p>
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
