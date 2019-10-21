import React from 'react';
import { observer } from 'mobx-react';
import { Card, Statistic, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const stepinfo = {
  title: '',
  label: 'You’re a few steps away from being able to invest!',
};

const isMobile = document.documentElement.clientWidth < 768;

const checkStatus = (signupStatus, userDetailsStore) => {
  if ((signupStatus.idVerification !== 'PASS' && signupStatus.idVerification !== 'MANUAL_VERIFICATION_PENDING'
  && !signupStatus.isMigratedFullAccount)
  || (signupStatus.isMigratedFullAccount
    && !userDetailsStore.isBasicVerDoneForMigratedFullUser)) {
    stepinfo.title = 'Please verify your identity in order to proceed';
  } else if (signupStatus.phoneVerification !== 'DONE') {
    stepinfo.title = 'Please verify your identity in order to proceed';
  } else if (!signupStatus.investorProfileCompleted) {
    stepinfo.title = 'Get full access';
    stepinfo.label = 'To continue investing on Nextseed`s new Broker-Dealer platform, you`ll need to answer a few questions';
    stepinfo.btnText = 'Access';
    stepinfo.url = '/app/setup/establish-profile';
  } else {
    stepinfo.title = 'Complete your account setup';
    stepinfo.label = 'Finish setting up your account to start investing in local businesses';
    stepinfo.btnText = 'Continue';
    stepinfo.url = '/app/setup/account-creation';
  }
};

const StickyNotification = observer(({ signupStatus, userDetailsStore, isInvestor }) => {
  checkStatus(signupStatus, userDetailsStore);
  return (
    <div className={!isInvestor && 'top-cta-section'}>
      <div className={isInvestor ? 'closable-card' : 'sticky-notification'}>
        <Card fluid raised>
          <Card.Content>
            {!isInvestor && <Card.Meta>{stepinfo.group}</Card.Meta>}
            <Statistic size="mini" className="cta  acc-verify-status">
              {/* {isInvestor && <p className="intro-text text-uppercase"><b>{stepinfo.group}</b></p>} */}
              <Statistic.Value>{stepinfo.title}</Statistic.Value>
              <Statistic.Label>{stepinfo.label}</Statistic.Label>
            </Statistic>
            {stepinfo.btnText
            && (
              <div className={`${isMobile ? 'ml-18' : ''} center-align`}>
                <Button
                  as={Link}
                  to={stepinfo.url}
                  color="green"
                  className={isMobile && 'mt-20'}
                >
                  {stepinfo.btnText}
                </Button>
              </div>
            )
            }
          </Card.Content>
        </Card>
      </div>
    </div>
  );
});

export default StickyNotification;
