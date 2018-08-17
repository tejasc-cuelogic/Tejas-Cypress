import React, { Component } from 'react';
import { Header, Table, Icon, Input, Button, Item } from 'semantic-ui-react';
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
        <Header as="h5">
        Other Documentation Uploads
        </Header>
        <p>(e.g. Material Sales Agreements and Contracts, Equity/Debt Agreements, etc.)</p>
        <Table inverted className="grey-table">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Label</Table.HeaderCell>
              <Table.HeaderCell>Comment</Table.HeaderCell>
              <Table.HeaderCell />
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell collapsing>
                <Input placeholder="Enter label here" />
              </Table.Cell>
              <Table.Cell />
              <Table.Cell collapsing>
                <Link to="/" className="icon-link">
                  <Icon className="ns-close-circle" color="grey" />
                </Link>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>
                <Input placeholder="Enter label here" />
              </Table.Cell>
              <Table.Cell />
              <Table.Cell>
                <Link to="/" className="icon-link">
                  <Icon className="ns-close-circle" color="grey" />
                </Link>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>
                <Button color="violet" className="ghost-button">+ Add new document</Button>
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
        <Header as="h5">
        NS Admin Uploaded Documents
        </Header>
        <p>Uploaded via the Activity History</p>
        <div className="featured-section">
          <Item.Group relaxed="very">
            <Item>
              <Item.Content>
                <Item.Header as="a">
                  <Icon className="ns-file" color="blue" />Business_Plan.pdf
                </Item.Header>
                <Item.Header>Attached: 7/10/2018 by Brandon Black</Item.Header>
                <Item.Header>
                  <Link to="/" className="icon-link">
                    <Icon className="ns-close-circle" color="grey" />
                  </Link>
                </Item.Header>
              </Item.Content>
              <Item.Content>
                <Item.Description className="caption">
                  <i>
                  This was the original business plan given to me by the owner.He will be sending
                  an updated one to me next week.  Figured we could use this as reference for now.
                  </i>
                </Item.Description>
              </Item.Content>
            </Item>
            <Item>
              <Item.Content>
                <Item.Header as="a">
                  <Icon className="ns-file" color="blue" />Business_Plan_2.pdf
                </Item.Header>
                <Item.Header>Attached: 7/12/2018 by Barbara Birsands</Item.Header>
                <Item.Header>
                  <Link to="/" className="icon-link">
                    <Icon className="ns-close-circle" color="grey" />
                  </Link>
                </Item.Header>
              </Item.Content>
              <Item.Content>
                <Item.Description className="caption">
                  <i>
                  Here’s the new business plan as expected!
                  </i>
                </Item.Description>
              </Item.Content>
            </Item>
          </Item.Group>
        </div>
      </div>
    );
  }
}
