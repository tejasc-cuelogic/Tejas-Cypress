import moment from 'moment';
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter, Link } from 'react-router-dom';
import { get, capitalize, has, lowerCase } from 'lodash';
import { Card, Table, Button, Icon } from 'semantic-ui-react';
import { InlineLoader, NsPagination } from '../../../../../theme/shared';
import { STATUS_MAPPING, STATUS_META } from '../../../../../services/constants/admin/transactions';
import { NoR } from '../../../../../theme/table/NSTable';
import Helper from '../../../../../helper/utility';
import { DataFormatter } from '../../../../../helper';

@inject('transactionsStore', 'crowdpayStore')
@withRouter
@observer
export default class AllTransactions extends Component {
  state = {
    GsAccountNum: {},
  }

  componentWillMount() {
    const { statusType } = this.props.match.params;
    const transStatus = STATUS_MAPPING[statusType].status;
    if (this.props.match.isExact && this.props.transactionsStore.pageReload) {
      this.props.transactionsStore.resetData();
      this.props.transactionsStore.initRequest(transStatus, statusType); // load data
    }
    this.props.transactionsStore.pageReload = true;
  }

  getGsAccountNumber = (e, accountId, userId) => {
    e.stopPropagation();
    const oldObj = this.state.GsAccountNum;
    oldObj[accountId] = {};
    oldObj[accountId].loading = true;
    this.setState({ GsAccountNum: oldObj });
    this.props.crowdpayStore.getDecryptedRoutingNum(accountId, userId).then((res) => {
      oldObj[accountId].decGsAccNumber = res;
      oldObj[accountId].loading = false;
      this.setState({ GsAccountNum: oldObj });
    }).catch(() => { oldObj[accountId].loading = false; });
  }

  getUserName = (info, userId) => (
    <span className="user-name">
      {userId !== undefined
        ? (
        <Link to={`/app/users/${userId}/profile-data`}>
          {`${info ? info.firstName : ''} ${info ? info.lastName : ''}`}
        </Link>
        ) : ''}
    </span>
  )

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
    const transStatus = STATUS_MAPPING[statusType].status;
    const columns = STATUS_META.filter(trans => trans.refStatus.includes(transStatus[0]));
    return (
      <>
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
                  { (has(STATUS_MAPPING[statusType], 'syncCta') || has(STATUS_MAPPING[statusType], 'affirmativeCta') || has(STATUS_MAPPING[statusType], 'failedCta'))
                    && (
                    <Table.HeaderCell key="actions">
                      &nbsp;
                    </Table.HeaderCell>
                    )
                  }
                </Table.Row>
              </Table.Header>
              <Table.Body>
                { allRecords.length === 0 ? (
                  <NoR cols={columns.length} msg="No record to display" />
                )
                  : allRecords.map(row => (
                    <Table.Row key={row.id}>
                      {
                        columns.map(col => (
                          <Table.Cell key={col.field} textAlign={col.textAlign} collapsing={col.field === 'userName'}>
                            {['amount'].includes(col.field) ? Helper.CurrencyFormat(row[col.field])
                              : ['startDate', 'failDate', 'estDateAvailable'].includes(col.field)
                                ? row[col.field] !== null ? DataFormatter.getDateInLocalTimeZone(moment.unix(row[col.field]), false, false, false, false) : '' : col.field === 'userName'
                                  ? this.getUserName(get(row, col.fieldLocation) || {}, get(row, col.fieldId)) : col.field === 'userId' ? get(row, col.fieldLocation)
                                    : col.field === 'amount' ? Helper.MoneyMathDisplayCurrency(row[col.field])
                                      : col.field === 'direction' ? capitalize(row[col.field]) : col.field === 'accountType'
                                        ? (
                                          <>
                                            {get(row, 'investorAccountInfo.accountType')
                                              ? <Icon size="large" className={`ns-${lowerCase(get(row, 'investorAccountInfo.accountType'))}-line`} color="green" /> : 'N/A'
                                            }
                                          </>
                                        )
                                        : col.field === 'cpAccountId'
                                          && get(row, 'accountId')
                                          ? (this.state.GsAccountNum[get(row, 'accountId')] && this.state.GsAccountNum[get(row, 'accountId')].decGsAccNumber
                                            ? this.state.GsAccountNum[get(row, 'accountId')].decGsAccNumber
                                            : this.state.GsAccountNum[get(row, 'accountId')] && this.state.GsAccountNum[get(row, 'accountId')].loading
                                              ? <p>Loading...</p>
                                              : (
                                                <Button color="blue" onClick={e => this.getGsAccountNumber(e, get(row, 'accountId'), get(row, 'userInfo.id'))} className="link-button">
                                                  Click to Show
                                                </Button>
                                              )
                                          )
                                          : get(row, col.field) === undefined ? 'N/A' : row[col.field]
                            }
                          </Table.Cell>
                        ))
                      }
                      <Table.Cell width={row.failDesc ? '2' : ''}>
                        {row.failDesc
                          ? (
                          <Button disabled>
                            Pending Bank Change
                          </Button>
                          )
                          : (
                          <Button.Group vertical compact size="mini">
                            {(has(STATUS_MAPPING[statusType], 'syncCta') && row.gsProcessId && !row.gsTransactionId)
                              ? (
                              <Button loading={btnLoader.includes(row.requestId)} color="blue" onClick={() => transactionChange(row.requestId, transStatus, STATUS_MAPPING[statusType].syncCta.action, row.direction)}>
                                {STATUS_MAPPING[statusType].syncCta.title}
                              </Button>
                              )
                              : has(STATUS_MAPPING[statusType], 'affirmativeCta')
                              && (
                              <Button loading={btnLoader.includes(row.requestId)} color={`${statusType === 'pending' && ['FROZEN'].includes(get(row, 'investorAccountInfo.accountStatus')) ? 'gray' : 'blue'}`} disabled={(statusType === 'pending' && ['FROZEN'].includes(get(row, 'investorAccountInfo.accountStatus'))) || row.failDesc || DataFormatter.getCurrentCSTMoment().isBefore(moment(row.estDateAvailable * 1000))} onClick={() => transactionChange(row.requestId, transStatus, STATUS_MAPPING[statusType].affirmativeCta.action, row.direction)}>
                                {STATUS_MAPPING[statusType].affirmativeCta.title}
                              </Button>
                              )
                            }
                            { has(STATUS_MAPPING[statusType], 'failedCta')
                              && (
                              <Button as={Link} to={`${match.url}/${row.requestId}`} inverted color="red">
                                {STATUS_MAPPING[statusType].failedCta.title}
                              </Button>
                              )
                            }
                          </Button.Group>
                          )
                        }
                      </Table.Cell>
                    </Table.Row>
                  ))
                }
              </Table.Body>
            </Table>
          </div>
          {totalRecords > 0
            && <NsPagination floated="right" initRequest={this.paginate} meta={{ totalRecords, requestState }} />
          }
        </Card>
      </>
    );
  }
}
