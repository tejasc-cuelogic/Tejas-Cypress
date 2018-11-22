import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Route } from 'react-router-dom';
import { Card, Table } from 'semantic-ui-react';
import { DateTimeFormat, InlineLoader, NsPagination } from './../../../../../theme/shared';
import Actions from './Actions';
import ConfirmModel from './ConfirmModel';

@inject('accreditationStore')
@observer
export default class AllAccreditationRequests extends Component {
  componentWillMount() {
    this.props.accreditationStore.initRequest();
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
                      <p><b>{accreditation.name}</b></p>
                    </Table.Cell>
                    <Table.Cell>
                      <DateTimeFormat datetime={accreditation.createdAt} />
                    </Table.Cell>
                    <Table.Cell>
                      <p>{accreditation.type}</p>
                    </Table.Cell>
                    <Table.Cell>
                      <p>{accreditation.method}</p>
                    </Table.Cell>
                    <Table.Cell>
                      <a href={`${accreditation.boxLink}`} className="link" rel="noopener noreferrer" target="_blank" >{accreditation.boxLink}</a>
                    </Table.Cell>
                    <Actions
                      accountId={accreditation.id}
                      userId={accreditation.id}
                      accountType={accreditation.id}
                      {...this.props}
                    />
                  </Table.Row>
                ))
              }
            </Table.Body>
          </Table>
          <Route path={`${match.url}/:action/:userId/:accountId/:accountType`} render={props => <ConfirmModel refLink={match.url} {...props} />} />
        </div>
        {totalRecords > 0 &&
          <NsPagination floated="right" initRequest={this.paginate} meta={{ totalRecords, requestState }} />
        }
      </Card>
    );
  }
}
