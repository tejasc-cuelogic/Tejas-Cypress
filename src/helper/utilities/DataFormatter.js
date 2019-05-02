import { camelCase, upperFirst, reduce, assign, get } from 'lodash';
import moment from 'moment';

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

  getJsonFormattedError = (err) => {
    try {
      return JSON.parse(err.message.substring(err.message.indexOf('{')));
    } catch (e) {
      return {};
    }
  };

  diffDays = (timeStamp2, inHours = false, returnNegative = false) => {
    const d1 = moment().format('MM/DD/YYYY');
    const d2 = timeStamp2 ? moment(timeStamp2, 'MM/DD/YYYY').format('MM/DD/YYYY') : null;
    const diff = d2 ? moment(d2, 'MM/DD/YYYY').diff(moment(d1, 'MM/DD/YYYY'), 'days') : null;
    if (inHours) {
      const date = new Date();
      const convertedtimeStamp2 = new Date(timeStamp2);
      const difference = convertedtimeStamp2.getTime() - date.getTime();
      return Math.floor(difference / 1000 / 60 / 60);
    }
    if (!returnNegative && diff <= 0) {
      return 0;
    }
    return diff;
  }

  diffDaysForLauch = (
    timeStamp2, inHours = false, returnNegative = false, isCustomDate = false,
    customDateObj = undefined,
  ) => {
    const d1 = moment().format('MM/DD/YYYY');
    // const d2 = timeStamp2 ? moment(timeStamp2, 'MM/DD/YYYY').format('MM/DD/YYYY') : null;
    const d2 = isCustomDate && customDateObj && get(customDateObj, 'number') ? timeStamp2 ? moment(timeStamp2, 'MM/DD/YYYY').add(customDateObj.number, customDateObj.format.toString()).format('MM/DD/YYYY') : null : timeStamp2 ? moment(timeStamp2, 'MM/DD/YYYY').format('MM/DD/YYYY') : null;
    const diff = d2 ? moment(d2, 'MM/DD/YYYY').diff(moment(d1, 'MM/DD/YYYY'), 'days') : null;
    if (inHours) {
      const date = new Date();
      const convertedtimeStamp2 = new Date(timeStamp2);
      const difference = convertedtimeStamp2.getTime() - date.getTime();
      return Math.floor(difference / 1000 / 60 / 60);
    }
    if (!returnNegative && diff <= 0) {
      return 0;
    }
    return diff;
  }

  diffInDaysHoursMin = (timeStamp2) => {
    const d1 = moment().format('MM/DD/YYYY');
    const d2 = timeStamp2 ? moment(timeStamp2, 'MM/DD/YYYY').format('MM/DD/YYYY 23:59:59') : null;
    const diff = d2 ? moment(d2, 'MM/DD/YYYY').diff(moment(d1, 'MM/DD/YYYY'), 'days') : null;
    if (diff === 0) {
      const date = new Date();
      const convertedtimeStamp2 = new Date(d2);
      const difference = convertedtimeStamp2.getTime() - date.getTime();
      const hourDiff = Math.floor(difference / 1000 / 60 / 60);
      if (hourDiff === 0) {
        const minDiff = Math.floor(difference / 1000 / 60);
        return { diff: minDiff, diffType: 'Minutes', diffText: `${minDiff} Minutes` };
      }
      return { diff: hourDiff, diffType: 'Hours', diffText: `${hourDiff} Hours` };
    }
    return { diff: diff < 0 ? 0 : diff, diffType: 'Days', diffText: `${diff < 0 ? 0 : diff} Days` };
  }

  getDate = (date, iso = true, dayType = null, isUnix = false) => {
    let formatedDate = moment(this.formatedDate(date)).utc();
    formatedDate = dayType === 'startDate' ? moment(new Date(formatedDate)).add(1, 'day').startOf('day') : dayType === 'endDate' ? moment(new Date(formatedDate)).add(1, 'day').endOf('day') : formatedDate;
    return iso ? moment(new Date(formatedDate)).toISOString() :
      isUnix ? moment(new Date(formatedDate)).unix() : formatedDate;
  }

  formatedDate = date => moment(new Date(date)).format('MM/DD/YYYY');

  mapDatesToType = (data, keys, dateType = 'iso') => data.map((d) => {
    const convertedDates = keys.map(k => ({ [k]: this.convertDateType(d[k], dateType) }));
    const filterInvalidDates = convertedDates
      .filter(obj => moment(Object.values(obj)[0]).isValid());
    const convDatesObj = reduce(filterInvalidDates, (old, current) => assign(old, current), {});
    return {
      ...d,
      ...convDatesObj,
    };
  });

  convertDateType = (date, dateType = 'iso') => (dateType === 'iso' ? moment(date).toISOString() : moment(date).unix())

  QueryStringToJSON = (search) => {
    const pairs = search.slice(1).split('&');
    const result = {};
    pairs.forEach((pair) => {
      const pairVal = pair.split('=');
      result[pairVal[0]] = decodeURIComponent(pairVal[1] || '');
    });
    return JSON.parse(JSON.stringify(result));
  }
  replaceAll = (input, search, replacement) => input.replace(new RegExp(search, 'g'), replacement);
  stringTemplateFormatting = (string, data) => {
    let result = string;
    Object.keys(data).forEach((item) => {
      result = this.replaceAll(result, `{{${item}}}`, data[item]);
    });
    return result;
  }
  fetchLastDigitsOfAccountNumber = accountNumber => accountNumber.substr(accountNumber.length - 4);
  getDateFromNow = afterDays =>
    new Date((new Date()).getTime() - (afterDays * 86400000)).toISOString();

  // eslint-disable-next-line no-useless-escape
  validateEmail = email => email.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}/igm);
}

export default new DataFormatter();
