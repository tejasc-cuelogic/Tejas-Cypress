import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { get } from 'lodash';
import { Grid, Header, Container, Responsive, Icon } from 'semantic-ui-react';
import { Image64 } from '../../../../../theme/shared';
import HtmlEditor from '../../../../shared/HtmlEditor';

@inject('collectionStore')
@withRouter
@observer
export default class CardHeaderPreview extends Component {
  render() {
    const { collectionStore } = this.props;
    const { CARD_HEADER_META_FRM, CARD_HEADER_SOCIAL_FRM } = collectionStore;
    const collection = CARD_HEADER_META_FRM.fields;
    const socialDetails = CARD_HEADER_SOCIAL_FRM.fields.social;
    const actionText = get(collection, 'actionText.value');
    const headerDownClick = (actionText && actionText !== '')
      ? (
        <div className="current-projects-box">
          <p style={{ color: get(collection, 'descriptionColor.value') }} className="mb-0">{actionText}</p>
          {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
          <i className="icon ns-chevron-down" />
        </div>
      )
      : null;
    return (
      <div className="campaign-banner collection-banner collection-header-wrap" style={{ backgroundColor: get(collection, 'bgColor.value') }}>
        {get(collection, 'bgImage.preSignedUrl')
          && <Image64 bg className="collection-bg-image" srcUrl={get(collection, 'bgImage.preSignedUrl')} />
        }
        <section className="banner">
          <Responsive minWidth={768} as={Container} className={`pt-70 pb-70 ${actionText ? 'mb-30' : 'mb-0'}`}>
            <Grid relaxed stackable centered>
              <Grid.Column width={7}>
                <div className="video-wrapper campaign">
                  <Image64
                    bg
                    srcUrl={get(collection, 'image.preSignedUrl')}
                    imgType="heroImage"
                  />
                  {get(collection, 'text.value') && <div style={{ backgroundColor: get(collection, 'color.value') || 'green' }} className="ns_flgs_box"><p style={{ color: get(collection, 'textColor.value') }}>{get(collection, 'text.value')}</p></div>}
                </div>
                <div className="clearfix social-links mt-20">
                  {socialDetails.length > 0
                    ? socialDetails.map(site => (
                      <React.Fragment key={site.type.value}>
                        {site.url.value
                          && <a target="_blank" rel="noopener noreferrer" href={site.url.value.includes('http') ? site.url.value : `http://${site.url.value}`}><Icon name={site.type.value.toLowerCase() === 'website' ? 'globe' : site.type.value.toLowerCase()} style={{ color: get(collection, 'descriptionColor.value') }} /></a>
                        }
                      </React.Fragment>
                    )) : ''
                  }
                </div>
              </Grid.Column>
              <Grid.Column width={8}>
                <Header style={{ color: get(collection, 'descriptionColor.value') }} as="h3" inverted>
                  {get(collection, 'title.value')}
                </Header>
                <span style={{ color: get(collection, 'descriptionColor.value') }}><HtmlEditor readOnly content={get(collection, 'description.value')} style={{ color: get(collection, 'descriptionColor.value') }} /></span>
              </Grid.Column>
            </Grid>
          </Responsive>
          {headerDownClick}
        </section>
      </div>

      // <div className="bg-offwhite pt-30 pb-30">
      //   <Container className="offerings-container">
      //     <Grid style={{ backgroundColor: get(collection, 'bgColor.value') }} className="p-36 collection-box">
      //       <Grid.Column widescreen={4} computer={4} tablet={16} mobile={16} className="zi-9">
      //         <Image64 originalImg srcUrl={get(collection, 'image.preSignedUrl')} />
      //         {get(collection, 'text.value')
      //           && (
      //             <div style={{ backgroundColor: get(collection, 'color.value'), color: get(collection, 'textColor.value') }} className="ns_flgs_box">
      //               <p>{get(collection, 'text.value')}</p>
      //             </div>
      //           )
      //         }
      //       </Grid.Column>
      //       <Grid.Column widescreen={11} computer={11} tablet={16} mobile={16} className="zi-9">
      //         <Header as="h3">{get(collection, 'title.value')}</Header>
      //         <HtmlEditor readOnly content={get(collection, 'description.value')} />
      //         <Button inverted color="white" className="mt-30 mb-30">Explore</Button>
      //       </Grid.Column>
      //       {get(collection, 'bgImage.preSignedUrl')
      //         && <Image64 bg originalImg className="collection-bg-image" srcUrl={get(collection, 'bgImage.preSignedUrl')} />
      //       }
      //     </Grid>
      //   </Container>
      // </div>
    );
  }
}
