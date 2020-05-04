import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { get } from 'lodash';
import { withRouter } from 'react-router-dom';
import { Responsive, Icon, Header, Container, Grid } from 'semantic-ui-react';
import { Image64 } from '../../../../theme/shared';

@inject('uiStore')
@withRouter
@observer
export default class CollectionHeader extends Component {
  render() {
    const { uiStore, data } = this.props;
    const { responsiveVars } = uiStore;
    const { isMobile } = responsiveVars;
    const meta = JSON.parse(get(data, 'meta') || '{}');
    const title = get(meta, 'title');
    const description = get(meta, 'description');
    return (
      <>
        {!isMobile
          ? (
            <>
              <div className="campaign-banner">
                {get(meta, 'bgImage')
                  && <Image64 bg originalImg className="campaign-details-banner" srcUrl={get(meta, 'bgImage')} />
                }
                <section className="banner">
                  <Responsive minWidth={768} as={Container}>
                    <Grid relaxed stackable centered>
                      <Grid.Column width={7}>
                        <div className="video-wrapper campaign">
                          <Image64
                            originalImg
                            bg
                            srcUrl={get(meta, 'image')}
                            imgType="heroImage"
                          />
                          <div className="ns_flgs_box">NextSeed</div>
                        </div>
                        <div className="clearfix social-links mt-20">
                          {get(meta, 'social[0]')
                            ? get(meta, 'social').map(site => (
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
                          {title}
                        </Header>
                        <p>{description}</p>
                      </Grid.Column>
                    </Grid>
                  </Responsive>
                  <div className="current-projects-box">
                    <p className="mb-0">View our current and past projects below.</p>
                    <i className="icon ns-chevron-down" />
                  </div>
                </section>
              </div>
            </>
          ) : (
            <div className={`${isMobile ? 'mobile-campain-header' : 'sticky-sidebar'} offering-layout-menu offering-side-menu `}>
              <Responsive maxWidth={991} as={React.Fragment}>
                <div className={`${isMobile ? 'offering-intro-v2' : ''} offering-intro center-align`}>
                  <div className="video-wrapper campaign">
                    <Image64
                      originalImg
                      bg
                      srcUrl={get(meta, 'image')}
                      imgType="heroImage"
                    />
                  </div>
                  <Header as="h4" inverted>
                    {title}
                  </Header>
                  <p>{description}</p>
                  <div className="clearfix social-links mt-10">
                    {get(meta, 'social[0]')
                      ? get(meta, 'social').map(site => (
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
