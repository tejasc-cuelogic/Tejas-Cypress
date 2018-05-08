import React from 'react';
import { observer } from 'mobx-react';
import { Grid, Icon, Button } from 'semantic-ui-react';

const PageHeaderSection = observer((props) => {
  if (!props.title) {
    return null;
  }
  return (
    <div className="page-header-section">
      <Grid>
        <Grid.Row>
          <Grid.Column width={6}>
            <h1>{props.title}</h1>
          </Grid.Column>
          <Grid.Column width={4} floated="right" textAlign="right">
            <a className="item notification" href="#">
              <Icon className="ns-bell" />
              <span className="unread-count">3</span>
            </a>
            <Button primary floated="right">Invest Now</Button>
            {/* </Grid.Column>
            <Grid.Column floated="right" textAlign="right"> */}
          </Grid.Column>
        </Grid.Row>
      </Grid>
      {props.children}
    </div>
  );
});

export default PageHeaderSection;
