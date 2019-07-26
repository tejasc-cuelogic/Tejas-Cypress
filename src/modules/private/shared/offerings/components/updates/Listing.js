import React, { Component } from 'react';
import { Table, Button, Icon, Card } from 'semantic-ui-react';
import { kebabCase, capitalize } from 'lodash';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { DateTimeFormat, NsPagination } from '../../../../../../theme/shared';
import { DataFormatter } from '../../../../../../helper';

@inject('updateStore', 'userStore')
@observer
export default class Listing extends Component {
  paginate = params => this.props.updateStore.pageRequest(params);

  handleUpdatesVisibility = (record, isVisible) => {
    this.props.updateStore.updateVisibility(record, isVisible);
  }

  render() {
    const access = this.props.userStore.myAccessForModule('OFFERINGS');
    const isManager = access.asManager;
    const meta = isManager ? ['Title', 'Recipients', 'Last status change', 'Status', 'Last update', ''] : ['Title', 'Recipients', 'Last status change', 'Status', 'Last update'];
    const listHeader = [...meta];
    const totalRecords = this.props.count || 0;
    return (
      <Card fluid>
        <div className="table-wrapper">
          <Table unstackable singleLine className="investment-details">
            <Table.Header>
              <Table.Row>
                {
                  listHeader.map(cell => (
                    <Table.HeaderCell key={cell.split(' ')[0]} textAlign={cell === 'Last update' ? 'right' : ''}>{cell}</Table.HeaderCell>
                  ))
                }
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {this.props.data.length === 0 ? (
                <Table.Row>
                  <Table.Cell textAlign="center" colSpan={5}>No update to display !</Table.Cell>
                </Table.Row>
              )
                : this.props.data.map(record => (
                  <Table.Row key={record.refId}>
                    <Table.Cell>
                      <Link to={`${this.props.match.url}/edit/${record.refId}`}>{record.title}</Link>
                    </Table.Cell>
                    <Table.Cell>{capitalize(record.scope)}</Table.Cell>
                    <Table.Cell><DateTimeFormat isCSTFormat datetime={DataFormatter.getDateInCST(record.updated.date, true, false, false)} /></Table.Cell>
                    <Table.Cell className={`status ${kebabCase(record.status)}`}> <Icon className="ns-circle" color={record.status === 'PUBLISHED' ? 'green' : record.status === 'DRAFT' ? 'red' : 'orange'} /> {capitalize(record.status)}</Table.Cell>
                    <Table.Cell textAlign="right">{record.status === 'PUBLISHED' ? 'Update is published' : record.status === 'DRAFT' ? 'Saved To Draft' : 'Sent update for review'}</Table.Cell>
                    {isManager
                    && (
                    <Table.Cell collapsing textAlign="center">
                      <Button icon className="link-button">
                      <Icon className={record.isVisible ? 'ns-no-view' : 'ns-view'} onClick={() => this.handleUpdatesVisibility(record, !record.isVisible)} />
                      </Button>
                    </Table.Cell>
                    )
                    }
                  </Table.Row>
                ))
              }
            </Table.Body>
          </Table>
        </div>
        {totalRecords > 0
          && <NsPagination floated="right" initRequest={this.paginate} meta={{ totalRecords, requestState: this.props.requestState }} />
        }
      </Card>
    );
  }
}
