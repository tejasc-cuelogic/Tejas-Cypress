import React, { Component } from 'react';
import { inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { Header, Grid, Item, Divider, Button, Responsive } from 'semantic-ui-react';
import Aux from 'react-aux';

const isMobile = document.documentElement.clientWidth < 768;

@inject('authStore')
export default class PreferredEquity extends Component {
  render() {
    const { isUserLoggedIn } = this.props.authStore;
    const link = '/auth/register/applynow';
    return (
      <Aux>
        <Header as="h3">Preferred Equity</Header>
        <Grid doubling columns={2} relaxed="very">
          <Grid.Column>
            <Item.Group className={!isMobile && 'question-list'}>
              <Item>
                <Item.Content>
                  <Header as="h5">
                How does it work?
                  </Header>
                  <Item.Description>
                    <p>
                  Selling preferred equity offers greater flexibility for business owners.
                  Payments and dividends are based on actual profits or net cash flow and
                  don’t require collateral in the business.
                    </p>
                    <p>
                  Selling ownership to investors will align your interests and allows investors
                  to share in the success of the business.
                    </p>
                  </Item.Description>
                </Item.Content>
              </Item>
            </Item.Group>
            <Responsive minWidth={993} as={Aux}>
              <Divider hidden />
              {
            isUserLoggedIn ?
            '' :
            <Button as={Link} to={link} secondary>Apply Now</Button>
          }
            </Responsive>
          </Grid.Column>
          <Grid.Column>
            <Item.Group className="question-list">
              <Item>
                <Item.Content>
                  <Header as="h5">
                Who is this option best for?
                  </Header>
                  <Item.Description>
                    <p>There are several situations that make the selling of equity the best
                  choice for a business.
                    </p>
                    <p>Equity may be best for high growth businesses that are looking at a
                  long-term return. Some businesses need to reinvest all their cashflow
                  back into the business to support their long-term growth. Consumer packaged
                  goods companies are a good example.
                    </p>
                    <p>Other instances require that a business raise significant amounts of
                  capital and are at an earlier stage of fundraising.
                    </p>
                    <p>This may also be best for businesses that are also seeking capital that
                  can be leveraged for a larger bank loan or debt raise while eliminating
                  strict remedies if the investment is not paid back timely.
                    </p>
                  </Item.Description>
                </Item.Content>
              </Item>
            </Item.Group>
            <Responsive maxWidth={992} as={Aux}>
              {
            isUserLoggedIn ?
            '' :
            <Button as={Link} to={link} secondary>Apply Now</Button>
          }
            </Responsive>
          </Grid.Column>
        </Grid>
      </Aux>
    );
  }
}
// export default PreferredEquity;
