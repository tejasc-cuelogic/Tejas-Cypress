import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { get } from 'lodash';
import { inject, observer } from 'mobx-react';
import { Grid, Container, Button, Header, Card } from 'semantic-ui-react';
import { Image64, InlineLoader } from '../../../../theme/shared';
import HtmlEditor from '../../../shared/HtmlEditor';

const CollectionItem = ({ isMobile, isTablet, responsiveVars, collections, collectionUrl, collectionLength, handleNavigate }) => (
  <>
    {
      collections.map((collection, i) => (!collectionLength || (i < collectionLength)) && (
        <Container key={get(collection, 'id')} className={` offerings-container ${responsiveVars.uptoTablet ? 'pt-50 pb-50 pl-20 pr-20' : 'pt-30 pb-30'}`}>
          <Grid style={{ backgroundColor: get(collection, 'marketing.tombstone.bgColor') }} className="p-36 collection-box">
            <Grid.Column widescreen={4} computer={4} tablet={16} mobile={16} className="show-top">
              {/* {get(collection, 'marketing.tombstone.tag.text')}
                {get(collection, 'marketing.tombstone.tag.color')} */}
              <Image64 srcUrl={get(collection, 'marketing.tombstone.image.url')} />
              <div style={{ backgroundColor: get(collection, 'marketing.tombstone.tag.color') }} className="ns_flgs_box">
                <p>{get(collection, 'marketing.tombstone.tag.text')}</p>
              </div>
            </Grid.Column>
            <Grid.Column widescreen={11} computer={11} tablet={16} mobile={16} className="show-top">
              <Header as="h3">{get(collection, 'marketing.tombstone.title')}</Header>
              <HtmlEditor readOnly content={get(collection, 'marketing.tombstone.description')} />
              {!isMobile && !isTablet
                && (
                  <Button as={Link} to={`${collectionUrl}/${get(collection, 'slug')}`} inverted color="white" className="mt-30 mb-30">Explore</Button>
                )
              }
            </Grid.Column>
            {get(collection, 'marketing.tombstone.bgImage.url')
              && <Image64 bg originalImg className="collection-bg-image" srcUrl={get(collection, 'marketing.tombstone.bgImage.url')} />
            }
          </Grid>
        </Container>
      ))}
    <div className="mt-50 center-align">
      <Button fluid={responsiveVars.isMobile} color="green" inverted content="View All Collections" onClick={handleNavigate} />
    </div>
  </>
);

const CollectionCards = ({ responsiveVars, collections, collectionUrl, collectionLength }) => (
  <Container className="collection-listings-box">
    <Card.Group itemsPerRow={responsiveVars.isMobile ? 1 : 3}>
      {
        collections.map((collection, i) => (!collectionLength || (i < collectionLength)) && (
          <Card as={Link} to={`${collectionUrl}/${get(collection, 'slug')}`} style={{ backgroundColor: get(collection, 'marketing.tombstone.bgColor') }}>
            <Image64 srcUrl={get(collection, 'marketing.tombstone.image.url')} />
            <div style={{ backgroundColor: get(collection, 'marketing.tombstone.tag.color') }} className="ns_flgs_box">
              <p>{get(collection, 'marketing.tombstone.tag.text')}</p>
            </div>
            <div className="full-width mt-0 p-36">
              {get(collection, 'marketing.tombstone.bgImage.url')
                && <Image64 bg originalImg className="collection-bg-image" srcUrl={get(collection, 'marketing.tombstone.bgImage.url')} />
              }
              <Header as="h5">{get(collection, 'marketing.tombstone.title')}</Header>
              <HtmlEditor readOnly content={get(collection, 'marketing.tombstone.description')} />
              <Button as={Link} to={`${collectionUrl}/${get(collection, 'slug')}`} inverted color="white" className="mt-30 full-width">Explore</Button>
            </div>
          </Card>
        ))}
    </Card.Group>
  </Container>
);

const Heading = ({ responsiveVars }) => (
  <>
    <Header as="h2" textAlign={responsiveVars.isMobile ? '' : 'center'} caption className={`bg-offwhite ${responsiveVars.isMobile ? 'mb-20 mt-20' : 'mt-50 mb-30'}`}>Explore Popular Collections</Header>
    <p className={`bg-offwhite ${responsiveVars.isMobile ? 'mb-40' : 'center-align mb-80'}`}>Browse investment opportunities by Collection - featuring exclusive deals from official NextSeed{!responsiveVars.isMobile && <br />} Partner Organizations, as well as offerings grouped by theme, such as location or security type.</p>
  </>
);

@inject('uiStore', 'collectionStore', 'nsUiStore')
@withRouter
@observer
export default class CollectionsList extends Component {
  state = { expandCollection: false }

  handleNavigate = () => {
    if (this.props.offering) {
      this.props.history.push('/collections');
    } else {
      this.setState({ expandCollection: true });
    }
  }

  render() {
    const { expandCollection } = this.state;
    const { match, collectionLength, nsUiStore } = this.props;
    const { loadingArray } = nsUiStore;
    const { responsiveVars } = this.props.uiStore;
    const { isMobile, isTablet } = responsiveVars;
    const { collections } = this.props.collectionStore;
    if (loadingArray.includes('getCollections')) {
      return <InlineLoader />;
    }
    return (
      <div className={`bg-offwhite ${responsiveVars.uptoTablet ? 'pl-20 pr-20 pt-50 pb-50' : 'pt-100 pb-100'}`}>
        <Heading responsiveVars={responsiveVars} />
        {collections && collections.length
          ? (expandCollection || isMobile ? (
            <CollectionCards
              collections={collections}
              responsiveVars={responsiveVars}
              collectionUrl={match.url}
            />
          ) : (
              <CollectionItem
                handleNavigate={this.handleNavigate}
                collections={collections}
                collectionLength={collectionLength}
                isMobile={isMobile}
                isTablet={isTablet}
                responsiveVars={responsiveVars}
                collectionUrl={match.url}
              />
            )
          ) : <InlineLoader text="No record to display." />}
      </div>
    );
  }
}
