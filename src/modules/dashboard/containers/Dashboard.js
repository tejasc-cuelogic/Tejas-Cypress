import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react';

class Invest extends Component {
  render() {
    return (
      <div className="page-header-section webcontent-spacer">
        <Grid columns={4}>
          <Grid.Row>
            <Grid.Column>
              <h3>Dashboard</h3>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default Invest;
