import React from 'react';
import { Modal, Grid, Header, Form } from 'semantic-ui-react';
import { FormArrowButton } from '../../../../../../theme/form';
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
    dimmer="inverted"
    centered={!isMobile}
    className={isMobile ? 'multistep-modal bg-white' : ''}
    basic
    size="large"
  >
    <Modal.Content className="signup-content">
      <Grid
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            renderAccType();
          }
        }}
        className={isMobile && 'mt-30'}
        centered
      >
        <Grid.Column width="8">
          {!isMobile && (
          <Header as="h4">Which type of investment account would you like to open?</Header>
          )}
          <Form error className={isMobile ? '' : 'account-type-tab'}>
            <FormArrowButton
              fielddata={form.fields.accType}
              name="accType"
              changed={handleAccTypeChange}
              action={renderAccType}
            />
          </Form>
          {isMobile
            ? (
              <p className="grey-header mobile-bottom-notes">
                NextSeed accounts are provided and held at our partner bank, Happy State Bank DBA GoldStar Trust Company ({'"'}GoldStar{'"'}), which provides FDIC insurance for up to $250,000 of uninvested cash in NextSeed accounts.
              </p>
            )
            : (
            <AccTypeDescription accTypes={form.fields.accType} />
          )}
        </Grid.Column>
      </Grid>
    </Modal.Content>
  </Modal>
);

export default AccountTypes;
