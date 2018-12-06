import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Form, Header, Button, Divider, Table, Icon } from 'semantic-ui-react';

@inject('offeringCreationStore', 'userStore', 'offeringsStore')
@observer
export default class DataRoom extends Component {
  render() {
    const { match } = this.props;
    const { isIssuer } = this.props.userStore;
    return (
      <div className={isIssuer || (isIssuer && !match.url.includes('offering-creation')) ? 'ui card fluid form-card' : ''}>
        <Form>
          <Header as="h4">
            Documents
            <Button.Group size="mini" floated="right">
              <Button primary compact content="Add Document" />
            </Button.Group>
          </Header>
          <Divider hidden />
          <Table basic compact className="form-table">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Document Name</Table.HeaderCell>
                <Table.HeaderCell>Document</Table.HeaderCell>
                <Table.HeaderCell>Updated on</Table.HeaderCell>
                <Table.HeaderCell textAlign="center">is Public?</Table.HeaderCell>
                <Table.HeaderCell>Actions</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <Table.Row>
                <Table.Cell>Disclosure</Table.Cell>
                <Table.Cell>
                  <Link to="/" className="link"><Icon className="ns-file" />disclosure-document.pdf</Link>
                </Table.Cell>
                <Table.Cell>12-15-2011</Table.Cell>
                <Table.Cell textAlign="center" className="positive-text">Yes</Table.Cell>
                <Table.Cell collapsing>
                  <Button icon circular color="green" className="link-button">
                    <Icon name="ns-unlock" />
                  </Button>
                  <Button icon circular className="link-button">
                    <Icon name="ns-trash" />
                  </Button>
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Financial</Table.Cell>
                <Table.Cell>
                  <Link to="/" className="link"><Icon className="ns-file" />financial-document.pdf</Link>
                </Table.Cell>
                <Table.Cell>12-15-2011</Table.Cell>
                <Table.Cell textAlign="center" className="negative-text">No</Table.Cell>
                <Table.Cell collapsing>
                  <Button icon circular color="red" className="link-button">
                    <Icon name="ns-lock" />
                  </Button>
                  <Button icon circular className="link-button">
                    <Icon name="ns-trash" />
                  </Button>
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </Form>
      </div>
    );
  }
}
