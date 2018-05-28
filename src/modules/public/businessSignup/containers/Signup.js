import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Segment, Grid, Icon, Header, Divider } from 'semantic-ui-react';

class Signup extends Component {
  render() {
    return (
      <Segment vertical className="content">
        <Grid container>
          <Grid.Column>
            <Icon className="ns-paper-plane" size="huge" color="green" />
            <Header as="h1">
              Pre-Qualification Application Process
              <Header.Subheader>
                Welcome to NextSeed! Run through this quick form to get pre-qualified.{' '}
                <Link to="/" className="link">Need help or have questions?</Link>
              </Header.Subheader>
            </Header>
            <Divider section />
          </Grid.Column>
        </Grid>
      </Segment>
    );
  }
}

export default Signup;
