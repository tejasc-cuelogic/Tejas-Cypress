import React from 'react';
import { camelCase } from 'lodash';
import { Header } from 'semantic-ui-react';
import HtmlEditor from '../../../../shared/HtmlEditor';
import { InlineLoader } from '../../../../../theme/shared';

function CustomContent({ title, content, isTablet }) {
    return (
      <>
        {title ? (
          <Header as="h3" className={`${isTablet ? 'mb-20 mt-40' : 'mt-40 mb-30'} anchor-wrap`}>
            {title}
            <span className="anchor" id={title ? camelCase(title) : ''} />
          </Header>
        ) : null}
        {content
          ? (
            <p className="mb-40 copyright-info">
              <HtmlEditor readOnly content={(content)} />
            </p>
          )
          : <InlineLoader text="No Data Found" className="bg-offwhite" />
        }
      </>
    );
  }

export default CustomContent;
