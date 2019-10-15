import React, { Component } from 'react';
import { Table, Button, Icon, Card } from 'semantic-ui-react';
import { kebabCase, capitalize } from 'lodash';
import moment from 'moment';
import { observer, inject } from 'mobx-react';
import { DateTimeFormat, NsPagination } from '../../../../../../theme/shared';
import { DataFormatter } from '../../../../../../helper';

@inject('updateStore', 'userStore')
@observer
export default class Listing extends Component {
  paginate = params => this.props.updateStore.pageRequest(params);

  handleUpdatesVisibility = (record, isVisible) => {
    this.props.updateStore.updateVisibility(record, isVisible);
  }

  handleViewUpdate = (id, status) => {
    const redirectTo = this.props.userStore.isIssuer && ['PENDING', 'PUBLISHED'].includes(status) ? 'preview' : 'edit';
    this.props.history.push(`${this.props.match.url}/${redirectTo}/${id}`);
  }

  render() {
    const access = this.props.userStore.myAccessForModule('OFFERINGS');
    const isManager = access.asManager;
    const meta = isManager ? ['Title', 'Published Date', 'Recipients', 'Status', 'Updated date', ''] : ['Title', 'Published Date', 'Recipients', 'Status', 'Updated date'];
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
                      <Button className="link-button" onClick={() => this.handleViewUpdate(record.refId, record.status)}>{record.title}</Button>
                    </Table.Cell>
                    <Table.Cell>{record.updatedDate ? moment(record.updatedDate).format('LL') : '-'}</Table.Cell>
                    <Table.Cell>{capitalize(record.scope)}</Table.Cell>
                    <Table.Cell className={`status ${kebabCase(record.status)}`}> <Icon className="ns-circle" color={record.status === 'PUBLISHED' ? 'green' : record.status === 'DRAFT' ? 'red' : 'orange'} /></Table.Cell>
                    <Table.Cell><DateTimeFormat isCSTFormat datetime={DataFormatter.getDateAsPerTimeZone(record.updated.date, true, false, false)} /></Table.Cell>
                    {isManager
                    && (
                    <Table.Cell collapsing textAlign="center">
                      <Button icon className="link-button">
                      <Icon className={record.isVisible ? 'ns-view' : 'ns-no-view'} onClick={() => this.handleUpdatesVisibility(record, !record.isVisible)} />
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
