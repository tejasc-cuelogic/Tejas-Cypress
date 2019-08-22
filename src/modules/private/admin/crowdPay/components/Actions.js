import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Table, Button } from 'semantic-ui-react';
import { capitalize, get } from 'lodash';
import { Link, withRouter } from 'react-router-dom';
import { CROWDPAY_ACCOUNTS_STATUS } from '../../../../../services/constants/crowdpayAccounts';

@inject('crowdpayStore', 'identityStore', 'userDetailsStore')
@withRouter
@observer
export default class Actions extends Component {
  ctaHandler = (e, userId, accountId, action, msg) => {
    e.preventDefault();
    const availableActions = ['APPROVE', 'DECLINE', 'EMAIL', 'GSPROCESS', 'VALIDATE', 'CREATEACCOUNT'];
    const attrObj = { userId, accountId, action, msg };
    this.props.crowdpayStore.addLoadingCrowdPayId(accountId);
    if (action === 'CREATEACCOUNT') {
      const { detailsOfUser, selectedUserId } = this.props.userDetailsStore;
      if (selectedUserId === '' || selectedUserId !== userId) {
        this.props.userDetailsStore.getUserProfileDetails(userId).then((data) => {
          this.checkRequestIdBeforeSubmitInvestor(get(data, 'user'), attrObj);
        });
      } else if (get(detailsOfUser, 'data.user')) {
        this.checkRequestIdBeforeSubmitInvestor(get(detailsOfUser, 'data.user'), attrObj);
      }
    } else if (availableActions.includes(action)) {
      this.props.crowdPayCtaHandler(userId, accountId, action, msg);
    } else {
      this.props.history.push(`${this.props.match.url}/${action}`);
    }
  }

  handleVerifyUserIdentity = (userId, accountId, action, msg) => {
    this.props.identityStore.verifyUserIdentity().then((requestId) => {
      if (requestId) {
        this.props.crowdPayCtaHandler(userId, accountId, action, msg);
      } else {
        this.props.crowdpayStore.removeLoadingCrowdPayId(accountId, this.props.account.accountStatus);
      }
    });
  }

  checkRequestIdBeforeSubmitInvestor = (userObj, attrObj) => {
    const { userId, accountId, action, msg } = attrObj;
    if (this.isCipExpired(userObj) || userObj.legalDetails.status === 'OFFLINE' || userObj.cip.requestId === '-1') {
      this.handleVerifyUserIdentity(userId, accountId, action, msg);
    } else {
      this.props.crowdPayCtaHandler(userId, accountId, action, msg);
    }
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
    return (
      <>
        <Table.Cell collapsing textAlign="center">
          <Button.Group vertical compact size="mini">
            {!isDeclined
              ? (
                <>
                  {!approved && type === 'review'
                && <Button disabled={loadingCrowdPayIds.includes(accountId)} onClick={e => this.openModal(e, userId, accountId, 'APPROVE', 'Crowdpay account is approved successfully.')} as={Link} to={`${urlPara}/APPROVE`} color="green">Approve</Button>
                }
                  {type !== 'review' && type !== 'individual' && !isGsProcess && !isAccProcess
                  && <Button disabled={loadingCrowdPayIds.includes(accountId)} onClick={e => this.openModal(e, userId, accountId, 'GSPROCESS', 'Crowdpay account successfully processed for gold star.')} as={Link} to={`${urlPara}/GSPROCESS`} color={isGsProcess ? 'gray' : 'green'}>{isGsProcess ? 'Processing' : 'GS Process'}</Button>
                }
                {!isAccProcess
                  && (
<Button
  disabled={loadingCrowdPayIds.includes(accountId)}
  onClick={
                      e => (type === 'review' ? this.openModal(e, userId, accountId, 'DECLINE', 'Crowdpay account is declined successfully.') : this.ctaHandler(e, userId, accountId, 'DECLINE_A', '.'))
                    }
  as={Link}
  to={`${urlPara}/DECLINE`}
  color="red"
>
                    Decline
                  </Button>
                  )
                }
                {!isAccProcess && type === 'individual'
                  && <Button disabled={loadingCrowdPayIds.includes(accountId)} onClick={e => this.ctaHandler(e, userId, accountId, 'VALIDATE', 'Crowdpay account is validated successfully.')} as={Link} to={`${urlPara}/VALIDATE`} className="inverted" color="blue">Validate</Button>
                }
                {isAccProcess
                  && <Button disabled={loadingCrowdPayIds.includes(accountId)} onClick={e => this.ctaHandler(e, userId, accountId, 'CREATEACCOUNT', `${capitalize(type)} account is Created successfully.`)} as={Link} to={`${urlPara}/CREATEACCOUNT`} className="inverted" color="blue">Create</Button>
                }
                {type !== 'review' && isGsProcess
                  && <Button disabled={loadingCrowdPayIds.includes(accountId)} onClick={e => this.ctaHandler(e, userId, accountId, 'VALIDATE', 'Crowdpay account is validated successfully.')} as={Link} to={`${urlPara}/VALIDATE`} className="inverted" color="blue">Validate</Button>
                }
                </>
              )
              : (
                <>
                  <Button disabled={loadingCrowdPayIds.includes(accountId)} onClick={e => this.ctaHandler(e, userId, accountId, 'RESTORE', 'Crowdpay account is restored successfully.')} as={Link} to={`${urlPara}/RESTORE`} color="blue">Restore</Button>
                  <Button disabled={loadingCrowdPayIds.includes(accountId)} onClick={e => this.ctaHandler(e, userId, accountId, 'DELETE', 'Crowdpay account is deleted successfully.')} as={Link} to={`${urlPara}/DELETE`} color="red">Delete</Button>
                </>
              )
            }
          </Button.Group>
        </Table.Cell>

      </>
    );
  }
}
