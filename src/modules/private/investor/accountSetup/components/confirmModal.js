/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import { useHistory } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Header, Button } from 'semantic-ui-react';

const isMobile = document.documentElement.clientWidth < 768;
const successMessage = 'Check out some of the investment opportunities now available to you as a member of the NextSeed community.';
const processingMessage = <span>While we set up your account, check out some of the investment opportunities now available to you as a member of the NextSeed community.</span>;

const ConfirmModal = inject('iraAccountStore', 'entityAccountStore', 'individualAccountStore', 'uiStore', 'userDetailsStore')(observer((props) => {
  const accountType = 'ira';
  const message = props[`${accountType}AccountStore`].showProcessingModal ? processingMessage : successMessage;
  const history = useHistory();

  const HandleModalCta = () => {
    const { partialInvestNowSessionURL, setPartialInvestmenSession } = props.userDetailsStore;
    if (partialInvestNowSessionURL) {
      history.push(partialInvestNowSessionURL);
      setPartialInvestmenSession();
    } else {
      history.push('/offerings');
      props.uiStore.resetcreateAccountMessage();
    }
  };
  return (
    <>
      <Header as="h4">Thank you for creating a NextSeed account</Header>
      <p className="mt-30 mb-30">
        {message}
      </p>
      <Button fluid={isMobile} onClick={HandleModalCta} primary size="large">Explore Campaigns</Button>
    </>
  );
}));

export const ThankYouStep = {
  name: 'Thank You',
  isValid: false,
  isDirty: false,
  disableNextButton: true,
  isHideName: true,
  disablePrevButton: true,
  component: <ConfirmModal />,
};

export default ConfirmModal;
