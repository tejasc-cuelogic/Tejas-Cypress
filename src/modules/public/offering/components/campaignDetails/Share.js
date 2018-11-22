import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { forEach, filter } from 'lodash';
import { Header, Icon, Modal, Input } from 'semantic-ui-react';
import { InlineLoader } from '../../../../../theme/shared';

// const shareVia = [
//   {
//     class: 'default', title: 'yelp', action: '', name: 'envelope outline',
//   },
//   {
//     class: 'in-color', title: 'linkedin', action: '', name: 'linkedin in',
//   },
//   {
//     class: 'tw-color', title: 'twitter', action: '', name: 'twitter',
//   },
//   {
//     class: 'fb-color', title: 'facebook', action: '', name: 'facebook f',
//   },
// ];
@inject('campaignStore')
@observer
export default class Share extends Component {
  render() {
    const { campaign } = this.props.campaignStore;
    const socialArray = campaign && campaign.offering && campaign.offering.overview &&
      campaign.offering.overview.social &&
      campaign.offering.overview.social.length ? campaign.offering.overview.social : [];
    const filteredSocialArr = filter(socialArray, o => (
      o.url === null
    ));
    forEach(filteredSocialArr, (val) => {
      if (val === 'type') {
        switch (filteredSocialArr.val) {
          case 'facebook':
            filteredSocialArr.name = 'facebook f';
            filteredSocialArr.class = 'fb-color';
            break;
          case 'twitter':
            filteredSocialArr.name = 'twitter';
            filteredSocialArr.class = 'tw-color';
            break;
          case 'linkedin':
            filteredSocialArr.name = 'in-color';
            filteredSocialArr.class = 'fb-color';
            break;
          case 'yelp':
            filteredSocialArr.name = 'envelope outline';
            filteredSocialArr.class = 'default';
            break;
          case 'instagram':
            filteredSocialArr.name = 'instagram';
            filteredSocialArr.class = 'instagram';
            break;
          default:
            break;
        }
      }
    });
    console.log('campaign==>', campaign, filteredSocialArr);
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
                  socalObj.shareLink && socalObj.shareLink !== '' &&
                  <Link to={`https://${socalObj.url}`} target="_blank">
                    <Icon name={socalObj.name} circular inverted className={socalObj.class} size="big" />
                    {socalObj.title}
                  </Link>
                  // <a href={`https://${socalObj.url}`} target="_blank" rel="noopener noreferrer" className="icon-link mr-10">
                  //   <Icon color="grey" name={socalObj.type} />
                  // </a>
                ))
                }
              </div>
              :
              <InlineLoader text="No Data Found." />
          }
          {/* <div className="share-icons center-align">
            {
              shareVia.map(share => (
                <Link to="/">
                <Icon name={share.name} circular inverted className={share.class} size="big" />
                {share.title}
                </Link>
              ))
            }
          </div> */}
          <Input readOnly action={{ color: 'green', content: 'COPY' }} fluid value="https://nextseed.com/offerings/buffbrew-taproom" />
        </Modal.Content>
      </Modal>
    );
  }
}
