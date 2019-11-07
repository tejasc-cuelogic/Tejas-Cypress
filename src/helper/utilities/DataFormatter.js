import { camelCase, upperFirst, reduce, assign, get, forEach } from 'lodash';
import moment from 'moment';
import momentZone from 'moment-timezone';
import { DEFAULT_TIME_ZONE_TO_DISPLAY, ELIGIBLE_TAGS } from '../../constants/common';
import Helper from '../utility';


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
    // const d1 = moment().format('MM/DD/YYYY');
    const d1 = momentZone.tz(DEFAULT_TIME_ZONE_TO_DISPLAY).format('MM/DD/YYYY');
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
    const diffLabel = diff === 1 ? 'Day' : 'Days';
    return { diff: diff < 0 ? 0 : diff, diffType: 'Days', diffText: `${diff < 0 ? 0 : diff}  ${diffLabel}` };
  }

  getDateDifferenceInHoursOrMinutes = (timeStamp2, isDayEnd = false, showLabel = false) => {
    const startDate = momentZone.tz(DEFAULT_TIME_ZONE_TO_DISPLAY).format('MM/DD/YYYY HH:mm:ss');
    const endDate = isDayEnd ? moment(`${timeStamp2} 23:59:59`) : moment(timeStamp2);
    // const resultHours = moment.duration(endDate.diff(startDate)).hours();
    const resultHoursLength = moment.duration(endDate.diff(startDate)).asHours();
    const resultHours = Math.floor(resultHoursLength);
    const resultMinutesLength = moment.duration(endDate.diff(startDate)).asMinutes();
    const resultMinutes = Math.floor(resultMinutesLength);
    const result = resultHours > 1 ? resultHours + 1 === 48 ? 2 : resultHours + 1 : resultMinutes > 0 ? resultMinutes > 60 ? 2 : resultMinutes : 0;
    const resultLables = resultHours > 1 ? resultHours + 1 === 48 ? 'Days Left' : 'Hours Left' : resultMinutes > 0 ? resultMinutes > 60 ? 'Hours Left' : resultMinutes === 1 ? 'Minute Left' : 'Minutes Left' : null;
    const resultantObject = { value: result, label: resultLables, isLokinPeriod: resultHours + 1 < 48 };
    return showLabel ? resultantObject : result;
  }

  getDateDifference = (startDate, endDate) => {
    const dateStart = moment(startDate);
    const dateEnd = moment(endDate);
    const diffrerence = dateEnd.diff(dateStart);
    const duration = moment.duration(diffrerence);
    const daysToShow = duration.days() > 0 ? `${duration.days()} Day` : null;
    const hoursToShow = duration.hours() > 0 ? `${duration.hours()} Hours` : null;
    const minutesToShow = duration.minutes() > 0 ? `${duration.minutes()} Minutes` : null;
    const secondsToShow = duration.seconds() > 0 ? `${duration.seconds()} Seconds` : null;
    const diff = dateEnd ? moment(dateEnd, 'MM/DD/YYYY HH:mm:ss').diff(moment(dateStart, 'MM/DD/YYYY HH:mm:ss'), 'Days') : null;
    const result = hoursToShow > 24 ? `${diff} Day` : (daysToShow === null && hoursToShow === null && minutesToShow === null && secondsToShow === null) ? '' : `${daysToShow || ''} ${hoursToShow || ''} ${minutesToShow || ''} ${secondsToShow || ''}`;
    return result.trim();
  }

  getDateAsPerTimeZone = (dataParam, isISOString = false, isLLFormat = false, showTime = true, isCustomFormat = undefined, timeZone = 'CST') => {
    // const localTimeZone = timeZone === 'local' ? momentZone.tz.guess(true) : timeZone;
    const localTimeZone = timeZone === 'CST' ? DEFAULT_TIME_ZONE_TO_DISPLAY : timeZone === 'local' ? momentZone.tz.guess(true) : timeZone;
    const dataVal = isISOString ? dataParam ? moment(dataParam) : moment() : dataParam;
    const utcCutoff = moment.utc(dataVal, 'MM/DD/YYYY HH:mm:ss');
    const displayCutoff = utcCutoff.clone().tz(localTimeZone);
    return isLLFormat ? displayCutoff.format('ll') : isCustomFormat ? displayCutoff.format(isCustomFormat) : showTime ? displayCutoff.format('MM/DD/YYYY HH:mm:ssa') : displayCutoff.format('MM/DD/YYYY');
  }

  getDate = (date, iso = true, dayType = null, isUnix = false) => {
    let formatedDate = moment(this.formatedDate(date)).utc();
    formatedDate = dayType === 'startDate' ? moment(new Date(formatedDate)).add(1, 'day').startOf('day') : dayType === 'endDate' ? moment(new Date(formatedDate)).add(1, 'day').endOf('day') : formatedDate;
    return iso ? moment(new Date(formatedDate)).toISOString()
      : isUnix ? moment(new Date(formatedDate)).unix() : formatedDate;
  }

  // TODO this function is created to avoid impacts, need to optimize.
  getDateForApiFiltering = (date, iso = true, dayType = null, isUnix = false) => {
    let formatedDate = moment(this.formatedDate(date)).utc();
    formatedDate = dayType === 'accountCreateFromDate' ? moment(new Date(formatedDate)).add(1, 'day').startOf('day') : dayType === 'accountCreateToDate' ? moment(new Date(formatedDate)).endOf('day') : formatedDate;
    return iso ? moment(new Date(formatedDate)).toISOString()
      : isUnix ? moment(new Date(formatedDate)).unix() : formatedDate;
  }

  formatedDate = date => moment(new Date(date)).format('MM/DD/YYYY');

  getCurrentCSTDateInFormat = (showTime = false) => (showTime ? momentZone.tz(DEFAULT_TIME_ZONE_TO_DISPLAY).format('MM/DD/YYYY HH:mm:ss') : momentZone.tz(DEFAULT_TIME_ZONE_TO_DISPLAY).format('MM/DD/YYYY'));

  getCurrentCSTMoment = () => momentZone.tz(DEFAULT_TIME_ZONE_TO_DISPLAY);

  getCSTDateMomentObject = (dataParam, isISOString = false) => {
    const dataVal = isISOString ? moment(dataParam) : dataParam;
    const utcCutoff = moment.utc(dataVal, 'MM/DD/YYYY HH:mm:ss');
    const displayCutoff = utcCutoff.clone().tz(DEFAULT_TIME_ZONE_TO_DISPLAY);
    return displayCutoff;
  }

  mapDatesToType = (data, keys, dateType = 'iso') => data.map((d) => {
    // const convertedDates = keys.map(k => ({ [k]: this.convertDateType(d[k], dateType) }));
    const convertedDates = keys.map(k => ({ [k]: this.convertDateType(this.getDateAsPerTimeZone(d[k], true, false, false), dateType) }));
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
    if (search !== '') {
      const pairs = search.slice(1).split('&');
      const result = {};
      pairs.forEach((pair) => {
        const pairVal = pair.split('=');
        result[pairVal[0]] = decodeURIComponent(pairVal[1] || '');
      });
      return JSON.parse(JSON.stringify(result));
    }
    return null;
  }

  createEligibleTagsObj = (urlParameter) => {
    const tags = {};
    forEach(urlParameter, (p, key) => {
      if (ELIGIBLE_TAGS.includes(key.toUpperCase()) && p && p.length <= 128 && !Helper.isSpecialCharPresent(p)) {
        tags[key.toUpperCase()] = p;
      }
    });
    return tags;
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

  getDateFromNow = afterDays => new Date((new Date()).getTime() - (afterDays * 86400000)).toISOString();

  // eslint-disable-next-line no-useless-escape
  validateEmail = email => email.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}/igm);
}

export default new DataFormatter();
