import React from 'react';
import { Header, Popup } from 'semantic-ui-react';
import { observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import find from 'lodash/find';

const isMobile = document.documentElement.clientWidth < 768;
const AccTypeDescription = observer((props) => {
  const { value, values } = props.accTypes;
  const isAccExist = find(values, v => v.value === value);
  return (
    <div className={isMobile ? '' : 'option-details'}>
      { /* Individual */ }
      {isAccExist && value === 0
        && (
        <>
          <p>
            An initial deposit can be quickly and securely completed by linking your checking account. You can easily connect your account by logging in through our secure system or by manually entering your account information. We safeguard your account information. NextSeed accounts are provided and held at our partner bank, Happy State Bank DBA GoldStar Trust Company ({'"'}GoldStar{'"'}), which is interest-bearing and provides{' '}
            <Popup
              content={<span>NextSeed accounts are provided and held at our partner bank, Happy State Bank DBA GoldStar Trust Company ({'"'}GoldStar{'"'}), which provides FDIC insurance for uninvested cash in NextSeed accounts.</span>}
              trigger={<span className="highlight-text">FDIC insurance</span>}
              position="top center"
            />
            {' '}for up to $250,000 for uninvested cash in NextSeed accounts.
          </p>
          <p>
            NextSeed accounts are provided and held at our partner bank, Happy State Bank DBA GoldStar Trust Company ({'"'}GoldStar{'"'}), which provides{' '}
            <Popup
              content={<span>NextSeed accounts are provided and held at our partner bank, Happy State Bank DBA GoldStar Trust Company ({'"'}GoldStar{'"'}), which provides FDIC insurance for uninvested cash in NextSeed accounts.</span>}
              trigger={<span className="highlight-text">FDIC insurance</span>}
              position="top center"
            />
            {' '}for uninvested cash in NextSeed accounts.
          </p>
          <p className="grey-text">
            NextSeed accounts are provided and held at our partner bank, Happy State Bank DBA GoldStar Trust Company ({'"'}GoldStar{'"'}), which provides FDIC insurance for uninvested cash in NextSeed accounts.
          </p>
        </>
        )
      }
      { /* IRA */ }
      {isAccExist && value === 1
        && (
        <>
          <p>
            Open a self-directed NextSeed IRA to begin investing in local businesses.
            Get the benefits of investing with either a Traditional or Roth IRA.
            Minimum opening deposit: $5,000.   Investment limits apply.
          </p>
          <p>
            The uninvested cash in your account is{' '}
            <Popup
              content={<span>NextSeed accounts are provided and held at our partner bank, Happy State Bank DBA GoldStar Trust Company ({'"'}GoldStar{'"'}), which provides FDIC insurance for uninvested cash in NextSeed accounts.</span>}
              trigger={<span className="highlight-text">FDIC-insured</span>}
              position="top center"
            />
            {' '}up to $250,000 and is
            interest-bearing. We safeguard your information with bank-level security measures.
            <br />Questions? Please see our{' '}
            <Link to="/resources/education-center/investor/faq" target="_blank" className="link">FAQs on IRAs</Link>.
          </p>
          <p className="grey-text">
            NextSeed is not a tax, investment or legal advisor and does not provide any tax,
            investment, or legal advice; please consult your own advisors or IRS guidelines to
            determine whether investing in NextSeed offerings through a self-directed IRA is
            right for you.
          </p>
        </>
        )
      }
      { /* Entity */ }
      {isAccExist && value === 2
        && (
        <>
          <p>
            Invest in businesses through an Entity investment account. (Note: Investment limits
            for Entity accounts are treated separately from Individual investment accounts)
          </p>
          <p>
            An initial deposit can be quickly and securely completed by linking your entity
            checking account. You can easily connect your account by logging in through our
            secure system or by manually entering your account information.
          </p>
          <p>
            The uninvested cash in your account is{' '}
            <Popup
              content={<span>NextSeed accounts are provided and held at our partner bank, Happy State Bank DBA GoldStar Trust Company ({'"'}GoldStar{'"'}), which provides FDIC insurance for uninvested cash in NextSeed accounts.</span>}
              trigger={<span className="highlight-text">FDIC-insured</span>}
              position="top center"
            />
            {' '}up to $250,000 and is
            interest-bearing. We safeguard your information with bank-level security measures.
          </p>
          <p className="grey-text">
            NextSeed accounts are provided and held at our partner bank, Happy State Bank DBA
            GoldStar Trust Company ({'"'}GoldStar{'"'}), which provides FDIC insurance for
            uninvested cash in NextSeed accounts.
          </p>
        </>
        )
      }
    </div>
  );
});

export default AccTypeDescription;
