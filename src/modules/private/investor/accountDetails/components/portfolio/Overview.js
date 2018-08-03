import React from 'react';
import Aux from 'react-aux';
import { Link } from 'react-router-dom';
import { Header, Table, Grid, Statistic, Button, Divider } from 'semantic-ui-react';
import { AccTypeTitle } from '../../../../../../theme/shared';
import PayOffChart from './PayOffChart';

const Overview = () => (
  <Aux>
    <div className="inner-content-spacer bg-offwhite">
      <span className="pull-left">
        <Header as="h5">
          <AccTypeTitle moreText="investment" />
        </Header>
      </span>
      <span className="pull-right">
        <Link target="_blank" to="/offerings/cjk9i3tv31vh70197umi5y2ak/overview" className="pull-right">View offering page</Link>
      </span>
    </div>
    <div className="inner-content-spacer">
      <Grid>
        <Grid.Column width={9}>
          <Header as="h4">Offering Summary</Header>
          <div className="table-wrapper">
            <Table unstackable definition basic="very">
              <Table.Body>
                <Table.Row verticalAlign="top">
                  <Table.Cell width={5}>Issuer</Table.Cell>
                  <Table.Cell>Vigilante Gaming Bar, LLC (“Vigilante”)</Table.Cell>
                </Table.Row>
                <Table.Row verticalAlign="top">
                  <Table.Cell>Entity Type</Table.Cell>
                  <Table.Cell>Limited liability company</Table.Cell>
                </Table.Row>
                <Table.Row verticalAlign="top">
                  <Table.Cell>Anticipated Opening</Table.Cell>
                  <Table.Cell>Sept 6th, 2018</Table.Cell>
                </Table.Row>
                <Table.Row verticalAlign="top">
                  <Table.Cell>Maturity</Table.Cell>
                  <Table.Cell>42 Months to Offering Summary</Table.Cell>
                </Table.Row>
                <Table.Row verticalAlign="top">
                  <Table.Cell>Principal Office</Table.Cell>
                  <Table.Cell>4102 Avenue H #A, Austin, TX 78751</Table.Cell>
                </Table.Row>
                <Table.Row verticalAlign="top">
                  <Table.Cell>Security Interest</Table.Cell>
                  <Table.Cell>Blanket lien on all assets of the business</Table.Cell>
                </Table.Row>
                <Table.Row verticalAlign="top">
                  <Table.Cell>Ownership %</Table.Cell>
                  <Table.Cell>Term Notes</Table.Cell>
                </Table.Row>
                <Table.Row verticalAlign="top">
                  <Table.Cell>Interest Rate</Table.Cell>
                  <Table.Cell>18%</Table.Cell>
                </Table.Row>
                <Table.Row verticalAlign="top">
                  <Table.Cell>Securities</Table.Cell>
                  <Table.Cell>
                    0%. Investors will not receive any equity interests in
                    the Issuer or any voting or management rights with respect
                    to the Issuer as a result of an investment in Securities.
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell colSpan="2">
                    <Button primary content="Fill SEC Form C" />
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </div>
        </Grid.Column>
        <Grid.Column width={4} floated="right">
          <Header as="h4">Key Dates & Values</Header>
          <Statistic.Group size="mini" className="vertical">
            <Statistic>
              <Statistic.Label>Open date</Statistic.Label>
              <Statistic.Value>Sep 6<sup>th</sup>, 2016</Statistic.Value>
            </Statistic>
            <Statistic>
              <Statistic.Label>Months to Maturity</Statistic.Label>
              <Statistic.Value>38 months</Statistic.Value>
            </Statistic>
          </Statistic.Group>
        </Grid.Column>
      </Grid>
    </div>
    <Divider />
    <div className="inner-content-spacer payoff-chart">
      <Header as="h4">Pay Off Chart</Header>
      <PayOffChart />
    </div>
  </Aux>
);

export default Overview;
