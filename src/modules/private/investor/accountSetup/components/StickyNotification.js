import React from 'react';
import { observer } from 'mobx-react';
import { Card, Statistic } from 'semantic-ui-react';
import { isEmpty } from 'lodash';
import AccCreationHelper from '../helper';
import { DataFormatter } from '../../../../../helper';

const stepinfo = {
  group: 'Investor Account Creation',
  title: '',
  label: 'You’re a few steps away from being able to invest!',
};

const checkStatus = (signupStatus, userDetailsStore) => {
  const accCreation = signupStatus.partialAccounts.concat(signupStatus.inActiveAccounts);
  const accName = AccCreationHelper.eleToUpperCaseInArray(accCreation);
  if ((signupStatus.idVerification !== 'PASS' && signupStatus.idVerification !== 'MANUAL_VERIFICATION_PENDING'
  && !signupStatus.isMigratedFullAccount) ||
  (signupStatus.isMigratedFullAccount
    && !userDetailsStore.isBasicVerDoneForMigratedFullUser)) {
    stepinfo.title = 'Please verify your identity in order to proceed';
  } else if (signupStatus.phoneVerification !== 'DONE') {
    stepinfo.title = 'Please verify your identity in order to proceed';
  } else if (!signupStatus.investorProfileCompleted) {
    stepinfo.title = 'Please establish your investor profile in order to proceed';
  } else if (!isEmpty(signupStatus.roles)) {
    stepinfo.title = 'You can open your another NextSeed account!';
    stepinfo.group = 'Congratulations!';
    if (accCreation.length === 1) {
      stepinfo.label = `Choose an ${DataFormatter.getCommaSeparatedArrStr(accName)} account to get started.`;
    } else {
      stepinfo.label = `Choose between an ${DataFormatter.getCommaSeparatedArrStr(accName)} account to get started.`;
    }
  } else {
    stepinfo.title = 'Now you can open your first NextSeed Investment Account';
    stepinfo.group = 'Congratulations!';
    stepinfo.label = 'Choose between an Individual, IRA or Entity account to get started.';
  }
};

const StickyNotification = observer(({ signupStatus, userDetailsStore }) => {
  checkStatus(signupStatus, userDetailsStore);
  return (
    <div className="top-cta-section">
      <div className="sticky-notification">
        <Card fluid raised>
          <Card.Content>
            <Card.Meta>{stepinfo.group}</Card.Meta>
            <Statistic size="mini" className="cta">
              <Statistic.Value>{stepinfo.title}</Statistic.Value>
              <Statistic.Label>{stepinfo.label}</Statistic.Label>
            </Statistic>
          </Card.Content>
        </Card>
      </div>
    </div>
  );
});

export default StickyNotification;
