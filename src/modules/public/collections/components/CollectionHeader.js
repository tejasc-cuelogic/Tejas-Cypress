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
    const { uiStore, data, scrollToActiveOfferings } = this.props;
    const { responsiveVars } = uiStore;
    const { isMobile } = responsiveVars;
    const title = get(data, 'title');
    const headerDownClick = (
      <div className="current-projects-box">
        <p className="mb-0">View our current and past projects below.</p>
        {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
        <i className="icon ns-chevron-down" onClick={scrollToActiveOfferings} />
      </div>
    );
    return (
      <>
        {!isMobile
          ? (
            <>
              <div className="campaign-banner collection-banner">
                {get(data, 'bgImage.url')
                  && <Image64 bg className="campaign-details-banner" srcUrl={get(data, 'bgImage.url')} />
                }
                <section className="banner">
                  <Responsive minWidth={768} as={Container}>
                    <Grid relaxed stackable centered>
                      <Grid.Column width={7}>
                        <div className="video-wrapper campaign">
                          <Image64
                            bg
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
                        <span style={{ backgroundColor: get(data, 'descriptionColor') }}><HtmlEditor readOnly content={get(data, 'description')} /></span>
                      </Grid.Column>
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
                      srcUrl={get(data, 'image.url')}
                      imgType="heroImage"
                    />
                    {get(data, 'tag.text') && <div style={{ backgroundColor: get(data, 'tag.color') || 'green' }} className="ns_flgs_box"><p style={{ color: get(data, 'tag.textColor') }}>{get(data, 'tag.text')}</p></div>}
                  </div>
                  <Header as="h4" inverted>
                    {title}
                  </Header>
                  <span style={{ backgroundColor: get(data, 'descriptionColor') }}><HtmlEditor readOnly content={get(data, 'description')} /></span>
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
