import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Route } from 'react-router-dom';
import { Card, Table } from 'semantic-ui-react';
import { DateTimeFormat, InlineLoader } from './../../../../../theme/shared';
import Actions from './Actions';
import ConfirmModel from './ConfirmModel';

@inject('accreditationStore')
@observer
export default class AllAccreditationRequests extends Component {
  componentWillMount() {
    this.props.accreditationStore.initRequest();
  }
  render() {
    const { match, accreditationStore } = this.props;
    const { accreditations, loading } = accreditationStore;
    if (loading) {
      return <InlineLoader />;
    }
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
                    <Actions {...this.props} />
                  </Table.Row>
                ))
              }
            </Table.Body>
          </Table>
          <Route path={`${match.url}/:action`} render={props => <ConfirmModel refLink={match.url} {...props} />} />
        </div>
      </Card>
    );
  }
}
