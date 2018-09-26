import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Header, Modal, Grid, Table, Popup, Icon, Divider } from 'semantic-ui-react';

const isMobile = document.documentElement.clientWidth < 768;
class TermNoteKeyTerms extends Component {
  render() {
    return (
      <Modal.Content>
        <Grid columns={3} stackable divided className="vertical-gutter">
          <Grid.Column>
            <p><b>Issuer</b><br />A Gard Midtown, LLC</p>
          </Grid.Column>
          <Grid.Column>
            <p><b>Securities</b><br />Term Notes</p>
          </Grid.Column>
          <Grid.Column>
            <p><b>Offering Amount</b><br />Min. $250,000, to max. $1,000,000</p>
          </Grid.Column>
        </Grid>
        <Divider />
        <Table basic="very">
          <Table.Body>
            <Table.Row verticalAlign="top">
              <Table.Cell width={5}><b>Interest Rate{' '}</b>
                <Popup trigger={<Icon name="help circle" color="green" />} content="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor" position="bottom center" />
              </Table.Cell>
              <Table.Cell>
                <p><b>16.0%</b></p>
              </Table.Cell>
            </Table.Row>
            <Table.Row verticalAlign="top">
              <Table.Cell width={5}><b>Payments{' '}</b>
                <Popup trigger={<Icon name="help circle" color="green" />} content="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor" position="bottom center" />
              </Table.Cell>
              <Table.Cell>
                <p><b>Monthly</b></p>
              </Table.Cell>
            </Table.Row>
            <Table.Row verticalAlign="top">
              <Table.Cell width={5}><b>Maturity{' '}</b>
                <Popup trigger={<Icon name="help circle" color="green" />} content="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor" position="bottom center" />
              </Table.Cell>
              <Table.Cell>
                <p><b>60 Months</b></p>
              </Table.Cell>
            </Table.Row>
            <Table.Row verticalAlign="top">
              <Table.Cell width={5}><b>Security Interest{' '}</b>
                <Popup trigger={<Icon name="help circle" color="green" />} content="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor" position="bottom center" />
              </Table.Cell>
              <Table.Cell>
                <p>Blanket lien on all assets of the business</p>
              </Table.Cell>
            </Table.Row>
            <Table.Row verticalAlign="top">
              <Table.Cell width={5}>
                <b>Ownership % Represented by Securities</b>
              </Table.Cell>
              <Table.Cell>
                <p>
                  <b>0%.</b> Investors will not receive any equity interests in the Issuer or
                  any voting or management rights with respect to the Issuer as a result of
                  an investment in Securities.
                </p>
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
        {!isMobile &&
        <Divider />
        }
        <Header as="h5" className="center-align">
          <Link to="/">
            View the Issuer&apos;s SEC Form C filing
          </Link>
        </Header>
      </Modal.Content>
    );
  }
}

export default TermNoteKeyTerms;
