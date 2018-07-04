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
}

export default new DataFormatter();
