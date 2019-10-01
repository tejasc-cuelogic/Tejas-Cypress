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
  <Modal
    open
    closeIcon={!isMobile}
    onClose={close}
    closeOnDimmerClick={false}
    dimmer={isMobile && 'inverted'}
    centered={!isMobile}
    className={isMobile ? 'multistep-modal bg-white' : ''}
    basic={isMobile}
  >
    <Modal.Header className={isMobile ? '' : 'center-align signup-header'}>
      {!isMobile && (
      <Header as="h3">What type of Investment Account would you like to start?</Header>
      )}
      {isMobile && (
        <>
          <Button
            icon={{ className: 'ns-chevron-left' }}
            className="multistep__btn prev"
            onClick={close}
          />
          <Button
            icon={{ className: 'ns-close-light' }}
            className="link-button pull-right multistep__btn"
            onClick={close}
          />
        </>
      )}
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
        className={isMobile && 'mt-30'}
      >
        <Form error className={isMobile ? '' : 'account-type-tab'}>
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
          {isMobile
            ? (
              <p className="grey-header mt-30">
                NextSeed accounts are provided and held at our partner bank, Happy State Bank
                DBA GoldStar Trust Company ({'"'}GoldStar{'"'}), which provides FDIC insurance for up
                to $250,000 of uninvested cash in NextSeed accounts.
              </p>
            )
            : (
            <AccTypeDescription accTypes={form.fields.accType} />
            )}
        </Form>
      </Grid>
      {!isMobile
      && (<Button circular icon={{ className: 'ns-arrow-right' }} className="multistep__btn next active" onClick={() => renderAccType()} />)
      }
    </Modal.Content>
  </Modal>
);

export default AccountTypes;
