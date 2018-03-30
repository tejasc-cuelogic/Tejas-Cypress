import React from 'react';
import { observer } from 'mobx-react';
import { Grid } from 'semantic-ui-react';

const PageHeaderSection = observer((props) => {
  if (!props.title) {
    return null;
  }
  return (
    <div className="page-header-section webcontent-spacer">
      <Grid>
        <Grid.Row>
          <Grid.Column width={4}>
            <h1>{props.title}</h1>
          </Grid.Column>
        </Grid.Row>
      </Grid>
      {props.children}
    </div>
  );
});

export default PageHeaderSection;
