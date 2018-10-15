import React from 'react';
import Aux from 'react-aux';
import { Button, Icon } from 'semantic-ui-react';

const ButtonGroup = ({
  formValid, isManager, isApproved, updateOffer,
}) => (
  <Aux>
    <div className="clearfix">
      <Button as="span" className="time-stamp">
        <Icon className="ns-check-circle" color="green" />
        Submitted by USER_NAME on 2/3/2018
      </Button>
      {isApproved &&
      <Button as="span" className="time-stamp">
        <Icon className="ns-check-circle" color="green" />
        Approved by USER_NAME on 2/3/2018
      </Button>
      }
      <Button.Group floated="right">
        {isManager ? (
          <Aux>
            <Button inverted onClick={() => updateOffer(false)} color="red" content="Decline" disabled={!formValid} />
            <Button color="green" onClick={() => updateOffer(true)} className="relaxed" disabled={!formValid}>{isApproved ? 'Edit' : 'Approve'}</Button>
          </Aux>
        ) : (
          <Button primary onClick={updateOffer} color="green" className="relaxed" disabled={!formValid}>Save</Button>
        )}
      </Button.Group>
    </div>
  </Aux>
);

export default ButtonGroup;
