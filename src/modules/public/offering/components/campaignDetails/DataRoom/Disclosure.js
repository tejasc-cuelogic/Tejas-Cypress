import React, { Component } from 'react';
import { Header, Icon, Grid, Segment } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

class Disclosure extends Component {
  render() {
    return (
      <Grid.Column widescreen={7} largeScreen={8} computer={16} tablet={16}>
        <Segment padded>
          <div className="segment-container small">
            <Header as="h3">
              <Link to="/">
                Disclousres
                <Icon className="ns-chevron-right" color="green" />
              </Link>
            </Header>
          </div>
        </Segment>
      </Grid.Column>
    );
  }
}

export default Disclosure;
