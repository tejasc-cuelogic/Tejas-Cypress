import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Aux from 'react-aux';
import moment from 'moment';
import { lowerCase, get } from 'lodash';
import { withRouter, Route, Link } from 'react-router-dom';
import { Card, Table, Icon } from 'semantic-ui-react';
import ConfirmModel from './ConfirmModel';
import Helper from '../../../../../helper/utility';
import { InlineLoader, NsPagination } from './../../../../../theme/shared';
import { NEXTSEED_BOX_URL } from '../../../../../constants/common';
import Actions from './Actions';
import MessageModal from '../components/MessageModal';

const statusDetails = {
  PARTIAL: 'Partial',
  FULL: 'Full',
  FROZEN: 'Frozen',
  CIP_PROCESSING: 'CIP Processing',
  NS_PROCESSING: 'Processing',
  GS_PROCESSING: 'Processing',
  DECLINED: 'Declined',
  DELETED: 'Deleted',
  ACCOUNT_PROCESSING: 'Account Processing',
};

@inject('crowdpayStore', 'uiStore')
@withRouter
@observer
export default class AllCrowdPay extends Component {
  componentWillMount() {
    const type = this.props.history.location.pathname === '/app/crowdpay' ? 'review' : this.props.history.location.pathname.includes('individual') ? 'individual' : this.props.history.location.pathname.includes('ira') ? 'ira' : this.props.history.location.pathname.includes('review') ? 'review' : 'entity';
    this.props.crowdpayStore.setAccountTypes(type);
    this.props.crowdpayStore.reset();
    this.props.uiStore.setProgress(false);
  }
  paginate = params => this.props.crowdpayStore.pageRequest(params);
  render() {
    const { crowdpayStore, uiStore } = this.props;
    const {
      accounts, count, requestState, crowdPayCtaHandler,
    } = crowdpayStore;
    const type = this.props.history.location.pathname === '/app/crowdpay' ? 'review' : this.props.history.location.pathname.includes('individual') ? 'individual' : this.props.history.location.pathname.includes('ira') ? 'ira' : this.props.history.location.pathname.includes('review') ? 'review' : 'entity';
    if (count === 0) {
      return <InlineLoader text="No data found." />;
    }
    const { inProgress } = uiStore;
    const totalRecords = count || 0;
    return (
      <Card fluid>
        <div className="table-wrapper">
          <Table unstackable className="application-list">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Name</Table.HeaderCell>
                {type === 'review' &&
                  <Aux>
                    <Table.HeaderCell>Account Type</Table.HeaderCell>
                    <Table.HeaderCell>Brokerage / Public Compnay</Table.HeaderCell>
                  </Aux>
                }
                <Table.HeaderCell>Creation date</Table.HeaderCell>
                {type !== 'review' &&
                  <Table.HeaderCell>Status</Table.HeaderCell>
                }
                {(type !== 'review' && type === 'individual') &&
                <Table.HeaderCell>Fail Reason</Table.HeaderCell>
                }
                {type === 'individual' &&
                <Table.HeaderCell>GS Processing Date</Table.HeaderCell>
                }
                {type !== 'entity' &&
                <Table.HeaderCell>{ type === 'individual' ? 'CIP Uploads' : 'Documents'}</Table.HeaderCell>
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
                ) :
                accounts.map(account => (
                  <Table.Row key={account.accountId} className={account.accountId === inProgress ? 'disabled' : ''}>
                    <Table.Cell>
                      <p>
                        <Link to={`/app/users/${account.userId}/profile-data`}>
                          <b>{account.firstName} {account.lastName}</b>
                        </Link>
                        <br />{account.email}<br />{account.phone ? Helper.phoneNumberFormatter(account.phone) : ''}
                      </p>
                    </Table.Cell>
                    {type === 'review' &&
                      <Aux>
                        <Table.Cell>
                          <Icon className={`ns-${lowerCase(account.accountType)}-line`} color="green" size="large" />
                        </Table.Cell>
                        <Table.Cell>
                          {`Firm: ${get(account, 'investorProfileData.brokerageFirmName') ? get(account, 'investorProfileData.brokerageFirmName') : 'N/A'}`}
                          <br />
                          {`Ticker: ${get(account, 'investorProfileData.publicCompanyTicker') ? get(account, 'investorProfileData.publicCompanyTicker') : 'N/A'}`}
                        </Table.Cell>
                      </Aux>
                    }
                    <Table.Cell>
                      {account.created && account.created.date ?
                        moment.unix(account.created.date).format('MM-DD-YYYY')
                        :
                        <p className="intro-text">N/A</p>
                      }
                    </Table.Cell>
                    {type !== 'review' &&
                    // <Table.Cell className={`status ${kebabCase(account.accountStatus)}`}>
                    <Table.Cell className="status">
                      {/* <Icon className="ns-warning-circle" /> */}
                      {statusDetails[account.accountStatus]}
                    </Table.Cell>
                    }
                    {(type !== 'review' && type === 'individual') &&
                    <Table.Cell>
                      {account.cip && account.cip.failReason && account.cip.failReason.message ? account.cip.failReason.message : <p className="intro-text">N/A</p>}
                    </Table.Cell>
                    }
                    {type === 'individual' &&
                    <Table.Cell>
                      {account.processing && account.processing.gs && account.processing.gs.date ? moment.unix(account.processing.gs.date).format('MM-DD-YYYY') : <p className="intro-text">N/A</p>}
                    </Table.Cell>
                    }
                    {type === 'ira' ?
                      <Table.Cell>
                        {account.legalDetails && account.legalDetails.verificationDocs
                        && account.legalDetails.verificationDocs.addressProof &&
                        account.legalDetails.verificationDocs.addressProof.fileHandle ?
                          <a href={`${NEXTSEED_BOX_URL}folder/${account.legalDetails.verificationDocs.addressProof.fileHandle.boxFolderId}`} className="link" rel="noopener noreferrer" target="_blank" >
                            View Documents
                          </a>
                        :
                          <p className="intro-text">N/A</p>
                        }
                      </Table.Cell>
                      : type !== 'entity' ?
                        <Table.Cell>
                          { type === 'review' ?
                            get(account, 'storageDetails.rootFolder.id') ?
                              <Aux>
                                <a href={`${NEXTSEED_BOX_URL}folder/${get(account, 'storageDetails.rootFolder.id')}`} className="link filename-link" rel="noopener noreferrer" target="_blank" >
                                  View Documents
                                </a>
                              </Aux>
                          :
                              <p className="intro-text">N/A</p>
                          :
                          get(account, 'storageDetails.Profile.CIP.id') ?
                            <Aux>
                              <a href={`${NEXTSEED_BOX_URL}folder/${get(account, 'storageDetails.Profile.CIP.id')}`} className="link filename-link" rel="noopener noreferrer" target="_blank" >
                                View Documents
                              </a>
                            </Aux>
                          :
                            <p className="intro-text">N/A</p>

                          }
                        </Table.Cell> : null
                    }
                    <Actions
                      inProgress={inProgress}
                      crowdPayCtaHandler={crowdPayCtaHandler}
                      refLink={this.props.match.url}
                      type={type}
                      account={account}
                    />
                  </Table.Row>
                ))
              }
            </Table.Body>
          </Table>
        </div>
        <Route exact path={`${this.props.match.url}/:action`} render={props => <MessageModal refLink={this.props.match.url} {...props} />} />
        <Route path={`${this.props.match.url}/:userId/:accountId/:action`} render={props => <ConfirmModel refLink={this.props.match.url} {...props} />} />
        {totalRecords > 0 &&
          <NsPagination floated="right" initRequest={this.paginate} meta={{ totalRecords, requestState }} />
        }
      </Card>
    );
  }
}
