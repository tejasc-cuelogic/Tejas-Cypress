import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter, Link } from 'react-router-dom';
import Aux from 'react-aux';
import { get, capitalize, has } from 'lodash';
import { Card, Table, Button } from 'semantic-ui-react';
import { InlineLoader, DateTimeFormat, NsPagination } from '../../../../../theme/shared';
import { STATUS_MAPPING, STATUS_META } from '../../../../../services/constants/admin/transactions';
import { NoR } from '../../../../../theme/table/NSTable';
import Helper from '../../../../../helper/utility';

@inject('transactionsStore')
@withRouter
@observer
export default class AllTransactions extends Component {
  componentWillMount() {
    const { statusType } = this.props.match.params;
    const transStatus = STATUS_MAPPING[statusType].status;
    this.props.transactionsStore.resetData();
    this.props.transactionsStore.initRequest(transStatus, statusType); // load data
  }

  getUserName = (info, userId) => (
    <span className="user-name">
      {userId !== undefined ?
        <Link to={`/app/users/${userId}/profile-data`}>
          {`${info ? info.firstName : ''} ${info ? info.lastName : ''}`}
        </Link> : ''}
    </span>)

  paginate = params => this.props.transactionsStore.pageRequest(params);

  render() {
    const { transactionsStore, match } = this.props;
    const { statusType } = this.props.match.params;
    const {
      allRecords, loading,
      transactionCount, requestState,
      transactionChange, isNonTerminatedState,
    } = transactionsStore;
    if (loading) {
      return <InlineLoader />;
    }
    const totalRecords = transactionCount;
    const transStatus = STATUS_MAPPING[statusType].status;
    const columns = STATUS_META.filter(trans =>
      trans.refStatus.includes(transStatus[0]));
    return (
      <Aux>
        <Card fluid>
          <div className="table-wrapper">
            <Table unstackable striped sortable className="user-list">
              <Table.Header>
                <Table.Row>
                  {
                    columns.map(col => (
                      <Table.HeaderCell key={col.field} textAlign={col.textAlign}>
                        {col.title}
                      </Table.HeaderCell>
                    ))
                  }
                  {isNonTerminatedState &&
                    <Table.HeaderCell key="actions">
                      &nbsp;
                    </Table.HeaderCell>
                  }
                </Table.Row>
              </Table.Header>
              <Table.Body>
                { allRecords.length === 0 ? (
                  <NoR cols={columns.length} msg="No record to display" />
                ) :
                  allRecords.map(row => (
                    <Table.Row key={row.id}>
                      {
                        columns.map(col => (
                          <Table.Cell key={col.field} textAlign={col.textAlign} collapsing={col.field === 'userName'}>
                            {
                              ['startDate', 'failDate', 'estDateAvailable'].includes(col.field) ?
                                row[col.field] !== null ? <DateTimeFormat unix format="MM/DD/YYYY" datetime={row[col.field] || ''} /> : '' : col.field === 'userName' ?
                                this.getUserName(get(row, col.fieldLocation) || {}, get(row, col.fieldId)) : col.field === 'userId' ? get(row, col.fieldLocation) :
                                col.field === 'amount' ? Helper.MoneyMathDisplayCurrency(row[col.field]) :
                                col.field === 'direction' ? capitalize(row[col.field]) :
                                get(row, col.field) === undefined ? 'N/A' : row[col.field]
                            }
                          </Table.Cell>
                        ))
                      }
                      {has(STATUS_MAPPING[statusType], ['affirmativeCta', 'failedCta']) &&
                        <Table.Cell>
                          <Button.Group vertical compact size="mini">
                            <Button color="blue" onClick={() => transactionChange(row.requestId, transStatus, STATUS_MAPPING[statusType].affirmativeCta.action)}>
                              {STATUS_MAPPING[statusType].affirmativeCta.title}
                            </Button>
                            <Button as={Link} to={`${match.url}/${row.requestId}`} inverted color="red">
                              {STATUS_MAPPING[statusType].failedCta.title}
                            </Button>
                          </Button.Group>
                        </Table.Cell>
                      }
                    </Table.Row>
                  ))
                }
              </Table.Body>
            </Table>
          </div>
          {totalRecords > 0 &&
            <NsPagination floated="right" initRequest={this.paginate} meta={{ totalRecords, requestState }} />
          }
        </Card>
      </Aux>
    );
  }
}
