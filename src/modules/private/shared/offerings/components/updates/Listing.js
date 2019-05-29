import React, { Component } from 'react';
import { Table, Modal, Button, Icon, Card } from 'semantic-ui-react';
import { kebabCase, capitalize } from 'lodash';
import { observer, inject } from 'mobx-react';
import NewUpdate from './NewUpdate';
import { DateTimeFormat, NsPagination } from '../../../../../../theme/shared';

const meta = ['Title', 'Recipients', 'Last status change', 'Status', 'Last update'];
@inject('updateStore')
@observer
export default class Listing extends Component {
  paginate = params => this.props.updateStore.pageRequest(params);
  render() {
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
                ) :
                this.props.data.map(record => (
                  <Table.Row key={record.refId}>
                    <Table.Cell>
                      <Modal dimmer="inverted" closeOnEscape={false} onClose={this.close} closeOnDimmerClick={false} size="large" trigger={<Button className="link-button" >{record.title}</Button>} >
                        <NewUpdate
                          refLink={this.props.match.url}
                          id={record.refId}
                          match={this.props.match}
                          status={record.status}
                        />
                      </Modal>
                    </Table.Cell>
                    <Table.Cell>{capitalize(record.scope)}</Table.Cell>
                    <Table.Cell><DateTimeFormat datetime={record.updated.date} /></Table.Cell>
                    <Table.Cell className={`status ${kebabCase(record.status)}`}> <Icon className="ns-circle" color={record.status === 'PUBLISHED' ? 'green' : record.status === 'DRAFT' ? 'red' : 'orange'} /> {capitalize(record.status)}</Table.Cell>
                    <Table.Cell textAlign="right">{record.status === 'PUBLISHED' ? 'Update is published' : record.status === 'DRAFT' ? 'Saved To Draft' : 'Sent update for review'}</Table.Cell>
                  </Table.Row>
                ))
              }
            </Table.Body>
          </Table>
        </div>
        {totalRecords > 0 &&
          <NsPagination floated="right" initRequest={this.paginate} meta={{ totalRecords, requestState: this.props.requestState }} />
        }
      </Card>
    );
  }
}

