import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Header, Responsive, Icon, Grid, List, Container } from 'semantic-ui-react';

const FooterItem = ({ collectionFooter, responsiveVars }) => (
  <Container>
    <section className={responsiveVars.uptoTablet ? 'pt-50 pb-50' : 'pt-100 pb-100'}>
      <Grid>
        <Grid.Row>
          <Grid.Column widescreen={7} computer={7} tablet={16} mobile={16} verticalAlign="middle">
            <div className={responsiveVars.isMobile ? 'pb-30' : ''}>
                <Header as="h2">Interested in becoming<Responsive as="br" minWidth={1200} /> a NextSeed Partner?</Header>
                <p className={responsiveVars.isMobile ? 'mb-10 mt-10' : 'mb-20 mt-40'}>
                NextSeed works with investment teams, developers, and various types of organizations to raise capital through our integrated online platform. <br /><br />
                Your group can launch both public and private offerings on NextSeed, while we help you expertly navigate the complex compliance and regulatory requirements.<br /><br />
                Contact us at <a href="mailto:partners@nextseed.com">partners@nextseed.com</a> to learn more.
              </p>
            </div>
          </Grid.Column>
          <Grid.Column className="centered" widescreen={7} computer={7} tablet={16} mobile={16} verticalAlign="middle">
            <List>
              {
                collectionFooter.map(item => (
                  <List.Item key={item.id} className={responsiveVars.isMobile ? 'mt-0 mb-10' : 'mb-20'}>
                    <Header as="h5" className="mb-10">
                      <Icon className="ns-tick" color="grey" style={{ fontSize: '28px' }} />
                      {item.title}
                    </Header>
                    <p className={responsiveVars.isMobile ? 'ml-30' : 'ml-45'}>
                      {item.description}
                    </p>
                  </List.Item>
                ))
              }
            </List>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </section>
  </Container>
);

@inject('uiStore')
@withRouter
@observer
class CollectionsFooter extends Component {
  render() {
    const { responsiveVars } = this.props.uiStore;
    const footerList = [
      {
        id: 1,
        title: 'Integrated Broker-Dealer relationship',
        description: 'NextSeed Securities is an SEC-registered broker-dealer and can facilitate offerings of various security types via Regulation Crowdfunding, Regulation D, or Regulation A+.',
      }, {
        id: 2,
        title: 'Expand your network',
        description: 'Connect with an engaged community of investors to market your projects and investments. Generate awareness while increasing your reach.',
      }, {
        id: 3,
        title: 'Automate your investment operations',
        description: 'NextSeed’s proprietary technology can manage your investors, projects, and distributions all in one place.',
      },
    ];
    return (
      <FooterItem collectionFooter={footerList} responsiveVars={responsiveVars} />
    );
  }
}

export default CollectionsFooter;
