import React from 'react';
import Aux from 'react-aux';
import { Card, Icon, Button } from 'semantic-ui-react';

const checkStatus = (signupStatus, key) => {
  let status = false;
  if (key === 'envelope-line') {
    status = 2;
  } else if (key === 'contact-card') {
    if (signupStatus.idVerification === 'PASS' || signupStatus.idVerification === 'MANUAL_VERIFICATION_PENDING') {
      status = 2;
    } else {
      status = 1;
    }
  } else if (key === 'phone-line') {
    if (signupStatus.idVerification !== 'PASS' && !signupStatus.idVerification !== 'MANUAL_VERIFICATION_PENDING') {
      status = 0;
    } else {
      status = 1;
    }
    if (signupStatus.phoneVerification === 'DONE') {
      status = 2;
    }
  } else if (key === 'bar-line-chart') {
    if (signupStatus.partialAccounts.length > 0) {
      status = true;
    }
  } else if (key === 'chart-setting') {
    if (signupStatus.inActiveAccounts.length > 0) {
      status = true;
    }
  }
  return status;
};

const ProgressCard = ({ metaData, signupStatus, action }) => (
  <Card.Group stackable itemsPerRow={3}>
    {
      Object.keys(metaData).map((key) => {
        const status = checkStatus(signupStatus, key);
        return (
          <Card fluid className={`verification ${status === 2 ? 'done' : status === 0 ? 'disabled' : ''}`}>
            <Card.Content>
              <Icon.Group size="huge">
                <Icon className={`ns-${key}`} />
                <Icon corner color={status === 2 ? 'green' : status === 1 ? 'red' : ''} className={status === 0 ? '' : `ns-${status === 2 ? 'check' : 'warning'}-circle`} />
              </Icon.Group>
              <p>
                {status === 2 ? <p>Your <b>{metaData[key].label}</b> has been verified</p> : (
                  <Aux>
                    <p><b>{metaData[key].labelGiven ? metaData[key].label : `Please verify your ${metaData[key].label}`}</b></p>
                    <Button
                      onClick={() => action(metaData[key].action)}
                      color={status === 0 ? '' : 'green'}
                      className="relaxed"
                      content="Verify"
                      disabled={status === 0}
                    />
                  </Aux>
                )
                }
              </p>
            </Card.Content>
          </Card>
        );
      })
    }
  </Card.Group>
);

export default ProgressCard;
