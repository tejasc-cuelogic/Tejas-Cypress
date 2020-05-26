import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Header, Item, Container, Responsive } from 'semantic-ui-react';
import NSImage from '../../../shared/NSImage';

const HeaderItem = ({ collectionHeader, responsiveVars }) => (
  <section className={responsiveVars.uptoTablet ? 'pt-50 pb-50 ' : 'pt-100 pb-100'}>
    <Header as="h2" className={responsiveVars.isMobile ? 'mb-40 pl-20 pr-20' : 'mb-40 center-align'}>Explore Communities{' & '}Partners</Header>
    <p className={responsiveVars.uptoTablet ? 'mb-20 pl-20 pr-20' : 'mb-70 center-align'}>
      Browse curated combinations of investment opportunities and businesses,<Responsive minWidth={992} as="br" />
      categorized by the Communities that matter to you most.
    </p>
    {
      <Container>
        <Item.Group className="horizontal-items home-page">
        {collectionHeader.map(b => (
          <Item>
            <div className="ui mini image">
              <NSImage path={b.icon} />
            </div>
            <Item.Content>
              <Item.Header as="h6">{b.title}</Item.Header>
              <Item.Meta>{b.description}</Item.Meta>
            </Item.Content>
          </Item>
        ))
        }
        </Item.Group>
        {/* <Card.Group itemsPerRow={responsiveVars.isMobile ? 1 : 3}>
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
        </Card.Group> */}
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
        description: 'Search in your neighborhood, hometown, or region.',
        icon: 'icons/iconLocation.svg',
      }, {
        id: 2,
        title: 'Interests & Industries',
        description: 'Invest in the categories you find most relevant.',
        icon: 'icons/iconSearch.svg',
      }, {
        id: 3,
        title: 'Partners',
        description: 'Exclusive opportunities from vetted Partners in the NextSeed network.',
        icon: 'icons/networkIcon.svg',
      },
    ];
    return (
      <HeaderItem collectionHeader={headerList} responsiveVars={responsiveVars} />
    );
  }
}

export default CollectionsHeader;
