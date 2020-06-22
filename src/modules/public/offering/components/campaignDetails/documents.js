/* eslint-disable */
import React, { Component } from 'react';
import { toJS } from 'mobx';
import { isEmpty, get, camelCase, indexOf } from 'lodash';
import { withRouter, Route, Link } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { Header, Grid, Segment, Button, Divider } from 'semantic-ui-react';
import DocumentModal from './DataRoom/DocumentModal';
import { InlineLoader } from '../../../../../theme/shared';
import SecondaryMenu from '../../../../../theme/layout/SecondaryMenu';
import Helper from '../../../../../helper/utility';


const isTablet = document.documentElement.clientWidth < 992;
@inject('campaignStore', 'uiStore', 'accreditationStore', 'authStore')
@withRouter
@observer
export default class Documents extends Component {
  constructor(props) {
    super(props);
    let document = null;
    if (this.props.authStore.isUserLoggedIn && this.props.accreditationStore.docReference) {
      document = toJS(this.props.accreditationStore.docReference);
    }
    this.state = {
      doc: document,
    }
    if (this.props.authStore.isUserLoggedIn
      && isEmpty(this.props.accreditationStore.userData)) {
      this.props.accreditationStore.getUserAccreditation();
    }
  }

  openDocument = (doc) => {
    this.setState({ doc });
    if (!this.props.authStore.isUserLoggedIn) {
      this.props.accreditationStore.setFieldValue('docReference', doc);
    } else {
      this.props.accreditationStore.setFieldValue('docReference', null);
    }
  }

  close = () => {
    this.setState({ doc: null });
    this.props.accreditationStore.setFieldValue('docReference', null);
  }

  render() {
    const { campaign, dataRoomDocs, loading } = this.props.campaignStore;
    const isNotPublic = this.props.match.url.includes('dashboard');
    if (loading && this.props.portfolioSection) {
      return <InlineLoader />;
    }
    const { responsiveVars } = this.props.uiStore;
    return (
      <>
        {this.props.portfolioSection && responsiveVars.isMobile
          && <SecondaryMenu refMatch={this.props.refMatch} navItems={this.props.MobileNavItems} />
        }
        <div className={this.props.portfolioSection ? 'content-spacer' : ''}>
          {(dataRoomDocs.length && ['LIVE', 'CREATION'].includes(get(campaign, 'stage')))
            ? (
              <>
                <Header as="h3" className={`${(this.props.newLayout && isTablet) ? 'mt-40 mb-20' : this.props.newLayout ? 'mt-40 mb-30' : 'mb-30'} anchor-wrap`}>
                  <span className="anchor" id={this.props.title ? camelCase(Helper.sanitize(this.props.title)) : 'data-room'} />
                  {this.props.title || 'Documents'}
                </Header>
              </>
            ) : null
          }
          {!this.props.newLayout && <Divider hidden />}
          <Grid columns={3} stackable doubling>
            {
              dataRoomDocs.length && dataRoomDocs.map(l => (
                <Grid.Column>
                  <Segment padded textAlign="center" className="legal-documents">
                    <p>{l.name}</p>
                    <Button
                      onClick={() => this.openDocument(l)}
                      className="relaxed"
                      primary
                      compact
                      as={isNotPublic ? null : Link}
                      to={isNotPublic ? '' : `${this.props.match.url}/data-room#${indexOf(dataRoomDocs, l) + 1}`}
                    >
                      View
                  </Button>
                  </Segment>
                </Grid.Column>
              ))
            }
          </Grid>
          {isNotPublic && this.state.doc
            ? <DocumentModal doc={this.state.doc} close={this.close} />
            : <Route path={`${this.props.match.params}/:fileId`} component={<DocumentModal doc={this.state.doc} close={this.close} />} />
          }
        </div>
      </>
    );
  }
}
