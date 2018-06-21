import React from 'react';
import { Card, Statistic } from 'semantic-ui-react';
import _ from 'lodash';
import Helper from '../../../helper/utility';

const stepinfo = {
  group: 'Investor Account Creation',
  title: '',
  label: 'You`re a few steps away from being able to invest! ',
};

const checkStatus = (signupStatus) => {
  let accCreation = signupStatus.partialAccounts.concat(signupStatus.inActiveAccounts);
  accCreation = Helper.eleToUpperCaseInArray(accCreation);
  if (signupStatus.idVerification !== 'PASS' && signupStatus.idVerification !== 'MANUAL_VERIFICATION_PENDING') {
    stepinfo.title = 'Please verify your identity in order to proceed';
  } else if (signupStatus.phoneVerification !== 'DONE') {
    stepinfo.title = 'Please verify your phone number in order to proceed';
  } else if (!_.isEmpty(signupStatus.accounts)) {
    stepinfo.title = 'You can open your another NextSeed account!';
    stepinfo.group = 'Congratulations!';
    if (accCreation.length === 1) {
      stepinfo.label = `Choose an ${Helper.getCommaSeparatedArrStr(accCreation)} account to get started.`;
    } else {
      stepinfo.label = `Choose between an ${Helper.getCommaSeparatedArrStr(accCreation)} account to get started.`;
    }
  } else {
    stepinfo.title = 'Now you can open your first NextSeed account!';
    stepinfo.group = 'Congratulations!';
    stepinfo.label = 'Choose between an Individual, IRA or Entity account to get started.';
  }
};

const StickyNotification = ({ signupStatus }) => {
  checkStatus(signupStatus);
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
};

export default StickyNotification;
