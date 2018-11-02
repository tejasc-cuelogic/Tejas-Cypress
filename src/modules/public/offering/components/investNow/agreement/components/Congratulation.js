import React from 'react';
import Aux from 'react-aux';
import { inject, observer } from 'mobx-react';
import { Link, withRouter } from 'react-router-dom';
import { Modal, Header, Button, Icon, Divider } from 'semantic-ui-react';
import Firework from './FireworkAnimation';
import Helper from '../../../../../../../helper/utility';

@inject('investmentStore', 'uiStore')
@withRouter
@observer
export default class Congratulation extends React.Component {
  state = {
    showFireworks: false,
  }
  componentWillMount() {
    if (this.props.changeInvestment) {
      this.props.uiStore.setFieldvalue('showFireworkAnimation', true);
    } else {
      this.setState({ showFireworks: true });
    }
  }
  handleCloseModal = () => {
    this.props.history.push('overview');
  }
  render() {
    const { investmentAmount } = this.props.investmentStore;
    setTimeout(() => {
      if (this.props.changeInvestment) {
        this.props.uiStore.setFieldvalue('showFireworkAnimation', false);
      } else {
        this.setState({ showFireworks: false });
      }
    }, 8500);
    return (
      <Aux>
        {this.state.showFireworks &&
        <Firework />
        }
        <Modal open closeIcon closeOnRootNodeClick={false} onClose={this.handleCloseModal}>
          <Modal.Header className="center-align signup-header">
            <Header as="h2">Congratulations!</Header>
            <Header as="h3">You have invested <span className="positive-text">{Helper.CurrencyFormat(investmentAmount)}</span> in Pour Behavior.</Header>
          </Modal.Header>
          <Modal.Content className="signup-content center-align">
            <p>
            Now, earn an additional $20 credit by giving $20. Invite your
            friends to build the community together, and you both earn credits.
            </p>
            <Divider hidden />
            <div className="center-align">
              <Button
                primary
                onClick={this.handleCloseModal}
              >Give $20 & Get $20
              </Button>
            </div>
            <Divider hidden />
            <Link to="/app/summary" className="text-link">
              <Icon className="ns-arrow-right" color="green" />
              Go to My Accounts
            </Link>
            {/* <List horizontal className="learn-more-list mt-30">
              <List.Item>
                <List.Icon className="ns-arrow-right" color="green" />
                <List.Content as={Link} to="/app/summary">Go to My Account</List.Content>
              </List.Item>
            </List> */}
          </Modal.Content>
        </Modal>
      </Aux>
    );
  }
}
