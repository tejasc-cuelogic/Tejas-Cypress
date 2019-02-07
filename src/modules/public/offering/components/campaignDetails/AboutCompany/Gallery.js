import React, { Component } from 'react';
import Aux from 'react-aux';
import { Header, Button, Icon } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { get } from 'lodash';
import { inject, observer } from 'mobx-react';
import { Image64 } from '../../../../../../theme/shared';
import { ASSETS_URL } from '../../../../../../constants/aws';

const isTablet = document.documentElement.clientWidth < 991;
@inject('campaignStore')
@withRouter
@observer
class Gallery extends Component {
  handleViewGallary = (e, index) => {
    e.preventDefault();
    this.props.campaignStore.setFieldValue('gallarySelectedImageIndex', index);
    this.props.history.push(`${this.props.galleryUrl.replace(/\/$/, '')}/photogallery`);
  }
  render() {
    const { campaign } = this.props;
    return (
      <Aux>
        <Header as="h3" className="mb-30 anchor-wrap mb-30">
          Gallery
          <span className="anchor" id="gallery" />
        </Header>
        <div className="gallery-preview">
          {get(campaign && 'media.gallery') ?
            campaign.media.gallery.map((data, index) => (
              <Aux>
                {index < 3 &&
                  <Image64 onClick={e => this.handleViewGallary(e, index)} fluid className="about-gallery-bg" srcUrl={data.url} />
                }
              </Aux>
            )) :
            <Image64 fluid className="about-gallery-bg" srcUrl={`${ASSETS_URL}images/gallery-placeholder-16-9.jpg`} />
          }
        </div>
        {get(campaign && 'media.gallery') &&
          <Button fluid={isTablet} onClick={e => this.handleViewGallary(e, null)} basic compact className="highlight-text mt-40">
            View Gallery
            <Icon size="small" className="ns-chevron-right right" color="white" />
          </Button>
        }
      </Aux>
    );
  }
}

export default Gallery;
