import React from 'react';
import { Image, Card, Grid } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const insightArticle = ({ article }) => (
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
);

export default insightArticle;
