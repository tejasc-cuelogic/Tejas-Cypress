import React, { Component } from 'react';
import { Breadcrumb, Grid, Segment, Image } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { NsCarousel, Image64 } from '../../../../../../theme/shared';
import { ASSETS_URL } from '../../../../../../constants/aws';

class Gallery extends Component {
  render() {
    const {
      campaign, settings, isTabletLand, isTablet, galleryUrl,
    } = this.props;
    return (
      <Grid.Column widescreen={10} largeScreen={10} computer={16} tablet={16} className={isTabletLand || isTablet ? 'mt-30' : ''}>
        <Segment padded>
          <Breadcrumb>
            <Breadcrumb.Section as={Link} to={`${galleryUrl}/photogallery`}><b>Gallery</b></Breadcrumb.Section>
            <Breadcrumb.Divider icon={{ className: 'ns-chevron-right', color: 'green' }} />
          </Breadcrumb>
          <div className="carousel mt-10 mb-30">
            <NsCarousel
              {...settings}
              handlePaginationFun={() => {}}
            >
              {
                campaign && campaign.media &&
                  campaign.media.gallery && campaign.media.gallery.length ?
                  campaign.media.gallery.map(data => (
                    <Image64 srcUrl={data.url} />
                  ))
                  :
                  <Image src={`${ASSETS_URL}images/gallery-placeholder-16-9.jpg`} />
              }
            </NsCarousel>
          </div>
        </Segment>
      </Grid.Column>
    );
  }
}

export default Gallery;
