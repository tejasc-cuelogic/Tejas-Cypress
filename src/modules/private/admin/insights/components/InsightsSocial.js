import React from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import SocialLinks from '../../../shared/marketing/SocialLinks';
import formHOC from '../../../../../theme/form/formHOC';

const metaInfo = {
  store: 'articleStore',
  form: 'ARTICLE_MISC_FRM',
};

function InsightsSocial(props) {
  const { inProgress } = props.uiStore;
  const handleFormSubmit = () => {
    const { id } = props.match.params;
    props.articleStore.adminUpdateSocialLinks(id);
  };
  return (
    <>
      <SocialLinks {...props} store={metaInfo.store} form={metaInfo.form} loading={inProgress} handleFormSubmit={handleFormSubmit} uploadPath={`articles/${props.match.params.id}`} />
    </>
  );
}

export default inject('uiStore')(withRouter(formHOC(observer(InsightsSocial), metaInfo)));
