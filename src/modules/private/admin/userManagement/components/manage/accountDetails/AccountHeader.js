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
    const freezeAccObj = { SOFT_FREEZE: { btnText: 'Soft Freeze' }, HARD_FREEZE: { btnText: 'Hard Freeze' } };
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
                              {accStatus === 'HARD_FREEZE'
                                ? (
                                  <>
                                    <span><b>Hard Frozen Account</b></span>
                                    <li>Can NOT make comments on an offering <b>(NEW) </b></li>
                                    <li>Can NOT make investments || updates to investments</li>
                                    <li>Can NOT make deposits</li>
                                    <li>Can NOT make withdraw</li>
                                    <li>Can cancel a reservation</li>
                                    <li>Can make change linked bank account requests</li>
                                  </>
                                )
                                : (
                                  <>
                                    <span><b>Soft Frozen Account</b></span>
                                    <li>Same as Hard Freeze except for:</li>
                                    <li>Can make withdraw</li>
                                  </>
                                )
                              }
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
