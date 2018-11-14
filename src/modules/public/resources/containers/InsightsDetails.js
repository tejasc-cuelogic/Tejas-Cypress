import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Header, Container, Grid, Breadcrumb } from 'semantic-ui-react';
import { InlineLoader, Image64 } from '../../../../theme/shared';

@inject('articleStore')
@observer
export default class InsightsDetails extends Component {
  componentWillMount() {
    this.props.articleStore.getArticle(this.props.match.params.id);
  }
  render() {
    const { ArticlesDetails, articleLoading } = this.props.articleStore;
    if (articleLoading) {
      return <InlineLoader />;
    }

    if (!ArticlesDetails) {
      return <InlineLoader text="Not found" />;
    }
    return (
      <Container>
        <section className="insight-post">
          <Breadcrumb className="mb-30">
            <Breadcrumb.Section as={Link} to="/resources/insights">Insights</Breadcrumb.Section>
            <Breadcrumb.Divider icon={{ className: 'ns-chevron-right' }} />
            <Breadcrumb.Section active>{ArticlesDetails.title}</Breadcrumb.Section>
          </Breadcrumb>
          <Grid>
            <Grid.Column computer={12} tablet={16} mobile={16}>
              <Header as="h2">{ArticlesDetails.title}</Header>
              <Image64
                srcUrl={ArticlesDetails.featuredImage}
                className="mb-30 mt-30"
              />
              <pre className="migrated-content" dangerouslySetInnerHTML={{ __html: ArticlesDetails.content }} />
            </Grid.Column>
          </Grid>
        </section>
      </Container>
    );
  }
}
