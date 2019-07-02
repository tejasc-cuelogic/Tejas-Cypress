import React from 'react';
import { Modal, Grid, Button, Header, Form } from 'semantic-ui-react';
import { FormArrowButton, FormRadioGroup } from '../../../../../../theme/form';
import AccTypeDescription from './AccTypeDescription';

const isMobile = document.documentElement.clientWidth < 768;

const AccountTypes = ({
  form,
  close,
  renderAccType,
  handleAccTypeChange,
}) => (
  <Modal open closeIcon onClose={close} closeOnDimmerClick={false}>
    <Modal.Header className="center-align signup-header">
      <Header as="h3">What type of Investment Account would you like to start?</Header>
    </Modal.Header>
    <Modal.Content className="signup-content">
      <Header as="h6" textAlign="center">Choose an account type</Header>
      <Grid
        textAlign="center"
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            renderAccType();
          }
        }}
      >
        <Form error className="account-type-tab">
          {!isMobile
            ? (
            <FormRadioGroup
              fielddata={form.fields.accType}
              name="accType"
              changed={handleAccTypeChange}
              containerclassname="button-radio center-align"
            />
            )
            : (
              <FormArrowButton
                fielddata={form.fields.accType}
                name="accType"
                changed={handleAccTypeChange}
                action={renderAccType}
              />
            )
          }
          <AccTypeDescription accTypes={form.fields.accType} />
        </Form>
      </Grid>
      {!isMobile
      && (<Button circular icon={{ className: 'ns-arrow-right' }} className="multistep__btn next active" onClick={() => renderAccType()} />)
      }
    </Modal.Content>
  </Modal>
);

export default AccountTypes;
