/**
 * Some generally used function definations being used at multiple places
 */
import { toast } from 'react-toastify';
import _ from 'lodash';
import moment from 'moment';
import { toJS } from 'mobx';
import money from 'money-math';
import { Parser } from 'json2csv';
import apiService from '../api/restApi';
import { isLoggingEnabled, IMAGE_UPLOAD_ALLOWED_EXTENSIONS } from '../constants/common';
import authStore from '../services/stores/entities/shared/authStore';
import userStore from '../services/stores/entities/userStore';

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
    if (!userStore.isInvestor) {
      const cleanMsg = s => (s ? s.replace('GraphQL error: ', '') : '');
      if (alertType && _.includes(['error', 'success', 'info', 'warning'], alertType)) {
        toast[alertType](`${cleanMsg(msg)}`, _.merge({}, this.options, optionsOverride, { className: alertType }));
      } else {
        toast(`${cleanMsg(msg)}`, _.merge({}, this.options, optionsOverride));
      }
    }
  }

  unMaskInput = maskedInput => (
    maskedInput.split('-').join('')
  )

  matchRegexWithUrl = regexList => _.find(
    regexList,
    regex => (window.location.href.match(new RegExp(regex)) !== null),
  )

  matchRegexWithString = (regex, str) => str.match(new RegExp(regex, 'i')) !== null

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
    if (!number) return null;
    let encryptedNumber = number.replace(/.(?=.{4,}$)/g, '...');
    encryptedNumber = encryptedNumber.slice(-7);
    return encryptedNumber;
  }

  encryptNumberWithX = (number) => {
    if (!number) return null;
    const encryptedNumber = number.replace(/.(?=.{4,}$)/g, 'X');
    return encryptedNumber;
  }

  encrypSsnNumberByForm = (form) => {
    const formData = _.cloneDeep(toJS({ ...form }));
    formData.ssn.value = this.encryptNumberWithX(formData.ssn.value);
    return formData;
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
      const OtpItems = document.getElementsByClassName('otp-field')[0]
        ? document.getElementsByClassName('otp-field')[0]
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
      const parser = new Parser({ fields: params.fields, quote: params.quote || '' });
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

  removeSsn = () => {
    try {
      document.getElementsByName('ssn')[0].value = '';
    } catch (e) {
      console.log(e);
    }
  }

  eventListnerHandler = (className, funName, action = 'add') => {
    const classname = document.getElementsByClassName(className);
    Array.from(classname).forEach((element) => {
      element[`${action}EventListener`]('click', this[funName]);
    });
  }

  toggleReadMore = (e) => {
    const htmlContent = e.target.closest('.parsed-data').querySelector('.html-toggle-content');
    const toggleButtonText = e.target.closest('.parsed-data').querySelector('.toggleReadMoreText');
    const arrowText = e.target.closest('.parsed-data').querySelector('.arrowText');
    const customTitle = e.target.closest('.parsed-data').querySelector('.customTitle');
    if (htmlContent.classList.contains('hide-content')) {
      htmlContent.classList.add('read-content');
      htmlContent.classList.remove('hide-content');
      customTitle.classList.add('hide-content');
      toggleButtonText.innerHTML = 'Collapse ';
      arrowText.innerHTML = '&#9652';
    } else {
      htmlContent.classList.add('hide-content');
      htmlContent.classList.remove('read-content');
      customTitle.classList.remove('hide-content');
      toggleButtonText.innerHTML = 'Expand ';
      arrowText.innerHTML = '&#9660';
      const parent = e.target.closest('.parsed-data').parentElement || e.target.closest('.parsed-data');
      const currentActiveHash = parent.previousElementSibling.querySelector('span').getAttribute('id');
      if (currentActiveHash) {
        document.querySelector(`#${currentActiveHash}`).scrollIntoView({
          block: 'start',
        });
      }
    }
  };

  logger = (params, type = 'log') => {
    if (isLoggingEnabled) {
      // eslint-disable-next-line no-unused-expressions
      type === 'info' ? console.info(params)
        : type === 'warn' ? console.warn(params)
          : type === 'clear' ? console.clear()
            : console.log(params);
    } else if (!isLoggingEnabled && (type === 'warn' || type === 'info')) {
      // Send an email for these two type;
      const email = {
        graphqlError: { operationName: `Logging ${type === 'warn' ? 'Warning' : type === 'info' ? 'Information' : ''}` },
        urlLocation: window.location.href,
        message: { ...params },
      };
      const emailParams = {
        emailContent: JSON.stringify(email),
      };
      authStore.notifyApplicationError(emailParams);
    }
  }

  processImageFileName = (originalFileName, deviceInfo) => {
    const fileNameSplit = originalFileName.split('.');
    const fileExt = fileNameSplit.pop();
    const fileName = fileNameSplit.join('.');
    const { isMobile, isTablet } = deviceInfo;
    const prepName = res => `${fileName}${res ? `__${res}` : ''}.${fileExt}`;
    return IMAGE_UPLOAD_ALLOWED_EXTENSIONS.includes(fileExt.toLowerCase()) ? isMobile ? prepName(640) : isTablet ? prepName(1024) : prepName(1920) : prepName();
  }

  caseify = s => _.startCase(_.lowerCase(s));

  validateImageExtension = (ext) => {
    const obj = {
      isInvalid: !IMAGE_UPLOAD_ALLOWED_EXTENSIONS.includes(ext.toLowerCase()),
      errorMsg: `Only ${IMAGE_UPLOAD_ALLOWED_EXTENSIONS.join(', ')}  extensions are allowed.`,
    };
    return obj;
  };
}

export default new Utility();
