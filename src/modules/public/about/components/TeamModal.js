import React, { Component } from 'react';
import { Header, Modal, Item, Image, Icon } from 'semantic-ui-react';
import campainAboutImg from '../../../../assets/images/campaign_about.png';

class TeamModal extends Component {
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
        className="team-member-modal"
      >
        <Modal.Content className="team-details-container">
          <Item.Group>
            <Item>
              <Image src={campainAboutImg} />
              <Item.Content verticalAlign="middle">
                <div className="scrollable-content">
                  <Header as="h4">
                    Abe Chu
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
                </div>
              </Item.Content>
            </Item>
          </Item.Group>
        </Modal.Content>
      </Modal>
    );
  }
}

export default TeamModal;
