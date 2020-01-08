import React, { Component } from 'react';
import { Container, Header, Divider } from 'semantic-ui-react';

export default class IraPromotionTerms extends Component {
  render() {
    return (
      <section>
        <Container>
          <Header as="h2">NextSeed IRA Terms and Conditions</Header>
          <Divider hidden />
          <div className="justify-text legal-desc">
            <p>
              Self-directed IRAs are offered in partnership with our partner custodian,
              GoldStar Trust Company(GoldStar). As consideration for servicing the IRAs,
              GoldStar charges a one-time account opening fee of $25 due at account opening
              and an annual maintenance fee of $65 due at account opening and each
              anniversary thereof. NextSeed will pay the account opening fee and the first
              annual maintenance fee due at account opening and annual maintenance fees for
              the subsequent three years (for a total waiver of four annual fees) for all
              IRAs. NextSeed reserves the right to modify or discontinue this offer at any time.
            </p>
            <p>
              You will be responsible for any fees charged by GoldStar that don’t meet the above
              requirements, including a $100 account termination fee when closing your IRA. See
              the <a className="positive-text" href="https://www.goldstartrust.com/Fees.aspx">GoldStar IRA Fee Schedule</a> for more information.
            </p>
            <p>
              The value of this promotional fee waiver or any other reward you receive may
              constitute taxable income. Gold Star may issue an IRS Form 1099 (or other
              appropriate form) to you that reflects the value received by you.
            </p>
            <p>
              <b>
                NextSeed is not a tax, investment or legal advisor and does not provide any tax,
                investment, or legal advice; please consult your own advisors or IRS guidelines
                to determine whether investing in NextSeed offerings through a self-directed IRA
                is right for you.
              </b>
            </p>
            <p>
              If NextSeed determines in its sole discretion that there has been any abusive,
              wrongful or fraudulent activity, or if any terms of the NextSeed’s Terms of Use
              have been violated, NextSeed reserves the right to suspend or terminate accounts.
              You will be responsible for any fees charged by GoldStar upon such suspension or
              termination
            </p>
          </div>
        </Container>
      </section>
    );
  }
}
