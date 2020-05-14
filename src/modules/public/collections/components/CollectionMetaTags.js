import React from 'react';
import { Helmet } from 'react-helmet';
import { get } from 'lodash';
import Helper from '../../../../helper/utility';
// import { BUSINESS_INDUSTRIES, SECURITIES_VALUES } from '../../../../services/constants/admin/offerings';

const CollectionMetaTags = ({ collection, getOgDataFromSocial }) => (
  <Helmet>
    <meta name="description" content={getOgDataFromSocial(get(collection, 'marketing.header.description'), 'facebook', 'blurb')} />
    <link rel="canonical" href={window.location.href} />
    <title>{Helper.pageTitle(`${get(collection, 'marketing.header.title')} collection - NextSeed`)}</title>
    <meta property="og:locale" content="en_US" />
    <meta property="og:type" content="article" />
    <meta property="og:title" content={`${get(collection, 'marketing.header.title')} | NextSeed`} />
    <meta property="og:description" content={getOgDataFromSocial(get(collection, 'marketing.social'), 'facebook', 'blurb')} />
    <meta property="og:url" content={window.location.href} />
    <meta property="og:site_name" content="NextSeed" />
    <meta property="article:publisher" content="https://www.facebook.com/thenextseed" />
    {/* <meta property="article:tag" content={get(find(SECURITIES_VALUES, b => b.value === get(collection, 'keyTerms.securities')), 'text')} />
    <meta property="article:section" content={get(find(BUSINESS_INDUSTRIES, b => b.value === get(collection, 'keyTerms.industry')), 'text')} /> */}
    <meta property="fb:app_id" content="1806635959569619" />
    <meta property="og:image" content={getOgDataFromSocial(get(collection, 'marketing.social'), 'facebook', 'featuredImageUpload.url')} />
    <meta property="og:image:secure_url" content={getOgDataFromSocial(get(collection, 'marketing.social'), 'facebook', 'featuredImageUpload.url')} />
    <meta property="og:image:width" content="1218" />
    <meta property="og:image:height" content="542" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:description" content={getOgDataFromSocial(get(collection, 'marketing.social'), 'twitter', 'blurb')} />
    <meta name="twitter:title" content={`${get(collection, 'marketing.header.title')} | NextSeed`} />
    <meta name="twitter:site" content="@thenextseed" />
    <meta name="twitter:image" content={getOgDataFromSocial(get(collection, 'marketing.social'), 'twitter', 'featuredImageUpload.url')} />
    <meta name="twitter:creator" content="@thenextseed" />
  </Helmet>
);

export default CollectionMetaTags;