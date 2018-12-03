import React, { Component } from 'react';
import { Table, Modal, Button, Icon } from 'semantic-ui-react';
import { kebabCase, capitalize } from 'lodash';
import NewUpdate from './NewUpdate';
import { DateTimeFormat } from '../../../../../../theme/shared';

const meta = ['Title', 'Recipients', 'Last status change', 'Status', 'Last update'];

export default class Listing extends Component {
  render() {
    const listHeader = [...meta];
    return (
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
                <Table.Row key={record.id}>
                  <Table.Cell>
                    <Modal dimmer="inverted" onClose={this.close} closeOnDimmerClick={false} size="large" trigger={<Button className="link-button" >{record.title}</Button>} closeIcon >
                      <NewUpdate
                        refLink={this.props.match.url}
                        id={record.id}
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
    );
  }
}

