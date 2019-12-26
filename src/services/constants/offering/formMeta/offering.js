import { FormHelper } from '../../../../helper';

export const TOMBSTONE_BASIC = FormHelper.generateMeta([
  ['tombstoneDescription', 'Tombstone Description', '', 'optional', 'Describe your project and what you`re raising funds to accomplish.'],
  ['tombstoneImage', 'Tombstone Image', '', 'optional', '', { s3Upload: true }],
]);
