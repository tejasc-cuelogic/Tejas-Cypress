import React, { Component } from 'react';
// import Aux from 'react-aux';
import { inject, observer } from 'mobx-react';
import { Route, Link } from 'react-router-dom';
import { Header, Image, Icon, Embed, Grid, Segment, Popup, List, Item, Divider, Statistic, Label } from 'semantic-ui-react';
import videoPoster from '../../../../../assets/images/636206632.jpg';
import noEarlyBird from '../../../../../assets/images/illustration.png';
import teamMember1 from '../../../../../assets/images/avatar-1.jpg';
import UpdatesModal from './Updates';
import KeyTermsModal from './investmentDetails/KeyTermsModal';


const nsvideos = {
  embed: '218642510',
};
const isTabletBoth = document.documentElement.clientWidth >= 768
&& document.documentElement.clientWidth < 1200;
const isTabletLand = document.documentElement.clientWidth >= 992
&& document.documentElement.clientWidth < 1200;

@inject('campaignStore', 'updatesStore')
@observer
class Overview extends Component {
  render() {
    const { campaign } = this.props.campaignStore;
    const { allData } = this.props.updatesStore;
    return (
      <div className="campaign-content-wrapper">
        <Grid stackable doubling>
          <Grid.Row>
            <Grid.Column widescreen={7} largeScreen={8} computer={16} tablet={16}>
              <Segment padded>
                <Header as="h3">
                  <Link to={`${this.props.refLink}/about`}>
                    Top things to know
                    <Icon className="ns-chevron-right" color="green" />
                  </Link>
                </Header>
                <p>
                  <b>Type of Raise:</b> {campaign.investmentType}
                  <Popup hoverable position="bottom center" trigger={<Icon name="help circle" color="green" />} content={(<span>For every $100 you invest, you are paid a portion of this company&apos;s gross revenue every month until you are paid $190 within 78 months. A 1.0% service fee is deducted from each payment. <a target="blank" href="https://www.nextseed.com/offerings/buffbrew-taproom/#returnsGraphAnchor">See some examples</a>.</span>)} />
                  <br />
                  <b>Industry:</b> {campaign.industry}
                </p>
                <p className="detail-section">{campaign.description}</p>
                <List bulleted relaxed className="mb-20">
                  <List.Item>
                    <strong>Full-service kitchen, over 40 beers </strong>
                    on tap, open 7 days a week
                  </List.Item>
                  <List.Item>
                    <strong>Joining the Sawyer Yards Creative Campus </strong>
                    of 40 acres, 10 buildings,  400+ Studios, 500+ Artists
                  </List.Item>
                  <List.Item>
                    <strong>Get “Free Beer for Life”</strong> with any investment over $1,000
                  </List.Item>
                </List>
                <Link to={`${this.props.refLink}/about`}>Read More</Link>
                <div className="mt-50">
                  <Link to="/" className="icon-link mr-10">
                    <Icon color="grey" name="facebook" />
                  </Link>
                  <Link to="/" className="icon-link mr-10">
                    <Icon color="grey" name="twitter" />
                  </Link>
                  <Link to="/" className="icon-link mr-10">
                    <Icon color="grey" name="linkedin in" />
                  </Link>
                  <Link to="/" className="icon-link">
                    <Icon color="grey" name="yelp" />
                  </Link>
                </div>
              </Segment>
            </Grid.Column>
            <Grid.Column widescreen={9} largeScreen={8} computer={16} tablet={16} className={isTabletLand && 'mt-30'}>
              <Segment padded>
                <Embed
                  id={nsvideos.embed}
                  placeholder={videoPoster}
                  source="vimeo"
                  icon="ns-play"
                />
              </Segment>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns={isTabletBoth ? 1 : 3}>
            <Grid.Column>
              <Segment padded className="clearfix">
                <Header as="h4">
                  <Link to={`${this.props.match.url}/keyterms`}>
                    Key Terms
                    <Icon className="ns-chevron-right" color="green" />
                  </Link>
                </Header>
                <Grid columns={3} doubling divided className="vertical-gutter">
                  <Grid.Column>
                    <Statistic size="mini" className="basic">
                      <Statistic.Label><b>Investment Type</b>{' '}
                        <Popup
                          trigger={<Icon name="help circle" color="green" />}
                          content="Lorem Ipsum"
                          position="top center"
                        />
                      </Statistic.Label>
                      <Statistic.Value>Revenue Sharing Note</Statistic.Value>
                    </Statistic>
                  </Grid.Column>
                  <Grid.Column>
                    <Statistic size="mini" className="basic">
                      <Statistic.Label><b>Multiple</b>{' '}
                        <Popup
                          trigger={<Icon name="help circle" color="green" />}
                          content="For every $100 you invest, you are paid a portion of this company's gross revenue every month until you are paid $XXX within YY months. A 1.0% service fee is deducted from each payment."
                          position="top center"
                        />
                      </Statistic.Label>
                      <Statistic.Value>1.6x</Statistic.Value>
                    </Statistic>
                  </Grid.Column>
                  <Grid.Column>
                    <Statistic size="mini" className="basic">
                      <Statistic.Label><b>Maturity</b>{' '}
                        <Popup
                          trigger={<Icon name="help circle" color="green" />}
                          content="If the investors have not been paid in full within [XX] months, the Issuer is required to promptly pay the entire outstanding balance to the investors."
                          position="top center"
                        />
                      </Statistic.Label>
                      <Statistic.Value>48 months</Statistic.Value>
                    </Statistic>
                  </Grid.Column>
                  <Grid.Column>
                    <Statistic size="mini" className="basic">
                      <Statistic.Label><b>Min Investment</b>{''}
                        <Popup
                          trigger={<Icon name="help circle" color="green" />}
                          content="Lorem Ipsum"
                          position="top center"
                          hoverable
                        />
                      </Statistic.Label>
                      <Statistic.Value>$100</Statistic.Value>
                    </Statistic>
                  </Grid.Column>
                  <Grid.Column>
                    <Statistic size="mini" className="basic">
                      <Statistic.Label><b>Payments</b>{' '}
                        <Popup
                          trigger={<Icon name="help circle" color="green" />}
                          content="The Issuer will make monthly payments based on the relevant revenue sharing percentage."
                          position="top center"
                        />
                      </Statistic.Label>
                      <Statistic.Value>Monthly</Statistic.Value>
                    </Statistic>
                  </Grid.Column>
                  <Grid.Column>
                    <Statistic size="mini" className="basic">
                      <Statistic.Label><b>Ownership</b>{' '}
                        <Popup
                          trigger={<Icon name="help circle" color="green" />}
                          content="Equity interest in the Issuer or voting or management rights with respect to the Issuer as a result of an investment in Securities. "
                          position="top center"
                        />
                      </Statistic.Label>
                      <Statistic.Value>0%</Statistic.Value>
                    </Statistic>
                  </Grid.Column>
                </Grid>
                <Link to={`${this.props.match.url}/keyterms`} className="pull-right mt-10">View More</Link>
              </Segment>
            </Grid.Column>
            <Grid.Column className={isTabletLand && 'mt-30'}>
              <Segment padded>
                <Header as="h4">
                  <Link to={`${this.props.refLink}/updates`}>
                    Updates
                    <Label circular horizontal color="blue">{allData.length}</Label>
                    <Icon className="ns-chevron-right" color="green" />
                  </Link>
                </Header>
                <Item.Group className="campaign-updates">
                  <Item>
                    <Item.Content>
                      <Item.Image floated="left" size="mini" src={teamMember1} />
                      <Item.Header>Rassul Zarnifar</Item.Header>
                      <Item.Meta>March 10, 2018</Item.Meta>
                      <Divider />
                      <Item.Description>
                        <p><b>Closing campaign early!</b></p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
                        velit esse cillum dolore eu fugiat nulla pariatur....
                        <Link to={`${this.props.refLink}/updates`}>View Update</Link>
                      </Item.Description>
                    </Item.Content>
                  </Item>
                </Item.Group>
              </Segment>
            </Grid.Column>
            <Grid.Column className={isTabletLand && 'mt-30'}>
              <Segment padded>
                <Header as="h4">
                  <Link to={`${this.props.refLink}/bonus-rewards`}>
                    Investor Rewards
                    <Icon className="ns-chevron-right" color="green" />
                  </Link>
                </Header>
                <Image src={noEarlyBird} className="no-early-bird" />
                <p className="center-align"><b>Invest more, recieve more.</b></p>
                <p className="early-bird-desc center-align">
                  See the bonus rewards BuffBrew Taproom is offering for higher
                  levels of investment.
                </p>
              </Segment>
              {/* <Segment padded>
                <Breadcrumb>
                  <Breadcrumb.Section>Bonus Rewards</Breadcrumb.Section>
                  <Breadcrumb.Divider icon={{ className: 'ns-chevron-right' }} />
                </Breadcrumb>
                <Header as="h3">Early Bird Rewards</Header>
              </Segment> */}
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Route path={`${this.props.match.url}/updates`} component={UpdatesModal} />
        <Route path={`${this.props.match.url}/keyterms`} component={KeyTermsModal} />
      </div>
    );
  }
}

export default Overview;
