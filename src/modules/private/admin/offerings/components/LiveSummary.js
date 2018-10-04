import React from 'react';
import { Card, Grid, Icon, Header } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const leftSummary = offer => [
  { title: 'Business Name', content: offer.keyTerms ? offer.keyTerms.legalBusinessName : 'N/A' },
  { title: 'Launch Date', content: '3/15/18' },
  { title: 'Date Till Close', content: '34 days' },
];

const rightSummary = offer => [
  { title: 'Name', content: offer.lead ? offer.lead.name : 'NA' },
  { title: 'Email', content: 'jdoe234@gmail.com' },
  { title: 'Phone', content: '235-343-6453' },
];
const LiveSummary = ({ offer }) => (
  <Grid columns="equal">
    <Grid.Row>
      <Grid.Column>
        <Card fluid className="ba-info-card">
          <Card.Header>
            Information
            <small className="pull-right"><Link to="/"><Icon className="ns-pencil" />Edit</Link></small>
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
