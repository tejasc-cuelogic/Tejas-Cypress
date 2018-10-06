import React, { Component } from 'react';
import { Breadcrumb, Grid, Image, Segment } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { NsCarousel } from '../../../../../../theme/shared';
// import videoPoster from '../../../../../../assets/images/636206632.jpg';

class Gallery extends Component {
  render() {
    const {
      campaign, settings, isTabletLand, isTablet, galleryUrl,
    } = this.props;
    return (
      <Grid.Column widescreen={9} largeScreen={8} computer={16} tablet={16} className={isTabletLand || isTablet ? 'mt-30' : ''}>
        <Segment padded>
          <Breadcrumb>
            <Breadcrumb.Section as={Link} to={`${galleryUrl}/photogallery`}><b>Gallery</b></Breadcrumb.Section>
            <Breadcrumb.Divider icon={{ className: 'ns-chevron-right', color: 'green' }} />
          </Breadcrumb>
          <div className="carousel mt-10 mb-30">
            <NsCarousel {...settings}>
              {campaign.media.gallery.map(data => (
                <Image src={data.url} />
              ))}
            </NsCarousel>
          </div>
        </Segment>
      </Grid.Column>
    );
  }
}

export default Gallery;
