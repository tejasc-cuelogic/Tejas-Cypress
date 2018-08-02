import React, { Component } from 'react';
import { Container } from 'semantic-ui-react';
import KnowledgeBase from '../../../private/shared/education/components/KnowledgeBase';

export default class EducationCentreDetails extends Component {
  render() {
    const { match, location } = this.props;
    return (
      <section>
        <Container>
          <KnowledgeBase nosearch match={match} location={location} />
        </Container>
      </section>
    );
  }
}
