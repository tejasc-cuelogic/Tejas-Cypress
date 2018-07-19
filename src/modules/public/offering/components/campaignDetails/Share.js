import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Header, Icon, Modal, Input } from 'semantic-ui-react';

const shareVia = [
  { icon: 'default', title: 'Email', action: '' },
  { icon: 'in-color', title: 'LinkedIn', action: '' },
  { icon: 'tw-color', title: 'Twitter', action: '' },
  { icon: 'fb-color', title: 'Facebook', action: '' },
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
                <Link to="/"><Icon circular className={share.icon} />{share.title}</Link>
              ))
            }
          </div>
          <Input disabled action={{ color: 'green', content: 'COPY' }} fluid value="https://nextseed.com/offerings/buffbrew-taproom" />
        </Modal.Content>
      </Modal>
    );
  }
}
