import React from 'react';
import { isEmpty } from 'lodash';
import { Card, Icon, Button } from 'semantic-ui-react';
import Helper from '../helper';

const progressMeta = Helper.Progress();

const checkStatus = (signupStatus, key, userDetailsStore) => {
  let status = false;
  if (key === 'contact-card') {
    if ((signupStatus.idVerification === 'PASS' || signupStatus.idVerification === 'MANUAL_VERIFICATION_PENDING') &&
      signupStatus.phoneVerification === 'DONE') {
      status = 2;
    } else if (signupStatus.isMigratedFullAccount &&
      signupStatus.isCipDoneForMigratedUser &&
      signupStatus.phoneVerification === 'DONE' && signupStatus.isEmailConfirmed) {
      status = 2;
    } else {
      status = 1;
    }
  } else if (key === 'cash-dollar') {
    if ((signupStatus.investorProfileCompleted && !signupStatus.isMigratedFullAccount)
    || (signupStatus.isMigratedFullAccount &&
    signupStatus.isCipDoneForMigratedUser &&
    signupStatus.phoneVerification === 'DONE' && signupStatus.isEmailConfirmed && signupStatus.investorProfileCompleted)) {
      status = 2;
    } else if (((signupStatus.idVerification === 'PASS' || signupStatus.idVerification === 'MANUAL_VERIFICATION_PENDING') &&
    signupStatus.phoneVerification === 'DONE') ||
    (signupStatus.isMigratedFullAccount && userDetailsStore.isBasicVerDoneForMigratedFullUser)
    ) {
      status = 1;
    } else {
      status = 0;
    }
  } else if (key === 'bar-line-chart') {
    if ((signupStatus.investorProfileCompleted && !signupStatus.isMigratedFullAccount) ||
      (signupStatus.isMigratedFullAccount &&
      signupStatus.isCipDoneForMigratedUser &&
      signupStatus.phoneVerification === 'DONE' &&
      signupStatus.isEmailConfirmed &&
      signupStatus.investorProfileCompleted
      )) {
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
      (isEmpty(props.signupStatus.activeAccounts)
      || (props.signupStatus.isMigratedFullAccount &&
        (!props.isBasicVerDoneForMigratedFullUser
        || !props.signupStatus.investorProfileCompleted)))
      && Object.keys(progressMeta).map((key) => {
        const currentCard = progressMeta[key];
        const status = checkStatus(props.signupStatus, key, props.userDetailsStore);
        // if (props.signupStatus.partialAccounts.length > 0 && currentCard.step === 2) {
        //   return null;
        // }
        /*
        * Condition added for migrated-user
        */
        const verificationStatus =
        props.userDetailsStore.validAccStatus.includes(props.signupStatus.idVerification) ||
        (props.signupStatus.isMigratedFullAccount &&
        (props.userDetailsStore.userDetails && props.userDetailsStore.userDetails.cip
        && props.userDetailsStore.userDetails.cip.requestId !== null));
        const isEmailVerified = props.signupStatus.isEmailConfirmed;
        /*
        * Condition added for migrated-user
        */
        const pathToRender = props.match.url.slice(-1) === '/' ? `${props.match.url}${currentCard.route}` :
        `${props.match.url}/${currentCard.route}`;
        const altPathToRender = props.match.url.slice(-1) === '/' ? `${props.match.url}${currentCard.altRoute}` :
        `${props.match.url}/${currentCard.altRoute}`;
        return (
          <Card fluid className={`verification ${status === 2 ? 'done' : status === 0 ? 'disabled' : ''}`}>
            <Card.Content>
              <Icon.Group size="huge">
                <Icon className={`ns-${key}`} />
                <Icon corner color={status === 2 ? 'green' : status === 1 ? 'red' : ''} className={status === 0 ? '' : `${status === 2 ? 'ns-check-circle' : ''}`} />
              </Icon.Group>
              <p><b>{currentCard.label}</b></p>
              {status === 2 ? <p>{currentCard.successMsg}</p> : '' }
              {status === 0 ?
                '' :
                status !== 2 ?
                  <Button
                    color="green"
                    content={currentCard.step === 2 ? 'Create' : 'Continue'}
                    onClick={() =>
                      (currentCard.step !== 0 ?
                        props.history.push(`${pathToRender}`) :
                        !isEmailVerified ?
                          props.history.push(currentCard.emailVerificationRoute) :
                        !verificationStatus
                          ? props.history.push(`${pathToRender}`) :
                          props.history.push(`${altPathToRender}`))
                    }
                  /> :
                  ''
              }
            </Card.Content>
          </Card>
        );
      })
    }
    {/* {props.signupStatus.partialAccounts.length > 0 &&
      props.signupStatus.partialAccounts.map(accountType => (
        <Card fluid className={props.getStepStatus('accounts') === 'disable'
          ? 'verification disabled' : 'verification'}>
          <Card.Content>
            <Icon.Group size="huge">
              <Icon className="ns-bar-line-chart" />
            </Icon.Group>
            <p><b>Create Investment Account</b></p>
            <Button.Group vertical>
              <Button
                color={props.getStepStatus('accounts') === 'disable' ? 'gray' : 'green'}
                // eslint-disable-next-line max-len
                content={`Continue ${accountType === 'ira' ?
                upperCase(accountType) : startCase(accountType)} Account Creation`}
                disabled={props.getStepStatus('accounts') === 'disable'}
                onClick={() => props.navToAccTypes(accountType)}
              />
              {!isEmpty(props.signupStatus.roles) &&
              props.signupStatus.inActiveAccounts.length > 0 &&
                <Button
                  className="link-button padded"
                  color="green"
                  content="or create a different investment account"
                  disabled={props.getStepStatus('accounts') === 'disable'}
                  onClick={() => props.navToAccTypes()}
                />
              }
            </Button.Group>
          </Card.Content>
        </Card>
      ))
    } */}
    {props.signupStatus.partialAccounts.length === 0 &&
    !isEmpty(props.signupStatus.roles) &&
    props.signupStatus.roles.length > 1 &&
    props.signupStatus.inActiveAccounts.length > 0 &&
      <Card fluid className={props.getStepStatus('accounts') === 'disable' ? 'verification disabled' : 'verification'}>
        <Card.Content>
          <Icon.Group size="huge">
            <Icon className="ns-bar-line-chart" />
          </Icon.Group>
          <p><b>Create Investment Account</b></p>
          <Button.Group vertical>
            <Button
              color={props.getStepStatus('accounts') === 'disable' ? 'gray' : 'green'}
              content="Continue Account Creation"
              disabled={props.getStepStatus('accounts') === 'disable'}
              onClick={() => props.navToAccTypes()}
            />
          </Button.Group>
        </Card.Content>
      </Card>
    }
  </Card.Group>
);

export default ProgressCard;
