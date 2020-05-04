import React, { Component } from 'react';
import { Grid, Card, Container } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { InlineLoader, Image64 } from '../../../../theme/shared';

class CollectionInsights extends Component {
  render() {
    const { InsightArticles, loading } = this.props;
    if (loading) {
      return <InlineLoader />;
    }
    if (InsightArticles && InsightArticles.length === 0) {
      return <InlineLoader text="No record to display." />;
    }
    return (
      <Container>
        {this.props.heading}
        {this.props.subheading}
        <Grid stackable doubling columns={3}>
          {InsightArticles && InsightArticles.length
            && InsightArticles.map(article => (
              <Grid.Column>
                <Card className="campaign insights" fluid>
                  <Image64
                    centered
                    srcUrl={article.featuredImage ? article.featuredImage : null
                    }
                  />
                  <Card.Content>
                    <div className="tags">
                      {article.category}
                      <span className="pull-right">{article.minuteRead ? `${article.minuteRead} Min read` : ''}</span>
                    </div>
                    <Card.Description>
                      {article.title}
                    </Card.Description>
                    <Link to={`/insights/${article.slug}`}>Read Article</Link>
                  </Card.Content>
                </Card>
              </Grid.Column>
            ))
          }
        </Grid>
      </Container>
    );
  }
}

export default CollectionInsights;
