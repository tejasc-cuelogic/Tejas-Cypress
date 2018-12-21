import React from 'react';
import { Card, Grid, Icon, Header } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { DataFormatter } from '../../../../../helper';

const leftSummary = offer => [
  {
    title: 'Business Name',
    content: ((offer.keyTerms && offer.keyTerms.shorthandBusinessName) ?
      offer.keyTerms.shorthandBusinessName : (
        (offer.keyTerms && offer.keyTerms.legalBusinessName) ? offer.keyTerms.legalBusinessName : 'N/A'
      )),
  },
  { title: 'Launch Date', content: offer && offer.offering && offer.offering.launch && DataFormatter.formatedDate(offer.offering.launch.targetDate) },
  { title: offer.offering && offer.offering.launch && offer.offering.launch.terminationDate && DataFormatter.diffDays(offer.offering.launch.terminationDate, true) <= 0 ? 'Close Date' : 'Days Till Close', content: (offer.offering && offer.offering.launch && offer.offering.launch.terminationDate && DataFormatter.diffDays(offer.offering.launch.terminationDate, true) >= 0) ? `${DataFormatter.diffDays(offer.offering.launch.terminationDate)} days` : offer.offering.launch.terminationDate ? offer.offering.launch.terminationDate : 'N/A' },
];

const rightSummary = offer => [
  { title: 'Name', content: offer.issuerDetails && offer.issuerDetails.info ? `${offer.issuerDetails.info.firstName} ${offer.issuerDetails.info.lastName}` : 'N/A' },
  { title: 'Email', content: offer.issuerDetails && offer.issuerDetails.email && offer.issuerDetails.email.address ? offer.issuerDetails.email.address : 'N/A' },
  { title: 'Phone', content: offer.issuerDetails && offer.issuerDetails.phone && offer.issuerDetails.phone.number ? offer.issuerDetails.phone.number : 'N/A' },
];
const LiveSummary = ({ offer, refLink }) => (
  <Grid columns="equal">
    <Grid.Row>
      <Grid.Column>
        <Card fluid className="ba-info-card">
          <Card.Header>
            Information
            <small className="pull-right"><Link to={`${refLink}/editOffering`}><Icon className="ns-pencil" />Edit</Link></small>
          </Card.Header>
          <Card.Content>
            <Grid columns={3}>
              { leftSummary(offer).map(item => (
                <Grid.Column>
                  <Header as="h6">
                    <Header.Subheader>{item.title}</Header.Subheader>
                    {item.content}
                  </Header>
                </Grid.Column>))
                }
            </Grid>
          </Card.Content>
        </Card>
      </Grid.Column>
      <Grid.Column>
        <Card fluid className="ba-info-card">
          <Card.Header>Primary POC</Card.Header>
          <Card.Content>
            <Grid columns={3}>
              { rightSummary(offer).map(item => (
                <Grid.Column>
                  <Header as="h6">
                    <Header.Subheader>{item.title}</Header.Subheader>
                    {item.content}
                  </Header>
                </Grid.Column>))
              }
            </Grid>
          </Card.Content>
        </Card>
      </Grid.Column>
    </Grid.Row>
  </Grid>
);

export default LiveSummary;
