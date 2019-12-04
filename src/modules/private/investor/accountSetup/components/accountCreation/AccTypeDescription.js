import React from 'react';
import { Popup } from 'semantic-ui-react';
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
          <p className="mt-80 grey-header">
            NextSeed accounts are provided and held at our partner bank, Happy State Bank DBA GoldStar Trust Company ({'"'}GoldStar{'"'}), 
            which provides FDIC insurance for up to $250,000 of uninvested cash in NextSeed accounts.
          </p>
        )
      }
      { /* IRA */ }
      {isAccExist && value === 1
        && (
        <>
          <p className="grey-header">
            Open a self-directed NextSeed IRA to begin investing in local businesses.
            <br />
            Get the benefits of investing with either a Traditional or Roth IRA.
            <br />
            Minimum opening deposit: $5,000. Investment limits apply.
          </p>
          <p className="grey-header">
            The uninvested cash in your account is{' '}
            <Popup
              content={<span>NextSeed accounts are provided and held at our partner bank, Happy State Bank DBA GoldStar Trust Company ({'"'}GoldStar{'"'}), which provides FDIC insurance for uninvested cash in NextSeed accounts.</span>}
              trigger={<span className="highlight-text">FDIC-insured</span>}
              position="top center"
            />
            {' '}up to $250,000 and is interest-bearing.
            <br />
            We safeguard your information with bank-level security measures.
            <br />Questions? Please see our{' '}
            <Link to="/resources/education-center/investor/faq" target="_blank" className="link">FAQs on IRAs</Link>.
          </p>
          <p className="grey-text">
            NextSeed accounts are provided and held at our partner bank, Happy State Bank DBA
            GoldStar Trust Company ({'"'}GoldStar{'"'}), which provides FDIC insurance for
            up to $250,000 of uninvested cash in NextSeed accounts.
          </p>
        </>
        )
      }
      { /* Entity */ }
      {isAccExist && value === 2
        && (
        <>
          <p className="grey-header">
            Invest in businesses through an Entity investment account. (Note: Investment limits
            for Entity accounts are treated separately from Individual investment accounts)
          </p>
          <p className="grey-header">
            An initial deposit can be quickly and securely completed by linking your entity
            checking account. You can easily connect your account by logging in through our
            secure system or by manually entering your account information.
          </p>
          <p className="grey-header">
            The uninvested cash in your account is{' '}
            <Popup
              content={<span>NextSeed accounts are provided and held at our partner bank, Happy State Bank DBA GoldStar Trust Company ({'"'}GoldStar{'"'}), which provides FDIC insurance for uninvested cash in NextSeed accounts.</span>}
              trigger={<span className="highlight-text">FDIC-insured</span>}
              position="top center"
            />
            {' '}up to $250,000 and is interest-bearing. We safeguard your information with bank-level security measures.
          </p>
          <p className="grey-text">
            NextSeed accounts are provided by and held at our partner bank, Happy State Bank DBA
            GoldStar Trust Company ({'"'}GoldStar{'"'}), which provides FDIC insurance for
            up to $250,000 of uninvested cash in NextSeed accounts.
          </p>
        </>
        )
      }
    </div>
  );
});

export default AccTypeDescription;
