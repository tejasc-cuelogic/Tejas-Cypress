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
      <div className="ui vertical segment content">
        <div className="ui container">
          <div className="ui one column grid">
            <div className="column nsContent">
              <LoadableAbout />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default About;
