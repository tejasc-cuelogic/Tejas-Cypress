import React from 'react';
import { Helmet } from 'react-helmet';
import { get } from 'lodash';
import Helper from '../../../../helper/utility';
import { DataFormatter } from '../../../../helper';

const insightContent = insight => (
  get(insight, 'content') ? get(insight, 'content').replace(/<[^>]*>?/gm, '').slice(0, 70).trim() : ''
);

const InsightMetaTags = ({ insight }) => (
  <Helmet>
    <meta name="description" content={DataFormatter.getOgDataFromSocial(get(insight, 'social'), 'facebook', 'blurb') || insightContent(insight)} />
    <link rel="canonical" href={window.location.href} />
    <title>{Helper.pageTitle(`${get(insight, 'title')}`)}</title>
    <meta property="og:locale" content="en_US" />
    <meta property="og:type" content="article" />
    <meta property="og:title" content={`${get(insight, 'title')} | NextSeed`} />
    <meta property="og:description" content={DataFormatter.getOgDataFromSocial(get(insight, 'social'), 'facebook', 'blurb') || insightContent(insight)} />
    <meta property="og:url" content={window.location.href} />
    <meta property="og:site_name" content="NextSeed" />
    <meta property="article:publisher" content="https://www.facebook.com/thenextseed" />
    <meta property="article:tag" content={get(insight, 'tags') ? get(insight, 'tags').join(', ') : ''} />
    <meta property="article:section" content={get(insight, 'category')} />
    <meta property="fb:app_id" content="1806635959569619" />
    <meta property="og:image" content={DataFormatter.getOgDataFromSocial(get(insight, 'social'), 'facebook', 'featuredImageUpload.url') || get(insight, 'featuredImage')} />
    <meta property="og:image:secure_url" content={DataFormatter.getOgDataFromSocial(get(insight, 'social'), 'facebook', 'featuredImageUpload.url') || get(insight, 'featuredImage')} />
    <meta property="og:image:width" content="1218" />
    <meta property="og:image:height" content="542" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:description" content={DataFormatter.getOgDataFromSocial(get(insight, 'social'), 'twitter', 'blurb') || insightContent(insight)} />
    <meta name="twitter:title" content={`${get(insight, 'title')} | NextSeed`} />
    <meta name="twitter:site" content="@thenextseed" />
    <meta name="twitter:image" content={DataFormatter.getOgDataFromSocial(get(insight, 'social'), 'twitter', 'featuredImageUpload.url') || get(insight, 'featuredImage')} />
    <meta name="twitter:creator" content="@thenextseed" />
  </Helmet>
);

export default InsightMetaTags;
