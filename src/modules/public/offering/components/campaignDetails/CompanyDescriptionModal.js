import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Aux from 'react-aux';
import { Modal, Header, List, Icon, Image, Divider } from 'semantic-ui-react';
import defaultLeaderProfile from '../../../../../assets/images/leader-placeholder.jpg';

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
        <Modal.Content scrolling>
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
          </Grid>
          <Divider section /> */}
          <Aux>
            {
              campaign.offering.about.theCompany !== null ?
                <p className="detail-section" dangerouslySetInnerHTML={{ __html: campaign && campaign.offering && campaign.offering.about && campaign.offering.about.theCompany }} />
                :
                <p>{emptyStatement}</p>
            }
            <Image
              src={
                campaign && campaign.media && campaign.media.heroImage
                  && campaign.media.heroImage.url ?
                  campaign.media.heroImage.url : defaultLeaderProfile
              }
              fluid
              centered
              className="mt-30"
            />
          </Aux>
          <Divider section />
          <div className="history-section">
            <Header as="h4">History</Header>
            {
              campaign.offering.about.history.length ?
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
