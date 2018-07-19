import React, { Component } from 'react';
import { Header, Modal, Grid, Image, Icon } from 'semantic-ui-react';
import campainAboutImg from '../../../../assets/images/campaign_about.png';

class MeetTeamModal extends Component {
  state = { modalOpen: false }
  handleOpen = () => this.setState({ modalOpen: true })
  handleClose = () => this.setState({ modalOpen: false })

  render() {
    return (
      <Modal
        open={this.state.modalOpen}
        onClose={this.handleClose}
        closeIcon
        size="large"
      >
        <Header as="h3">
        Meet the Team
        </Header>
        <Modal.Content scrolling>
          <Grid doubling columns={2} className="compact" verticalAlign="middle">
            <Grid.Column>
              <Image src={campainAboutImg} />
            </Grid.Column>
            <Grid.Column className="padded">
              <Header as="h3">
                Rassul Zainfar
                <Header.Subheader>co-founder & ceo</Header.Subheader>
              </Header>
              <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit,
              sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
              </p>
              <div>
                <Icon color="green" name="twitter" />
                <Icon color="green" name="linkedin in" />
              </div>
            </Grid.Column>
            <Grid.Column className="padded">
              <Header as="h3">
                Alex Grigss
                <Header.Subheader>co-founder & Director of projects</Header.Subheader>
              </Header>
              <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit,
              sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
              </p>
              <div>
                <Icon color="green" name="twitter" />
                <Icon color="green" name="linkedin in" />
              </div>
            </Grid.Column>
            <Grid.Column>
              <Image src={campainAboutImg} />
            </Grid.Column>
          </Grid>
        </Modal.Content>
      </Modal>
    );
  }
}

export default MeetTeamModal;
