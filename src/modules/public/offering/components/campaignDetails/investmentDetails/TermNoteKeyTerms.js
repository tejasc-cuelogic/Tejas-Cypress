import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Header, Modal, Grid, Table, Popup, Icon, Divider } from 'semantic-ui-react';

const isMobile = document.documentElement.clientWidth < 768;
class TermNoteKeyTerms extends Component {
  render() {
    return (
      <Modal.Content scrolling>
        <Grid columns={3} stackable divided className="vertical-gutter">
          <Grid.Column>
            <p><b>Issuer</b><br />A Gard Midtown, LLC</p>
          </Grid.Column>
          <Grid.Column>
            <p><b>Regulation</b><br />506(c)</p>
          </Grid.Column>
          <Grid.Column>
            <p><b>Security</b><br />Term Notes</p>
          </Grid.Column>
        </Grid>
        <Divider />
        <Table basic="very">
          <Table.Body>
            <Table.Row verticalAlign="top">
              <Table.Cell width={5}><b>Offering Min{' '}</b>
                <Popup trigger={<Icon name="help circle" color="green" />} content="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor" position="bottom center" />
              </Table.Cell>
              <Table.Cell>
                <p>$250,000</p>
              </Table.Cell>
            </Table.Row>
            <Table.Row verticalAlign="top">
              <Table.Cell width={5}><b>Offering Max{' '}</b>
                <Popup trigger={<Icon name="help circle" color="green" />} content="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor" position="bottom center" />
              </Table.Cell>
              <Table.Cell>
                <p>$1,000,000</p>
              </Table.Cell>
            </Table.Row>
            <Table.Row verticalAlign="top">
              <Table.Cell width={5}><b>Min Individual Investment{' '}</b>
                <Popup trigger={<Icon name="help circle" color="green" />} content="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor" position="bottom center" />
              </Table.Cell>
              <Table.Cell>
                <p>$100</p>
              </Table.Cell>
            </Table.Row>
            <Table.Row verticalAlign="top">
              <Table.Cell width={5}><b>Interest Rate{' '}</b>
                <Popup trigger={<Icon name="help circle" color="green" />} content="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor" position="bottom center" />
              </Table.Cell>
              <Table.Cell>
                <p>16.0%</p>
              </Table.Cell>
            </Table.Row>
            <Table.Row verticalAlign="top">
              <Table.Cell width={5}><b>Maturity{' '}</b>
                <Popup
                  trigger={<Icon name="help circle" color="green" />}
                  content="If the investors have not been paid in full within [XX] months, the Issuer is required to promptly pay the entire outstanding balance to the investors."
                  position="bottom center"
                />
              </Table.Cell>
              <Table.Cell>
                <p>60 Months</p>
              </Table.Cell>
            </Table.Row>
            <Table.Row verticalAlign="top">
              <Table.Cell width={5}><b>Payments{' '}</b>
                <Popup
                  trigger={<Icon name="help circle" color="green" />}
                  content="The Issuer will make monthly payments based on the relevant revenue sharing percentage."
                  position="bottom center"
                />
              </Table.Cell>
              <Table.Cell>
                <p>Monthly</p>
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
