import React from 'react';
import { Header, Button, Table, Form, Divider, Popup, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const TransferRequest = props => (
  <div className="center-align">
    <Header as="h3" textAlign="center">Confirm Transfer Request</Header>
    <Table basic="very" className="confirm-transfer-table mt-30" compact>
      <Table.Body>
        <Table.Row>
          <Table.Cell>Investment Amount:</Table.Cell>
          <Table.Cell collapsing>$</Table.Cell>
          <Table.Cell collapsing>15,000.00</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>
            Cash Available:
            <Popup
              wide
              trigger={<Icon name="help circle" color="green" />}
              content="If this investment is a request to change an existing investment in this offering, then Cash Available also includes any dollars currently reserved or invested in the same offering."
              position="top center"
            />
          </Table.Cell>
          <Table.Cell collapsing>$</Table.Cell>
          <Table.Cell collapsing>(5,819.01)</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Available Credit ($100): </Table.Cell>
          <Table.Cell collapsing>$</Table.Cell>
          <Table.Cell collapsing>
            <Form>
              <Form.Group>
                <Form.Input size="mini" />
              </Form.Group>
            </Form>
          </Table.Cell>
        </Table.Row>
      </Table.Body>
      <Table.Footer>
        <Table.Row>
          <Table.HeaderCell>Transfer Request: </Table.HeaderCell>
          <Table.HeaderCell className="positive-text" collapsing>$</Table.HeaderCell>
          <Table.HeaderCell className="positive-text" collapsing>9,180.99</Table.HeaderCell>
        </Table.Row>
      </Table.Footer>
    </Table>
    <Divider hidden />
    <Button.Group>
      <Button primary onClick={props.click}>Confirm</Button>
      <Button onClick={props.click}>Cancel</Button>
    </Button.Group>
    <p className="mt-50">
      By clicking the “Confirm” button, I authorize the transfer from
      my <Link to="/">Banco do Brasil account (x-1923)</Link> to my NextSeed account in the
      amount equal to the Transfer Requested above. I understand this transfer will
      be <Link to="/">initiated within 1 business day</Link>.
    </p>
  </div>
);

export default TransferRequest;
