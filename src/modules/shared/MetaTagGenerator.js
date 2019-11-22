import React from 'react';
import { Helmet } from 'react-helmet';
import { map } from 'lodash';
import { TITLES } from '../../constants/titleMeta';

const MetaTagGenerator = ({ metaTagsData, pathName }) => {
  let title = false;
  console.log(pathName, TITLES, 'pathNamepathName');
  if (TITLES[pathName]) {
    title = TITLES[pathName];
  }
  return (
    <Helmet>
      <title>{title || 'NextSeed'}</title>
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
