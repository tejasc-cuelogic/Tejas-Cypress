import { DataFormatter } from '../../../../../helper';

class Helper {
  Progress = () => {
    const metaData = {
      'contact-card': {
        step: 0,
        label: 'Verify Identity',
        action: false,
        successMsg: 'Complete',
        route: 'identity-verification/0',
        altRoute: 'identity-verification/3',
        emailVerificationRoute: '/auth/confirm-email',
      },
      'cash-dollar': {
        step: 1,
        label: 'Establish Investor Profile',
        action: false,
        successMsg: 'Complete',
        route: 'establish-profile',
      },
      'bar-line-chart': {
        step: 2,
        label: 'Create Investment Account',
        action: false,
        route: 'account-creation',
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

  eleToUpperCaseInArray = (givenArray) => {
    const upperCaseEleArray = givenArray.map((item) => {
      if (item === 'ira') {
        return item.toUpperCase();
      }
      return DataFormatter.upperCamelCase(item);
    });
    return upperCaseEleArray;
  }
}

export default new Helper();
