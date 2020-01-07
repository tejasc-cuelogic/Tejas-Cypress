import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
import { inject } from 'mobx-react';
import { Header, Modal, Item } from 'semantic-ui-react';
import { Image64 } from '../../../../theme/shared';

const isMobile = document.documentElement.clientWidth < 768;
@inject('teamStore')
class TeamModal extends Component {
  render() {
    const { teamMembers } = this.props.teamStore;
    const { id } = this.props;
    const member = teamMembers.find(obj => obj.id === id);
    // const types = { FACEBOOK: 'facebook f', LINKEDIN: 'linkedin in' };
    return (
      <Modal
        closeIcon
        size="large"
        trigger={this.props.trigger}
        className="team-member-modal"
      >
        {isMobile
          && <Modal.Header>Meet our team</Modal.Header>
        }
        <Modal.Content scrolling={isMobile}>
          <Item.Group>
            <Item>
              <Image64
                srcUrl={member.avatar}
                alt={member.memberName}
              />
              <Item.Content verticalAlign="middle" className="team-details-container">
                <div className={isMobile ? '' : 'scrollable-content'}>
                  <Header as="h4">
                    {member.memberName}
                    <Header.Subheader>{member.title}</Header.Subheader>
                  </Header>
                  <p>
                    {member.story}
                  </p>
                  {/* <Divider hidden />
                    <div>
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
