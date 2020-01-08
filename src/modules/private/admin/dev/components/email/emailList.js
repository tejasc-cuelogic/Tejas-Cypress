import React, { useEffect, useState } from 'react';
import { Card } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import Filters from './filter';
import formHOC from '../../../../../../theme/form/formHOC';
import EmailContent from '../../../../shared/EmailContent';
import EmailsListing from '../../../../shared/EmailsListing';

const metaInfo = {
  store: 'emailStore',
  form: 'EMAIL_LIST_FRM',
};

function EmailList(props) {
  const [displyNoEmails, setdisplyRecord] = useState(false);
  const [showContentModal, toggleModal] = useState(false);
  const [id, setId] = useState(false);
  const [requestDate, setRequestDate] = useState(false);

  useEffect(() => {
    props.emailStore.resetForm('EMAIL_LIST_FRM');
    return () => {
      props.emailStore.resetFilters();
      props.emailStore.setFieldValue('emailLogList', []);
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
    props.emailStore.setInitiateSrch(name, value);
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
  };

  const { loadingArray } = props.nsUiStore;
  const { emailStore } = props;
  const {
    EMAIL_LIST_FRM, requestState, filters, count, emailList,
  } = emailStore;
  const totalRecords = count || 0;
  return (
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
          <EmailsListing loading={loadingArray.includes('getEmailList')} emailList={emailList} displyNoEmails={displyNoEmails} handleModel={handleModel} />
        </Card.Description>
      </Card>
    </>
  );
}

export default inject('nsUiStore')(withRouter(formHOC(observer(EmailList), metaInfo)));
