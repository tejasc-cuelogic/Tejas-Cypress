/**
 * Some generally used function definations being used at multiple places
 */
import { toast } from 'react-toastify';
import _ from 'lodash';
import apiService from '../api/restApi';

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

  getTotal = (from, key) => {
    const total = 0;
    return from.map(r => total + parseInt(r[key], 0)).reduce((sum, n) => sum + n);
  }

  gAddressClean = (place) => {
    let result = {};
    const addressMap = {
      residentalStreet: ['street_number', 'route', 'sublocality_level_1', 'sublocality_level_2', 'sublocality_level_3'],
      city: ['locality'],
      state: ['administrative_area_level_1'],
      zipCode: ['postal_code'],
    };
    Object.keys(addressMap).map(aK => place.address_components.map((c) => {
      if (_.intersection(addressMap[aK], c.types).length > 0) {
        const addressEle = {};
        addressEle[aK] = addressMap[aK].length > 2 && result[aK] ? `${result[aK]} ${c.long_name}` : c.long_name;
        result = _.has(result, aK) ? addressEle : { ...result, ...addressEle };
      }
      return result;
    }));
    return result;
  }

  CurrencyFormat = (amount, f) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: typeof (f) === 'number' ? f : 2 }).format(amount)

  cryptedSSNNumber = (ssnNumber) => {
    if (!ssnNumber) return null;
    const cyrptedSSNNumber = ssnNumber.replace(/.(?=.{4,}$)/g, '\u2715');
    const formattedSSNNumber = `${cyrptedSSNNumber.substr(0, 3)}-${cyrptedSSNNumber.substr(3, 2)}-${cyrptedSSNNumber.substr(5, 4)}`;
    return formattedSSNNumber;
  }

  encryptNumber = (number) => {
    let encryptedNumber = number.replace(/.(?=.{4,}$)/g, '...');
    encryptedNumber = encryptedNumber.slice(-7);
    return encryptedNumber;
  }

  getFormattedFileData = (file) => {
    const fileData = {};
    if (file) {
      const fileInfo = file;
      fileData.fileName = fileInfo.name.replace(/ /g, '_');
      fileData.fileType = fileInfo.type;
      fileData.fileExtension = fileInfo.name.substr((fileInfo.name.lastIndexOf('.') + 1));
      fileData.fileSize = fileInfo.size;
    }
    return fileData;
  }

  putUploadedFile = urlArray => new Promise((resolve, reject) => {
    const funcArray = [];
    _.forEach(urlArray, (item) => {
      funcArray.push(apiService.uploadOnS3(item.preSignedUrl, item.fileData[0]));
    });
    Promise.all(funcArray).then(() => {
      resolve();
    })
      .catch((err) => {
        reject(err);
      });
  });

  maskPhoneNumber = (phoneNumber) => {
    const maskPhoneNumber = phoneNumber.replace(/(\d\d\d)(\d\d\d)(\d\d\d\d)/, '$1-$2-$3');
    return maskPhoneNumber;
  }

  getDaysfromNow = (days) => {
    const d = new Date();
    let daysFromNow = d.setDate(d.getDate() + days);
    daysFromNow = new Date(daysFromNow).toISOString();
    console.log(daysFromNow);
    return daysFromNow;
  }
}

export default new Utility();
