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
}

export default new Helper();
