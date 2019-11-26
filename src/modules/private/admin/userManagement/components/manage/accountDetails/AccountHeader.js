import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { includes, startCase, get } from 'lodash';
import { Header, Icon, Button, Divider, Popup } from 'semantic-ui-react';
import { withRouter, Link } from 'react-router-dom';

@inject('userDetailsStore', 'uiStore', 'userStore', 'accountStore')
@withRouter
@observer
export default class AccountHeader extends Component {
  toggleConfirmModal = (e, action) => {
    e.preventDefault();
    this.props.history.push(`${this.props.pathname}/${action}`);
  }

  freezeAccountToggle = (userId, accountId, freeze) => {
    this.props.userDetailsStore.freezeAccountToggle(userId, accountId, freeze);
  }

  render() {
    const { inProgress } = this.props.uiStore;
    const loadingVal = Boolean(inProgress);
    const {
      currentActiveAccountDetailsOfSelectedUsers,
    } = this.props.userDetailsStore;
    const accountStatus = get(currentActiveAccountDetailsOfSelectedUsers, 'details.accountStatus');
    const accountType = includes(this.props.pathname, 'individual') ? 'individual' : includes(this.props.pathname, 'ira') ? 'ira' : 'entity';
    const access = this.props.userStore.myAccessForModule('USERS');
    const isFullAccessUser = access.level === 'FULL';
    const { isAccFrozen } = this.props.accountStore;
    const freezeAccObj = { HARD_FREEZE: { btnText: 'Hard Freeze' }, SOFT_FREEZE: { btnText: 'Soft Freeze' } };
    return (
      <>
        <div className="clearfix">
          <span className="pull-left">
            <Header as="h4">
              <Icon className={`ns-${accountType.toLocaleLowerCase()}-line`} color="green" />{(accountType === 'ira') ? accountType.toUpperCase() : startCase(accountType)} {this.props.module || ''}
            </Header>
          </span>
          {this.props.showFreezeCTA
            && (
              <>
                <span className="pull-right">
                  <Button.Group compact size="tiny">
                    {(!isAccFrozen(accountStatus))
                      && Object.keys(freezeAccObj).map(accStatus => (
                        <Popup
                          position="top center"
                          content={(
                            <ul>
                              <li>Cannot make comments on an offering <b>(NEW) </b></li>
                              <li>Cannot make investments</li>
                              <li>Cannot updates to investments</li>
                              <li>Cannot make deposits</li>
                              <li> {accStatus === 'HARD_FREEZE' ? 'Cannot' : 'Can make'} withdraw (this is the ONLY difference between soft/hard freeze)</li>
                              <li>Can cancel a reservation</li>
                              <li>Can make change linked bank account requests</li>
                            </ul>
                          )}
                          trigger={
                            <Button loading={loadingVal} secondary onClick={e => this.toggleConfirmModal(e, accStatus)}><Icon className="ns-freeze" />{freezeAccObj[accStatus].btnText}</Button>
                          }
                        />
                      ))
                    }


                    {isAccFrozen(accountStatus)
                      && <Button loading={loadingVal} secondary onClick={e => this.toggleConfirmModal(e, 'UNFREEZE')}><Icon className="ns-freeze" />Unfreeze</Button>
                    }

                    {(isFullAccessUser)
                      && <Button loading={loadingVal} secondary onClick={e => this.toggleConfirmModal(e, 'close-account')}>Close account</Button>
                    }
                  </Button.Group>
                </span>
              </>
            )
          }
          {this.props.showAddWithdrawFundCta
            && (
              <span className="pull-right">
                <Button.Group floated="right" compact size="tiny">
                  <Button as={Link} to={`${this.props.refLink}/addfunds`} primary>Add Funds</Button>
                  <Button as={Link} to={`${this.props.refLink}/withdraw-funds`} primary>Withdraw Funds</Button>
                </Button.Group>
              </span>
            )
          }
        </div>
        <Divider hidden />
      </>
    );
  }
}
