import { isNaN } from 'lodash';

class Helper {
  setIdentityQuestions = (response) => {
    const questionsObj = {};

    response.forEach((question) => {
      const questionObj = { rule: 'required', error: undefined };
      const optionsArray = [];
      question.Choices.forEach((choice) => {
        optionsArray.push({ key: choice.Text, value: choice.Text, text: choice.Text });
      });
      questionObj.label = question.Prompt;
      questionObj.key = question.Type;
      questionObj.options = optionsArray;
      questionObj.value = '';
      questionsObj[question.Type] = questionObj;
    });

    return questionsObj;
  };

  getVerificationStatus = (key, questions) => {
    const details = {};
    if (key === 'id.error') {
      details.alertMsg = 'Verification failed';
      details.route = '/app/summary/identity-verification/1';
      details.msgType = 'error';
      details.key = key;
    } else if (key === 'id.failure' && questions) {
      details.alertMsg = 'Verification failed';
      details.route = '/app/summary/identity-verification/2';
      details.display = false;
      details.msgType = 'error';
      details.key = key;
    } else if (key === 'id.success') {
      details.alertMsg = 'Verification passed!';
      details.route = '/app/summary';
      details.msgType = 'success';
      details.key = key;
    } else {
      details.alertMsg = 'Verification failed';
      details.route = '/app/summary/identity-verification/1';
      details.msgType = 'error';
      details.key = key;
    }
    return details;
  }

  getCipStatus = (key, questions) => {
    let cipStatus = 'HARD_FAIL';
    if (key === 'id.error') {
      cipStatus = 'FAIL';
    } else if (key === 'id.failure' && questions) {
      cipStatus = 'SOFT_FAIL';
    } else if (key === 'id.success') {
      cipStatus = 'PASS';
    }
    return cipStatus;
  }


  isNumber = n => (!isNaN(parseFloat(n)))

  // Check if character is a fraction, e.g. ¼
  isFractionalChar = (n) => {
    const c = n.charCodeAt();
    return (c >= 188 && c <= 190) || (c >= 8531 && c <= 8542);
  }

  // return the first fractional character in a string
  // return false if there is none
  // Could easily return the index of the character, but this creates a parallelism with RegExp.exec
  indexFractionalChar = (m) => {
    const a = m.split(''); let
      i;
    // eslint-disable-next-line no-restricted-syntax
    for (i in a) {
      if (this.isFractionalChar(a[i])) { return i; }
    }

    return false;
  }

  splitAddress = (x) => {
    const a = x.trim().split(' ');
    let streetCode;
    if (a.length <= 1) { return { streetCode: '', space: '', street: a.join('') }; }

    if (this.isNumber(a[0].substr(0, 1)) || this.isFractionalChar(a[0].substr(0, 1))) {
      streetCode = a.shift();
    } else {
      // If there isn't a leading streetCode, just return the trimmed input as the street
      return { streetCode: '', space: '', street: x.trim() };
    }
    if (/[0-9]\/[0-9]/.exec(a[0]) || this.indexFractionalChar(a[0]) !== false) { streetCode += ` ${a.shift()}`; }

    return { streetCode, space: ' ', street: a.join(' ') };
  }
}

export default new Helper();
