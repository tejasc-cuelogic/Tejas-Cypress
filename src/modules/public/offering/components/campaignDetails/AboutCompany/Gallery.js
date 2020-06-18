import React, { Component } from 'react';
import { Header, Button, Icon } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { get, camelCase } from 'lodash';
import { inject, observer } from 'mobx-react';
import { Image64 } from '../../../../../../theme/shared';
import NSImage from '../../../../../shared/NSImage';
import Helper from '../../../../../../helper/utility';


const isTablet = document.documentElement.clientWidth < 992;
@inject('campaignStore')
@withRouter
@observer
class Gallery extends Component {
  componentDidMount() {
    setTimeout(() => {
      this.props.processScroll();
    }, 10);
  }

  handleViewGallery = (e, index) => {
    e.preventDefault();
    this.props.campaignStore.setFieldValue('gallarySelectedImageIndex', index);
    this.props.history.push(`${this.props.galleryUrl.replace(/\/$/, '')}/photogallery`);
  }

  render() {
    const { campaignStore, newLayout } = this.props;
    const { campaignStatus } = campaignStore;
    const isTemplate2 = campaignStatus.campaignTemplate === 2;
    return (
      <>
        <Header as="h3" className={`${(this.props.newLayout && isTablet) ? 'mt-40 mb-20' : this.props.newLayout ? 'mt-40 mb-30' : 'mb-30'} anchor-wrap`}>
        <span className="anchor" id={this.props.title ? camelCase(Helper.sanitize(this.props.title)) : 'gallery'} />
          {this.props.title || 'Gallery'}
        </Header>
        <div className="gallery-preview">
          {campaignStatus.galleryImages && campaignStatus.galleryImages.length
            ? campaignStatus.galleryImages.map((data, index) => (
              <>
                {index < (newLayout ? 1 : 3)
                  && <Image64 onClick={e => this.handleViewGallery(e, index)} fluid={!newLayout} className="about-gallery-bg" srcUrl={isTemplate2 ? get(data, 'image.url') : data.url} />
                }
              </>
            ))
            : <NSImage fluid={!newLayout} className="about-gallery-bg" path="gallery-placeholder-16-9.jpg" />
          }
        </div>
        {campaignStatus.galleryImages && campaignStatus.galleryImages.length > 0
          && (
            <Button fluid={!newLayout && isTablet} onClick={e => this.handleViewGallery(e, null)} basic={!newLayout} compact={!newLayout} className={`${newLayout ? 'link-button' : ''} highlight-text mt-40`}>
              View Gallery
              <Icon size={newLayout ? '' : 'small'} className={`${newLayout ? 'ns-caret-down' : 'ns-chevron-right'} right`} color="white" />
            </Button>
          )
        }
      </>
    );
  }
}

export default Gallery;
