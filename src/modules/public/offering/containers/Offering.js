import React, { Component } from 'react';
import Aux from 'react-aux';
import { Container, Menu, Image, Header } from 'semantic-ui-react';
import Banner from '../components/Banner';
import CampaignList from '../components/CampaignList';
import filterIcon from '../../../../assets/images/icon_filter.png';

class Offering extends Component {
  render() {
    return (
      <Aux>
        <Banner />
        <div className="filter-menu">
          <Container>
            <Menu text>
              <Menu.Item name="filter" className="text-uppercase">
                <Image src={filterIcon} className="filterIcon" />
                 Filter
              </Menu.Item>
              <Menu.Item
                name="50 Results Found"
                position="right"
              />
            </Menu>
          </Container>
        </div>
        <CampaignList
          locked={3}
          heading={<Header as="h5" textAlign="center" caption>Active Campaigns</Header>}
        />
      </Aux>
    );
  }
}

export default Offering;
