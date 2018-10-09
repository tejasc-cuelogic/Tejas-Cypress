import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Header, Modal, Grid, Image } from 'semantic-ui-react';
import emptyHeroImagePlaceholder from '../../../../assets/images/gallery-placeholder.jpg';
// import ChartPie from './ChartPie';


// const CUSTOMER_DEMO_GENDER = [
//   { name: 'Male', value: 45 },
//   { name: 'Female', value: 55 },
// ];

// const CUSTOMER_DEMO_AGE = [
//   { name: '21-24', value: 20 },
//   { name: '25-34', value: 30 },
//   { name: '35-44', value: 20 },
//   { name: '45-54', value: 15 },
//   { name: '55+', value: 15 },
// ];

// const GENDER_COLORS = ['#20C86D', '#4DD38A'];
// const AGE_COLORS = ['#263E64', '#516583', '#7D8BA2', '#A8B2C1', '#D4D8E0'];
const isMobile = document.documentElement.clientWidth < 768;

@inject('campaignStore')
@observer
class LocationAnalysisModal extends Component {
  handleClose = () => this.props.history.goBack();

  render() {
    const { campaign } = this.props.campaignStore;
    const emptyStatement = 'Detail not found';
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
                {/* <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3782.8980695673813!2d73.87562555088532!3d18.53350778733976!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c0f824992459%3A0x4f126e7b4c0ac0f6!2sCuelogic+Technologies!5e0!3m2!1sen!2sin!4v1530687811942"
                  title="test"
                  height="100%"
                  width="100%"
                /> */}
              </Grid.Column>
              <Grid.Column computer={10} tablet={10} mobile={16}>
                {
                  campaign.offering.about.locationAnalysis !== null ?
                    <p
                      dangerouslySetInnerHTML={
                        {
                          __html: campaign && campaign.offering
                            && campaign.offering.about
                            && campaign.offering.about.locationAnalysis,
                        }
                      }
                    /> : <p>{emptyStatement}</p>
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
