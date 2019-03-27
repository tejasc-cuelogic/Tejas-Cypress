import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Container, Header, Divider } from 'semantic-ui-react';

export default class ReferralProgramTerms extends Component {
  render() {
    return (
      <section>
        <Container>
          <Header as="h2">Investor Referral Program Terms and Conditions</Header>
          <Divider hidden />
          <div className="justify-text legal-desc">
            <p>
              The “NextSeed Investor Referral Program” allows NextSeed members that have completed
              the set up of their NextSeed accounts by linking their external bank account to
              their NextSeed account (a “NextSeed Member“) to earn promotional coupon credits
              (“Investment Credits“) toward future investments on NextSeed by referring friends
              to NextSeed. Participation in the NextSeed Investor Referral Program is subject
              to the terms and conditions described herein and any other terms that NextSeed
              may impose.
            </p>
            <Divider hidden />
            <Header as="h5">How to Invite Friends & Earn Investment Credits</Header>
            <p>
              Through the NextSeed Investor Referral Program NextSeed Members may invite friends
              to sign-up for a NextSeed account by sending them a referral link via NextSeed,
              and the NextSeed Member’s efforts in soliciting for NextSeed will be limited to this
              activity. Please send invites only to personal contacts that might appreciate
              receiving these invitations. Referral links should not be published or distributed
              on websites targeting the general public (e.g., coupon websites, public blogs,
              or Wikipedia).
            </p>
            <p>
              NextSeed Members will earn Investment Credits towards future NextSeed investments
              if a referred friend clicks on their referral link to create a valid NextSeed
              account that complies with NextSeed’s <Link className="positive-text" to="/agreements/legal/terms-of-use">Terms of Use</Link>.
            </p>
            <p>
              The referring NextSeed Member will be credited with the Investment Credit of
              $20 for each referred friend that becomes a new NextSeed Member.
            </p>
            <Divider hidden />
            <Header as="h5">Referred Friends</Header>
            <p>
              Referred friends that have signed up using a valid referral link to become a
              NextSeed Member will also receive an Investment Credit of $20 toward their
              next investment on NextSeed. A referred friend may only use one referral link.
              If a referred friend receives referral links from multiple NextSeed Members,
              only the corresponding NextSeed Member of the referral link used by the
              referred friend will receive Investment Credit.
            </p>
            <Divider hidden />
            <Header as="h5">Redeeming Investment Credits</Header>
            <p>
              Investment Credits may only be redeemed on NextSeed. Investment Credits will
              automatically appear as Investment Credits on your account page. The Investment
              Credits will automatically be applied to your next investment. Your existing
              investments or commitments will not be affected in any way.
              <b>
                If unused within five years from the date the Investment Credits are awarded,
                the Investment Credits will expire.
              </b>
              Investment Credits are coupons issued for promotional purposes only; they have
              no cash value and may not be transferred or exchanged for cash.
            </p>
            <p>
              If for any reason you believe that there is a discrepancy regarding your balance
              of Investment Credits, please contact <a className="positive-text" href="mailto:support@nextseed.com">support@nextseed.com</a>. NextSeed may require
              you to submit additional information in order to make a determination regarding
              your balance. All decisions regarding your balance will be final and at
              NextSeed’s sole discretion.
            </p>
            <p>
              You are responsible for any Tax consequences, if any, that may result
              from your use of Investment Credits.
            </p>
            <Divider hidden />
            <Header as="h5">Severability</Header>
            <p>
              If any provision in these terms are held to be invalid, void, or
              unenforceable, such provision (or the part of it that is making it invalid,
              void or unenforceable) will be deleted, but such deletion shall not affect
              the validity of and enforceability of the remaining provisions.
            </p>
            <Divider hidden />
            <Header as="h5">Termination and Changes</Header>
            <p>
              NextSeed may suspend or terminate the NextSeed Investor Referral Program or a
              user’s ability to participate in the program at any time for any reason.
            </p>
            <p>
              If NextSeed determines that there has been any abusive, wrongful or fraudulent
              activity, or if any terms of the NextSeed’s Terms of Use have been violated,
              NextSeed reserves the right to suspend accounts or remove Investment Credits.
              NextSeed reserves the right to review and investigate all referral activities
              and to suspend accounts or modify referrals in our sole discretion as deemed
              fair and appropriate.
            </p>
            <Divider hidden />
            <Header as="h5">Updates to the Terms</Header>
            <p>
              NextSeed can update these terms at any time without prior notice. If NextSeed
              modifies these terms, the modification will be posted on the NextSeed.com
              website, which are effective upon posting. Continued participation in the
              NextSeed Investor Referral Program after any modification shall constitute
              consent to such modification.
            </p>
          </div>
        </Container>
      </section>
    );
  }
}
