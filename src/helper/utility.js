/**
 * Some generally used function definations being used at multiple places
 */
import { toast } from 'react-toastify';
import _ from 'lodash';
import moment from 'moment';
import money from 'money-math';
import { Parser } from 'json2csv';
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
  // toast = (msg, alertType, optionsOverride) => {
  // eslint-disable-next-line no-unused-vars
  toast = (msg, alertType) => {
    // const cleanMsg = s => (s ? s.replace('GraphQL error: ', '') : '');
    // if (alertType && _.includes(['error', 'success', 'info', 'warning'], alertType)) {
    //   toast[alertType](`${cleanMsg(msg)}`,
    // _.merge({}, this.options, optionsOverride, { className: alertType }));
    // } else {
    //   toast(`${cleanMsg(msg)}`, _.merge({}, this.options, optionsOverride));
    // }
  }

  unMaskInput = maskedInput => (
    maskedInput.split('-').join('')
  )

  matchRegexWithUrl = regexList => _.find(
    regexList,
    regex => (window.location.href.match(new RegExp(regex)) !== null),
  )

  matchRegexWithString = (regex, str) => str.match(new RegExp(regex)) !== null

  guid = () => {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return `${s4()}${s4()}-${s4()}${s4()}`;
  }

  getTotal = (from, key) => {
    const total = '0.00';
    return from.map(f => money.floatToAmount(f[key]))
      .map(r => money.add(total, r))
      .reduce((sum, n) => money.add(sum, n));
  }

  gAddressClean = (place) => {
    let result = {};
    const addressMap = {
      residentalStreet: ['street_number', 'route', 'sublocality_level_1', 'sublocality_level_2', 'sublocality_level_3'],
      city: ['locality'],
      state: ['administrative_area_level_1'],
      zipCode: ['postal_code'],
    };
    if (place.address_components) {
      Object.keys(addressMap).map(aK => place.address_components.map((c) => {
        if (_.intersection(addressMap[aK], c.types).length > 0) {
          const addressEle = {};
          addressEle[aK] = addressMap[aK].length > 2 && result[aK] ? `${result[aK]} ${c.long_name}` : c.long_name;
          result = _.has(result, aK) ? addressEle : { ...result, ...addressEle };
        }
        return result;
      }));
    }
    return result;
  }

  MoneyMathDisplayCurrency = (amount, fraction = true) => {
    try {
      return fraction ? `$${amount}` : `$${amount}`.split('.')[0];
    } catch (e) {
      return '$0.00';
    }
  }
  CurrencyFormat = (amount, fraction = 2, maxFraction = 2) => new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', minimumFractionDigits: fraction, maximumFractionDigits: maxFraction,
  }).format(amount)

  formattedSSNNumber = (ssnNumber) => {
    if (!ssnNumber) return null;
    // const cyrptedSSNNumber = ssnNumber.replace(/.(?=.{4,}$)/g, 'X');
    const cyrptedSSNNumber = ssnNumber;
    const formattedSSNNumber = `${cyrptedSSNNumber.substr(0, 3)}-${cyrptedSSNNumber.substr(3, 2)}-${cyrptedSSNNumber.substr(5, 4)}`;
    return formattedSSNNumber;
  }

  encryptNumber = (number) => {
    let encryptedNumber = number.replace(/.(?=.{4,}$)/g, '...');
    encryptedNumber = encryptedNumber.slice(-7);
    return encryptedNumber;
  }

  encryptNumberWithX = (number) => {
    const encryptedNumber = number.replace(/.(?=.{4,}$)/g, 'X');
    return encryptedNumber;
  }

  replaceKeysDeep = (obj, keysMap) => _.transform(obj, (result, value, key) => {
    const resultTmp = result;
    const currentKey = keysMap[key] || key;
    resultTmp[currentKey] = _.isObject(value) ? this.replaceKeysDeep(value, keysMap) : value;
  });

  getFormattedFileData = (file) => {
    const fileData = {};
    if (file) {
      const fileInfo = file;
      fileData.fileName = this.sanitize(fileInfo.name);
      fileData.fileType = fileInfo.type;
      fileData.fileExtension = fileInfo.name.substr((fileInfo.name.lastIndexOf('.') + 1));
      fileData.fileSize = fileInfo.size;
    }
    return fileData;
  }

  sanitize = name => (name ? name.replace(/[^a-z0-9._-]+/gi, '_') : '');

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
    // const maskPhoneNumber = phoneNumber.replace(/(\d\d\d)(\d\d\d)(\d\d\d\d)/, '$1-$2-$3');
    const maskPhoneNumber = phoneNumber.replace(/(\d\d\d)(\d\d\d)(\d\d\d\d)/, '($1) $2-$3');
    return maskPhoneNumber;
  }
  phoneNumberFormatter = (phoneNumber) => {
    const maskPhoneNumber = phoneNumber.replace(/(\d\d\d)(\d\d\d)(\d\d\d\d)/, '($1) $2-$3');
    return maskPhoneNumber;
  }
  getDaysfromNow = (days) => {
    const d = new Date();
    let daysFromNow = d.setDate(d.getDate() + days);
    daysFromNow = new Date(daysFromNow).toISOString();
    return daysFromNow;
  }
  getLastThreeYearsLabel = () => {
    const currentYear = parseInt(moment().format('YYYY'), 10);
    return {
      annualIncomeCurrentYear: currentYear,
      annualIncomePreviousYear: currentYear - 1,
    };
  }

  otpShield = () => {
    try {
      const OtpItems = document.getElementsByClassName('otp-field')[0] ?
        document.getElementsByClassName('otp-field')[0]
          .getElementsByTagName('input') : '';
      for (let i = 0; i < OtpItems.length; i += 1) {
        OtpItems[i].addEventListener('keydown', (e) => {
          if ([16, 107, 110, 109, 69, 187, 188, 189, 190].includes(e.keyCode)) {
            e.preventDefault();
          }
        });
      }
    } catch (e) {
      console.log(e);
    }
  }

  downloadCSV = (params) => {
    try {
      const parser = new Parser({ fields: params.fields, quote: '' });
      const csv = parser.parse(params.data);
      const uri = `data:text/csv;charset=utf-8,${escape(csv)}`;
      const link = document.createElement('a');
      link.href = uri;
      link.style = 'visibility:hidden';
      link.download = `${params.fileName || 'download'}_${moment(new Date()).format('DD-MM-YYYY')}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error(err);
    }
  }

  isBase64 = (data) => {
    try {
      const block = data.split(';');
      return block[1].split(',')[0] === 'base64';
    } catch (e) {
      return false;
    }
  }
  b64toBlob = (data, sliceSize = 512) => {
    const block = data.split(';');
    // Get the content type of the image
    const contentType = block[0].split(':')[1];
    // get the real base64 content of the file
    const b64Data = block[1].split(',')[1];
    const size = sliceSize || 512;
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += size) {
      const slice = byteCharacters.slice(offset, offset + size);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i += 1) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }
}

export default new Utility();
