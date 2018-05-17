import React from 'react';
import { observer } from 'mobx-react';
import { Grid, Header, Icon, Button } from 'semantic-ui-react';

const PageHeaderSection = observer((props) => {
  if (!props.title) {
    return null;
  }
  return (
    <div className="page-header-section">
      <Grid>
        <Grid.Row>
          <Grid.Column width={6}>
            <Header as="h1">{props.title}</Header>
          </Grid.Column>
          <Grid.Column width={4} floated="right" textAlign="right">
            <span className="item notification">
              <Icon className="ns-bell" />
              <span className="unread-count">3</span>
            </span>
            <Button primary floated="right">Invest Now</Button>
          </Grid.Column>
        </Grid.Row>
      </Grid>
      {props.children}
    </div>
  );
});

export default PageHeaderSection;
