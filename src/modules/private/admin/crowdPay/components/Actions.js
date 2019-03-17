import React, { Component } from 'react';
import { Table, Button } from 'semantic-ui-react';
import { Link, withRouter } from 'react-router-dom';
import Aux from 'react-aux';
import { CROWDPAY_ACCOUNTS_STATUS } from '../../../../../services/constants/crowdpayAccounts';

@withRouter
export default class Actions extends Component {
  ctaHandler = (e, userId, accountId, action, msg) => {
    e.preventDefault();
    const availableActions = ['APPROVE', 'DECLINE', 'EMAIL', 'GSPROCESS', 'VALIDATE', 'CREATEACCOUNT'];
    if (availableActions.includes(action)) {
      this.props.crowdPayCtaHandler(userId, accountId, action, msg);
    } else {
      this.props.history.push(`${this.props.match.url}/${action}`);
    }
  }
  render() {
    const {
      type, refLink, account, inProgress,
    } = this.props;
    const {
      accountId, accountStatus, approved, userId,
    } = account;
    const isGsProcess = accountStatus === CROWDPAY_ACCOUNTS_STATUS.GS_PROCESSING;
    const isAccProcess = accountStatus === CROWDPAY_ACCOUNTS_STATUS.ACCOUNT_PROCESSING;
    const declined = accountStatus === CROWDPAY_ACCOUNTS_STATUS.DECLINED;
    const urlPara = `${refLink}/${userId}/${accountId}`;
    return (
      <Table.Cell collapsing textAlign="center">
        <Button.Group vertical compact size="mini">
          {!declined ?
            <Aux>
              {!approved && type === 'review' &&
              <Button disabled={inProgress === accountId} onClick={e => this.ctaHandler(e, userId, accountId, 'APPROVE', 'Crowdpay account is approved successfully.')} as={Link} to={`${urlPara}/APPROVE`} color="green">Approve</Button>
              }
              {type !== 'review' && type !== 'individual' && !isGsProcess && !isAccProcess &&
                <Button disabled={inProgress === accountId} onClick={e => this.ctaHandler(e, userId, accountId, 'GSPROCESS', 'Crowdpay account successfully processed for gold star.')} as={Link} to={`${urlPara}/GSPROCESS`} color={isGsProcess ? 'gray' : 'green'}>{isGsProcess ? 'Processing' : 'GS Process'}</Button>
              }
              {!isAccProcess &&
                <Button disabled={inProgress === accountId} onClick={e => this.ctaHandler(e, userId, accountId, 'DECLINE', 'Crowdpay account is declined successfully.')} as={Link} to={`${urlPara}/DECLINE`} color="red">Decline</Button>
              }
              {!isAccProcess && type === 'individual' &&
                <Button disabled={inProgress === accountId} onClick={e => this.ctaHandler(e, userId, accountId, 'VALIDATE', 'Crowdpay account is validated successfully.')} as={Link} to={`${urlPara}/VALIDATE`} className="inverted" color="blue">Validate</Button>
              }
              {(type === 'individual' || type === 'ira') && isAccProcess &&
                <Button disabled={inProgress === accountId} onClick={e => this.ctaHandler(e, userId, accountId, 'CREATEACCOUNT', 'Crowdpay account is Created successfully.')} as={Link} to={`${urlPara}/CREATEACCOUNT`} className="inverted" color="blue">Create</Button>
              }
              {type !== 'review' && isGsProcess &&
                <Button disabled={inProgress === accountId} onClick={e => this.ctaHandler(e, userId, accountId, 'VALIDATE', 'Crowdpay account is validated successfully.')} as={Link} to={`${urlPara}/VALIDATE`} className="inverted" color="blue">Validate</Button>
              }
            </Aux> :
            <Aux>
              <Button disabled={inProgress === accountId} onClick={e => this.ctaHandler(e, userId, accountId, 'RESTORE', 'Crowdpay account is restored successfully.')} as={Link} to={`${urlPara}/RESTORE`} color="blue">Restore</Button>
              <Button disabled={inProgress === accountId} onClick={e => this.ctaHandler(e, userId, accountId, 'DELETE', 'Crowdpay account is deleted successfully.')} as={Link} to={`${urlPara}/DELETE`} color="red">Delete</Button>
            </Aux>
          }
        </Button.Group>
      </Table.Cell>
    );
  }
}
