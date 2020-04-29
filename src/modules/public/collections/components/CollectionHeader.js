import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { get } from 'lodash';
import { withRouter, Link } from 'react-router-dom';
import { Responsive, Icon, Header, Container, Grid } from 'semantic-ui-react';
import { Image64 } from '../../../../theme/shared';

@inject('campaignStore', 'authStore', 'uiStore')
@withRouter
@observer
export default class CollectionHeader extends Component {
  render() {
    const { campaignStore, newLayout, uiStore } = this.props;
    const { responsiveVars } = uiStore;
    const { isMobile } = responsiveVars;
    const { campaign, campaignSideBarShow } = campaignStore;
    const address = 'Huston, TX';
    const description = 'The City of Houston has long been home to a diverse community of entrepreneurs, all driven by the independent spirit that Texas is known for. From the innovative technology companied driving growth in the oil & gas and medical industries, to the thousands of restaurants and hospitality companies that showcase the cultural diversity of the Bayou City, Houston has it all. Earl Campbell was the greatest.';
    const social = [
      { type: 'facebook', url: 'test.com' },
      { type: 'linkedin', url: 'test.com' },
      { type: 'twitter', url: 'test.com' },
      { type: 'instagram', url: 'test.com' },
      { type: 'yelp', url: 'test.com' },
    ];
    return (
      <>
        {!isMobile
          ? (
            <>
              <div className="campaign-banner">
                {get(campaign, 'header.heroBackgroundImage.url')
                  && <Image64 bg className="campaign-details-banner" srcUrl={get(campaign, 'header.heroBackgroundImage.url')} />
                }
                <section className="banner">
                  <Responsive minWidth={768} as={Container}>
                    <Grid relaxed stackable centered>
                      <Grid.Column width={7}>
                        <div className="video-wrapper campaign">
                          {get(campaign, 'header.heroVideoURL')
                            ? (
                              <Link to={`${this.props.match.url}${newLayout ? '' : '/overview'}/herovideo`}>
                                <Image64
                                  bg
                                  srcUrl={get(campaign, 'header.heroImage.url')}
                                  imgType="heroImage"
                                />
                                <Icon className="ns-play play-icon" />
                              </Link>
                            )
                            : (
                              <Image64
                                bg
                                srcUrl={get(campaign, 'header.heroImage.url')}
                                imgType="heroImage"
                              />
                            )
                          }
                        </div>
                        <div className="clearfix social-links mt-10">
                          {social
                            ? social.map(site => (
                              <React.Fragment key={site.type}>
                                {site.url
                                  && <a target="_blank" rel="noopener noreferrer" href={site.url.includes('http') ? site.url : `http://${site.url}`}><Icon name={site.type.toLowerCase()} /></a>
                                }
                              </React.Fragment>
                            )) : ''}
                        </div>
                      </Grid.Column>
                      <Grid.Column width={8}>
                        <Header as="h3" inverted>
                          {address}
                          {/* <Header.Subheader>{address}</Header.Subheader> */}
                        </Header>
                        <p>{description}</p>
                      </Grid.Column>
                    </Grid>
                  </Responsive>
                </section>
              </div>
            </>
          ) : (
            <div className={`${campaignSideBarShow ? '' : 'collapse'} ${isMobile ? 'mobile-campain-header' : 'sticky-sidebar'} ${newLayout ? 'offering-layout-menu' : ''} offering-side-menu `}>
              <Responsive maxWidth={991} as={React.Fragment}>
                <div className={`${newLayout && isMobile ? 'offering-intro-v2' : ''} offering-intro center-align`}>
                  <div className="video-wrapper campaign">
                    {get(campaign, 'header.heroVideoURL')
                      ? (
                        <Link to={`${this.props.match.url}${newLayout ? '' : '/overview'}/herovideo`}>
                          <Image64
                            bg
                            srcUrl={get(campaign, 'header.heroImage.url')}
                            imgType="heroImage"
                          />
                          <Icon className="ns-play play-icon" />
                        </Link>
                      )
                      : (
                        <Image64
                          bg
                          srcUrl={get(campaign, 'header.heroImage.url')}
                          imgType="heroImage"
                        />
                      )
                    }
                  </div>
                  <Header as="h4" inverted>
                    {address}
                    {/* <Header.Subheader>{address}</Header.Subheader> */}
                  </Header>
                  <p>{description}</p>
                  <div className="clearfix social-links mt-10">
                    {social
                      ? social.map(site => (
                        <React.Fragment key={site.type}>
                          {site.url
                            && <a className="ml-30" target="_blank" rel="noopener noreferrer" href={site.url.includes('http') ? site.url : `http://${site.url}`}><Icon name={site.type.toLowerCase()} /></a>
                          }
                        </React.Fragment>
                      )) : ''}
                  </div>
                </div>
              </Responsive>
            </div>
          )}
      </>
    );
  }
}
