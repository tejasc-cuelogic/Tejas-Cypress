import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Aux from 'react-aux';
// Grid, Embed
import { Modal, Header, List, Icon, Image, Divider } from 'semantic-ui-react';
import campainAboutImg from '../../../../../assets/images/campaign_about.jpg';
// import videoPoster from '../../../../../assets/images/636206632.jpg';

// const nsvideos = {
//   embed: '218642510',
// };

@inject('campaignStore')
@observer
class CompanyDescriptionModal extends Component {
  handleClose = () => this.props.history.goBack();

  render() {
    const { campaign } = this.props.campaignStore;
    const emptyStatement = 'Detail not found';
    const emptyHistoryStatement = 'History not found';
    return (
      <Modal
        open
        onClose={this.handleClose}
        size="large"
        closeIcon
      >
        <Modal.Header>Company Description</Modal.Header>
        <Modal.Content>
          <Header as="h4">Buffbrew Taproom LLC</Header>
          {
            campaign.offering.about.theCompany !== null ?
              <p className="detail-section" dangerouslySetInnerHTML={{ __html: campaign && campaign.offering && campaign.offering.about && campaign.offering.about.theCompany }} />
              :
              <p>{emptyStatement}</p>
          }
          {/* <Divider section />
          <Grid columns={2} stackable>
            <Grid.Column verticalAlign="middle" textAlign="center">
              <p>
                Over the years, Buffbrew has developed a lineup of products that has drawn an
                adventurous community. Its brewing methods have applied cutting-edge technology,
                technique and unique flavor profiles to achieve a unique and superior taste that
                the team is extremely proud of. As important, its self-distributing model gives
                the business a degree of independence and control over its product that no other
                Houston brewery has matched.
              </p>
            </Grid.Column>
            <Grid.Column>
              <Embed
                id={nsvideos.embed}
                placeholder={videoPoster}
                source="vimeo"
                icon="ns-play"
              />
            </Grid.Column>
          </Grid> */}
          <Divider section />

          {
            campaign.media.heroImage.isPublic === true ?
              <Aux>
                <p>
                  The new Sawyer Yards location will allow Buffbrew the space to make beer and host
                  guests in a beautifully and thoughtfully designed home. Standing three stories
                  tall with over 28,000 square feet, the brewery will welcome a steady flow of beer
                  enthusiasts, 7 days a week. The cornerstone of this experience will be the
                  state-of-the-art Buffbrew Taproom, with over 40 beers on tap and a full-service
                  kitchen serving up an elevated bar food menu.
                </p>
                <Image src={campainAboutImg} fluid centered className="mt-30" />
                <p className="caption-note mb-30">
                  Caption. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
                  dignissim vitae odio nec pellentesque.
                </p>
                <p>
                  The team’s partnership with Method Architecture has been a process in staying true
                  to the beloved elements of Buffbrew’s current home on Nolda Street – an immersive,
                  picnic-tables-on-concrete feel – while creating a new, unparalleled scenic view.
                </p>
                <p>
                  The main taproom will reside on the second floor. On one side, customers will be
                  met with 30 feet of large, plate glass windows that directly overlook the tanks
                  and brewers at work – a true tank-to-table, or tank-to-tap, experience. In line
                  with its “Urban Brewery” designation, taproom patrons will also face magnificent
                  Houston views with over 50 feet of downtown-facing windows. With no taller
                  buildings standing between the brewery and downtown, the city’s skyline will make
                  for a beautiful backdrop for private events, holidays, and any other reason to
                  spend an evening on the rooftop patio or party room.
                </p>
              </Aux> : ''
          }
          <div className="history-section">
            <Header as="h4">History</Header>
            {
              campaign.offering.about.history.length > 0 ?
                <List>
                  {
                    campaign.offering.about.history.map(data => (
                      <List.Item className="mb-10">
                        <Icon className="ns-flag-line" color="green" />
                        <List.Content>
                          <List.Header>{data.date}</List.Header>
                          <List.Description>
                            {data.description}
                          </List.Description>
                        </List.Content>
                      </List.Item>
                    ))
                  }
                </List>
                :
                <p>{emptyHistoryStatement}</p>
            }
          </div>
        </Modal.Content>
      </Modal>
    );
  }
}

export default CompanyDescriptionModal;
