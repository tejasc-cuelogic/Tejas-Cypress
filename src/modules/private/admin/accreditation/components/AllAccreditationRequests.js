import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Route, withRouter } from 'react-router-dom';
import { Card, Table, Icon } from 'semantic-ui-react';
import { DateTimeFormat, InlineLoader, NsPagination } from './../../../../../theme/shared';
import Actions from './Actions';
import ConfirmModel from './ConfirmModel';
import { ACCREDITATION_METHOD_ENUMS } from '../../../../../services/constants/accreditation';
import { NEXTSEED_BOX_URL } from '../../../../../constants/common';

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
                <Table.HeaderCell>Type</Table.HeaderCell>
                <Table.HeaderCell>Method</Table.HeaderCell>
                <Table.HeaderCell>Box Link</Table.HeaderCell>
                <Table.HeaderCell textAlign="center" />
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {
                accreditations.map(accreditation => (
                  <Table.Row key={accreditation.id}>
                    <Table.Cell>
                      <p><b>{`${accreditation.firstName} ${accreditation.lastName}`}</b></p>
                    </Table.Cell>
                    <Table.Cell>
                      <DateTimeFormat unix format="MM-DD-YYYY" datetime={accreditation.requestDate} />
                    </Table.Cell>
                    <Table.Cell>
                      <p>{ACCREDITATION_METHOD_ENUMS[accreditation.method]}</p>
                    </Table.Cell>
                    <Table.Cell>
                      <p>{accreditation.assetsUpload && accreditation.assetsUpload.length ? 'Uploads' : 'Verifier'}</p>
                    </Table.Cell>
                    <Table.Cell>
                      {accreditation.assetsUpload && accreditation.assetsUpload.length ?
                        <a href={`${NEXTSEED_BOX_URL}folder/${accreditation.assetsUpload[0].type === 'ASSETS' ? accreditation.assetsUpload[0].fileInfo.fileHandle.boxFolderId : accreditation.assetsUpload[0].fileInfo[0].fileHandle.boxFolderId}`} className="link" rel="noopener noreferrer" target="_blank" ><Icon className="ns-file" /></a>
                      : '-'
                      }
                    </Table.Cell>
                    <Actions
                      accountId={accreditation.accountId}
                      userId={accreditation.userId}
                      accountType={accreditation.accountType}
                      {...this.props}
                    />
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
