import React, { Component } from 'react';
import Aux from 'react-aux';
import { inject, observer } from 'mobx-react';
import { Header, Modal, Grid, Image, Icon, Responsive } from 'semantic-ui-react';
import emptyHeroImagePlaceholder from '../../../../assets/images/gallery-placeholder.jpg';

@inject('campaignStore')
@observer
class MeetTeamModal extends Component {
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
          Meet the Team
        </Header>
        <Modal.Content scrolling>
          <Grid doubling columns={2} className="compact" verticalAlign="middle">
            {
              campaign.leadership.map((data, index) => (
                (index === 0 || index % 2 === 0) ?
                  <Aux>
                    <Grid.Column>
                      <Image
                        src={
                          data.uploads.heroImage.isPublic === true &&
                            data.uploads.heroImage.url != null ?
                            data.uploads.heroImage.url : emptyHeroImagePlaceholder
                        }
                        fluid
                      />
                    </Grid.Column>
                    <Grid.Column className="padded team-details-container">
                      <Header as="h3">
                        {`${data.firstName} ${data.lastName}`}
                        <Header.Subheader>{data.companyPosition}</Header.Subheader>
                      </Header>
                      <p>{data.bio !== null && data.bio !== '' ? data.bio : emptyStatement }</p>
                      <div>
                        {
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
                        <Image src={emptyHeroImagePlaceholder} />
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
                      <p>{data.bio !== null && data.bio !== '' ? data.bio : emptyStatement }</p>
                      <div>
                        {
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
                              data.uploads.heroImage.url : emptyHeroImagePlaceholder
                          }
                        />
                      </Grid.Column>
                    </Responsive>
                  </Aux>
              ))
            }
          </Grid>
        </Modal.Content>
      </Modal>
    );
  }
}

export default MeetTeamModal;
