import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Aux from 'react-aux';
import { get } from 'lodash';
import moment from 'moment';
import { Route, withRouter, Link } from 'react-router-dom';
import { Card, Table, Icon } from 'semantic-ui-react';
import { InlineLoader, NsPagination } from './../../../../../theme/shared';
import Actions from './Actions';
import ConfirmModel from './ConfirmModel';
import { ACCREDITATION_METHOD_ENUMS, ACCREDITATION_NETWORTH_LABEL } from '../../../../../services/constants/accreditation';
import { NEXTSEED_BOX_URL } from '../../../../../constants/common';
import { ACCREDITATION_STATUS_LABEL } from '../../../../../services/constants/investmentLimit';

@inject('accreditationStore', 'commonStore', 'userStore')
@withRouter
@observer
export default class AllAccreditationRequests extends Component {
  componentWillMount() {
    if (this.props.match.isExact) {
      this.props.accreditationStore.initRequest();
    }
  }
  handleSort = clickedColumn => () => {
    const { setSortingOrder, sortOrder } = this.props.accreditationStore;
    setSortingOrder(clickedColumn, sortOrder.direction === 'asc' ? 'desc' : 'asc');
  }
  handleDocumentsLink = (e, folderId) => {
    e.preventDefault();
    const params = {
      id: folderId,
      accountType: 'SERVICES',
      type: 'FOLDERS',
    };
    this.props.commonStore.getsharedLink(params).then((shareLink) => {
      window.open(shareLink);
    });
  }
  paginate = params => this.props.accreditationStore.initRequest(params);
  render() {
    const { match, accreditationStore, commonStore } = this.props;
    const { inProgress } = commonStore;
    const {
      accreditations, loading, count, requestState, emailVerifier, sortOrder,
    } = accreditationStore;

    const access = this.props.userStore.myAccessForModule('ACCREDITATION');
    const isManager = access.asManager;
    if (loading) {
      return <InlineLoader />;
    }
    const totalRecords = count || 0;
    return (
      <Card fluid>
        <div className="table-wrapper">
          <Table sortable unstackable className="application-list">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell
                  onClick={this.handleSort('firstName')}
                  sorted={sortOrder.column === 'firstName' ? sortOrder.direction === 'asc' ? 'ascending' : 'descending' : null}
                >
                  Investor Name
                </Table.HeaderCell>
                <Table.HeaderCell
                  onClick={this.handleSort('requestDate')}
                  sorted={sortOrder.column === 'requestDate' ? sortOrder.direction === 'asc' ? 'ascending' : 'descending' : null}
                >
                  Requested Date
                </Table.HeaderCell>
                <Table.HeaderCell
                  onClick={this.handleSort('accountType')}
                  sorted={sortOrder.column === 'accountType' ? sortOrder.direction === 'asc' ? 'ascending' : 'descending' : null}
                >
                  Account Type
                </Table.HeaderCell>
                <Table.HeaderCell
                  onClick={this.handleSort('method')}
                  sorted={sortOrder.column === 'method' ? sortOrder.direction === 'asc' ? 'ascending' : 'descending' : null}
                >
                  Type
                </Table.HeaderCell>
                {isManager &&
                  <Table.HeaderCell>Method</Table.HeaderCell>
                }
                <Table.HeaderCell textAlign="center" />
                {requestState.search.status === 'CONFIRMED' &&
                  <Aux>
                    <Table.HeaderCell
                      onClick={this.handleSort('expiration')}
                      sorted={sortOrder.column === 'expiration' ? sortOrder.direction === 'asc' ? 'ascending' : 'descending' : null}
                    >
                      Expiration Date
                    </Table.HeaderCell>
                    <Table.HeaderCell
                      onClick={this.handleSort('promotionCredits')}
                      sorted={sortOrder.column === 'promotionCredits' ? sortOrder.direction === 'asc' ? 'ascending' : 'descending' : null}
                    >
                      Promotion Credits
                    </Table.HeaderCell>
                  </Aux>
                }
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {
              accreditations.length === 0 ? (
                <Table.Row>
                  <Table.Cell textAlign="center" colSpan={7}>No accreditation requests to display !</Table.Cell>
                </Table.Row>
                ) :
                accreditations.map(accreditation => (
                  <Table.Row key={accreditation.id}>
                    <Table.Cell>
                      <Link to={`/app/users/${accreditation.userId}/profile-data`}><p><b>{`${accreditation.firstName} ${accreditation.lastName}`}</b></p></Link>
                    </Table.Cell>
                    <Table.Cell>
                      {accreditation.requestDate ? moment.unix(accreditation.requestDate).format('MM/DD/YYYY') : <p className="note">N/A</p>}
                    </Table.Cell>
                    <Table.Cell>
                      {accreditation.accountType && accreditation.accountType.includes('ENTITY') && <Icon size="large" className="ns-entity-line" color="green" />}
                      {accreditation.accountType && accreditation.accountType.includes('INDIVIDUAL') && <Icon size="large" className="ns-individual-line" color="green" />}
                      {accreditation.accountType && accreditation.accountType.includes('IRA') && <Icon size="large" className="ns-ira-line" color="green" />}
                    </Table.Cell>
                    <Table.Cell>
                      <p>{ACCREDITATION_METHOD_ENUMS[accreditation.method]}
                        {(accreditation.method === 'ASSETS' || accreditation.method === 'REVOCABLE_TRUST_ASSETS') && accreditation.netWorth &&
                          <Aux><br /><b>Net Worth: </b>
                            {ACCREDITATION_NETWORTH_LABEL[accreditation.netWorth]}
                          </Aux>
                        }
                        {(accreditation.method === 'REVOCABLE_TRUST_ASSETS' || accreditation.method === 'REVOCABLE_TRUST_INCOME') && accreditation.grantorName &&
                          <Aux><br /><b>Grantor Name: </b>
                            {accreditation.grantorName}
                          </Aux>
                        }
                      </p>
                    </Table.Cell>
                    {isManager &&
                      <Table.Cell>
                        <p>{accreditation.assetsUpload && accreditation.assetsUpload.length ?
                          accreditation.assetsUpload[0].fileInfo &&
                          accreditation.assetsUpload[0].fileInfo[0].fileHandle ?
                          (inProgress === accreditation.assetsUpload[0]
                            .fileInfo[0].fileHandle.boxFolderId ? <p> Loading... </p> :
                            <a onClick={e => this.handleDocumentsLink(e, accreditation.assetsUpload[0].fileInfo[0].fileHandle.boxFolderId)} href={`${NEXTSEED_BOX_URL}folder/${accreditation.assetsUpload[0].fileInfo[0].fileHandle.boxFolderId}`} className="link" rel="noopener noreferrer" target="_blank" >{inProgress === accreditation.assetsUpload[0].fileInfo[0].fileHandle.boxFolderId ? 'Loading...' : 'Share Link'}</a>
                            )
                            : <p className="note">N/A</p>
                          : 'Verifier'}
                          {accreditation.verifier &&
                            <Aux>
                              <br /><b>Role: </b> {accreditation.verifier.role}
                              <br /><b>Email: </b> {accreditation.verifier.email}
                            </Aux>
                          }
                        </p>
                      </Table.Cell>
                    }
                    {accreditation.accreditationStatus === 'REQUESTED' && isManager ?
                      <Aux>
                        <Actions
                          accountId={accreditation.accountId}
                          userId={accreditation.userId}
                          accountType={get(accreditation, 'accountType[0]')}
                          emailVerifier={emailVerifier}
                          accreditation={accreditation}
                          requestDate={accreditation.requestDate}
                          {...this.props}
                        />
                      </Aux> :
                      <Table.Cell>
                        <p className={`${accreditation.accreditationStatus === 'CONFIRMED' ? 'positive' : accreditation.accreditationStatus === 'REQUESTED' ? 'warning' : 'negative'}-text`}><b>{ACCREDITATION_STATUS_LABEL[accreditation.accreditationStatus]}</b>{get(accreditation, 'reviewed.date') ? ` on ${moment.unix(get(accreditation, 'reviewed.date')).format('MM/DD/YYYY')}` : ''}</p>
                      </Table.Cell>
                    }
                    {accreditation.accreditationStatus === 'CONFIRMED' &&
                      <Aux>
                        <Table.Cell>{get(accreditation, 'expiration') ? moment.unix(get(accreditation, 'expiration')).format('MM/DD/YYYY') : '-'}</Table.Cell>
                        <Table.Cell>{get(accreditation, 'promotionCredits')}</Table.Cell>
                      </Aux>
                    }
                  </Table.Row>
                ))
              }
            </Table.Body>
          </Table>
          <Route path={`${match.url}/:action/:userId/:requestDate/:accountId?/:accountType?`} render={props => <ConfirmModel refLink={match.url} {...props} />} />
        </div>
        {totalRecords > 0 &&
          <NsPagination floated="right" initRequest={this.paginate} meta={{ totalRecords, requestState }} />
        }
      </Card>
    );
  }
}
