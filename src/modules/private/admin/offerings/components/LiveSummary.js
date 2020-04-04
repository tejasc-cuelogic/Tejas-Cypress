import React from 'react';
import { Card, Grid, Icon, Header, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { get } from 'lodash';
import { DataFormatter } from '../../../../../helper';

const leftSummary = (offer, offerStatus) => [
  {
    title: 'Business Name',
    content: (get(offer, 'keyTerms.shorthandBusinessName')
      ? get(offer, 'keyTerms.shorthandBusinessName') : (
        get(offer, 'keyTerms.legalBusinessName') ? get(offer, 'keyTerms.legalBusinessName') : 'N/A'
      )),
  },
  { title: 'Launch Date', content: get(offer, 'closureSummary.launchDate') ? DataFormatter.formatedDate(get(offer, 'closureSummary.launchDate')) : 'N/A' },
  { title: offerStatus.offeringLiveTitle, content: offerStatus.offeringLiveContent },

];

const rightSummary = offer => [
  { title: 'Name', content: get(offer, 'issuerDetails.info') ? `${get(offer, 'issuerDetails.info.firstName')} ${get(offer, 'issuerDetails.info.lastName')}` : 'N/A' },
  { title: 'Email', content: get(offer, 'issuerDetails.email.address') || 'N/A' },
  { title: 'Phone', content: get(offer, 'issuerDetails.phone.number') || 'N/A' },
];

const LiveSummary = ({ offer, refLink, onClick, offerStatus }) => (
  <Grid columns="equal" className="mt-10">
    <Grid.Row>
      <Grid.Column>
        <Card fluid className="ba-info-card">
          <Card.Header>
            Information {' '}
            <Button color="green" className="link-button" content="Box Link" onClick={onClick} />
            <small className="pull-right"><Link to={`${refLink}/editOffering`}><Icon className="ns-pencil" />Edit</Link></small>
          </Card.Header>
          <Card.Content>
            <Grid columns={3}>
              { leftSummary(offer, offerStatus).map(item => (
                <Grid.Column>
                  <Header as="h6">
                    <Header.Subheader>{item.title}</Header.Subheader>
                    {item.content}
                  </Header>
                </Grid.Column>
              ))
                }
            </Grid>
          </Card.Content>
        </Card>
      </Grid.Column>
      <Grid.Column>
        <Card fluid className="ba-info-card">
          <Card.Header>
            Primary POC
            <small className="pull-right"><Link to={`${refLink}/editPoc`}><Icon className="ns-pencil" />Edit</Link></small>
          </Card.Header>
          <Card.Content>
            <Grid columns={3}>
              { rightSummary(offer).map(item => (
                <Grid.Column>
                  <Header as="h6">
                    <Header.Subheader>{item.title}</Header.Subheader>
                    {item.content}
                  </Header>
                </Grid.Column>
              ))
              }
            </Grid>
          </Card.Content>
        </Card>
      </Grid.Column>
    </Grid.Row>
  </Grid>
);

export default LiveSummary;
