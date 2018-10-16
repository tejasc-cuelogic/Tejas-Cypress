import React from 'react';
import Aux from 'react-aux';
// import { Link } from 'react-router-dom';
import { Header, Grid, List, Divider, Container, Item } from 'semantic-ui-react';
import MarketingIcon from '../../../../assets/images/business/marketing.svg';
import EscrowIcon from '../../../../assets/images/business/escrow.svg';
import CampaignIcon from '../../../../assets/images/business/campaign.svg';
import PaymentIcon from '../../../../assets/images/business/payment.svg';
import QuestionIcon from '../../../../assets/images/business/questions.svg';
import PreparationIcon from '../../../../assets/images/business/preparation.svg';
import ServicesIcon from '../../../../assets/images/business/services.svg';
import TaxIcon from '../../../../assets/images/business/tax.svg';

const isMobile = document.documentElement.clientWidth < 768;

const AllInclusive = () => (
  <Aux>
    <section className="content-spacer">
      <Container>
        <Grid relaxed padded="vertically">
          <Grid.Row>
            <Grid.Column computer={10} tablet={16} mobile={16} verticalAlign="middle" className="side-section">
              <Header as="h2">Reach your goals with full-service support included.</Header>
              <p className="mb-30">
              Our one-time fee comes with everything you need to launch, promote and service
              your campaign. Best of all, we only charge you if your offering is successful.
              </p>
              <Item.Group className="horizontal-items">
                <Item>
                  <Item.Image size="mini" src={MarketingIcon} />
                  <Item.Content>
                    <Item.Header as="h5">Marketing</Item.Header>
                    <Item.Meta>Expert advertising, marketing and PR resources.</Item.Meta>
                  </Item.Content>
                </Item>
                <Item>
                  <Item.Image size="mini" src={EscrowIcon} />
                  <Item.Content>
                    <Item.Header as="h5">Escrow</Item.Header>
                    <Item.Meta>Handling all banking, escrow and processing fees.</Item.Meta>
                  </Item.Content>
                </Item>
                <Item>
                  <Item.Image size="mini" src={CampaignIcon} />
                  <Item.Content>
                    <Item.Header as="h5">Campaign Development</Item.Header>
                    <Item.Meta>Design and content creation services.</Item.Meta>
                  </Item .Content>
                </Item>
                <Item>
                  <Item.Image size="mini" src={PaymentIcon} />
                  <Item.Content>
                    <Item.Header as="h5">Payment Processing</Item.Header>
                    <Item.Meta>Collecting commitments and distributing funds.</Item.Meta>
                  </Item.Content>
                </Item>
                <Item>
                  <Item.Image size="mini" src={QuestionIcon} />
                  <Item.Content>
                    <Item.Header as="h5">Q&A</Item.Header>
                    <Item.Meta>Facilitating investor questions during the offering.</Item.Meta>
                  </Item.Content>
                </Item>
                <Item>
                  <Item.Image size="mini" src={PreparationIcon} />
                  <Item.Content>
                    <Item.Header as="h5">Disclosure Preparation</Item.Header>
                    <Item.Meta>Legal templates and Regulatory filing assistance.</Item.Meta>
                  </Item.Content>
                </Item>
                <Item>
                  <Item.Image size="mini" src={ServicesIcon} />
                  <Item.Content>
                    <Item.Header as="h5">Investor Services</Item.Header>
                    <Item.Meta>Servicing payments to investors.</Item.Meta>
                  </Item.Content>
                </Item>
                <Item>
                  <Item.Image size="mini" src={TaxIcon} />
                  <Item.Content>
                    <Item.Header as="h5">Tax Form Preparation</Item.Header>
                    <Item.Meta>Distributing year-end documents to investors.</Item.Meta>
                  </Item.Content>
                </Item>
              </Item.Group>
              <List horizontal={!isMobile} relaxed className="learn-more-list">
                <List.Item>
                  <List.Header>Learn more</List.Header>
                  {/* <List.Icon className="ns-arrow-right" color="green" /> */}
                  <List.Content>NextSeed and <a href="/">Small businesses</a></List.Content>
                </List.Item>
                <List.Item>
                  {!isMobile &&
                    <List.Header>&nbsp;</List.Header>
                  }
                  {/* <List.Icon className="ns-arrow-right" color="green" /> */}
                  <List.Content>NextSeed and <a href="/">Commercial real estate</a></List.Content>
                </List.Item>
              </List>
              <Divider />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </section>
  </Aux>
);

export default AllInclusive;
