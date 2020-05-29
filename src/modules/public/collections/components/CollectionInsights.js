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
    return (
      <Container>
        {this.props.heading}
        {this.props.subheading}
        {InsightArticles && InsightArticles.length
          && (
          <Grid stackable doubling columns={2}>
              {InsightArticles.map(article => (
                article.scope !== 'HIDDEN'
                ? (
                <Grid.Column>
                  <Card as={Link} to={`/insights/${article.slug}`} className="campaign insights" fluid>
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
                )
                : <InlineLoader text="No record to display." />
              ))}
            </Grid>
          )}
      </Container>
    );
  }
}

export default CollectionInsights;
