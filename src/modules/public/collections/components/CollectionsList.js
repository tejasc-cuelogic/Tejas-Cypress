import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Grid, Container, Button, Header } from 'semantic-ui-react';
import NSImage from '../../../shared/NSImage';

const CollectionItem = ({ isMobile, isTablet, responsiveVars, collections, collectionUrl }) => (
  <>
    {
      collections.map(collection => (
        <section key={collection.id} className={`${responsiveVars.uptoTablet ? 'pt-50 pb-50' : 'pt-100 pb-100'} bg-${collection.marketing.tombstone.bgColor}`}>
          <Container>
            <Grid>
              <Grid.Column widescreen={4} computer={4} tablet={16} mobile={16}>
                {/* {collection.marketing.tombstone.tag &&
                  <Nstag content={collection.marketing.tombstone.tag.text} color={collection.marketing.tombstone.tag.color} />
                } */}
                <NSImage path={collection.marketing.tombstone.image} />
              </Grid.Column>
              <Grid.Column widescreen={11} computer={11} tablet={16} mobile={16}>
                <Header as="h3">{collection.marketing.tombstone.title}</Header>
                <p className="mb-30">{collection.marketing.tombstone.description}</p>
                {!isMobile && !isTablet
                  && (
                  <a href={`${collectionUrl}/${collection.slug}`} target="_blank" rel="noopener noreferrer"><Button inverted color="green" className="mb-30">Explore</Button></a>
                  )
                }
              </Grid.Column>
            </Grid>
          </Container>
        </section>
      ))
    }
    <div className="mt-50 center-align">
      <Button fluid={responsiveVars.isMobile} color="green" inverted content="View All Collections" />
    </div>
  </>
);

const Heading = ({ responsiveVars }) => (
  <>
    <Header as="h2" textAlign={responsiveVars.isMobile ? '' : 'center'} caption className={responsiveVars.isMobile ? 'mb-20 mt-20' : 'mt-50 mb-30'}>Collections</Header>
    <p className={responsiveVars.isMobile ? 'mb-40' : 'center-align mb-80'}>Browse investment opportunities by Collection - featuring exclusive deals from official NextSeed{!responsiveVars.isMobile && <br /> } Partner Organizations, as well as offerings grouped by theme, such as location or security type.</p>
  </>
);

@inject('uiStore', 'collectionStore')
@withRouter
@observer
export default class CollectionsList extends Component {
  render() {
    const { match } = this.props;
    const { responsiveVars } = this.props.uiStore;
    const { isMobile, isTablet } = responsiveVars;
    const { collections } = this.props.collectionStore;
    return (
      <>
        <Heading responsiveVars={responsiveVars} />
        <CollectionItem
          collections={collections}
          isMobile={isMobile}
          isTablet={isTablet}
          responsiveVars={responsiveVars}
          collectionUrl={match.url}
        />
      </>
    );
  }
}
