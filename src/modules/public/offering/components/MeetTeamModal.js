import React, { Component } from 'react';
import Aux from 'react-aux';
import { inject, observer } from 'mobx-react';
import { Header, Modal, Grid, Image, Icon, Responsive } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import team1 from '../../../../assets/images/team1.jpg';
import team2 from '../../../../assets/images/team2.jpg';

@inject('campaignStore')
@observer
class MeetTeamModal extends Component {
  handleClose = () => this.props.history.goBack();
  render() {
    const { campaign } = this.props.campaignStore;
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
                      <Image src={team1} fluid />
                    </Grid.Column>
                    <Grid.Column className="padded team-details-container">
                      <Header as="h3">
                        {`${data.firstName} ${data.lastName}`}
                        <Header.Subheader>{data.companyPosition}</Header.Subheader>
                      </Header>
                      <p>{data.bio}</p>
                      <div>
                        {
                          Object.keys(data.social).map(key => (
                            <Link to={`${data.social[key]}`} className="icon-link">
                              <Icon color="green" name={`${key} in`} />
                            </Link>
                          ))
                        }
                      </div>
                    </Grid.Column>
                    <Responsive maxWidth={767} as={Aux}>
                      <Grid.Column>
                        <Image src={team2} />
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
                      <p>{data.bio}</p>
                      <div>
                        {
                          Object.keys(data.social).map(key => (
                            <Link to={`${data.social[key]}`} className="icon-link">
                              <Icon color="green" name={`${key} in`} />
                            </Link>
                          ))
                        }
                      </div>
                    </Grid.Column>
                    <Responsive minWidth={768} as={Aux}>
                      <Grid.Column>
                        <Image src={team2} />
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
