import React, { Component } from 'react';
// import Aux from 'react-aux';
import { inject } from 'mobx-react';
import { Grid, Header, Segment, Image } from 'semantic-ui-react';
// import businessModel from '../../../../../assets/images/investment-1.jpg';
import businessModel from '../../../../../assets/images/investment-2.jpg';
import TermNoteDetails from './investmentDetails/TermNoteDetails';
import RevenueSharingDetails from './investmentDetails/RevenueSharingDetails';

@inject('campaignStore')
class InvestmentDetails extends Component {
  render() {
    const { campaign } = this.props.campaignStore;

    return (
      <div className="campaign-content-wrapper">
        <Grid>
          <Grid.Row>
            <Grid.Column widescreen={7} computer={8}>
              <Segment padded>
                <Header as="h3">Use of Proceeds</Header>
                <p>
                  BuffBrew expects the complete buildout of the new building and brewery to be a
                  $14 million project. The scope of the Buffbrew Taproom is $3.4 million. Buffbrew
                  is committed to financing the total project, while opening up a portion of the
                  financing for BuffBrew Taproom through NextSeed.
                </p>
                <p>
                  100% of the funding proceeds will be used towards the buildout of the new
                  Buffbrew Taproom facility. The spend includes construction as well as the
                  purchasing of equipment, furniture and supplies.
                </p>
              </Segment>
            </Grid.Column>
            <Grid.Column widescreen={9} computer={8}>
              <Segment padded>
                <Image src={businessModel} fluid />
              </Segment>
            </Grid.Column>
          </Grid.Row>
          {campaign.investmentType === 'Revenue Sharing' ?
            <RevenueSharingDetails {...this.props} /> : <TermNoteDetails {...this.props} />
          }
        </Grid>
      </div>
    );
  }
}

export default InvestmentDetails;
