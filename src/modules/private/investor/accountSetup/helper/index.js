class Helper {
  Progress = () => {
    const metaData = {
      'contact-card': {
        step: 0,
        label: 'Verify Identity',
        action: false,
        successMsg: 'Complete',
      },
      'cash-dollar': {
        step: 1,
        label: 'Establish Investor Profile',
        action: false,
        successMsg: 'Complete',
      },
      'bar-line-chart': {
        step: 2,
        label: 'Create Investment Account',
        action: false,
      },
    };
    return metaData;
  }

  StickyNotification = () => {
    const metaData = {
      A: {
        group: 'Investor Account Creation',
        title: '',
        label: 'Check your inbox for a confirmation email from NextSeed, and click the link to verify your address.',
      },
    };
    return metaData.A;
  };
}

export default new Helper();
