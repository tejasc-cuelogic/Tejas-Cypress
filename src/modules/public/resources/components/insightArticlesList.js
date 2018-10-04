import React, { Component } from 'react';
import { Grid, Image, Card } from 'semantic-ui-react';
import { inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { InlineLoader } from '../../../../theme/shared';

@inject('articleStore')
class InsightArticlesList extends Component {
  render() {
    const { InsightArticles, data } = this.props.articleStore;
    if (data.loading) {
      return <InlineLoader />;
    }
    if (InsightArticles && InsightArticles.length === 0) {
      return <InlineLoader text="No record to display." />;
    }
    return (
      <Grid stackable doubling>
        {InsightArticles && InsightArticles.length &&
        InsightArticles.map(article => (
          <Grid.Column mobile={16} tablet={8} computer={4}>
            <Card className="campaign insights" fluid as={Link} to={`/resources/insights/${article.id}`}>
              <Image
                src={article.featureImage}
              />
              <Card.Content>
                <div className="tags">
                  {article.category}
                  <span className="pull-right">{`${article.minuteRead} Min read`}</span>
                </div>
                <Card.Description>
                  {article.title}
                </Card.Description>
              </Card.Content>
            </Card>
          </Grid.Column>
        ))
      }
      </Grid>);
  }
}

export default InsightArticlesList;
