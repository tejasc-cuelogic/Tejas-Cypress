import React, { Component } from 'react';
import { Header, Modal, Grid, Image, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import team1 from '../../../../assets/images/team1.jpg';
import team2 from '../../../../assets/images/team2.jpg';

class MeetTeamModal extends Component {
  handleClose = () => this.props.history.goBack();

  render() {
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
            <Grid.Column>
              <Image src={team1} fluid />
            </Grid.Column>
            <Grid.Column className="padded team-details-container">
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
                <Link to="/" className="icon-link">
                  <Icon color="green" name="twitter" />
                </Link>
                <Link to="/" className="icon-link">
                  <Icon color="green" name="linkedin in" />
                </Link>
              </div>
            </Grid.Column>
            <Grid.Column className="padded team-details-container">
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
                <Link to="/" className="icon-link">
                  <Icon color="green" name="twitter" />
                </Link>
                <Link to="/" className="icon-link">
                  <Icon color="green" name="linkedin in" />
                </Link>
              </div>
            </Grid.Column>
            <Grid.Column>
              <Image src={team2} fluid />
            </Grid.Column>
          </Grid>
        </Modal.Content>
      </Modal>
    );
  }
}

export default MeetTeamModal;
