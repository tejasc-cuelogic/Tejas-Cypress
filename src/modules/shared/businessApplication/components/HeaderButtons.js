import React from 'react';
import { Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import Aux from 'react-aux';

export const SubmitButton = props => (
  <Button
    loading={props.loading}
    onClick={props.click}
    className="primary"
    disabled={!props.canSubmitApp || props.readOnlyForm}
    {...props}
  >
    {props.buttonText || 'Submit'}
  </Button>
);

export const HeaderButtons = props => (
  <Aux>
    {!props.disabled ?
    (!props.showSubNav && !props.preQualPage ?
      <Button.Group>
        <Button inverted onClick={props.saveContinue} disabled={props.isFileUploading || props.disabled} color="green">{props.isFileUploading ? 'File operation in process' : 'Continue later'}</Button>
        <SubmitButton
          loading={props.inProgress}
          click={props.submitApp}
          canSubmitApp={!props.isFileUploading}
          readOnlyForm={props.disabled}
          buttonText={props.ButtonTextToggle}
        />
      </Button.Group> : props.preQualPage &&
      <Button.Group>
        <Button as={Link} loading={props.inProgress} to="/app/dashboard" inverted color="red">Cancel</Button>
        <SubmitButton
          loading={props.inProgress}
          click={props.preQualSubmit}
          canSubmitApp={props.isValid}
        />
      </Button.Group>
    ) :
      <Button.Group>
        <Button as={Link} to="/app/dashboard" inverted color="red">Back to Dashboard</Button>
      </Button.Group>
    }
  </Aux>
);
