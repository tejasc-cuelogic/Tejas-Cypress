import React, { Component } from 'react';
import { Header, Button, Icon } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { get } from 'lodash';
import { inject, observer } from 'mobx-react';
import { Image64 } from '../../../../../../theme/shared';
import NSImage from '../../../../../shared/NSImage';

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
    const { campaign, newLayout } = this.props;
    return (
      <>
        <Header as="h3" className={`${newLayout ? 'mt-50 mb-40' : 'mb-30'} anchor-wrap`}>
          Gallery
          <span className="anchor" id="gallery" />
        </Header>
        <div className="gallery-preview">
          {get(campaign, 'media.gallery')
            ? campaign.media.gallery.map((data, index) => (
              <>
                {index < 3
                  && <Image64 onClick={e => this.handleViewGallary(e, index)} fluid className="about-gallery-bg" srcUrl={data.url} />
                }
              </>
            ))
            : <NSImage fluid className="about-gallery-bg" path="gallery-placeholder-16-9.jpg" />
          }
        </div>
        {get(campaign, 'media.gallery')
          && (
<Button fluid={isTablet} onClick={e => this.handleViewGallary(e, null)} basic={!newLayout} compact={!newLayout} className={`${newLayout ? 'link-button' : ''} highlight-text mt-40`}>
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
