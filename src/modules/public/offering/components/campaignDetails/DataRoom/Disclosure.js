import React, { Component } from 'react';
import { Header, Icon, Segment } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

class Disclosure extends Component {
  render() {
    return (
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
    );
  }
}

export default Disclosure;
