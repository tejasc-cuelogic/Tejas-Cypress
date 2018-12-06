import React, { Component } from 'react';
import Aux from 'react-aux';
import { inject, observer } from 'mobx-react';
import { filter } from 'lodash';
import { Header, Modal, Grid, Image, Icon, Responsive } from 'semantic-ui-react';
import { InlineLoader } from '../../../../theme/shared';
import { ASSETS_URL } from '../../../../constants/aws';

@inject('campaignStore')
@observer
class MeetTeamModal extends Component {
  handleClose = () => this.props.history.goBack();
  render() {
    const { campaign } = this.props.campaignStore;
    const emptyStatement = 'Detail not found';
    const leadershipArr = campaign && campaign.leadership && campaign.leadership.length ?
      campaign.leadership : [];
    const meetTeamOjb = filter(leadershipArr, o => (
      o.isPublic
    ));
    return (
      <Modal
        open
        onClose={this.handleClose}
        closeIcon
        size="large"
      >
        <Header as="h3">
          Meet the Team
        </Header>
        <Modal.Content scrolling>
          <Grid doubling columns={2} className="compact" verticalAlign="middle">
            {
              meetTeamOjb.length ?
                meetTeamOjb.map((data, index) => (
                  (index === 0 || index % 2 === 0) ?
                    <Aux>
                      <Grid.Column>
                        <Image
                          src={
                            data && data.uploads && data.uploads.heroImage &&
                              data.uploads.heroImage.url ?
                              data.uploads.heroImage.url : `${ASSETS_URL}images/gallery-placeholder.jpg`
                          }
                          fluid
                        />
                      </Grid.Column>
                      <Grid.Column className="padded team-details-container">
                        <Header as="h3">
                          {`${data.firstName} ${data.lastName}`}
                          <Header.Subheader>{data.companyPosition}</Header.Subheader>
                        </Header>
                        <p>{data.bio && data.bio !== '' ? data.bio : emptyStatement}</p>
                        <div>
                          {data && data.social &&
                            Object.keys(data.social).map(key => (
                              <a href={`https://${data.social[key]}`} target="_blank" rel="noopener noreferrer" className="icon-link">
                                <Icon color="green" name={key === 'website' ? 'globe in' : `${key} in`} />
                              </a>
                            ))
                          }
                        </div>
                      </Grid.Column>
                      <Responsive maxWidth={767} as={Aux}>
                        <Grid.Column>
                          <Image src={`${ASSETS_URL}images/gallery-placeholder.jpg`} fluid />
                        </Grid.Column>
                      </Responsive>
                    </Aux>
                    :
                    <Aux>
                      <Grid.Column className="padded team-details-container">
                        <Header as="h3">
                          {`${data.firstName} ${data.lastName}`}
                          <Header.Subheader>{data.companyPosition}</Header.Subheader>
                        </Header>
                        <p>{data.bio && data.bio !== '' ? data.bio : emptyStatement}</p>
                        <div>
                          {data && data.social &&
                            Object.keys(data.social).map(key => (
                              <a href={`https://${data.social[key]}`} target="_blank" rel="noopener noreferrer" className="icon-link">
                                <Icon color="green" name={key === 'website' ? 'globe in' : `${key} in`} />
                              </a>
                            ))
                          }
                        </div>
                      </Grid.Column>
                      <Responsive minWidth={768} as={Aux}>
                        <Grid.Column>
                          <Image
                            src={
                              data.uploads.heroImage.isPublic === true &&
                                data.uploads.heroImage.url != null ?
                                data.uploads.heroImage.url : `${ASSETS_URL}images/gallery-placeholder.jpg`
                            }
                            fluid
                          />
                        </Grid.Column>
                      </Responsive>
                    </Aux>
                ))
                :
                    <InlineLoader text={emptyStatement} />
            }
          </Grid>
        </Modal.Content>
      </Modal>
    );
  }
}

export default MeetTeamModal;
