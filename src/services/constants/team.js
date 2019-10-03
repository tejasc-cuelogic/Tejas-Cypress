import FormHelper from '../../helper';

export const TEAM = FormHelper.generateMeta([
  ['title', 'Title', '', 'required', 'Title'],
  ['memberName', 'Member Name', '', 'required', 'Member Name'],
  ['story', '', '', '', 'Describe the story of the ambassador'],
  ['order', 'Order', '', '', 'Order'],
  ['avatar', 'Avatar', '', '', '', { s3Upload: true, objRef: 'uploads', objRefOutput2: 'uploads' }],
  ['heroImage', 'Hero Image', '', '', '', { s3Upload: true, objRef: 'uploads', objRefOutput2: 'uploads' }],
  ['heroImage', 'Hero Image', '', '', '', { asIn: {} }],
  [
    'facebook', 'Facebook', '',
    '', 'Paste Facebook profile URL', { asIn: true, props: { ArrayObjItem: true } }],
  [
    'linkedin', 'LinkedIn', '',
    '', 'Paste LinkedIn profile URL', { asIn: true, props: { ArrayObjItem: true } }],
  [
    'twitter', 'Twitter', '',
    '', 'Paste Twitter profile URL', { asIn: true, props: { ArrayObjItem: true } }],
  [
    'instagram', 'Instagram', '',
    '', 'Paste Instagram profile URL', { asIn: true, props: { ArrayObjItem: true } }],
]);
