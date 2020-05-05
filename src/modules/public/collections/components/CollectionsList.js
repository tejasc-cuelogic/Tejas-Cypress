import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { get } from 'lodash';
import { inject, observer } from 'mobx-react';
import { Grid, Container, Button, Header } from 'semantic-ui-react';
import { Image64, InlineLoader } from '../../../../theme/shared';
import HtmlEditor from '../../../shared/HtmlEditor';

const CollectionItem = ({ isMobile, isTablet, responsiveVars, collections, collectionUrl, collectionLength, handleNavigate }) => (
  <>
    {
      collections.map((collection, i) => (!collectionLength || (i < collectionLength)) && (
        <section style={{ backgroundColor: get(collection, 'marketing.tombstone.bgColor') }} key={get(collection, 'id')} className={`${responsiveVars.uptoTablet ? 'pt-50 pb-50' : 'pt-100 pb-100'}`}>
          {get(collection, 'marketing.tombstone.bgImage.url')
            && <Image64 bg originalImg className="collection-bg-image" srcUrl={get(collection, 'marketing.tombstone.bgImage.url')} />
          }
          <Container>
            <Grid>
              <Grid.Column widescreen={4} computer={4} tablet={16} mobile={16}>
                {/* {get(collection, 'marketing.tombstone.tag.text')}
                {get(collection, 'marketing.tombstone.tag.color')} */}
                <Image64 srcUrl={get(collection, 'marketing.tombstone.image.url')} />
              </Grid.Column>
              <Grid.Column widescreen={11} computer={11} tablet={16} mobile={16}>
                <Header as="h3">{get(collection, 'marketing.tombstone.title')}</Header>
                <HtmlEditor readOnly content={get(collection, 'marketing.tombstone.description')} />
                {!isMobile && !isTablet
                  && (
                    <Button as={Link} to={`${collectionUrl}/${get(collection, 'slug')}`} inverted color="green" className="mt-30 mb-30">Explore</Button>
                  )
                }
              </Grid.Column>
            </Grid>
          </Container>
        </section>
      ))
    }
    <div className="mt-50 center-align">
      <Button fluid={responsiveVars.isMobile} color="green" inverted content="View All Collections" onClick={handleNavigate} />
    </div>
  </>
);

const Heading = ({ responsiveVars }) => (
  <>
    <Header as="h2" textAlign={responsiveVars.isMobile ? '' : 'center'} caption className={responsiveVars.isMobile ? 'mb-20 mt-20' : 'mt-50 mb-30'}>Explore Popular Collections</Header>
    <p className={responsiveVars.isMobile ? 'mb-40' : 'center-align mb-80'}>Browse investment opportunities by Collection - featuring exclusive deals from official NextSeed{!responsiveVars.isMobile && <br /> } Partner Organizations, as well as offerings grouped by theme, such as location or security type.</p>
  </>
);

@inject('uiStore', 'collectionStore', 'nsUiStore')
@withRouter
@observer
export default class CollectionsList extends Component {
  handleNavigate = () => {
    if (this.props.offering) {
      this.props.history.push('/collections');
    } else {
      console.log('clicked');
    }
  }

  render() {
    const { match, collectionLength, nsUiStore } = this.props;
    const { loadingArray } = nsUiStore;
    const { responsiveVars } = this.props.uiStore;
    const { isMobile, isTablet } = responsiveVars;
    const { collections } = this.props.collectionStore;
    if (loadingArray.includes('getCollections')) {
      return <InlineLoader />;
    }
    return (
      <>
        <Heading responsiveVars={responsiveVars} />
        {collections && collections.length
        ? (
        <CollectionItem
          handleNavigate={this.handleNavigate}
          collections={collections}
          collectionLength={collectionLength}
          isMobile={isMobile}
          isTablet={isTablet}
          responsiveVars={responsiveVars}
          collectionUrl={match.url}
        />
        ) : <InlineLoader text="No record to display." />}
      </>
    );
  }
}
