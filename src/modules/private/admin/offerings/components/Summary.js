import React from 'react';
// import snakeCase from 'lodash/snakeCase';
import { Card, Grid, Icon, Header } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
// import Helper from '../../../../../helper/utility';
/*
  type =>
  0 / undefined: display as it is
  1: amount so prefix $ sign
  2: date representation
*/

// const showValue = props => ((props.type === 1) ?
//   (Helper.CurrencyFormat(props.content)) :
//   ((props.type === 2) ? `date ${props.content}` : props.content));

const Summary = ({ details }) => {
  console.log('details are', details);
  return (
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
                <Grid.Column>
                  <Header as="h6">
                    <Header.Subheader>Business Name</Header.Subheader>
                    {details && details.keyTerms && details.keyTerms.legalBusinessName}
                  </Header>
                </Grid.Column>
                <Grid.Column>
                  <Header as="h6">
                    <Header.Subheader>Launch Date</Header.Subheader>
                    3/15/18
                  </Header>
                </Grid.Column>
                <Grid.Column>
                  <Header as="h6">
                    <Header.Subheader>Date Till Close</Header.Subheader>
                    34 days
                  </Header>
                </Grid.Column>
              </Grid>
            </Card.Content>
          </Card>
        </Grid.Column>
        <Grid.Column>
          <Card fluid className="ba-info-card">
            <Card.Header>Primary POC</Card.Header>
            <Card.Content>
              <Grid columns={3}>
                <Grid.Column>
                  <Header as="h6">
                    <Header.Subheader>Name</Header.Subheader>
                    {details && details.lead && details.lead.name}
                  </Header>
                </Grid.Column>
                <Grid.Column>
                  <Header as="h6">
                    <Header.Subheader>Email</Header.Subheader>
                    jdoe234@gmail.com
                  </Header>
                </Grid.Column>
                <Grid.Column>
                  <Header as="h6">
                    <Header.Subheader>Phone</Header.Subheader>
                    235-343-6453
                  </Header>
                </Grid.Column>
              </Grid>
            </Card.Content>
          </Card>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default Summary;
