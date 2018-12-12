import { camelCase, upperFirst } from 'lodash';
import moment from 'moment';
import Handlebars from 'handlebars';

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

  diffDays = (timeStamp2, inHours = false) => {
    const d1 = moment().format('MM/DD/YYYY');
    const d2 = timeStamp2 ? moment(timeStamp2, 'MM/DD/YYYY').format('MM/DD/YYYY') : null;
    const diff = d2 ? moment(d2, 'MM/DD/YYYY').diff(moment(d1, 'MM/DD/YYYY'), 'days') : null;
    if (inHours) {
      const date = new Date();
      const convertedtimeStamp2 = new Date(timeStamp2);
      const difference = convertedtimeStamp2.getTime() - date.getTime();
      return Math.floor(difference / 1000 / 60 / 60);
    }
    if (diff <= 0) {
      return 0;
    }
    return diff;
  }
  getDate = (date, iso = true, dayType = null, isUnix = false) => {
    let formatedDate = moment(this.formatedDate(date)).utc();
    formatedDate = dayType === 'startDate' ? moment(formatedDate).add(1, 'day').startOf('day') : dayType === 'endDate' ? moment(formatedDate).add(1, 'day').endOf('day') : formatedDate;
    return iso ? moment(formatedDate).toISOString() :
      isUnix ? moment(formatedDate).unix() : formatedDate;
  }
  formatedDate = date => moment(date).format('MM/DD/YYYY');
  QueryStringToJSON = (search) => {
    const pairs = search.slice(1).split('&');
    const result = {};
    pairs.forEach((pair) => {
      const pairVal = pair.split('=');
      result[pairVal[0]] = decodeURIComponent(pairVal[1] || '');
    });
    return JSON.parse(JSON.stringify(result));
  }
  /** reference https://www.npmjs.com/package/handlebars */
  stringTemplateFormatting = (string, data) => {
    const template = Handlebars.compile(string);
    return template(data);
  }
  fetchLastDigitsOfAccountNumber = accountNumber => accountNumber.substr(accountNumber.length - 4);
}

export default new DataFormatter();
