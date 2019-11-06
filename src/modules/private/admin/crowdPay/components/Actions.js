import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Table, Button, Checkbox } from 'semantic-ui-react';
import { capitalize, get } from 'lodash';
import { Link, withRouter } from 'react-router-dom';
import { DEV_FEATURE_ONLY } from '../../../../../constants/common';
import { CROWDPAY_ACCOUNTS_STATUS } from '../../../../../services/constants/crowdpayAccounts';
import Helper from '../../../../../helper/utility';
@inject('crowdpayStore', 'identityStore', 'userDetailsStore')
@withRouter
@observer
export default class Actions extends Component {
  state = {
    skipCip: false,
  };

  ctaHandler = (e, userId, accountId, action, msg) => {
    e.preventDefault();
    const availableActions = ['APPROVE', 'DECLINE', 'EMAIL', 'GSPROCESS', 'VALIDATE', 'CREATEACCOUNT'];
    const attrObj = { userId, accountId, action, msg };
    this.props.crowdpayStore.addLoadingCrowdPayId(accountId);
    if (action === 'CREATEACCOUNT') {
      const { detailsOfUser, selectedUserId } = this.props.userDetailsStore;
      if (selectedUserId === '' || selectedUserId !== userId) {
        this.props.userDetailsStore.getUserProfileDetails(userId).then((data) => {
          this.checkCipBeforeSubmitInvestor(get(data, 'user'), attrObj);
        });
      } else if (get(detailsOfUser, 'data.user')) {
        this.checkCipBeforeSubmitInvestor(get(detailsOfUser, 'data.user'), attrObj);
      }
    } else if (availableActions.includes(action)) {
      this.props.crowdPayCtaHandler(userId, accountId, action, msg, this.state.skipCip === accountId);
    } else {
      this.props.history.push(`${this.props.match.url}/${action}`);
    }
  }

  handleVerifyUserIdentity = async (userId, accountId, action, msg) => {
    const { res } = await this.props.identityStore.verifyCip(true);
    const { requestId, message } = res.data.verifyCip;
    if (requestId && !message) {
      this.props.crowdPayCtaHandler(userId, accountId, action, msg, this.state.skipCip === accountId);
    } else {
      if (message) {
        Helper.toast(message, 'error');
      }
      this.props.crowdpayStore.removeLoadingCrowdPayId(accountId, this.props.account.accountStatus);
    }
  }

  checkCipBeforeSubmitInvestor = (userObj, attrObj) => {
    const { userId, accountId, action, msg } = attrObj;

    if (this.isCipExpired(userObj)
      || userObj.legalDetails.status === 'OFFLINE') {
      this.handleVerifyUserIdentity(userId, accountId, action, msg);
    } else {
      this.props.crowdPayCtaHandler(userId, accountId, action, msg, this.state.skipCip === accountId);
    }
  }

  skipCipChange = (e, result, accountId) => {
    e.preventDefault();
    this.setState({ skipCip: result.checked ? accountId : false });
  }

  isCipExpired = (userObj) => {
    if (userObj && userObj.cip) {
      const { expiration } = userObj.cip;
      const expirationDate = new Date(expiration);
      const currentDate = new Date();
      if (expirationDate < currentDate) {
        return true;
      }
    }
    return false;
  }

  openModal(e, userId, accountId, action) {
    this.props.history.push(`/${userId}/${accountId}/${action}`);
  }

  render() {
    const {
      type, refLink, account,
    } = this.props;
    const {
      accountId, accountStatus, approved, userId, declined,
    } = account;
    const { loadingCrowdPayIds } = this.props.crowdpayStore;
    const isGsProcess = accountStatus === CROWDPAY_ACCOUNTS_STATUS.GS_PROCESSING;
    const isAccProcess = accountStatus === CROWDPAY_ACCOUNTS_STATUS.ACCOUNT_PROCESSING;
    const isDeclined = accountStatus === CROWDPAY_ACCOUNTS_STATUS.DECLINED
      || (accountStatus === CROWDPAY_ACCOUNTS_STATUS.FROZEN && declined);
    const urlPara = `${refLink}/${userId}/${accountId}`;
    const isDisabled = loadingCrowdPayIds.includes(accountId);
    return (
      <>
        <Table.Cell collapsing textAlign="center">
          <Button.Group vertical compact size="mini">
            {!isDeclined
              ? (
                <>
                  {!approved && type === 'review'
                    && <Button disabled={isDisabled} onClick={e => this.openModal(e, userId, accountId, 'APPROVE', 'Crowdpay account is approved successfully.')} as={Link} to={`${urlPara}/APPROVE`} color="green">Approve</Button>
                  }
                  {type !== 'review' && type !== 'individual' && !isGsProcess && !isAccProcess
                    && <Button disabled={isDisabled} onClick={e => this.openModal(e, userId, accountId, 'GSPROCESS', 'Crowdpay account successfully processed for gold star.')} as={Link} to={`${urlPara}/GSPROCESS`} color={isGsProcess ? 'gray' : 'green'}>{isGsProcess ? 'Processing' : 'GS Process'}</Button>
                  }
                  {!isAccProcess
                    && (
                      <Button
                        disabled={isDisabled}
                        onClick={
                          e => this.openModal(e, userId, accountId, type === 'review' ? 'DECLINE' : 'ACCOUNT_DECLINE', 'Crowdpay account is declined successfully.')
                        }
                        as={Link}
                        to={`${urlPara}/${type === 'review' ? 'DECLINE' : 'ACCOUNT_DECLINE'}`}
                        color="red"
                      >
                        Decline
                  </Button>
                    )
                  }
                  {!isAccProcess && type === 'individual'
                    && (
                      <>
                        <Button disabled={isDisabled} onClick={e => this.ctaHandler(e, userId, accountId, 'VALIDATE', 'Crowdpay account is validated successfully.')} as={Link} to={`${urlPara}/VALIDATE`} className="inverted" color="blue">Validate</Button>
                        {
                          DEV_FEATURE_ONLY && (
                            <Checkbox
                              name="skip-cip"
                              onChange={(e, result) => this.skipCipChange(e, result, accountId)}
                              className="mt-half"
                              label="Skip CIP"
                              disabled={isDisabled}
                            />
                          )}

                      </>
                    )
                  }
                  {isAccProcess
                    && <Button disabled={isDisabled} onClick={e => this.ctaHandler(e, userId, accountId, 'CREATEACCOUNT', `${capitalize(type)} account is Created successfully.`)} as={Link} to={`${urlPara}/CREATEACCOUNT`} className="inverted" color="blue">Create</Button>
                  }
                  {type !== 'review' && isGsProcess
                    && <Button disabled={isDisabled} onClick={e => this.ctaHandler(e, userId, accountId, 'VALIDATE', 'Crowdpay account is validated successfully.')} as={Link} to={`${urlPara}/VALIDATE`} className="inverted" color="blue">Validate</Button>
                  }
                </>
              )
              : (
                <>
                  <Button disabled={isDisabled} onClick={e => this.ctaHandler(e, userId, accountId, 'RESTORE', 'Crowdpay account is restored successfully.')} as={Link} to={`${urlPara}/RESTORE`} color="blue">Restore</Button>
                  <Button disabled={isDisabled} onClick={e => this.ctaHandler(e, userId, accountId, 'DELETE', 'Crowdpay account is deleted successfully.')} as={Link} to={`${urlPara}/DELETE`} color="red">Delete</Button>
                </>
              )
            }
          </Button.Group>
        </Table.Cell>

      </>
    );
  }
}
