import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Header, Modal, Item, Image, Icon } from 'semantic-ui-react';

class TeamModal extends Component {
  state = {
    modalOpen: true,
  }
  handleClose = () => this.props.history.push(this.props.refLink)

  render() {
    const { member } = this.props;
    const types = {
      FACEBOOK: 'facebook f',
      LINKEDIN: 'linkedin in',
    };
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
              <Image src={member.avatar} />
              <Item.Content verticalAlign="middle">
                <div className="scrollable-content">
                  <Header as="h4">
                    {member.memberName}
                    <Header.Subheader>{member.title}</Header.Subheader>
                  </Header>
                  <p>
                    {member.story}
                  </p>
                  <div>
                    {member.social.map(stype => (
                      <Link to={stype.url === null ? '/' : stype.url}>
                        <Icon
                          color="green"
                          name={types[stype.type] || stype.type.toLowerCase()}
                        />
                      </Link>
                    ))
                    }
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
