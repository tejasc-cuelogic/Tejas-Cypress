
import { mapKeys } from 'lodash';

const S3UPLOAD = {
  src: '',
  base64String: '',
  responseUrl: '',
  fileData: '',
  meta: {},
  objRef: 'uploads',
  objType: 's3File',
  objRefOutput2: 'uploads',
};

const prepItemMeta = (item) => {
  const [key, label, value, rule, placeHolder, additionalProps] = item;
  return {
    key,
    label,
    value,
    rule: rule || 'optional',
    error: undefined,
    placeHolder,
    ...{ ...(additionalProps && additionalProps.asIn
      ? { ...additionalProps.props } : {}) },
    ...{ ...(additionalProps && additionalProps.s3Upload
      ? { ...S3UPLOAD,
        objRef: additionalProps.objRef,
        objRefOutput2: additionalProps.objRefOutput2 } : {}) },
  };
};

class FormHelper {
  generateMeta = items => (Array.isArray(items) ? mapKeys(items.map(item => prepItemMeta(item)), v => v.key) : prepItemMeta(items));
}

export default new FormHelper();
