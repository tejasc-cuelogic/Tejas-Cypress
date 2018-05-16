import React from 'react';
import {
  Divider,
} from 'semantic-ui-react';

const team = () => (
  <div>
    <span className="title">NextSeed Privacy Policy</span>
    <span className="infotext">
      Last updated January 2018
    </span>
    <Divider inverted section />
    {/* eslint-disable max-len */}
    <p className="pageContent">
      NextSeed US LLC (together with its affiliates, “NextSeed”) offers its website and services on the terms stated in these Terms of Use (the “Terms”). The NextSeed Privacy Policy includes additional information about NextSeed’s use of information you submit using the website and services. Please read the Terms and the Privacy Policy carefully and let us know if you have any questions at all. You may reach NextSeed at info@nextseed.co. If you do not agree to the Terms or Privacy Policy you may not use the website or service. By using the website or services, you accept these Terms and the Privacy Policy. If you are using the website or services on behalf of any entity, you represent and warrant that you are authorized to accept these Terms and the Privacy Policy on that entity’s behalf.
    </p>
    <p className="pageContent">
      Certain words used in these Terms have specific meanings as stated in the section where they are first used or in the section below captioned Definitions. For example, the words “NextSeed Content” and “User Content” have specific definitions that you must read and understand to have a full understanding these Terms.
    </p>
  </div>
);

export default team;
