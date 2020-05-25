import React, { useEffect, useState } from 'react';
import { Card, Modal, Form, Divider, Button, Header } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import Filters from './filter';
import formHOC from '../../../../../../theme/form/formHOC';
import EmailContent from '../../../../shared/EmailContent';
import EmailsListing from '../../../../shared/EmailsListing';
import { InlineLoader } from '../../../../../../theme/shared';
import DynamicFormInput from '../factory/dynamicFormInput';

const metaInfo = {
  store: 'emailStore',
  form: 'EMAIL_LIST_FRM',
};

function EmailList(props) {
  const [displyNoEmails, setdisplyRecord] = useState(false);
  const [showContentModal, toggleModal] = useState(false);
  const [id, setId] = useState(false);
  const [emailIdentity, setEmailIdentity] = useState(null);
  const [requestDate, setRequestDate] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);

  useEffect(() => {
    props.emailStore.fetchAdminListEmailTypesAndIdentifier().then(() => {
      props.emailStore.setInitiateSrch('emailType', 'DEV');
      props.emailStore.initRequest();
    });
    props.emailStore.resetForm('EMAIL_LIST_FRM');
    return () => {
      props.emailStore.resetFilters();
      props.emailStore.setFieldValue('emailLogList', []);
      props.emailStore.setFieldValue('emailPlugin', {});
      setdisplyRecord(false);
    };
  }, []);

  const change = (date, field) => {
    setdisplyRecord(true);
    if ((date && moment(date.formattedValue, 'MM-DD-YYYY', true).isValid()) || date.value === '') {
      props.emailStore.setInitiateSrch(field, date);
    }
  };

  const setSearchParam = (e, { name, value }) => {
    setdisplyRecord(true);
    props.emailStore.reseFilterManually(name, value);
    // props.emailStore.setInitiateSrch(name, value);
  };

  const paginate = params => props.emailStore.initRequest(params);

  const handleModel = (e, dataObj) => {
    e.preventDefault();
    setRequestDate(dataObj.requestDate);
    setId(dataObj.recipientId);
    toggleModal(true);
  };

  const handleCloseModal = () => {
    toggleModal(false);
    setShowActionModal(false);
    setEmailIdentity(null);
  };

  const handleSubmitForm = async () => {
    const res = await props.factoryStore.emailFactoryPluginTrigger(emailIdentity);
    if (res) {
      handleCloseModal();
    }
  };

  const handleActionModel = (e, { emailIdentifier }) => {
    e.preventDefault();
    setEmailIdentity(emailIdentifier);
    props.emailStore.setPluginInput(emailIdentifier);
    const { emailPlugin } = props.emailStore;
    props.factoryStore.setDynamicDataForEmail(emailPlugin.pluginInput, 'EMAIL_LIST');
    setShowActionModal(true);
  };

  const { loadingArray } = props.nsUiStore;
  const { emailStore } = props;
  const { DYNAMCI_PAYLOAD_FRM } = props.factoryStore;
  const {
    EMAIL_LIST_FRM, requestState, filters, count, emailList, emailPlugin,
  } = emailStore;
  const totalRecords = count || 0;
  return loadingArray.includes('adminListEmailType') ? <InlineLoader /> : (
    <>
      {showContentModal && (
        <EmailContent
          id={id}
          requestDate={requestDate}
          handleCloseModal={handleCloseModal}
          showContentModal={showContentModal}
          {...props}
        />
      )
      }
      <Filters
        requestState={requestState}
        filters={filters}
        setSearchParam={setSearchParam}
        change={change}
        paginate={paginate}
        totalRecords={totalRecords}
        FILTER_FRM={EMAIL_LIST_FRM}
      />
      <Card fluid className="elastic-search">
        <Card.Description>
          <EmailsListing loading={loadingArray.includes('adminFetchEmails')} emailList={emailList} displyNoEmails={displyNoEmails} handleModel={handleModel} handleActionModel={handleActionModel} />
        </Card.Description>
      </Card>
      {showActionModal
        && (
          <Card fluid className="elastic-search">
            <Card.Content>
              <Card.Description>
                <Modal closeOnDimmerClick={false} closeIcon open onClose={handleCloseModal} closeOnRootNodeClick={false}>
                  <Modal.Header className="center-align signup-header">
                    <Header as="h4">Email Form</Header>
                  </Modal.Header>
                  <Modal.Content>
                    <Form onSubmit={handleSubmitForm}>
                      <Form.Group>
                        <DynamicFormInput {...props} pluginObj={emailPlugin} formPayload={DYNAMCI_PAYLOAD_FRM.EMAIL_LIST} formObj={{ parentForm: 'DYNAMCI_PAYLOAD_FRM', childForm: 'EMAIL_LIST' }} selectedPlugin={requestState.search.emailIdentifier} />
                      </Form.Group>
                      <Divider section hidden />
                      <Button className="mt-80 ml-10" primary content="Submit" loading={loadingArray.includes('adminSendEmail')} disabled={!DYNAMCI_PAYLOAD_FRM.EMAIL_LIST.meta.isValid} />
                    </Form>
                  </Modal.Content>
                </Modal>
              </Card.Description>
            </Card.Content>
          </Card>
        )
      }
    </>
  );
}

export default inject('nsUiStore', 'factoryStore')(withRouter(formHOC(observer(EmailList), metaInfo)));
