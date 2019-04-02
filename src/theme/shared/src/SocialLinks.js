import React from 'react';
import { Menu, Icon } from 'semantic-ui-react';
import { SOCIAL_URLS } from '../../../constants/common';

const SocialLinks = () => Object.keys(SOCIAL_URLS).map(s => (
  <Menu.Item target="_blank" href={SOCIAL_URLS[s]} key={s}><Icon name={s} /></Menu.Item>
));

export default SocialLinks;
