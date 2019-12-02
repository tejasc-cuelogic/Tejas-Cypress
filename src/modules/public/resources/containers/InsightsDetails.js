import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Helmet } from 'react-helmet';
import { Header, Container, Grid, Breadcrumb } from 'semantic-ui-react';
import { InlineLoader } from '../../../../theme/shared';
import HtmlEditor from '../../../shared/HtmlEditor';

@inject('articleStore')
@observer
export default class InsightsDetails extends Component {
  constructor(props) {
    super(props);
    this.props.articleStore.getArticleDetailsBySlug(this.props.match.params.slug);
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
      <>
        <Helmet>
          <title>{`${ArticlesDetails.title} - NextSeed`}</title>
        </Helmet>
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
                <pre className="migrated-content justify-text">
                  <HtmlEditor
                    readOnly
                    content={(ArticlesDetails.content || '')}
                  />
                </pre>
              </Grid.Column>
            </Grid>
          </section>
        </Container>
      </>
    );
  }
}
