import React from 'react';
import { observer, inject } from 'mobx-react';
import { Modal, Header, Divider, Grid, Form, Responsive, Button, Select } from 'semantic-ui-react';
import NSImage from '../../../shared/NSImage';
import formHOC from '../../../../theme/form/formHOC';
import { CURRENT_OPERATIONS, INDUSTRIES } from '../../../../services/constants/space';

const metaInfo = {
  store: 'spaceStore',
  form: 'CONTACT_FRM',
};


const Contact = ({ history, smartElement, spaceStore, nsUiStore, uiStore }) => {
  const handleCloseModal = () => {
    history.push('/space');
  };

  const handleSubmit = () => {
    spaceStore.spaceHelpAndQuestion().then(() => {
      handleCloseModal();
    }).catch(() => { });
  };

  return (
    <Modal dimmer={uiStore.responsiveVars.isMobile ? 'inverted' : ''} className={uiStore.responsiveVars.isMobile ? 'full-screen-modal' : ''} open closeIcon onClose={() => handleCloseModal()} size={uiStore.responsiveVars.isMobile ? 'fullscreen' : 'large'}>
      <Modal.Content>
        <section className={!uiStore.responsiveVars.isMobile ? 'padded' : ''}>
          <Grid columns="equal" stackable>
            <Grid.Column only="computer">
              <Header as="h3">Interested in learning more<Responsive as="br" minWidth={992} /> about NextSeed Space?</Header>
              <p>Let us know how we can support you and we’ll be in<Responsive as="br" minWidth={992} /> touch.</p>
              <Divider hidden section />
              <NSImage path="space/crowd-hero.jpg" />
            </Grid.Column>
            <Grid.Column>
              {uiStore.responsiveVars.isMobile
              && (
                <>
                  <Header as="h3">Interested in learning about<br /> NextSeed Space?</Header>
                  <p className="mb-30">Let us know how we can support you and we’ll be<br /> in touch.</p>
                </>
              )}
              <Form className="nss-form">
                <Form.Group widths="equal">
                  {['firstName', 'lastName'].map(field => (smartElement.Input(field)))}
                </Form.Group>
                <Form.Group widths="equal">
                  {smartElement.Input('businessName')}
                  {smartElement.FormDropDown('industry', {
                    onChange: (e, result) => spaceStore.formChange(e, result, 'CONTACT_FRM'),
                    placeholder: 'Pick One',
                    options: INDUSTRIES,
                    control: Select,
                    search: true,
                    searchInput: { id: 'industry' },
                    label: { children: 'Industry', htmlFor: 'industry' },
                  })}
                </Form.Group>
                <Form.Group widths="equal">
                  {smartElement.FormDropDown('currentlyOperating', {
                    onChange: (e, result) => spaceStore.formChange(e, result, 'CONTACT_FRM'),
                    placeholder: 'Pick One',
                    options: CURRENT_OPERATIONS,
                    control: Select,
                    search: true,
                    searchInput: { id: 'currentlyOperating' },
                    label: { children: 'currentlyOperating', htmlFor: 'currentlyOperating' },
                  })}
                  {smartElement.Input('webURL')}
                </Form.Group>
                <Form.Group widths="equal">
                  {['phone', 'emailAddress'].map(field => (field === 'phone' ? smartElement.Masked(field, { format: '(###) ###-####', phoneNumber: true }) : smartElement.Input(field)))}
                </Form.Group>
                {smartElement.TextArea('question', { containerclassname: 'secondary mt-20 mb-20', fluid: true, placeholder: '' })}
                <Button loading={nsUiStore.loadingArray.includes('spaceHelpAndQuestion')} disabled={!spaceStore.CONTACT_FRM.meta.isValid} onClick={handleSubmit} secondary fluid content="Let’s Talk" />
              </Form>
            </Grid.Column>
          </Grid>
        </section>
      </Modal.Content>
    </Modal>
  );
};

export default inject('nsUiStore', 'spaceStore', 'uiStore')(formHOC(observer(Contact), metaInfo));
