import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Form, Header, Button, Divider, Table, Icon } from 'semantic-ui-react';

@inject('offeringCreationStore', 'offeringsStore')
@observer
export default class GenerateDocs extends Component {
  render() {
    const { offer } = this.props.offeringsStore;
    return (
      <div className={offer.stage === 'CREATION' ? 'ui card fluid form-card' : ''}>
        <Form>
          <Header as="h4">Generate Docs from Templates</Header>
          <Button primary className="relaxed" content="Generate Docs" />
          <Divider section />
          <Header as="h4">Edgar Filing</Header>
          <Table basic compact className="form-table">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell colSpan="3">
                  <Header as="h6">Generated Doc 1</Header>
                </Table.HeaderCell>
              </Table.Row>
              <Table.Row>
                <Table.HeaderCell>Submission</Table.HeaderCell>
                <Table.HeaderCell>Created Date</Table.HeaderCell>
                <Table.HeaderCell>Actions</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <Table.Row>
                <Table.Cell colSpan="3" textAlign="center">
                  <Button primary compact circular size="minix" className="relaxed" content="Generate New Edgar Filing" />
                </Table.Cell>
              </Table.Row>
              <Table.Row verticalAlign="top">
                <Table.Cell width={8}>XML Submission 1</Table.Cell>
                <Table.Cell width={8}>6/20/18</Table.Cell>
                <Table.Cell collapsing>
                  <Button.Group size="small">
                    <Button className="link-button"><Icon className="ns-download" /></Button>
                    <Button className="link-button"><Icon className="ns-link" /></Button>
                    <Button className="link-button"><Icon className="ns-lock" /></Button>
                    <Button className="link-button"><Icon className="ns-trash" /></Button>
                  </Button.Group>
                </Table.Cell>
              </Table.Row>
              <Table.Row verticalAlign="top">
                <Table.Cell>XML Submission 2</Table.Cell>
                <Table.Cell>6/20/18</Table.Cell>
                <Table.Cell collapsing>
                  <Button.Group size="small">
                    <Button className="link-button"><Icon className="ns-download" /></Button>
                    <Button className="link-button"><Icon className="ns-link" /></Button>
                    <Button className="link-button"><Icon className="ns-lock" /></Button>
                    <Button className="link-button"><Icon className="ns-trash" /></Button>
                  </Button.Group>
                </Table.Cell>
              </Table.Row>
              <Table.Row verticalAlign="top">
                <Table.Cell>XML Submission 3</Table.Cell>
                <Table.Cell>6/20/18</Table.Cell>
                <Table.Cell collapsing>
                  <Button.Group size="small">
                    <Button className="link-button"><Icon className="ns-download" /></Button>
                    <Button className="link-button"><Icon className="ns-link" /></Button>
                    <Button className="link-button"><Icon className="ns-lock" /></Button>
                    <Button className="link-button"><Icon className="ns-trash" /></Button>
                  </Button.Group>
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </Form>
      </div>
    );
  }
}
