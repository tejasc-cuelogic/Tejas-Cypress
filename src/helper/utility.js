/**
 * Some generally used function definations being used at multiple places
 */
import { toast } from 'react-toastify';
import _ from 'lodash';

export class Utility {
  // Default options for the toast
  options = {
    autoClose: 3800,
    position: toast.POSITION.TOP_RIGHT,
    pauseOnHover: true,
    className: 'info',
  };

  /**
   * @desc To show alert notifications to the user
   * reference: https://fkhadra.github.io/react-toastify/
   */
  toast = (msg, alertType, optionsOverride) => {
    if (alertType && _.includes(['error', 'success', 'info', 'warning'], alertType)) {
      toast[alertType](`${msg}`, _.merge({}, this.options, optionsOverride, { className: alertType }));
    } else {
      toast(`${msg}`, _.merge({}, this.options, optionsOverride));
    }
  }

  unMaskInput = maskedInput => (
    maskedInput.split('-').join('')
  )

  guid = () => {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return `${s4()}${s4()}-${s4()}${s4()}`;
  }

  // Reference: https://www.sec.gov/oiea/investor-alerts-and-bulletins/ib_crowdfundingincrease
  getInvestmentLimit = (data) => {
    let limit = 0;
    const refAmount = 107000;
    const referThis = data.annualIncome > data.netWorth ? data.netWorth : data.annualIncome;
    if ((data.annualIncome >= refAmount) && (data.netWorth >= refAmount)) {
      const referThis2 = (referThis * 10) / 100;
      limit = (refAmount > referThis2) ? referThis2 : refAmount;
    } else if ((data.annualIncome < refAmount) || (data.netWorth < refAmount)) {
      const referThis2 = (referThis * 5) / 100;
      limit = (referThis2 < 2200) ? 2200 : referThis2;
    }
    return limit;
  }

  getTotal = (from, key) => {
    const total = 0;
    return from.map(r => total + parseInt(r[key], 0)).reduce((sum, n) => sum + n);
  }

  gAddressClean = (place) => {
    const componentsForAddress = ['route', 'sublocality_level_3', 'sublocality_level_2', 'sublocality_level_1'];
    const componentsForCity = ['locality'];
    const componentForState = ['administrative_area_level_1'];
    const componentForZipCode = ['postal_code'];

    const residentalStreet = [];
    const city = [];
    const state = [];
    const zipCode = [];

    for (let i = 0; i < place.address_components.length; i += 1) {
      const component = place.address_components[i];
      const addressType = component.types[0];

      if (componentsForAddress.includes(addressType)) {
        residentalStreet.push(component.long_name);
      }
      if (componentsForCity.includes(addressType)) {
        city.push(component.long_name);
      }
      if (componentForState.includes(addressType)) {
        state.push(component.long_name);
      }
      if (componentForZipCode.includes(addressType)) {
        zipCode.push(component.long_name);
      }
    }

    return {
      residentalStreet: residentalStreet.join(', '),
      city: city.join(''),
      state: state.join(''),
      zipCode: zipCode.join(''),
    };
  }

  CurrencyFormat = amount => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)

  cryptedSSNNumber = (ssnNumber) => {
    const cyrptedSSNNumber = ssnNumber.replace(/.(?=.{4,}$)/g, '\u2715');
    const formattedSSNNumber = `${cyrptedSSNNumber.substr(0, 3)}-${cyrptedSSNNumber.substr(3, 2)}-${cyrptedSSNNumber.substr(5, 4)}`;
    return formattedSSNNumber;
  }

  encryptNumber = (number) => {
    let encryptedNumber = number.replace(/.(?=.{4,}$)/g, '...');
    encryptedNumber = encryptedNumber.slice(-7);
    return encryptedNumber;
  }
}

export default new Utility();
