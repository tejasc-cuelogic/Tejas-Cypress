import React from 'react';
// import { Link } from 'react-router-dom';
import { Grid, Image, Header, Divider, Embed, Icon, List } from 'semantic-ui-react';
import CampaignSideBar from './CampaignSideBar';
import videoPoster from '../../../../assets/images/636206632.webp';
import campainAboutImg from '../../../../assets/images/campaign_about.png';

const nsvideos = {
  embed: '218642510',
};

const aboutOffer = () => (
  <div className="offer-details">
    <CampaignSideBar />
    <div className="offering-wrapper">
      <Grid>
        <Grid.Row>
          <Grid.Column width={12}>
            <div className="campaign-about-wrapper">
              <div className="carousel">
                <Image src={videoPoster} />
              </div>
              <Header as="h3">Buffbrew Taproom LLC</Header>
              <p>
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem
                accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
                quae ab illo inventore veritatis et quasi architecto beatae vitae
                dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas
                sit aspernatur aut odit aut fugit, sed quia consequuntur magni
                dolores eos qui ratione voluptatem sequi nesciunt. Neque porro
                quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur,
                adipisci velit, sed quia non numquam eius modi tempora incidunt ut
                labore et dolore magnam aliquam quaerat voluptatem. Sed ut perspiciatis
                unde omnis iste natus error sit voluptatem accusantium doloremque laudantium,
                totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi
                architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem
                quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur
                magni dolores eos qui ratione voluptatem sequi nesciunt.
              </p>
              <Divider />
              <Grid columns={2} stackable>
                <Grid.Column verticalAlign="middle" textAlign="center">
                  <p>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                  tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                  quis nostrud exercitation ullamco laboris nisi.
                  </p>
                </Grid.Column>
                <Grid.Column>
                  <Embed
                    id={nsvideos.embed}
                    placeholder={videoPoster}
                    source="vimeo"
                  />
                </Grid.Column>
              </Grid>
              <Divider />
              <p>
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem
                accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
                quae ab illo inventore veritatis et quasi architecto beatae vitae
                dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas
                sit aspernatur aut odit aut fugit, sed quia consequuntur magni
                dolores eos qui ratione voluptatem sequi nesciunt. Neque porro
                quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur,
                adipisci velit, sed quia non numquam eius modi tempora incidunt ut
                labore et dolore magnam aliquam quaerat voluptatem.
              </p>
              <Image src={campainAboutImg} centered />
              <p className="note">
                Caption. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Vivamus dignissim vitae odio nec pellentesque.
              </p>
              <p>
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem
                accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
                quae ab illo inventore veritatis et quasi architecto beatae vitae
                dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas
                sit aspernatur aut odit aut fugit, sed quia consequuntur magni
                dolores eos qui ratione voluptatem sequi nesciunt. Neque porro
                quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur,
                adipisci velit, sed quia non numquam eius modi tempora incidunt ut
                labore et dolore magnam aliquam quaerat voluptatem.
              </p>
              <Header as="h5">
                Breaking ground this winter, the Buffbrew Taproom is expected to open at Sawyer
                Yards at the end of 2018.
              </Header>

              <div className="history-section">
                <Header as="h3">History</Header>
                <List>
                  <List.Item>
                    <Icon name="flag outline" />
                    <List.Content>
                      <List.Header>January 2012</List.Header>
                      <List.Description>
                        Original Buffalo Bayou Brewery location on Nolda Street opens
                      </List.Description>
                    </List.Content>
                  </List.Item>
                  <List.Item>
                    <Icon name="flag outline" />
                    <List.Content>
                      <List.Header>December 2012</List.Header>
                      <List.Description>
                        Barrel production of 750 during first year
                      </List.Description>
                    </List.Content>
                  </List.Item>
                  <List.Item>
                    <Icon name="flag outline" />
                    <List.Content>
                      <List.Header>December 2012</List.Header>
                      <List.Description>
                        Barrel production of 750 during first year
                      </List.Description>
                    </List.Content>
                  </List.Item>
                  <List.Item>
                    <Icon name="flag outline" />
                    <List.Content>
                      <List.Header>December 2012</List.Header>
                      <List.Description>
                        Barrel production of 750 during first year
                      </List.Description>
                    </List.Content>
                  </List.Item>
                  <List.Item>
                    <Icon name="flag outline" />
                    <List.Content>
                      <List.Header>December 2012</List.Header>
                      <List.Description>
                        Barrel production of 750 during first year
                      </List.Description>
                    </List.Content>
                  </List.Item>
                  <List.Item>
                    <Icon name="flag checkered" />
                    <List.Content>
                      <List.Header>
                        Winter 2018 Anticipated opening of Buffbrew Taproom at Sawyer Yard
                      </List.Header>
                    </List.Content>
                  </List.Item>
                </List>
              </div>
            </div>
          </Grid.Column>
          <Grid.Column width={4}>
            <div className="campaign-right-sidebar" />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  </div>
);

export default aboutOffer;
