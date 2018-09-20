import React, { Component } from 'react';
import { Modal, Header, List, Icon, Image, Divider, Grid, Embed } from 'semantic-ui-react';
import campainAboutImg from '../../../../../assets/images/campaign_about.jpg';
import videoPoster from '../../../../../assets/images/636206632.webp';

const nsvideos = {
  embed: '218642510',
};


class CompanyDescriptionModal extends Component {
  handleClose = () => this.props.history.goBack();

  render() {
    return (
      <Modal
        open
        onClose={this.handleClose}
        size="large"
        closeIcon
      >
        <Modal.Header>Company Description</Modal.Header>
        <Modal.Content>
          <Header as="h4">Buffbrew Taproom LLC</Header>
          <p>
            In the six years since its founding, Buffalo Bayou Brewing Company (“Buffbrew”) has
            grown and cultivated a craft brewery that is not only substantial in size, but even
            more importantly, substantive in quality.
          </p>
          <p>
            Their independent and relentless, boundary-pushing approach to craft brewing
            has resulted in an unmatched 70 innovative beer varieties and a business that
            is now Houston’s largest self-distributing brewery. Buffbrew has outgrown its
            brewing space, and it has heard the resounding demand for a dedicated taproom
            and event space. The team recently announced its new location at Sawyer Yards
            (see Chron, Eater, HBJ), which will encompass both an expanded brewing facility
            as well as an opportunity for the community to invest in the new
            <b> Buffbrew Taproom LLC ({'"'}Taproom{'"'})</b>. Buffbrew Taproom will be a new
            business that operates two bars on-site, a full-service kitchen, as well as a
            VIP room and event space for group reservations and larger gatherings at the
            new location.
          </p>
          <Divider section />
          <Grid columns={2} stackable>
            <Grid.Column verticalAlign="middle" textAlign="center">
              <p>
              Over the years, Buffbrew has developed a lineup of products that has drawn an
              adventurous community. Its brewing methods have applied cutting-edge technology,
              technique and unique flavor profiles to achieve a unique and superior taste that
              the team is extremely proud of. As important, its self-distributing model gives
              the business a degree of independence and control over its product that no other
              Houston brewery has matched.
              </p>
            </Grid.Column>
            <Grid.Column>
              <Embed
                id={nsvideos.embed}
                placeholder={videoPoster}
                source="vimeo"
                icon="ns-play"
              />
            </Grid.Column>
          </Grid>
          <Divider section />
          <p>
            The new Sawyer Yards location will allow Buffbrew the space to make beer and host
            guests in a beautifully and thoughtfully designed home. Standing three stories
            tall with over 28,000 square feet, the brewery will welcome a steady flow of beer
            enthusiasts, 7 days a week. The cornerstone of this experience will be the
            state-of-the-art Buffbrew Taproom, with over 40 beers on tap and a full-service
            kitchen serving up an elevated bar food menu.
          </p>
          <Image src={campainAboutImg} fluid centered className="mt-30" />
          <p className="caption-note mb-30">
            Caption. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
            dignissim vitae odio nec pellentesque.
          </p>
          <p>
            The team’s partnership with Method Architecture has been a process in staying true
            to the beloved elements of Buffbrew’s current home on Nolda Street – an immersive,
            picnic-tables-on-concrete feel – while creating a new, unparalleled scenic view.
          </p>
          <p>
            The main taproom will reside on the second floor. On one side, customers will be
            met with 30 feet of large, plate glass windows that directly overlook the tanks
            and brewers at work – a true tank-to-table, or tank-to-tap, experience. In line
            with its “Urban Brewery” designation, taproom patrons will also face magnificent
            Houston views with over 50 feet of downtown-facing windows. With no taller
            buildings standing between the brewery and downtown, the city’s skyline will make
            for a beautiful backdrop for private events, holidays, and any other reason to
            spend an evening on the rooftop patio or party room.
          </p>
          <Header as="h5">
            Breaking ground this winter, the Buffbrew Taproom is expected to open at Sawyer
            Yards at the end of 2018.
          </Header>
          <div className="history-section">
            <Header as="h4">History</Header>
            <List>
              <List.Item className="mb-10">
                <Icon className="ns-flag-line" color="green" />
                <List.Content>
                  <List.Header>January 2012</List.Header>
                  <List.Description>
                    Original Buffalo Bayou Brewery location on Nolda Street opens
                  </List.Description>
                </List.Content>
              </List.Item>
              <List.Item className="mb-10">
                <Icon className="ns-flag-line" color="green" />
                <List.Content>
                  <List.Header>December 2012</List.Header>
                  <List.Description>
                    Barrel production of 750 during first year
                  </List.Description>
                </List.Content>
              </List.Item>
              <List.Item className="mb-10">
                <Icon className="ns-flag-line" color="green" />
                <List.Content>
                  <List.Header>December 2016</List.Header>
                  <List.Description>Barrel production reaches 6,500</List.Description>
                </List.Content>
              </List.Item>
              <List.Item className="mb-10">
                <Icon className="ns-flag-line" color="green" />
                <List.Content>
                  <List.Header>December 2017</List.Header>
                  <List.Description>
                    Releasing in December 2017, “Sweater Weather” will mark the 70th Buff
                    Brew release
                  </List.Description>
                </List.Content>
              </List.Item>
              <List.Item className="mb-10">
                <Icon className="ns-flag-line" color="green" />
                <List.Content>
                  <List.Header>Winter 2017</List.Header>
                  <List.Description>
                    Construction begins at Sawyer Yards
                  </List.Description>
                </List.Content>
              </List.Item>
              <List.Item>
                <Icon className="ns-flag-line" color="green" />
                <List.Content>
                  <List.Header>
                    Winter 2018 Anticipated opening of Buffbrew Taproom at Sawyer Yard
                  </List.Header>
                </List.Content>
              </List.Item>
            </List>
          </div>
        </Modal.Content>
      </Modal>
    );
  }
}

export default CompanyDescriptionModal;
