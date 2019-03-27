import React, { Component } from 'react';
import { Container, Header, Divider } from 'semantic-ui-react';

export default class AccreditedIncentiveTerms extends Component {
  render() {
    return (
      <section>
        <Container>
          <Header as="h2">Accredited Investor Verification Incentive Program Terms and Conditions</Header>
          <Divider hidden />
          <div className="justify-text legal-desc">
            <p>
              The “NextSeed Accredited Investor Verification Program” (<b>“AIV Program”</b>) allows
              NextSeed members that have completed the setup of their NextSeed accounts by linking
              their external bank account to their NextSeed account (a <b>“NextSeed Member”</b>)
              to earn promotional coupon credits (<b>“Investment Credits“</b>) toward future
              investments on NextSeed by verifying their accredited investor status on NextSeed.
              Participation in the AIV Program is subject to the terms and conditions described
              herein and any other terms that NextSeed may impose.
            </p>
            <Divider hidden />
            <Header as="h5">How to Verify Your Accredited Investor Status & Earn Investment Credits</Header>
            <p>
              Through the AIV Program, NextSeed Members may navigate to their NextSeed Investor
              Account and follow the steps in the wizard to walk them through the verification
              of their accredited investor status, identifying how they qualify as an accredited
              investor and then providing the requested evidence to support that status
              (documentation or letters from applicable legal, financial or accounting advisers).
              Upon submission, a NextSeed representative will verify the documentation and
              confirm the member’s status.
            </p>
            <p>
              Upon completion of the verification process, NextSeed Members will earn an
              investment credit towards future NextSeed investments.
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
              Investment Credits are coupons issued for promotional purposes
              only; they have no cash value and may not be transferred or exchanged for cash.
            </p>
            <p>
              If for any reason you believe that there is a discrepancy regarding your balance
              of Investment Credits, please contact <a className="positive-text" href="mailto:support@nextseed.com">support@nextseed.com</a>. NextSeed may require
              you to submit additional information in order to make a determination regarding
              your Investment Credit balance. All decisions regarding your Investment Credit
              balance will be final and at NextSeed’s sole discretion.
            </p>
            <p>
              You are responsible for the tax consequences, if any, that may result from your
              use of Investment Credits.
            </p>
            <Divider hidden />
            <Header as="h5">Severability</Header>
            <p>
              If any provision in these terms are held to be invalid, void, or unenforceable,
              such provision (or the part of it that is making it invalid, void or
              unenforceable) will be deleted, but such deletion shall not affect the validity
              of and enforceability of the remaining provisions.
            </p>
            <Divider hidden />
            <Header as="h5">Termination and Changes</Header>
            <p>
              NextSeed may suspend or terminate the AIV Program or a user’s ability to
              participate in the program at any time for any reason.
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
              modifies these terms, the modification will be posted on the NextSeed.com website,
              which are effective upon posting. Continued participation in the AIV Program after
              any modification shall constitute consent to such modification.
            </p>
          </div>
        </Container>
      </section>
    );
  }
}
