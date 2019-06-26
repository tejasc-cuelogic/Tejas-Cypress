import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { kebabCase } from 'lodash';
import { Card, Table, Button, Grid, Form } from 'semantic-ui-react';
import Helper from '../../../../../helper/utility';
import { InlineLoader, DateTimeFormat } from '../../../../../theme/shared';
import { ByKeyword } from '../../../../../theme/form/Filters';

@inject('repaymentStore')
@observer
export default class AllRepayments extends Component {
  componentWillMount() {
    this.props.repaymentStore.initRequest();
  }

  setSearchParam = (e, { name, value }) => this.props.repaymentStore.setInitiateSrch(name, value);

  toggleSearch = () => this.props.repaymentStore.toggleSearch();

  executeSearch = (e) => {
    if (e.charCode === 13) {
      this.props.repaymentStore.setInitiateSrch('keyword', e.target.value);
    }
  }

  render() {
    const { repaymentStore } = this.props;
    const {
      repayments, loading, requestState, filters,
    } = repaymentStore;

    if (loading) {
      return <InlineLoader />;
    }
    return (
      <>
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
                addon={(
<Grid.Column width={5} textAlign="right">
                    <Button color="green" as={Link} floated="right" to="/app/repayments/new">
                      Add New Repayment
                    </Button>
                  </Grid.Column>
)}
              />
            </Grid.Row>
          </Grid>
        </Form>
        <Card fluid>
          <div className="table-wrapper">
            <Table unstackable singleLine>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Date</Table.HeaderCell>
                  <Table.HeaderCell>Status</Table.HeaderCell>
                  <Table.HeaderCell>Processed Date</Table.HeaderCell>
                  <Table.HeaderCell># of TL</Table.HeaderCell>
                  <Table.HeaderCell># of RS</Table.HeaderCell>
                  <Table.HeaderCell>Amount Repaid</Table.HeaderCell>
                  <Table.HeaderCell>Investors Repaid</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {
                  repayments.map(record => (
                    <Table.Row key={record.id}>
                      <Table.Cell><DateTimeFormat datetime={record.createdAt} /></Table.Cell>
                      <Table.Cell className={`status ${kebabCase(record.status)}`}>{record.status}</Table.Cell>
                      <Table.Cell><DateTimeFormat datetime={record.createdAt} /></Table.Cell>
                      <Table.Cell>{record.indexTL}</Table.Cell>
                      <Table.Cell>{record.indexRS}</Table.Cell>
                      <Table.Cell>{Helper.CurrencyFormat(record.amountRepaid)}</Table.Cell>
                      <Table.Cell>{Helper.CurrencyFormat(record.investorsRepaid)}</Table.Cell>
                    </Table.Row>
                  ))
                }
              </Table.Body>
            </Table>
          </div>
        </Card>
      </>
    );
  }
}
