import React, { Component } from 'react';
import Aux from 'react-aux';
import { inject, observer } from 'mobx-react';
import { Route, Link } from 'react-router-dom';
import { Header, Image, Icon, Embed, Grid, Segment, Breadcrumb, Popup, List, Item, Divider, Statistic } from 'semantic-ui-react';
import videoPoster from '../../../../../assets/images/636206632.webp';
import noEarlyBird from '../../../../../assets/images/illustration.png';
import teamMember1 from '../../../../../assets/images/avatar-1.jpg';
import UpdatesModal from './UpdatesModal';

const nsvideos = {
  embed: '218642510',
};

@inject('campaignStore', 'updatesStore')
@observer
class Overview extends Component {
  render() {
    const { campaign } = this.props.campaignStore;
    return (
      <div className="offering-content-spacer">
        <Grid>
          <Grid.Row>
            <Grid.Column widescreen={7} computer={8}>
              <Segment padded>
                <Breadcrumb>
                  <Breadcrumb.Section link><b>About the Company</b></Breadcrumb.Section>
                  <Breadcrumb.Divider icon={{ className: 'ns-chevron-right', color: 'green' }} />
                </Breadcrumb>
                <Header as="h3">Top things to know</Header>
                <p>
                  <b>Industry: </b>{campaign.industry}<br />
                  <b>Investment Type: </b>{campaign.investmentType}
                  <Popup hoverable position="bottom center" trigger={<Icon name="help circle" color="green" />} content={(<span>For every $100 you invest, you are paid a portion of this company&apos;s gross revenue every month until you are paid $190 within 78 months. A 1.0% service fee is deducted from each payment. <a target="blank" href="https://www.nextseed.com/offerings/buffbrew-taproom/#returnsGraphAnchor">See some examples</a>.</span>)} />
                </p>
                <p className="detail-section">{campaign.description}</p>
                <List bulleted relaxed>
                  <List.Item>
                    <strong>Full-service kitchen, over 40 beers</strong>
                    on tap, open 7 days a week
                  </List.Item>
                  <List.Item>
                    <strong>Joining the Sawyer Yards Creative Campus</strong>
                    of 40 acres, 10 buildings,  400+ Studios, 500+ Artists
                  </List.Item>
                  <List.Item>
                    <strong>Get “Free Beer for Life”</strong> with any investment over $1,000
                  </List.Item>
                  <List.Item>
                    Investment secured by a blanket lien on all assets of the business
                  </List.Item>
                </List>
                <div className="mt-30">
                  <Link to="/" className="icon-link">
                    <Icon color="grey" name="facebook" />
                  </Link>
                  <Link to="/" className="icon-link">
                    <Icon color="grey" name="twitter" />
                  </Link>
                  <Link to="/" className="icon-link">
                    <Icon color="grey" name="linkedin in" />
                  </Link>
                  <Link to="/" className="icon-link">
                    <Icon color="grey" name="yelp" />
                  </Link>
                </div>
              </Segment>
            </Grid.Column>
            <Grid.Column widescreen={9} computer={8}>
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
          <Grid.Row columns={3} stackable doubling>
            <Grid.Column>
              <Segment padded>
                <Breadcrumb>
                  <Breadcrumb.Section link><b>View Key Terms</b></Breadcrumb.Section>
                  <Breadcrumb.Divider icon={{ className: 'ns-chevron-right', color: 'green' }} />
                </Breadcrumb>
                <Header as="h4">Revenue Sharing Notes</Header>
                <Grid columns={3} doubling divided className="mt-30">
                  <Grid.Row>
                    <Grid.Column>
                      <Statistic size="mini" className="basic">
                        <Statistic.Label>Multiple <Popup trigger={<Icon name="help circle" color="green" />} content="Lorem Ipsum" position="top center" /></Statistic.Label>
                        <Statistic.Value>1.6x</Statistic.Value>
                      </Statistic>
                    </Grid.Column>
                    <Grid.Column>
                      <Statistic size="mini" className="basic">
                        <Statistic.Label>Revenue Sharing <Popup trigger={<Icon name="help circle" color="green" />} content="Lorem Ipsum" position="top center" /></Statistic.Label>
                        <Statistic.Value>4%</Statistic.Value>
                      </Statistic>
                    </Grid.Column>
                    <Grid.Column>
                      <Statistic size="mini" className="basic">
                        <Statistic.Label>Maturity <Popup trigger={<Icon name="help circle" color="green" />} content="Lorem Ipsum" position="top center" /></Statistic.Label>
                        <Statistic.Value>48 months</Statistic.Value>
                      </Statistic>
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row>
                    <Grid.Column>
                      <Statistic size="mini" className="basic">
                        <Statistic.Label>Payments
                          <Popup
                            trigger={<Icon name="help circle" color="green" />}
                            content="The Issuer will make monthly payments based on the relevant
                            revenue sharing percentage."
                            position="top center"
                          />
                        </Statistic.Label>
                        <Statistic.Value>Monthly</Statistic.Value>
                      </Statistic>
                    </Grid.Column>
                    <Grid.Column>
                      <Statistic size="mini" className="basic">
                        <Statistic.Label>Ownership <Popup trigger={<Icon name="help circle" color="green" />} content="Lorem Ipsum" position="top center" /></Statistic.Label>
                        <Statistic.Value>0%</Statistic.Value>
                      </Statistic>
                    </Grid.Column>
                    <Grid.Column>
                      <Statistic size="mini" className="basic">
                        <Statistic.Label>Type of Raise&nbsp;
                          <Popup
                            trigger={<Icon name="help circle" color="green" />}
                            content={(
                              <Aux>
                                This campaign is raising capital under Regulation CF and
                                Regulation D. For more information on what this means, check out
                                our <a href="/">Education Center.</a>
                              </Aux>
                            )}
                            position="top center"
                            hoverable
                          />
                        </Statistic.Label>
                        <Statistic.Value>Reg CF </Statistic.Value>
                      </Statistic>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Segment>
            </Grid.Column>
            <Grid.Column>
              <Segment padded>
                <Breadcrumb>
                  <Breadcrumb.Section as={Link} to={`${this.props.match.url}/updates`}><b>Latest Update</b></Breadcrumb.Section>
                  <Breadcrumb.Divider icon={{ className: 'ns-chevron-right', color: 'green' }} />
                </Breadcrumb>
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
                        <Link to="/">View Update</Link>
                      </Item.Description>
                    </Item.Content>
                  </Item>
                </Item.Group>
              </Segment>
            </Grid.Column>
            <Grid.Column>
              <Segment padded>
                <Breadcrumb>
                  <Breadcrumb.Section link><b>Bonus Rewards</b></Breadcrumb.Section>
                  <Breadcrumb.Divider icon={{ className: 'ns-chevron-right', color: 'green' }} />
                </Breadcrumb>
                <Header as="h4">Investor Rewards</Header>
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
      </div>
    );
  }
}

export default Overview;
