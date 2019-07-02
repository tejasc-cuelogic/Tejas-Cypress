import React from 'react';
import { Modal, Grid, Button, Header, Form } from 'semantic-ui-react';
import { FormRadioGroup } from '../../../../../../theme/form';
import AccTypeDescription from './AccTypeDescription';

const isMobile = document.documentElement.clientWidth < 768;
const AccountTypes = ({
  form,
  close,
  renderAccType,
  handleAccTypeChange,
}) => (
  <Modal
    open
    closeIcon={!isMobile}
    onClose={close}
    closeOnDimmerClick={false}
    dimmer={isMobile && 'inverted'}
    centered={!isMobile}
    className={isMobile ? 'multistep-modal' : ''}
    basic={isMobile}
  >
    <Modal.Header className={`${isMobile ? '' : 'center-align'} signup-header`}>
      {!isMobile && (
      <Header as="h3">What type of Investment Account would you like to start?</Header>
      )}
      {isMobile && (
        <Button
          icon={{ className: 'ns-chevron-left' }}
          className="multistep__btn prev"
        />
      )}
      <Button
        icon={{ className: 'ns-close-light' }}
        className="link-button pull-right multistep__btn"
      />
    </Modal.Header>
    <Modal.Content className="signup-content">
      {isMobile && (
      <Header as="h4">What type of Investment Account would you like to start?</Header>
      )}
      {!isMobile && (
        <Header as="h6" textAlign="center">Choose an account type</Header>
      )}
      <Grid
        textAlign="center"
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            renderAccType();
          }
        }}
      >
        <Form error className="account-type-tab">
          <FormRadioGroup
            fielddata={form.fields.accType}
            name="accType"
            changed={handleAccTypeChange}
            containerclassname="button-radio center-align"
          />
          <AccTypeDescription accTypes={form.fields.accType} />
        </Form>
      </Grid>
      {!isMobile && (
        <Button circular icon={{ className: 'ns-arrow-right' }} className="multistep__btn next active" onClick={() => renderAccType()} />
      )}
    </Modal.Content>
  </Modal>
);

export default AccountTypes;
