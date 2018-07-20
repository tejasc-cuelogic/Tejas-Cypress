import React from 'react';
import { Header, Grid, List, Button, Container, Item } from 'semantic-ui-react';
import MarketingIcon from '../../../../assets/images/business/marketing.svg';
import EscrowIcon from '../../../../assets/images/business/escrow.svg';
import CampaignIcon from '../../../../assets/images/business/campaign.svg';
import PaymentIcon from '../../../../assets/images/business/payment.svg';
import QuestionIcon from '../../../../assets/images/business/questions.svg';
import PreparationIcon from '../../../../assets/images/business/preparation.svg';
import ServicesIcon from '../../../../assets/images/business/services.svg';
import TaxIcon from '../../../../assets/images/business/tax.svg';

const AllInclusive = () => (
  <section className="content-spacer inclusive-banner">
    <Container>
      <Grid relaxed padded="vertically">
        <Grid.Row>
          <Grid.Column floated="left" width={10} verticalAlign="middle" className="side-section inclusive-left-section">
            <Header as="h2">Reach your goals with full-service support included.</Header>
            <p className="mb-30">
            Our one-time fee comes with everything you need to launch, promote and service
            your campaign. Best of all, we only charge you if your offering is successful.
            </p>
            <Item.Group className="horizontal-items">
              <Item>
                <Item.Image size="mini" src={MarketingIcon} />
                <Item.Content>
                  <Item.Header>Marketing</Item.Header>
                  <Item.Meta>Expert advertising, marketing and PR resources.</Item.Meta>
                </Item.Content>
              </Item>
              <Item>
                <Item.Image size="mini" src={EscrowIcon} />
                <Item.Content>
                  <Item.Header>Escrow</Item.Header>
                  <Item.Meta>Handling all banking, escrow and processing fees.</Item.Meta>
                </Item.Content>
              </Item>
              <Item>
                <Item.Image size="mini" src={CampaignIcon} />
                <Item.Content>
                  <Item.Header>Campaign Development</Item.Header>
                  <Item.Meta>Design and content creation services.</Item.Meta>
                </Item.Content>
              </Item>
              <Item>
                <Item.Image size="mini" src={PaymentIcon} />
                <Item.Content>
                  <Item.Header>Payment Processing</Item.Header>
                  <Item.Meta>Collecting commitments and distributing funds.</Item.Meta>
                </Item.Content>
              </Item>
              <Item>
                <Item.Image size="mini" src={QuestionIcon} />
                <Item.Content>
                  <Item.Header>Q&A</Item.Header>
                  <Item.Meta>Facilitating investor questions during the offering.</Item.Meta>
                </Item.Content>
              </Item>
              <Item>
                <Item.Image size="mini" src={PreparationIcon} />
                <Item.Content>
                  <Item.Header>Disclosure Preparation</Item.Header>
                  <Item.Meta>Legal templates and SEC documents.</Item.Meta>
                </Item.Content>
              </Item>
              <Item>
                <Item.Image size="mini" src={ServicesIcon} />
                <Item.Content>
                  <Item.Header>Investor Services</Item.Header>
                  <Item.Meta>Servicing note payments to underlying investors.</Item.Meta>
                </Item.Content>
              </Item>
              <Item>
                <Item.Image size="mini" src={TaxIcon} />
                <Item.Content>
                  <Item.Header>Tax Form Preparation</Item.Header>
                  <Item.Meta>Distributing year-end documents to investors.</Item.Meta>
                </Item.Content>
              </Item>
            </Item.Group>
            <List horizontal className="mb-50">
              <List.Item>
                <List.Header>Learn more</List.Header>
                <List.Icon name="arrow right" color="green" />
                <List.Content as="a">
                Small businesses and NextSeed
                </List.Content>
              </List.Item>
              <List.Item>
                <List.Header>Learn more</List.Header>
                <List.Icon name="arrow right" color="green" />
                <List.Content as="a">
                Commercial real estate and NextSeed
                </List.Content>
              </List.Item>
            </List>
            <div className="center-align">
              <Button primary compact>See How NextSeed Compares</Button>
            </div>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  </section>
);

export default AllInclusive;
