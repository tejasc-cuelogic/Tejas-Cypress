import React, { Component } from 'react';
// import { get } from 'lodash';
import Aux from 'react-aux';
import { Header, Button, Icon } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
// import { Link } from 'react-router-dom';
import { Image64 } from '../../../../../../theme/shared';
import { ASSETS_URL } from '../../../../../../constants/aws';

const isMobile = document.documentElement.clientWidth < 768;
@inject('campaignStore')
@withRouter
@observer
class Gallery extends Component {
  handleViewGallary = (e, index) => {
    e.preventDefault();
    this.props.campaignStore.setFieldValue('gallarySelectedImageIndex', index);
    this.props.history.push(`${this.props.galleryUrl}/photogallery`);
  }
  render() {
    const { campaign } = this.props;
    // const isGallaryFilled = get(campaign, 'media.gallery') && get(campaign,
    // 'media.gallery').length;
    return (
      <Aux>
        <Header as="h3" className="mb-30 anchor-wrap mb-30">
          Gallery
          <span className="anchor" id="gallery" />
        </Header>
        <div className="gallery-preview">
          {
            campaign && campaign.media &&
              campaign.media.gallery && campaign.media.gallery.length ?
              campaign.media.gallery.map((data, index) => (
                <Aux>
                  {index < 3 &&
                    <Image64 onClick={e => this.handleViewGallary(e, index)} fluid className="about-gallery-bg" srcUrl={data.url} />
                }
                </Aux>
              ))
              :
              <Image64 fluid className="about-gallery-bg" srcUrl={`${ASSETS_URL}images/gallery-placeholder-16-9.jpg`} />
          }
        </div>
        {
          campaign && campaign.media &&
            campaign.media.gallery && campaign.media.gallery.length &&
            <Button fluid={isMobile} onClick={this.handleViewGallary} basic compact className="highlight-text mt-40">
              View Gallery
              <Icon size="small" className="ns-chevron-right right" color="white" />
            </Button>
        }
      </Aux>
    );
  }
}

export default Gallery;
