import React from 'react';
import { Modal, Header, Button, List, Divider } from 'semantic-ui-react';

export default class Congratulation extends React.Component {
  handleCloseModal = () => {
    this.props.history.push('overview');
  }
  render() {
    return (
      <Modal open closeIcon closeOnRootNodeClick={false} onClose={this.handleCloseModal}>
        <Modal.Header className="center-align signup-header">
          <Header as="h2">Congratulations!</Header>
          <Header as="h3">You have invested <span className="positive-text">$300</span> in Pour Behavior.</Header>
        </Modal.Header>
        <Modal.Content className="signup-content center-align">
          <p>
          Now, earn an additional $20 credit by giving $20. Invite your
          friends to build the community together, and you both earn credits.
          </p>
          <Divider hidden />
          <div className="center-align">
            <Button primary onClick={this.handleCloseModal}>Give $20 & Get $20</Button>
          </div>
          <Divider hidden />
          <List horizontal className="learn-more-list mt-30">
            <List.Item>
              <List.Icon className="ns-arrow-right" color="green" />
              <List.Content as="a">Go to My Account</List.Content>
            </List.Item>
          </List>
        </Modal.Content>
      </Modal>
    );
  }
}
