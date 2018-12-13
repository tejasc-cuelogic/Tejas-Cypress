import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Aux from 'react-aux';
import { Route, withRouter, Link } from 'react-router-dom';
import { Card, Table, Icon } from 'semantic-ui-react';
import { DateTimeFormat, InlineLoader, NsPagination } from './../../../../../theme/shared';
import Actions from './Actions';
import ConfirmModel from './ConfirmModel';
import { ACCREDITATION_METHOD_ENUMS, ACCREDITATION_NETWORTH_LABEL } from '../../../../../services/constants/accreditation';
import { NEXTSEED_BOX_URL } from '../../../../../constants/common';
import { ACCREDITATION_STATUS_LABEL } from '../../../../../services/constants/investmentLimit';

@inject('accreditationStore')
@withRouter
@observer
export default class AllAccreditationRequests extends Component {
  componentWillMount() {
    if (this.props.match.isExact) {
      this.props.accreditationStore.initRequest();
    }
  }
  paginate = params => this.props.accreditationStore.initRequest(params);
  render() {
    const { match, accreditationStore } = this.props;
    const {
      accreditations, loading, count, requestState,
    } = accreditationStore;
    if (loading) {
      return <InlineLoader />;
    }
    const totalRecords = count || 0;
    return (
      <Card fluid>
        <div className="table-wrapper">
          <Table unstackable className="application-list">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Investor Name</Table.HeaderCell>
                <Table.HeaderCell>Requested Date</Table.HeaderCell>
                <Table.HeaderCell>Account Type</Table.HeaderCell>
                <Table.HeaderCell>Type</Table.HeaderCell>
                <Table.HeaderCell>Method</Table.HeaderCell>
                <Table.HeaderCell>Box Link</Table.HeaderCell>
                <Table.HeaderCell textAlign="center" />
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
                      <DateTimeFormat unix format="MM-DD-YYYY" datetime={accreditation.requestDate} />
                    </Table.Cell>
                    <Table.Cell>
                      {accreditation.accountType ?
                        <Icon size="large" className="ns-entity-line" color="green" /> :
                        <Aux>
                          <Icon size="large" className="ns-individual-line" color="green" />
                          <Icon size="large" className="ns-ira-line" color="green" />
                        </Aux>
                      }
                    </Table.Cell>
                    <Table.Cell>
                      <p>{ACCREDITATION_METHOD_ENUMS[accreditation.method]}
                        {(accreditation.method === 'ASSETS' || accreditation.method === 'REVOCABLE_TRUST_ASSETS') &&
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
                    <Table.Cell>
                      <p>{accreditation.assetsUpload && accreditation.assetsUpload.length ? 'Uploads' : 'Verifier'}
                        {accreditation.verifier &&
                          <Aux>
                            <br /><b>Role: </b> {accreditation.verifier.role}
                            <br /><b>Email: </b> {accreditation.verifier.email}
                          </Aux>
                        }
                      </p>
                    </Table.Cell>
                    <Table.Cell textAlign="center">
                      {accreditation.assetsUpload && accreditation.assetsUpload.length &&
                      accreditation.assetsUpload[0].fileInfo &&
                      accreditation.assetsUpload[0].fileInfo[0].fileHandle ?
                        <a href={`${NEXTSEED_BOX_URL}folder/${accreditation.assetsUpload[0].fileInfo[0].fileHandle.boxFolderId}`} className="link" rel="noopener noreferrer" target="_blank" ><Icon className="ns-file" /></a>
                      : <p className="intro-text">N/A</p>
                      }
                    </Table.Cell>
                    {accreditation.accreditationStatus === 'REQUESTED' ?
                      <Actions
                        accountId={accreditation.accountId}
                        userId={accreditation.userId}
                        accountType={accreditation.accountType}
                        {...this.props}
                      /> :
                      <Table.Cell>
                        <p className={`${accreditation.accreditationStatus === 'APPROVED' ? 'positive' : 'negative'}-text`}><b>{ACCREDITATION_STATUS_LABEL[accreditation.accreditationStatus]}</b></p>
                      </Table.Cell>
                    }
                  </Table.Row>
                ))
              }
            </Table.Body>
          </Table>
          <Route path={`${match.url}/:action/:userId/:accountId?/:accountType?`} render={props => <ConfirmModel refLink={match.url} {...props} />} />
        </div>
        {totalRecords > 0 &&
          <NsPagination floated="right" initRequest={this.paginate} meta={{ totalRecords, requestState }} />
        }
      </Card>
    );
  }
}
