import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Header, Icon, Modal, Input } from 'semantic-ui-react';

class ShareModal extends Component {
  state = { modalOpen: false }
  handleOpen = () => this.setState({ modalOpen: true })
  handleClose = () => this.setState({ modalOpen: false })

  render() {
    return (
      <Modal
        open={this.state.modalOpen}
        size="tiny"
        className="share-modal"
      >
        <Header as="h5">
        Share
        </Header>
        <Modal.Content>
          <div className="share-icons">
            <Link to="/">
              <Icon name="envelope outline" circular className="default" />
              Email
            </Link>
            <Link to="/">
              <Icon circular className="fb-color" name="facebook f" />
              LinkedIn
            </Link>
            <Link to="/">
              <Icon circular className="tw-color" name="twitter" />
              Twitter
            </Link>
            <Link to="/">
              <Icon circular className="in-color" name="linkedin in" />
              Facebook
            </Link>
          </div>
          <Input action={{ color: 'green', content: 'COPY' }} fluid value="https://nextseed.com/offerings/buffbrew-taproom" />
        </Modal.Content>
      </Modal>
    );
  }
}

export default ShareModal;
