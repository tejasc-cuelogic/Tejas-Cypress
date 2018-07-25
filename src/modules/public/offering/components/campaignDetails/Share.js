import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Header, Icon, Modal, Input } from 'semantic-ui-react';

const shareVia = [
  {
    class: 'default', title: 'Email', action: '', name: 'envelope outline',
  },
  {
    class: 'in-color', title: 'LinkedIn', action: '', name: 'linkedin in',
  },
  {
    class: 'tw-color', title: 'Twitter', action: '', name: 'twitter',
  },
  {
    class: 'fb-color', title: 'Facebook', action: '', name: 'facebook f',
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
          <div className="share-icons center-align">
            {
              shareVia.map(share => (
                <Link to="/"><Icon name={share.name} circular inverted className={share.class} size="big" />{share.title}</Link>
              ))
            }
          </div>
          <Input readOnly action={{ color: 'green', content: 'COPY' }} fluid value="https://nextseed.com/offerings/buffbrew-taproom" />
        </Modal.Content>
      </Modal>
    );
  }
}
