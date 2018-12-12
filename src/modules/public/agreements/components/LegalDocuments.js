import React, { Component } from 'react';
import Aux from 'react-aux';
import { Header, Grid, Segment, Button, Divider } from 'semantic-ui-react';

// const isSmallScreen = document.documentElement.clientWidth >= 1024
// && document.documentElement.clientWidth < 1200;

const legalDocs = [
  { id: 1, docName: (<Aux>NextSeed Securities LLC Privacy Policy</Aux>), link: 'https://nextseed.box.com/s/6rtk4yx9r71z0iknwk6xdbhtoyxdvwlt' },
  { id: 2, docName: (<Aux>NextSeed Securities LLC BCP Disclosure Statement</Aux>), link: 'https://nextseed.box.com/s/6rtk4yx9r71z0iknwk6xdbhtoyxdvwlt' },
  { id: 3, docName: (<Aux>NextSeed Securities LLC CIP Notice</Aux>), link: 'https://nextseed.box.com/s/6rtk4yx9r71z0iknwk6xdbhtoyxdvwlt' },
  { id: 4, docName: (<Aux>NextSeed Securities LLC Brokercheck Notice</Aux>), link: 'https://nextseed.box.com/s/6rtk4yx9r71z0iknwk6xdbhtoyxdvwlt' },
  { id: 5, docName: (<Aux>NextSeed Securities LLC Investor Agreement</Aux>), link: 'https://nextseed.box.com/s/6rtk4yx9r71z0iknwk6xdbhtoyxdvwlt' },
  { id: 6, docName: (<Aux>NextSeed US LLC Membership Agreement</Aux>), link: 'https://nextseed.box.com/s/6rtk4yx9r71z0iknwk6xdbhtoyxdvwlt' },
];
export default class LegalDocuments extends Component {
  render() {
    return (
      <Aux>
        <Header as="h2">Legal Documents</Header>
        <Divider hidden />
        <Grid columns={3} stackable doubling>
          {
            legalDocs.map(l => (
              <Grid.Column key={l.id}>
                <Segment padded textAlign="center" className="legal-documents">
                  <p>{l.docName}</p>
                  <Button className="relaxed" onClick={() => window.open(`${l.link}`, '_blank')} primary compact>View</Button>
                </Segment>
              </Grid.Column>
            ))
          }
        </Grid>
      </Aux>
    );
  }
}
