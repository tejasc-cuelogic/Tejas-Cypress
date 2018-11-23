import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Header, Modal, Grid, Image, Container } from 'semantic-ui-react';
import { InlineLoader, Image64, NsCarousel } from '../../../../theme/shared';
import { ASSETS_URL } from '../../../../constants/aws';

const isMobile = document.documentElement.clientWidth < 768;

@inject('campaignStore')
@observer
class LocationAnalysisModal extends Component {
  handleClose = () => this.props.history.goBack();

  render() {
    const { campaign } = this.props.campaignStore;
    // const emptyStatement = 'Detail not found';
    const settings = {
      dots: false,
      infinite: false,
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: true,
      adaptiveHeight: true,
    };
    const galleryArray = campaign && campaign.media && campaign.media.location &&
      campaign.media.location.length ? campaign.media.location : [];
    const galleryLength = galleryArray.length < 8 ? galleryArray.length : 8;
    const tabGalleryLength = galleryArray < 4 ? galleryArray.length : 4;
    return (
      <Modal
        open
        onClose={this.handleClose}
        closeIcon
        size="large"
      >
        <Header as="h3">
          Location Analysis
        </Header>
        <Modal.Content scrolling>
          <Grid>
            <Grid.Row>
              <Grid.Column computer={6} tablet={6} mobile={16} className={isMobile && 'mb-30'}>
                <Container fluid>
                  <NsCarousel
                    {...settings}
                    thumbs={isMobile ? tabGalleryLength : galleryLength}
                    imageCount={galleryArray.length}
                    isTablet={isMobile}
                    handlePaginationFun={this.handlePagination}
                  >
                    {
                      galleryArray.length ?
                        galleryArray.map(data => (
                          <Image64 srcUrl={data.url} />
                        ))
                        :
                        <Image src={`${ASSETS_URL}images/gallery-placeholder.jpg`} />
                    }
                  </NsCarousel>
                </Container>
                {/* {campaign && campaign.media && campaign.media.location &&
                  campaign.media.location.length && campaign.media.location[0].url ?
                  <Image64 srcUrl={campaign.media.location[0].url} />
                  :
                  <Image src={`${ASSETS_URL}images/gallery-placeholder.jpg`} />
                } */}
              </Grid.Column>
              <Grid.Column computer={10} tablet={10} mobile={16}>
                {
                  campaign && campaign.offering
                    && campaign.offering.about
                    && campaign.offering.about.locationAnalysis ?
                      <p
                        dangerouslySetInnerHTML={
                          {
                            __html: campaign.offering.about.locationAnalysis,
                          }
                        }
                      /> : <InlineLoader text="No data found." />
                }
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Modal.Content>
      </Modal>
    );
  }
}

export default LocationAnalysisModal;
