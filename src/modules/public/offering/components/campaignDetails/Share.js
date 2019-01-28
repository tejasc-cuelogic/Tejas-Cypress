import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { map, filter } from 'lodash';
import { Header, Icon, Modal, Input } from 'semantic-ui-react';
import { InlineLoader } from '../../../../../theme/shared';

@inject('campaignStore')
@observer
export default class Share extends Component {
  render() {
    const { campaign } = this.props.campaignStore;
    const socialArray = campaign && campaign.offering && campaign.offering.overview &&
      campaign.offering.overview.social &&
      campaign.offering.overview.social.length ? campaign.offering.overview.social : [];
    const filteredSocialArr = filter(socialArray, o => (
      o.url
    ));
    map(filteredSocialArr, (val, key) => {
      if (val.type) {
        switch (val.type) {
          case 'facebook':
            filteredSocialArr[key].name = 'facebook f';
            filteredSocialArr[key].class = 'fb-color';
            break;
          case 'twitter':
            filteredSocialArr[key].name = 'twitter';
            filteredSocialArr[key].class = 'tw-color';
            break;
          case 'linkedin':
            filteredSocialArr[key].name = 'linkedin in';
            filteredSocialArr[key].class = 'in-color';
            break;
          case 'yelp':
            filteredSocialArr[key].name = 'envelope outline';
            filteredSocialArr[key].class = 'default';
            break;
          case 'instagram':
            filteredSocialArr[key].name = 'instagram';
            filteredSocialArr[key].class = 'instagram';
            break;
          default:
            break;
        }
      }
    });
    return (
      <Modal open size="tiny" onClose={this.props.history.goBack} className="share-modal">
        <Header as="h5">
          Share
        </Header>
        <Modal.Content>
          {
            filteredSocialArr.length ?
              <div className="share-icons center-align">
                {filteredSocialArr.map(socalObj => (
                  socalObj.url && socalObj.url !== '' &&
                  <a href={`${socalObj.url}`} target="_blank" rel="noopener noreferrer">
                    <Icon name={socalObj.name} circular inverted className={socalObj.class} size="big" />
                    {socalObj.title}
                  </a>
                ))
                }
              </div>
              :
              <InlineLoader text="No Data Found." className="bg-offwhite" />
          }
          <Input readOnly action={{ color: 'green', content: 'COPY' }} fluid value="https://nextseed.com/offerings/buffbrew-taproom" />
        </Modal.Content>
      </Modal>
    );
  }
}
