import React, { Component } from 'react';
import Loadable from 'react-loadable';
import upperFirst from 'lodash/upperFirst';

class About extends Component {
  render() {
    const loadSection = upperFirst(this.props.match.params.section) || 'Team';
    const LoadableAbout = Loadable({
      loader: () => import(`../components/${loadSection}`),
      loading() {
        return <div>Loading...</div>;
      },
    });

    return (
      <div className="ui one column grid">
        <div className="column" style={{ fontSize: '30px', color: '#666', top: '25px' }} >
          <LoadableAbout />
        </div>
      </div>
    );
  }
}

export default About;
