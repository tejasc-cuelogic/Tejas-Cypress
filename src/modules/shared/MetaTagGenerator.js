import React from 'react';
import { Helmet } from 'react-helmet';
import { map } from 'lodash';
import { TITLES } from '../../constants/titleMeta';
import Helper from '../../helper/utility';

const MetaTagGenerator = ({ metaTagsData, pathName }) => {
  let title = false;
  const matchingKey = Object.keys(TITLES).find(t => pathName.startsWith(t));
  if (matchingKey) {
    title = TITLES[matchingKey];
  }
  return (
    <Helmet>
      <title>{Helper.pageTitle(`${title || 'Alternative Investments Made Simple - NextSeed'}`)}</title>
      <link rel="canonical" href={window.location.href} />
      {map(metaTagsData, d => (
        d.type === 'meta'
          ? <meta key={new Date().getTime()} name={d.name} content={d.content} />
          : d.type === 'ogTag'
            ? <meta property={d.property} key={d.type} content={d.content} />
            : null
      ))}
    </Helmet>
  );
};

export default MetaTagGenerator;
