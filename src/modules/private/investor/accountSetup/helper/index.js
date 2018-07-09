class Helper {
  Progress = () => {
    const metaData = {
      'contact-card': {
        step: 0,
        label: 'Verify identity',
        action: false,
        successMsg: 'Identity verified',
      },
      'cash-dollar': {
        step: 1,
        label: 'Establish Investor Profile',
        action: false,
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
        label: 'You’re a few steps away from being able to invest!',
      },
    };
    return metaData.A;
  };
}

export default new Helper();
