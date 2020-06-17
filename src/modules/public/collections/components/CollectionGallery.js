import React, { Component } from 'react';
import { Header, Button, Icon } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { get, camelCase } from 'lodash';
import { inject, observer } from 'mobx-react';
import { Image64 } from '../../../../theme/shared';
import NSImage from '../../../shared/NSImage';

@inject('uiStore', 'campaignStore', 'collectionStore')
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
    const { uiStore, newLayout, title, galleryImages } = this.props;
    const { responsiveVars } = uiStore;
    const { isTablet } = responsiveVars;
    return (
      <>
        <Header as="h3" className={`${(newLayout && isTablet) ? 'mt-40 mb-20' : this.props.newLayout ? 'mt-40 mb-30' : 'mb-30'} anchor-wrap`}>
          <span className="anchor" id={title ? camelCase(title) : 'gallery'} />
          {title || 'Gallery'}
        </Header>
        <div className="gallery-preview">
          {galleryImages && galleryImages.length
            ? galleryImages.map((image, index) => (
              <>
                {index < (newLayout ? 1 : 3)
                  && <Image64 onClick={e => this.handleViewGallery(e, index)} fluid={!newLayout} className="about-gallery-bg" srcUrl={get(image, 'image.url')} />
                }
              </>
            ))
            : <NSImage fluid={!newLayout} className="about-gallery-bg" path="gallery-placeholder-16-9.jpg" />
          }
        </div>
        {galleryImages && galleryImages.length > 0
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
