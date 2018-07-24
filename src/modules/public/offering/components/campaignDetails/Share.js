import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Header, Icon, Modal, Input } from 'semantic-ui-react';

const shareVia = [
  {
    icon: 'default', title: 'Email', action: '', name: 'envelope outline',
  },
  {
    icon: 'in-color', title: 'LinkedIn', action: '', name: 'linkedin in',
  },
  {
    icon: 'tw-color', title: 'Twitter', action: '', name: 'twitter',
  },
  {
    icon: 'fb-color', title: 'Facebook', action: '', name: 'facebook f',
  },
];
export default class Share extends Component {
  render() {
    return (
      <Modal open size="tiny" onClose={this.props.history.goBack} className="share-modal">
        <Header as="h5">
        Share
        </Header>
        <Modal.Content>
          <div className="share-icons">
            {
              shareVia.map(share => (
                <Link to="/"><Icon name={share.name} circular className={share.icon} />{share.title}</Link>
              ))
            }
          </div>
          <Input disabled action={{ color: 'green', content: 'COPY' }} fluid value="https://nextseed.com/offerings/buffbrew-taproom" />
        </Modal.Content>
      </Modal>
    );
  }
}
