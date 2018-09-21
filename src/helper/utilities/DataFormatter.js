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

  QueryStringToJSON = (search) => {
    const pairs = search.slice(1).split('&');
    const result = {};
    pairs.forEach((pair) => {
      const pairVal = pair.split('=');
      result[pairVal[0]] = decodeURIComponent(pairVal[1] || '');
    });
    return JSON.parse(JSON.stringify(result));
  }
}

export default new DataFormatter();
