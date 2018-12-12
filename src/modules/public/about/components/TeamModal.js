import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
import { inject } from 'mobx-react';
import { Header, Modal, Item, Image, Divider } from 'semantic-ui-react';

const isMobile = document.documentElement.clientWidth < 768;
@inject('teamStore')
class TeamModal extends Component {
  state = {
    modalOpen: true,
  }
  handleClose = () => this.props.history.push(this.props.refLink)

  render() {
    const { teamMembers } = this.props.teamStore;
    const { match } = this.props;
    const member = teamMembers.find(obj => obj.id === match.params.id);
    // const types = { FACEBOOK: 'facebook f', LINKEDIN: 'linkedin in' };
    return (
      <Modal
        open={this.state.modalOpen}
        onClose={this.handleClose}
        closeIcon
        size="large"
        className="team-member-modal"
      >
        {isMobile &&
          <Modal.Header>Meet our team</Modal.Header>
        }
        <Modal.Content scrolling={isMobile}>
          <Item.Group>
            <Item>
              <Image src={member.avatar} />
              <Item.Content verticalAlign="middle" className="team-details-container">
                <div className={isMobile ? '' : 'scrollable-content'}>
                  <Header as="h4">
                    {member.memberName}
                    <Header.Subheader>{member.title}</Header.Subheader>
                  </Header>
                  <p>
                    {member.story}
                  </p>
                  <Divider hidden />
                  {/* <div>
                    {member.social.map(stype => (
                      <Link to={stype.url === null ? '/' : stype.url} className="icon-link">
                        <Icon
                          color="green"
                          name={types[stype.type] || stype.type.toLowerCase()}
                        />
                      </Link>
                    ))
                    }
                  </div> */}
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
