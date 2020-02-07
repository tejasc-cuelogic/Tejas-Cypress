import React from 'react';
import { Modal, Grid, Header, Form, Divider } from 'semantic-ui-react';
import { FormArrowButton } from '../../../../../../theme/form';
import { ProgressModalHeader } from '../../../../../../theme/shared';

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
      centered={false}
      className="multistep-modal"
      basic
      size="large"
    >
      {!isMobile && <ProgressModalHeader Modal={Modal} />}
      <Modal.Content className="signup-content">
        <Grid
          centered
          textAlign="left"
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              renderAccType();
            }
          }}
          className={isMobile && 'mt-30'}
        >
          <Grid.Column width="8">
            <Header as="h3">Which type of investment account would you like to open?</Header>
            <Form error className={isMobile ? '' : 'account-type-tab'}>
              <FormArrowButton
                fielddata={form.fields.accType}
                name="accType"
                changed={handleAccTypeChange}
                action={renderAccType}
              />
            </Form>
            {!isMobile && <Divider section hidden />}
            <p className="grey-header mobile-bottom-notes">
              NextSeed accounts are provided and held at our partner bank, Happy State Bank DBA GoldStar Trust Company ({'"'}GoldStar{'"'}), which provides FDIC insurance for up to $250,000 of uninvested cash in NextSeed accounts.
          </p>
          </Grid.Column>
        </Grid>
      </Modal.Content>
    </Modal>
  );

export default AccountTypes;
