import React, { Component } from 'react';
import { get } from 'lodash';
import Aux from 'react-aux';
import { Grid, Segment, Header, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { NsCarousel, Image64 } from '../../../../../../theme/shared';
import { ASSETS_URL } from '../../../../../../constants/aws';

class Gallery extends Component {
  render() {
    const {
      campaign, settings, isTabletLand, isTablet, galleryUrl,
    } = this.props;
    const isGallaryFilled = get(campaign, 'media.gallery') && get(campaign, 'media.gallery').length;
    return (
      <Grid.Column widescreen={10} largeScreen={10} computer={16} tablet={16} className={isTabletLand || isTablet ? 'mt-30' : ''}>
        <Segment padded>
          <Header as="h6">
            {isGallaryFilled ?
              <Link to={`${galleryUrl}/photogallery`}>
                Gallery
                <Icon className="ns-chevron-right" color="green" />
              </Link> :
              <Aux>
                Gallery
                <Icon className="ns-chevron-right" color="green" />
              </Aux>
          }
          </Header>
          {/* <Breadcrumb>
            <Breadcrumb.Section as={isGallaryFilled && Link} to={isGallaryFilled &&
              `${galleryUrl}/photogallery`}><b>Gallery</b></Breadcrumb.Section>
            <Breadcrumb.Divider as={isGallaryFilled && Link} to={isGallaryFilled &&
          `${galleryUrl}/photogallery`} icon={{ className: 'ns-chevron-right', color: 'green' }} />
          </Breadcrumb> */}
          <div className="about-carousel mt-10 mb-30">
            <NsCarousel
              {...settings}
              handlePaginationFun={() => {}}
            >
              {
                campaign && campaign.media &&
                  campaign.media.gallery && campaign.media.gallery.length ?
                  campaign.media.gallery.map(data => (
                    <Image64 className="about-gallery-bg" bg srcUrl={data.url} />
                  ))
                  :
                  <Image64 className="about-gallery-bg" bg srcUrl={`${ASSETS_URL}images/gallery-placeholder-16-9.jpg`} />
              }
            </NsCarousel>
          </div>
        </Segment>
      </Grid.Column>
    );
  }
}

export default Gallery;
