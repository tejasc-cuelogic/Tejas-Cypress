import React from 'react';
import { inject, observer } from 'mobx-react';
import { Modal, Grid, Header, Form, Divider } from 'semantic-ui-react';
import { FormArrowButton } from '../../../../../../theme/form';
import { ProgressModalHeader } from '../../../../../../theme/shared';
import Helper from '../../../../../../helper/utility';

const isMobile = document.documentElement.clientWidth < 768;
const mountNode = Helper.customModalWrapper();

@inject('accountStore')
@observer
export default class AccountTypes extends React.Component {
  constructor(props) {
    super(props);
    this.props.accountStore.setAccTypeChange(null);
  }

  render() {
    const { close, renderAccType, handleAccTypeChange, form } = this.props;
    return (
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
        mountNode={mountNode}
      >
        {<ProgressModalHeader Modal={Modal} handleClose={close} closeCta name="ACCOUNT SETUP" />}
        <Modal.Content className="signup-content">
          <Grid
            centered
            textAlign="left"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                renderAccType();
              }
            }}
            className={isMobile && 'mt-14'}
            stackable
          >
            <Grid.Column width="8">
              <Header as="h4">Which type of investment account would you like to open?</Header>
              <Form error className={isMobile ? '' : 'account-type-tab'}>
                <FormArrowButton
                  fielddata={form.fields.accType}
                  name="accType"
                  changed={handleAccTypeChange}
                  action={renderAccType}
                />
              </Form>
              {!isMobile && <Divider section hidden />}
              {!isMobile && (
                <p className="note grey-text mt-20">
                  NextSeed accounts are provided and held at our partner bank, Happy State Bank DBA GoldStar Trust Company ({'"'}GoldStar{'"'}), which provides FDIC insurance for up to $250,000 of uninvested cash in NextSeed accounts.
              </p>
              )}
            </Grid.Column>
          </Grid>
          {isMobile && (
            <p className="grey-header mt-20">
              NextSeed accounts are provided and held at our partner bank, Happy State Bank DBA GoldStar Trust Company ({'"'}GoldStar{'"'}), which provides FDIC insurance for up to $250,000 of uninvested cash in NextSeed accounts.
        </p>
          )}
        </Modal.Content>
      </Modal>
    );
  }
}
