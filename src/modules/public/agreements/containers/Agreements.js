import React, { Component } from 'react';
import Loadable from 'react-loadable';
import { Container } from 'semantic-ui-react';
import upperFirst from 'lodash/upperFirst';

export default class Agreements extends Component {
  render() {
    const loadSection = upperFirst(this.props.match.params.section) || 'Terms-of-use';
    const Module = Loadable({
      loader: () => import(`../components/${loadSection}`),
      loading() {
        return <div>Loading...</div>;
      },
    });

    return (
      <section>
        <Container>
          <Module />
        </Container>
      </section>
    );
  }
}
