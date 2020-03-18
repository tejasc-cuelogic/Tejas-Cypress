import React from 'react';
import { observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Divider, Header } from 'semantic-ui-react';
import formHOC from '../../../../../../theme/form/formHOC';

const metaInfo = {
    store: 'manageOfferingStore',
    form: 'OFFERING_MISC_FRM',
  };

function CampaignHeaderSocial(props) {
  const { smartElement } = props;
  const isReadonly = false;
  return (
    <>
      <Header as="h4">Social Media
            <Header.Subheader>
              Links to social media profiles where investors can learn more about offering
            </Header.Subheader>
          </Header>
          {
            ['facebook_url', 'linkedin_url', 'twitter_url', 'instagram_url', 'yelp_url'].map(field => (
              smartElement.Input(field, { displayMode: isReadonly, key: field })
            ))
          }
          <Divider section />
    </>
  );
}

export default (withRouter(formHOC(observer(CampaignHeaderSocial), metaInfo)));
