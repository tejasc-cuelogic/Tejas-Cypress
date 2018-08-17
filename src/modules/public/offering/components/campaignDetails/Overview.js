import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Route, Link } from 'react-router-dom';
import { Header, Image, Icon, Embed, Statistic, Grid, Menu, Label, Divider, Segment, Breadcrumb, Popup, List } from 'semantic-ui-react';
import videoPoster from '../../../../../assets/images/636206632.webp';
import noEarlyBird from '../../../../../assets/images/illustration.png';
import UpdatesModal from './UpdatesModal';

const nsvideos = {
  embed: '218642510',
};

@inject('campaignStore', 'updatesStore')
@observer
class Overview extends Component {
  render() {
    const { campaign } = this.props.campaignStore;
    const { allData } = this.props.updatesStore;
    return (
      <div className="offering-content-spacer">
        <div className="quick-bar">
          <Menu secondary>
            <Menu.Item name="home" as={Link} to={`${this.props.match.url}/updates`}>
              <Icon name="list alternate outline" />
              Updates
              <Label circular color="blue" key="blue">{allData.length}</Label>
            </Menu.Item>
            <Menu.Menu position="right">
              <Menu.Item name="home">
                <Icon name="list alternate outline" />
                Trending
              </Menu.Item>
              <Menu.Item as="span" className="span">
                35 views | 8 investments
              </Menu.Item>
            </Menu.Menu>
          </Menu>
        </div>
        <Grid>
          <Grid.Row>
            <Grid.Column width={16}>
              <Segment padded>
                <Grid stackable>
                  <Grid.Row>
                    <Grid.Column width={6}>
                      <Breadcrumb>
                        <Breadcrumb.Section>About the Company</Breadcrumb.Section>
                        <Breadcrumb.Divider icon={{ className: 'ns-chevron-right' }} />
                      </Breadcrumb>
                      <Header as="h3">Top things to know</Header>
                      <p><b>Industry: </b>{campaign.industry}<br />
                        <b>Investment Type: </b>{campaign.investmentType}
                        <Popup hoverable position="bottom center" trigger={<Icon name="help circle" color="green" />} content={(<span>For every $100 you invest, you are paid a portion of this company&apos;s gross revenue every month until you are paid $190 within 78 months. A 1.0% service fee is deducted from each payment. <a target="blank" href="https://www.nextseed.com/offerings/buffbrew-taproom/#returnsGraphAnchor">See some examples</a>.</span>)} />
                      </p>
                      <p className="detail-section">{campaign.description}</p>
                      <Divider section />
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
                    </Grid.Column>
                    <Grid.Column width={10}>
                      <Embed
                        id={nsvideos.embed}
                        placeholder={videoPoster}
                        source="vimeo"
                      />
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Segment>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={12}>
              <Segment padded>
                <Breadcrumb>
                  <Breadcrumb.Section>Investment Details</Breadcrumb.Section>
                  <Breadcrumb.Divider icon={{ className: 'ns-chevron-right' }} />
                </Breadcrumb>
                <Header as="h3" className="mb-30">Investment Return Calculator</Header>
                <Grid columns={4} divided doubling className="investment-grid" padded="horizontally">
                  <Grid.Column>
                    <Statistic size="mini" className="basic">
                      <Statistic.Label>Investment Multiple</Statistic.Label>
                      <Statistic.Value>1.70x–1.90x</Statistic.Value>
                      <p>
                        Monthly gross revenue to be shared is 6.5%.
                        <Popup trigger={<Icon name="help circle" />} content="Help!" position="top center" />
                      </p>
                    </Statistic>
                  </Grid.Column>
                  <Grid.Column>
                    <Statistic size="mini" className="basic">
                      <Statistic.Label>Maturity*</Statistic.Label>
                      <Statistic.Value>78 months</Statistic.Value>
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        <Popup trigger={<Icon name="help circle" />} content="Help!" position="top center" />
                      </p>
                    </Statistic>
                  </Grid.Column>
                  <Grid.Column>
                    <Statistic size="mini" className="basic">
                      <Statistic.Label>Your Investment</Statistic.Label>
                      <Statistic.Value>$25,000</Statistic.Value>
                      <div className="slidecontainer">
                        <input type="range" min="1" max="100" value="10" className="slider" id="myRange" />
                      </div>
                    </Statistic>
                  </Grid.Column>
                  <Grid.Column>
                    <Statistic size="mini" className="basic">
                      <Statistic.Label>Total Payment*</Statistic.Label>
                      <Statistic.Value>
                        $42,500
                        <br />–<br />
                        $47,500
                      </Statistic.Value>
                    </Statistic>
                  </Grid.Column>
                </Grid>
                <p className="note">
                  * For illustration only. See expanded Payment Calculator view to
                  read more regarding actual performance variables.
                </p>
              </Segment>
            </Grid.Column>
            <Grid.Column width={4}>
              <Segment padded>
                <Breadcrumb>
                  <Breadcrumb.Section>Bonus Rewards</Breadcrumb.Section>
                  <Breadcrumb.Divider icon={{ className: 'ns-chevron-right' }} />
                </Breadcrumb>
                <Header as="h3">Investor Rewards</Header>
                <Image src={noEarlyBird} className="no-early-bird" />
                <p className="early-bird-title">Invest more, recieve more.</p>
                <p className="early-bird-desc">
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
