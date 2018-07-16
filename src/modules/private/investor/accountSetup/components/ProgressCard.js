import React from 'react';
import { isEmpty, upperCase } from 'lodash';
import { Card, Icon, Button } from 'semantic-ui-react';
import Helper from '../helper';

const progressMeta = Helper.Progress();

const checkStatus = (signupStatus, key) => {
  let status = false;
  if (key === 'contact-card') {
    if ((signupStatus.idVerification === 'PASS' || signupStatus.idVerification === 'MANUAL_VERIFICATION_PENDING') &&
      signupStatus.phoneVerification === 'DONE') {
      status = 2;
    } else {
      status = 1;
    }
  } else if (key === 'cash-dollar') {
    if ((signupStatus.idVerification === 'PASS' || signupStatus.idVerification === 'MANUAL_VERIFICATION_PENDING') &&
    signupStatus.phoneVerification === 'DONE') {
      status = 1;
    } else {
      status = 0;
    }
  } else if (key === 'bar-line-chart') {
    if ((signupStatus.idVerification === 'PASS' || signupStatus.idVerification === 'MANUAL_VERIFICATION_PENDING') &&
    signupStatus.phoneVerification === 'DONE') {
      status = 1;
    } else {
      status = 0;
    }
  }
  return status;
};

const ProgressCard = props => (
  <Card.Group stackable itemsPerRow={3}>
    {
      isEmpty(props.signupStatus.accounts) &&
      Object.keys(progressMeta).map((key) => {
        const currentCard = progressMeta[key];
        const status = checkStatus(props.signupStatus, key);
        return (
          <Card fluid className={`verification ${status === 2 ? 'done' : status === 0 ? 'disabled' : ''}`}>
            <Card.Content>
              <Icon.Group size="huge">
                <Icon className={`ns-${key}`} />
                <Icon corner color={status === 2 ? 'green' : status === 1 ? 'red' : ''} className={status === 0 ? '' : `ns-${status === 2 ? 'check' : 'warning'}-circle`} />
              </Icon.Group>
              <p><b>{status === 2 ? currentCard.successMsg : currentCard.label}</b></p>
              {status === 0 ?
                <p>
                  This option will be available
                  when you verify your identity
                </p> :
                status !== 2 ?
                  <Button
                    color="green"
                    content="Continue"
                    onClick={() => props.renderStep(currentCard.step)}
                  />
              :
                ''
              }
            </Card.Content>
          </Card>
        );
      })
    }
    {props.signupStatus.partialAccounts.length > 0 &&
      props.signupStatus.partialAccounts.map(accountType => (
        <Card fluid className={props.getStepStatus('accounts') === 'disable' ? 'verification disabled' : 'verification'}>
          <Card.Content>
            <Icon.Group size="huge">
              <Icon className="ns-bar-line-chart" />
            </Icon.Group>
            <p><b>{`You have not finished ${upperCase(accountType)} account creation`}</b></p>
            <Button
              color={props.getStepStatus('accounts') === 'disable' ? 'gray' : 'green'}
              className="relaxed"
              content="Continue"
              disabled={props.getStepStatus('accounts') === 'disable'}
              onClick={() => props.navToAccTypes(accountType)}
            />
          </Card.Content>
        </Card>
      ))
    }
    {!isEmpty(props.signupStatus.accounts) && props.signupStatus.inActiveAccounts.length > 0 &&
      <Card fluid className={props.getStepStatus('accounts') === 'disable' ? 'verification disabled' : 'verification'}>
        <Card.Content>
          <Icon.Group size="huge">
            <Icon className="ns-chart-setting" />
          </Icon.Group>
          <p><b>Start creation process of another type of account</b></p>
          <Button
            inverted
            color={props.getStepStatus('accounts') === 'disable' ? 'gray' : 'green'}
            content="Create another account"
            disabled={props.getStepStatus('accounts') === 'disable'}
            onClick={() => props.navToAccTypes()}
          />
        </Card.Content>
      </Card>
    }
  </Card.Group>
);

export default ProgressCard;
