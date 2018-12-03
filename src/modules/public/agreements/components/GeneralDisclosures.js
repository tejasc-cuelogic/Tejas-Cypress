import React, { Component } from 'react';
import Aux from 'react-aux';
import { Link } from 'react-router-dom';
import { Header, Divider } from 'semantic-ui-react';

export default class GeneralDisclosures extends Component {
  render() {
    return (
      <Aux>
        <Header as="h2">General Disclosures</Header>
        <Divider hidden />
        <div className="justify-text legal-desc">
          <p>
            This website is operated by NextSeed Services LLC (“NextSeed”), which is not a
            registered broker-dealernor funding portal.This website includes content about a
            variety of topics relating to community development, small businesses and investing.
            NextSeed does not give investment advice, endorsement, analysis or recommendations
            with respect to any securities. All securities offerings listed on certain sections
            of this website are being offered by, and all information included on this site is
            the responsibility of, the applicable issuer of such securities. NextSeed has not taken
            any steps to verify the adequacy, accuracy or completeness of any information. Neither
            NextSeed nor any of its officers, directors, agents and employees makes any warranty,
            express or implied, of any kind whatsoever related to the adequacy, accuracy or
            completeness of any information on this site or the use of information on this site.
            By accessing this site and any pages thereof, you agree to be bound by the Terms of Use
            and Privacy Policy.
          </p>
          <p>
            All securities-related activity on this site is conducted by NextSeed Securities, LLC
            (“NextSeed Securities”), an affiliate of NextSeedand a SEC-registered broker-dealer and
            member <Link to="http://www.finra.org/" target="_blank">FINRA</Link>/SIPC, unless otherwise specifically indicated as being conducted by
            NextSeed US LLC (“NextSeed Funding Portal”), anotheraffiliate of NextSeedand a
            SEC-registered Funding Portal and member FINRA, both located at 3 Greenway Plaza, Ste
            110, Houston TX 77046. NextSeed Securities and NextSeed Funding Portal does not make
            investment recommendations and no communication, through this website or in any other
            medium should be construed as a recommendation for any security offered on or off this
            investment platform. Any investments in private placements, any Regulation A offerings,
            or any investment crowdfunding offerings, and in particular any investments in startups
            and small businesses are highly speculative, illiquid,and involve a high degree of risk.
            Investors who cannot afford to lose their entire investment should not invest in
            start-upsor small businesses.
          </p>
          <p>
            Investment crowdfunding, whether offered via Regulation CF, Regulation A, or Regulation
            D, is a relatively new way of raising and investing capital, and is not a proven method
            to make consistent investment returns over time and should not be assumed or relied
            upon as such under any circumstances. Companies seeking startup investments or small
            businesses seeking growth capital through investment crowdfunding tend to be in earlier
            stages of development,and their business model, products and services may not yet be
            fully developed, operational or tested in the public marketplace. There is no guarantee
            that companies will be able to generate sufficient cashflow to 1Need to link Terms of
            Use and Privacy Policy to the actual URL that has them.
          </p>
          <p>
            Service their outstanding debt securities, or that the stated equity valuation and other
            terms are accurate or in agreement with the market or industry valuations.Additionally,
            investors may receive illiquid and/or restricted stock that may be subject to holding
            period requirements and/or liquidity concerns. As a prudent matter, investingin startups
            or small businesses should not be a large part of your overall investment portfolioand
            only completed after careful consideration and consultation with your legal, financial
            and tax advisers. Investments in startups and small businesses are highly illiquid and
            those investors who cannot hold an investment for the long term should not invest.
          </p>
          <p>
            NextSeed Securities and NextSeed Funding Portal do not provide custody services in
            connection any investments made through this website. Customer securities and account
            balancesare held by custodial solutions managed by GoldStar Trust Company (“GoldStar”),
            the trust branch of Happy State Bank headquartered in Amarillo, Texas.
          </p>
        </div>
      </Aux>
    );
  }
}
