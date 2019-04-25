import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter, Link } from 'react-router-dom';
import Aux from 'react-aux';
import { get, capitalize, has, lowerCase } from 'lodash';
import { Card, Table, Button, Icon } from 'semantic-ui-react';
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
    if (this.props.match.isExact && this.props.transactionsStore.pageReload) {
      this.props.transactionsStore.resetData();
      this.props.transactionsStore.initRequest(transStatus, statusType); // load data
    }
    this.props.transactionsStore.pageReload = true;
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
      allRecords, loading, btnLoader,
      transactionCount, requestState,
      transactionChange,
    } = transactionsStore;
    if (loading) {
      return <InlineLoader />;
    }
    const totalRecords = transactionCount;
    const now = new Date();
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
                  { (has(STATUS_MAPPING[statusType], 'syncCta') || has(STATUS_MAPPING[statusType], 'affirmativeCta') || has(STATUS_MAPPING[statusType], 'failedCta')) &&
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
                            {['amount'].includes(col.field) ? Helper.CurrencyFormat(row[col.field]) :
                              ['startDate', 'failDate', 'estDateAvailable'].includes(col.field) ?
                                row[col.field] !== null ? <DateTimeFormat unix format="MM/DD/YYYY" datetime={row[col.field] || ''} /> : '' : col.field === 'userName' ?
                                this.getUserName(get(row, col.fieldLocation) || {}, get(row, col.fieldId)) : col.field === 'userId' ? get(row, col.fieldLocation) :
                                col.field === 'amount' ? Helper.MoneyMathDisplayCurrency(row[col.field]) :
                                col.field === 'direction' ? capitalize(row[col.field]) : col.field === 'accountType' ?
                                  <Aux>
                                    {get(row, 'investorAccountInfo.accountType') ?
                                      <Icon size="large" className={`ns-${lowerCase(get(row, 'investorAccountInfo.accountType'))}-line`} color="green" /> : 'N/A'
                                    }
                                  </Aux> :
                                get(row, col.field) === undefined ? 'N/A' : row[col.field]
                            }
                          </Table.Cell>
                        ))
                      }
                      <Table.Cell width={row.failDesc ? '2' : ''}>
                        {row.failDesc ?
                          <Button disabled>
                            Pending Bank Change
                          </Button> :
                          <Button.Group vertical compact size="mini">
                            {(has(STATUS_MAPPING[statusType], 'syncCta') && row.gsProcessId && !row.gsTransactionId) ?
                              <Button loading={btnLoader.includes(row.requestId)} color="blue" onClick={() => transactionChange(row.requestId, transStatus, STATUS_MAPPING[statusType].syncCta.action, row.direction)}>
                                {STATUS_MAPPING[statusType].syncCta.title}
                              </Button> :
                              has(STATUS_MAPPING[statusType], 'affirmativeCta') &&
                              <Button loading={btnLoader.includes(row.requestId)} color="blue" disabled={row.failDesc || now < new Date(row.estDateAvailable * 1000)} onClick={() => transactionChange(row.requestId, transStatus, STATUS_MAPPING[statusType].affirmativeCta.action, row.direction)}>
                                {STATUS_MAPPING[statusType].affirmativeCta.title}
                              </Button>
                            }
                            { has(STATUS_MAPPING[statusType], 'failedCta') &&
                              <Button as={Link} to={`${match.url}/${row.requestId}`} inverted color="red">
                                {STATUS_MAPPING[statusType].failedCta.title}
                              </Button>
                            }
                          </Button.Group>
                        }
                      </Table.Cell>
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
