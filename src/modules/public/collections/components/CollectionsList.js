import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { get } from 'lodash';
import { inject, observer } from 'mobx-react';
import { Grid, Container, Button, Header, Card } from 'semantic-ui-react';
import { Image64, InlineLoader } from '../../../../theme/shared';
import HtmlEditor from '../../../shared/HtmlEditor';

const CollectionItem = ({ isMobile, isTablet, responsiveVars, collections, collectionLength, handleNavigate, offering, toggleHover, isHovered }) => (
  <>
    {
      collections.map((collection, i) => (!collectionLength || (i < collectionLength)) && (
        <Container as={Link} to={`/collections/${get(collection, 'slug')}`} key={get(collection, 'id')} className={` offerings-container ${responsiveVars.uptoTablet ? 'pt-0 pb-0 pl-0 pr-0' : ''}`}>
          <Grid style={{ backgroundColor: get(collection, 'marketing.tombstone.bgColor') }} className={`${get(collection, 'status') !== 'ACTIVE' ? 'border-red' : ''} collection-box ${responsiveVars.uptoTablet ? 'p-0' : 'p-60'}`}>
            <Grid.Column widescreen={4} computer={5} tablet={5} mobile={16} className="zi-9 p-0 collection-thumbnail-img">
              <Image64 reRender originalImg srcUrl={get(collection, 'marketing.tombstone.image.url')} />
              {get(collection, 'marketing.tombstone.tag.text')
                && (
                  <div style={{ backgroundColor: get(collection, 'marketing.tombstone.tag.color') }} className="ns_flgs_box">
                    <p style={{ color: get(collection, 'marketing.tombstone.tag.textColor') }}>{get(collection, 'marketing.tombstone.tag.text')}</p>
                  </div>
                )}
            </Grid.Column>
            <Grid.Column widescreen={12} computer={11} tablet={11} mobile={16} className="zi-9 collection-content">
              <Header style={{ color: get(collection, 'marketing.tombstone.descriptionColor') }} as="h3">{get(collection, 'marketing.tombstone.title')}</Header>
              <p style={{ color: get(collection, 'marketing.tombstone.descriptionColor') }}><HtmlEditor readOnly content={get(collection, 'marketing.tombstone.description')} /></p>
              {!isMobile && !isTablet
                && (
                  <Button inverted onMouseLeave={() => toggleHover(false)} onMouseEnter={() => toggleHover(get(collection, 'id'))} style={{ backgroundColor: isHovered === get(collection, 'id') ? get(collection, 'marketing.tombstone.descriptionColor') : '', color: isHovered === get(collection, 'id') ? get(collection, 'marketing.tombstone.bgColor') : get(collection, 'marketing.tombstone.descriptionColor'), borderColor: get(collection, 'marketing.tombstone.descriptionColor') }} as={Link} to={`/collections/${get(collection, 'slug')}`} className="mt-30 collectionExplore">Explore</Button>
                )
              }
            </Grid.Column>
            {get(collection, 'marketing.tombstone.bgImage.url')
              && <Image64 reRender bg originalImg className="collection-bg-image" srcUrl={get(collection, 'marketing.tombstone.bgImage.url')} />
            }
          </Grid>
        </Container>
      ))}
    {((collections.length > collectionLength) || (collections.length && !collectionLength) || offering) && (
      <div className="mt-80 center-align">
        <Button fluid={responsiveVars.isMobile} color="green" inverted content="View All Communities" onClick={handleNavigate} />
      </div>
    )}
  </>
);

const CollectionCards = ({ responsiveVars, collections, collectionLength, toggleHover, isHovered }) => (
  <Container className="collection-listings-box">
    <Card.Group itemsPerRow={responsiveVars.isMobile ? 1 : responsiveVars.isTablet ? 2 : 3}>
      {
        collections.map((collection, i) => (!collectionLength || (i < collectionLength)) && (
          <Card className={get(collection, 'status') !== 'ACTIVE' ? 'border-red' : ''} as={Link} to={`/collections/${get(collection, 'slug')}`} style={{ backgroundColor: get(collection, 'marketing.tombstone.bgColor') }}>
            <div className="collection-inner-img">
              <Image64 reRender originalImg srcUrl={get(collection, 'marketing.tombstone.image.url')} />
              {get(collection, 'marketing.tombstone.tag.text')
                && (
                  <div style={{ backgroundColor: get(collection, 'marketing.tombstone.tag.color') }} className="ns_flgs_box">
                    <p style={{ color: `${get(collection, 'marketing.tombstone.tag.textColor')} !important` }}>{get(collection, 'marketing.tombstone.tag.text')}</p>
                  </div>
                )}
            </div>
            <div className="full-width mt-0 p-36">
              {get(collection, 'marketing.tombstone.bgImage.url')
                && <Image64 reRender bg originalImg className="collection-bg-image" srcUrl={get(collection, 'marketing.tombstone.bgImage.url')} />
              }
              <Header style={{ color: get(collection, 'marketing.tombstone.descriptionColor') }} as="h5">{get(collection, 'marketing.tombstone.title')}</Header>
              <p style={{ color: get(collection, 'marketing.tombstone.descriptionColor') }}><HtmlEditor readOnly content={get(collection, 'marketing.tombstone.description')} /></p>
              <Button inverted onMouseLeave={() => toggleHover(false)} onMouseEnter={() => toggleHover(get(collection, 'id'))} style={{ backgroundColor: isHovered === get(collection, 'id') ? get(collection, 'marketing.tombstone.descriptionColor') : '', color: isHovered === get(collection, 'id') ? get(collection, 'marketing.tombstone.bgColor') : get(collection, 'marketing.tombstone.descriptionColor'), borderColor: get(collection, 'marketing.tombstone.descriptionColor') }} as={Link} to={`/collections/${get(collection, 'slug')}`} className="mt-30 full-width collectionExplore">Explore</Button>
            </div>
          </Card>
        ))}
    </Card.Group>
  </Container>
);

const Heading = ({ responsiveVars }) => (
  <>
    <Header as="h2" textAlign={responsiveVars.isMobile ? '' : 'center'} caption className={`${responsiveVars.isMobile ? 'mb-30 mt-20' : 'mt-40 mb-12'}`}>Communities{' & '}Partners</Header>
    <p className={`${responsiveVars.isMobile ? 'mb-40' : 'center-align mb-70'}`}>
      Browse investment opportunities and businesses organized by communities that matter to you. These include{!responsiveVars.isMobile && <br />}
      geographic areas, industries and interests, and partner organizations that highlight their unique offerings.
    </p>
  </>
);

@inject('uiStore', 'collectionStore', 'nsUiStore')
@withRouter
@observer
export default class CollectionsList extends Component {
  state = { expandCollection: false, isHovered: false }

  toggleHover = (id) => {
    this.setState({ isHovered: id });
  }

  handleNavigate = () => {
    if (this.props.offering) {
      this.props.history.push('/collections');
    } else {
      this.setState({ expandCollection: true });
    }
  }

  render() {
    const { expandCollection } = this.state;
    const { collectionLength, nsUiStore, offering } = this.props;
    const { loadingArray } = nsUiStore;
    const { responsiveVars } = this.props.uiStore;
    const { isMobile, isTablet } = responsiveVars;
    const { publicCollections } = this.props.collectionStore;
    if (loadingArray.includes('getCollections')) {
      return <InlineLoader />;
    }
    return (
      <div className={`${offering ? 'bg-offwhite' : 'bg-offwhite'} ${responsiveVars.uptoTablet ? 'pl-20 pr-20 pt-20 pb-70' : 'pt-70 pb-50'}`}>
        {offering
        && <Heading responsiveVars={responsiveVars} />}
        {publicCollections && publicCollections.length
          ? (expandCollection || isMobile ? (
            <CollectionCards
              collections={publicCollections}
              responsiveVars={responsiveVars}
              toggleHover={this.toggleHover}
              isHovered={this.state.isHovered}
            />
          ) : (
              <CollectionItem
                toggleHover={this.toggleHover}
                isHovered={this.state.isHovered}
                offering={offering}
                handleNavigate={this.handleNavigate}
                collections={publicCollections}
                collectionLength={collectionLength}
                isMobile={isMobile}
                isTablet={isTablet}
                responsiveVars={responsiveVars}
              />
            )
          ) : <InlineLoader text="No record to display." />}
      </div>
    );
  }
}
