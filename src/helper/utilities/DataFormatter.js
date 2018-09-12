import { camelCase, upperFirst } from 'lodash';

class DataFormatter {
  unMaskInput = maskedInput => (
    maskedInput.split('-').join('')
  )

  guid = () => {
    const s4 = Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    return `${s4()}${s4()}-${s4()}${s4()}`;
  }

  getSimpleErr = (err) => {
    const formattedErr = {};
    formattedErr.statusCode = err.statusCode;
    formattedErr.code = err.code;
    formattedErr.message = err.message;
    return formattedErr;
  }

  upperCamelCase = str => upperFirst(camelCase(str));

  getCommaSeparatedArrStr = array => [array.slice(0, -1).join(', '), array.slice(-1)[0]].join(array.length < 2 ? '' : ' or ');

  getJsonFormattedError = err => JSON.parse(err.message.substring(err.message.indexOf('{')));

  datesDifferenceInDays = (timeStamp2) => {
    const date = new Date();
    const timeStamp1 = date.getTime();
    const convertedtimeStamp2 = new Date(timeStamp2);
    const difference = timeStamp1 - convertedtimeStamp2.getTime();
    const daysDifference = Math.floor(difference / 1000 / 60 / 60 / 24);
    return daysDifference;
  }
}

export default new DataFormatter();
