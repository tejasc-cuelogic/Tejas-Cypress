import React, { Component } from 'react';
import { Grid, Image, Card } from 'semantic-ui-react';
import { inject } from 'mobx-react';
import { Link } from 'react-router-dom';

@inject('articleStore')
class InsightArticlesList extends Component {
  render() {
    const { InsightArticles } = this.props.articleStore;
    return (
      <Grid>
        {InsightArticles.map(article => (
          <Grid.Column mobile={16} tablet={8} computer={4} fluid>
            <Card className="campaign insights" as={Link} to="/">
              <Image
                src={article.featureImage}
              />
              <Card.Content>
                <div className="tags">
                  {article.category}
                  <span className="pull-right">{article.minuteRead}</span>
                </div>
                <Card.Description>
                  {article.title}
                </Card.Description>
              </Card.Content>
            </Card>
          </Grid.Column>
        ))}
      </Grid>);
  }
}

export default InsightArticlesList;
