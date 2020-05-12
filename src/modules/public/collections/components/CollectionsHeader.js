import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Header, Card, Container, Responsive } from 'semantic-ui-react';
import NSImage from '../../../shared/NSImage';

const HeaderItem = ({ collectionHeader, responsiveVars }) => (
  <section className={responsiveVars.uptoTablet ? 'pt-50 pb-50 ' : 'pt-100 pb-100'}>
    <Header as="h2" className={responsiveVars.isMobile ? 'mb-40 pl-20 pr-20' : 'mb-40 center-align'}>NextSeed Collections</Header>
    <p className={responsiveVars.uptoTablet ? 'mb-20 pl-20 pr-20' : 'mb-70 center-align'}>
      NextSeed Collections represent curated combinations of investment opportunities<Responsive minWidth={992} as="br" /> and businesses, categorized by the communities that matter to you most.
    </p>
    {
      <Container>
        <Card.Group itemsPerRow={responsiveVars.isMobile ? 1 : 3}>
          {
            collectionHeader.map(b => (
              <Card className="bordered center-align">
                <NSImage path={b.image} centered />
                <Card.Content>
                  <Header as="h5">{b.title}</Header>
                  <p>{b.description}</p>
                </Card.Content>
              </Card>
            ))
          }
        </Card.Group>
      </Container>
    }
  </section>
);

@inject('navStore', 'userDetailsStore', 'authStore', 'userStore', 'uiStore')
@withRouter
@observer
class CollectionsHeader extends Component {
  render() {
    const { responsiveVars } = this.props.uiStore;
    const headerList = [
      {
        id: 1,
        title: 'Locations',
        description: 'Explore investments in your neighborhood, hometown, or a region that you know well.',
        image: 'collections/skyline.jpg',
      }, {
        id: 2,
        title: 'Interests & Industries',
        description: 'Identify investments by themes that you find most relevant.',
        image: 'collections/bar.jpg',
      }, {
        id: 3,
        title: 'Partners',
        description: 'Get exclusive access to investment opportunities from vetted Partners in the NextSeed network.',
        image: 'collections/partners.png',
      },
    ];
    return (
      <HeaderItem collectionHeader={headerList} responsiveVars={responsiveVars} />
    );
  }
}

export default CollectionsHeader;
