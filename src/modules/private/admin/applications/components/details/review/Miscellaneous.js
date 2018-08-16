import React, { Component } from 'react';
import { Header, Table, Icon, Input } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

export default class Miscellaneous extends Component {
  render() {
    return (
      <div className="inner-content-spacer">
        <Header as="h5">
        Social Media
        </Header>
        <Table inverted className="grey-table">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Label</Table.HeaderCell>
              <Table.HeaderCell>URL</Table.HeaderCell>
              <Table.HeaderCell />
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell collapsing>
                <Input placeholder="e.g Facebook" value="Facebook" />
              </Table.Cell>
              <Table.Cell>
                <Input placeholder="Enter here..." fluid value="www.facebook.com/fbbusiness_name1" />
              </Table.Cell>
              <Table.Cell collapsing>
                <Link to="/" className="icon-link">
                  <Icon className="ns-close-circle" color="grey" />
                </Link>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>
                <Input placeholder="e.g Facebook" />
              </Table.Cell>
              <Table.Cell>
                <Input fluid placeholder="Enter here..." />
              </Table.Cell>
              <Table.Cell>
                <Link to="/" className="icon-link">
                  <Icon className="ns-close-circle" color="grey" />
                </Link>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>
                <Input placeholder="e.g Facebook" />
              </Table.Cell>
              <Table.Cell>
                <Input fluid placeholder="Enter here..." />
              </Table.Cell>
              <Table.Cell>
                <Link to="/" className="icon-link">
                  <Icon className="ns-close-circle" color="grey" />
                </Link>
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </div>
    );
  }
}
