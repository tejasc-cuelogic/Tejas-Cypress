import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Header, Modal, Grid, Image } from 'semantic-ui-react';
import { InlineLoader } from '../../../../theme/shared';
import emptyHeroImagePlaceholder from '../../../../assets/images/gallery-placeholder.jpg';

const isMobile = document.documentElement.clientWidth < 768;

@inject('campaignStore')
@observer
class LocationAnalysisModal extends Component {
  handleClose = () => this.props.history.goBack();

  render() {
    const { campaign } = this.props.campaignStore;
    // const emptyStatement = 'Detail not found';
    return (
      <Modal
        open
        onClose={this.handleClose}
        closeIcon
        size="large"
      >
        <Header as="h3">
          Location Analysis
        </Header>
        <Modal.Content scrolling>
          <Grid>
            <Grid.Row>
              <Grid.Column computer={6} tablet={6} mobile={16} className={isMobile && 'mb-30'}>
                <Image
                  src={
                    campaign.media.locationHeroImage &&
                    campaign.media.locationHeroImage.url ?
                      campaign.media.locationHeroImage.url : emptyHeroImagePlaceholder
                  }
                />
              </Grid.Column>
              <Grid.Column computer={10} tablet={10} mobile={16}>
                {
                  campaign && campaign.offering
                  && campaign.offering.about
                  && campaign.offering.about.locationAnalysis ?
                    <p
                      dangerouslySetInnerHTML={
                        {
                          __html: campaign.offering.about.locationAnalysis,
                        }
                      }
                    /> : <InlineLoader text="No data found." />
                }
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Modal.Content>
      </Modal>
    );
  }
}

export default LocationAnalysisModal;
