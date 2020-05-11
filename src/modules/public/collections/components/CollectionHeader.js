import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { get } from 'lodash';
import { withRouter } from 'react-router-dom';
import { Responsive, Icon, Header, Container, Grid, Menu } from 'semantic-ui-react';
import { Image64 } from '../../../../theme/shared';
import HtmlEditor from '../../../shared/HtmlEditor';
import { NavItems } from '../../../../theme/layout/NavigationItems';

@inject('uiStore')
@withRouter
@observer
export default class CollectionHeader extends Component {
  render() {
    const { uiStore, data, scrollToActiveOfferings, activeOffering } = this.props;
    const { responsiveVars } = uiStore;
    const { isMobile } = responsiveVars;
    const title = get(data, 'title');
    const actionText = get(data, 'actionText');
    const headerDownClick = activeOffering && actionText ? (
      <div className="current-projects-box" style={{ color: get(data, 'descriptionColor') }}>
        <p style={{ color: get(data, 'descriptionColor') }} className="mb-0">{actionText}</p>
        {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
        <i className="icon ns-chevron-down" onClick={scrollToActiveOfferings} />
      </div>
    ) : null;
    return (
      <>
        {!isMobile
          ? (
            <>
              <div className="campaign-banner collection-banner">
                <section className="banner" style={{ backgroundColor: get(data, 'bgColor') }}>
                  <Responsive minWidth={768} as={Container}>
                    <Grid relaxed stackable centered>
                      <Grid.Column width={7} className="zi-9">
                        <div className="video-wrapper campaign">
                          <Image64
                            reRender
                            bg
                            originalImg
                            srcUrl={get(data, 'image.url')}
                            imgType="heroImage"
                          />
                          {get(data, 'tag.text') && <div style={{ backgroundColor: get(data, 'tag.color') || 'green' }} className="ns_flgs_box"><p style={{ color: get(data, 'tag.textColor') }}>{get(data, 'tag.text')}</p></div>}
                        </div>
                        <div className="clearfix social-links mt-20">
                          {get(data, 'social[0]')
                            ? get(data, 'social').map(site => (
                              <React.Fragment key={site.type}>
                                {site.url
                                  && <a target="_blank" rel="noopener noreferrer" href={site.url.includes('http') ? site.url : `http://${site.url}`}><Icon name={site.type.toLowerCase() === 'website' ? 'globe' : site.type.toLowerCase()} /></a>
                                }
                              </React.Fragment>
                            )) : ''}
                        </div>
                      </Grid.Column>
                      <Grid.Column width={8} className="zi-9">
                        <Header style={{ color: get(data, 'descriptionColor') }} as="h3" inverted>
                          {title}
                        </Header>
                        <p style={{ color: get(data, 'descriptionColor') }}><HtmlEditor readOnly content={get(data, 'description')} /></p>
                      </Grid.Column>
                      {get(data, 'bgImage.url')
                        && <Image64 reRender originalImg bg className="campaign-details-banner" srcUrl={get(data, 'bgImage.url')} />
                      }
                    </Grid>
                  </Responsive>
                  {headerDownClick}
                </section>
              </div>
            </>
          ) : (
            <div className={`${isMobile ? 'mobile-campain-header' : 'sticky-sidebar'} offering-layout-menu offering-side-menu `}>
              <Responsive maxWidth={991} as={React.Fragment}>
                <div className={`${isMobile ? 'offering-intro-v2' : ''} offering-intro center-align`}>
                  <div className="video-wrapper campaign">
                    <Image64
                      bg
                      reRender
                      originalImg
                      srcUrl={get(data, 'image.url')}
                      imgType="heroImage"
                    />
                    {get(data, 'tag.text') && <div style={{ backgroundColor: get(data, 'tag.color') || 'green' }} className="ns_flgs_box"><p style={{ color: get(data, 'tag.textColor') }}>{get(data, 'tag.text')}</p></div>}
                  </div>
                  <Header style={{ color: get(data, 'descriptionColor') }} as="h4" inverted>
                    {title}
                  </Header>
                  <span style={{ color: get(data, 'descriptionColor') }}><HtmlEditor readOnly content={get(data, 'description')} /></span>
                  <div className="clearfix social-links mt-10">
                    {get(data, 'social[0]')
                      ? get(data, 'social').map(site => (
                        <React.Fragment key={site.type}>
                          {site.url
                            && <a className="ml-30" target="_blank" rel="noopener noreferrer" href={site.url.includes('http') ? site.url : `http://${site.url}`}><Icon name={site.type.toLowerCase()} /></a>
                          }
                        </React.Fragment>
                      )) : ''}
                  </div>
                </div>
              </Responsive>
              {headerDownClick}
              {!isMobile
                && (
                  <>
                    <Menu vertical>
                      <NavItems needNavLink sub refLoc="public" refLink={this.props.match.url} location={this.props.location} navItems={this.props.navItems} />
                    </Menu>
                  </>
                )
              }
            </div>
          )}
      </>
    );
  }
}
