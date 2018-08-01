import React, { Component } from 'react';
import { Container } from 'semantic-ui-react';
import KnowledgeBase from '../../../private/shared/education/components/KnowledgeBase';

export default class EducationCenterDetails extends Component {
  render() {
    const { match, location } = this.props;
    console.log(match);
    return (
      <section>
        <Container className="edu-center">
          <KnowledgeBase marketing match={match} location={location} />
        </Container>
      </section>
    );
  }
}
