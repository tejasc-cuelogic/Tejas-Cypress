import { forEach } from 'lodash';

class Helper {
  setIdentityQuestions = (response) => {
    const { questions } = response;
    const questionsArray = [];
    let optionsArray = [];
    forEach(questions, (question) => {
      const questionObj = { rule: 'required', error: undefined };
      optionsArray = [];
      forEach(question.choices, (choice) => {
        optionsArray.push({ key: choice.text, value: choice.text, text: choice.text });
      });
      questionObj.label = question.prompt;
      questionObj.key = question.type;
      questionObj.options = optionsArray;
      questionObj.value = '';
      questionsArray.push(questionObj);
    });
    return questionsArray;
  };

  getVerificationStatus = (key, questions) => {
    const details = {};
    if (key === 'id.error') {
      details.alertMsg = 'User verification failed!';
      details.route = '/app/summary/identity-verification/1';
      details.msgType = 'error';
      details.key = key;
    } else if (key === 'id.failure' && questions) {
      details.alertMsg = 'User verification soft-failed!';
      details.route = '/app/summary/identity-verification/2';
      details.display = false;
      details.msgType = 'error';
      details.key = key;
    } else if (key === 'id.success') {
      details.alertMsg = 'User verification passed!';
      details.route = '/app/summary';
      details.msgType = 'success';
      details.key = key;
    } else {
      details.alertMsg = 'User verification hard-failed!';
      details.route = '/app/summary/identity-verification/1';
      details.msgType = 'error';
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
}

export default new Helper();
