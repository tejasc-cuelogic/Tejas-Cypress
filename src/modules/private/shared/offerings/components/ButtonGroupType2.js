import React from 'react';
import Aux from 'react-aux';
import { Button, Icon } from 'semantic-ui-react';

const ButtonGroupType2 = ({
  formValid, isManager, isSubmitted, isApproved, updateFunction,
}) => (
  <Aux>
    <div className="clearfix mb-20">
      {isManager ?
        <Button.Group floated="right">
          <Button onClick={() => updateFunction(false)} inverted content="Decline" color="red" />
          <Button disabled={!formValid} secondary content="Generate Report" />
          <Button onClick={() => updateFunction(true)} disabled={!formValid} primary content="Approve" color="green" />
        </Button.Group>
      :
        <Aux>
          <div className="clearfix mb-20 right-align">
            <Button onClick={updateFunction} color={isSubmitted ? 'gray' : ''} secondary={!isSubmitted} content={isSubmitted ? 'Awaiting Manager Approval' : 'Submit for Approval'} disabled={!(formValid && !isSubmitted)} />
          </div>
        </Aux>
      }
    </div>
    {isApproved &&
    <div className="clearfix">
      <Button.Group floated="right">
        <Button secondary content="Generate Report" disabled={!formValid} />
        <Button as="span" className="time-stamp">
          <Icon className="ns-check-circle" color="green" />
          Approved by Manager on 2/3/2018
        </Button>
      </Button.Group>
    </div>
    }
  </Aux>
);

export default ButtonGroupType2;
