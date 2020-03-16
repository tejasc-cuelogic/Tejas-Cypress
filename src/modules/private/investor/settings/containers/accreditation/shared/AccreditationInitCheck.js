import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Header, Grid, Button } from 'semantic-ui-react';

const isMobile = document.documentElement.clientWidth < 768;

@withRouter
@inject('accreditationStore')
@observer
export default class AccreditationInitCheck extends Component {
  render() {
    return (
      <div>
        <Grid centered stackable className={isMobile ? 'full-width mt-0' : 'mt-0'}>
            <Grid.Column mobile={16} tablet={12} computer={8} className="pt-0">
            <Header as="h5" className={isMobile ? 'plr-0' : ''}>Verify your Accredited Investor Status</Header>
            <p>
              To invest in Regulation D offering on the NextSeed platform,
               we are required to verify your status as an accredited investor
                using standards put into place by the SEC.
            </p>
            <Button onClick={this.handleVerifyAccreditationSteps} primary content="Continue" />
            </Grid.Column>
          </Grid>
      </div>
    );
  }
}
