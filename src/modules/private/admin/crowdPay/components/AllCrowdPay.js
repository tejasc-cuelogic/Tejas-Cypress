import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import * as moment from 'moment';
import { lowerCase, get } from 'lodash';
import { withRouter, Route, Link } from 'react-router-dom';
import { Card, Table, Icon, Button, List } from 'semantic-ui-react';
import ConfirmModel from './ConfirmModel';
import Helper from '../../../../../helper/utility';
import { InlineLoader, NsPagination, MessageModal } from '../../../../../theme/shared';
import { NEXTSEED_BOX_URL } from '../../../../../constants/common';
import Actions from './Actions';
import { DataFormatter } from '../../../../../helper';

const statusDetails = {
  PARTIAL: 'Partial',
  FULL: 'Full',
  HARD_FREEZE: 'Frozen',
  SOFT_FREEZE: 'Frozen',
  CIP_PROCESSING: 'CIP Processing',
  NS_PROCESSING: 'Processing',
  GS_PROCESSING: 'Processing',
  DECLINED: 'Declined',
  DELETED: 'Deleted',
  ACCOUNT_PROCESSING: 'Account Processing',
};

@inject('crowdpayStore')
@withRouter
@observer
export default class AllCrowdPay extends Component {
  state = {
    GsAccountNum: {},
  }

  constructor(props) {
    super(props);
    const { type } = this.props.match.params;
    const { accounts } = this.props.crowdpayStore;
    if ((this.props.match.isExact && type && this.props.crowdpayStore.isApiHit !== type)
       || accounts.length === 0) {
      this.props.crowdpayStore.setData('isApiHit', type);
      this.props.crowdpayStore.reset();
      this.props.crowdpayStore.initRequest(type, true, false);
    }
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

  paginate = params => this.props.crowdpayStore.pageRequest(params);

  render() {
    const { crowdpayStore, match } = this.props;
    const {
      accounts, count, requestState, crowdPayCtaHandler, loadingCrowdPayIds, loading,
      isLazyLoading,
    } = crowdpayStore;
    const { type } = match.params;
    if (loading && requestState.page === 1) {
      return <InlineLoader />;
    }
    const totalRecords = count || 0;
    return (
      <Card fluid>
        <div className="table-wrapper">
          <Table unstackable className="application-list">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Name</Table.HeaderCell>
                {type === 'review'
                  && (
                    <>
                      <Table.HeaderCell>Account Type</Table.HeaderCell>
                      <Table.HeaderCell>Brokerage / Public Company</Table.HeaderCell>
                    </>
                  )
                }
                <Table.HeaderCell>Creation date</Table.HeaderCell>
                {type !== 'review'
                  && <Table.HeaderCell>Status</Table.HeaderCell>
                }
                {(type !== 'review' && type === 'individual')
                  && <Table.HeaderCell>Fail Reason</Table.HeaderCell>
                }
                {type === 'individual'
                  && <Table.HeaderCell>GS Processing Date</Table.HeaderCell>
                }
                {type !== 'entity'
                  && <Table.HeaderCell>{type === 'individual' ? 'CIP Uploads' : 'Documents'}</Table.HeaderCell>
                }
                {type !== 'review'
                  && <Table.HeaderCell>GS Account #</Table.HeaderCell>
                }
                <Table.HeaderCell textAlign="center" />
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {
                accounts.length === 0 ? (
                  <Table.Row>
                    <Table.Cell textAlign="center" colSpan={5}>No accounts to display !</Table.Cell>
                  </Table.Row>
                )
                  : accounts.map(account => (
                    <Table.Row key={account.accountId} className={loadingCrowdPayIds.includes(account.accountId) ? 'disabled' : ''}>
                      <Table.Cell>
                        <p>
                          <Link onClick={() => sessionStorage.setItem('userDetailsRefUrl', match.url)} to={`/dashboard/users/${account.userId}/profile-data`}>
                            <b>{account.firstName} {account.lastName}</b>
                          </Link>
                          <br />{account.email}<br />{account.phone ? Helper.phoneNumberFormatter(account.phone) : ''}
                        </p>
                      </Table.Cell>
                      {type === 'review'
                        && (
                          <>
                            <Table.Cell>
                              <Icon className={`ns-${lowerCase(account.accountType)}-line`} color="green" size="large" />
                            </Table.Cell>
                            <Table.Cell>
                              {`Firm: ${get(account, 'investorProfileData.brokerageFirmName') ? get(account, 'investorProfileData.brokerageFirmName') : 'N/A'}`}
                              <br />
                              {`Ticker: ${get(account, 'investorProfileData.publicCompanyTicker') ? get(account, 'investorProfileData.publicCompanyTicker') : 'N/A'}`}
                            </Table.Cell>
                          </>
                        )
                      }
                      <Table.Cell>
                        {account.created && account.created.date
                          ? DataFormatter.getDateAsPerTimeZone(moment.unix(account.created.date), false, false, false)
                          : <p className="intro-text">N/A</p>
                        }
                      </Table.Cell>
                      {type !== 'review'
                        // <Table.Cell className={`status ${kebabCase(account.accountStatus)}`}>
                        && (
                          <Table.Cell className="status">
                            {/* <Icon className="ns-warning-circle" /> */}
                            {statusDetails[account.accountStatus]}
                          </Table.Cell>
                        )
                      }
                      {(type !== 'review' && type === 'individual')
                        && (
                          <Table.Cell>
                            {get(account, 'cip.failReason')
                              ? <List as="ol">{(account.cip.failReason).map(obj => <List.Item as="li" value="-">{obj.message}</List.Item>)}</List>
                              : <p>-</p>
                            }
                          </Table.Cell>
                        )
                      }
                      {type === 'individual'
                        && (
                          <Table.Cell>
                            {account.processing && account.processing.gs && account.processing.gs.date ? DataFormatter.getDateAsPerTimeZone(moment.unix(account.processing.gs.date), false, false, false) : <p className="intro-text">N/A</p>}
                          </Table.Cell>
                        )
                      }
                      {type === 'ira'
                        ? (
                          <Table.Cell>
                            {get(account, 'storageDetails.Accounts.IRA.Creation.id') ? (
                              <a href={`${NEXTSEED_BOX_URL}folder/${get(account, 'storageDetails.Accounts.IRA.Creation.id')}`} className="link" rel="noopener noreferrer" target="_blank">
                                View Documents
                              </a>
                            ) : <p className="intro-text">N/A</p>
                            }
                          </Table.Cell>
                        )
                        : type !== 'entity'
                          ? (
                            <Table.Cell>
                              {type === 'review'
                                ? get(account, 'storageDetails.rootFolder.id')
                                  ? (
                                    <>
                                      <a href={`${NEXTSEED_BOX_URL}folder/${get(account, 'storageDetails.rootFolder.id')}`} className="link filename-link" rel="noopener noreferrer" target="_blank">
                                        View Documents
                                    </a>
                                    </>
                                  )
                                  : <p className="intro-text">N/A</p>
                                : get(account, 'storageDetails.Profile.CIP.id')
                                  ? (
                                    <>
                                      <a href={`${NEXTSEED_BOX_URL}folder/${get(account, 'storageDetails.Profile.CIP.id')}`} className="link filename-link" rel="noopener noreferrer" target="_blank">
                                        View Documents
                                    </a>
                                    </>
                                  )
                                  : <p className="intro-text">N/A</p>

                              }
                            </Table.Cell>
                          ) : null
                      }
                      {(type !== 'review')
                        && (
                          <Table.Cell>
                            {get(account, 'processing.gs.id')
                              ? (this.state.GsAccountNum[get(account, 'accountId')] && this.state.GsAccountNum[get(account, 'accountId')].decGsAccNumber
                                ? this.state.GsAccountNum[get(account, 'accountId')].decGsAccNumber
                                : this.state.GsAccountNum[get(account, 'accountId')] && this.state.GsAccountNum[get(account, 'accountId')].loading
                                  ? <p>Loading...</p>
                                  : (
                                    <Button color="blue" onClick={e => this.getGsAccountNumber(e, get(account, 'accountId'), get(account, 'userId'))} className="link-button">
                                      Click for GS Account #
                        </Button>
                                  )
                              ) : 'N/A'
                            }
                          </Table.Cell>
                        )
                      }
                      <Actions
                        crowdPayCtaHandler={crowdPayCtaHandler}
                        refLink={match.url}
                        type={type}
                        account={account}
                      />
                    </Table.Row>
                  ))
              }
            </Table.Body>
          </Table>
        </div>
        <Route exact path={`${match.url}/:action`} render={props => <MessageModal refLink={match.url} {...props} />} />
        <Route path={`${match.url}/:userId/:accountId/:action`} render={props => <ConfirmModel refLink={match.url} {...props} />} />
        {totalRecords > 0
          && <NsPagination floated="right" isLazyloading={isLazyLoading} initRequest={this.paginate} meta={{ totalRecords, requestState }} />
        }
      </Card>
    );
  }
}
