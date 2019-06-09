/*  eslint-disable jsx-a11y/label-has-for */
import React from 'react';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import { Icon, Responsive, Button, Popup, Dimmer, Loader } from 'semantic-ui-react';
import Dropzone from 'react-dropzone';
import Aux from 'react-aux';
import { isArray } from 'lodash';
import { FieldError } from '../../shared';

const DropZone = observer((props) => {
  const {
    label,
    value,
    error,
    showLoader,
  } = props.fielddata;
  return (
    <div className={`file-uploader-wrap ${props.containerclassname}`}>
      {label
        && (
        <label>
          {label}
          {props.tooltip
          && (
          <Popup
            trigger={<Icon className="ns-help-circle" />}
            content={props.tooltip}
            position="top center"
            className="center-align"
            wide
          />
          )
          }
        </label>
        )
      }
      { !props.disabled && (!value || props.multiple)
        ? (
          <div className="file-uploader">
            <Dimmer active={showLoader}>
              <Loader />
            </Dimmer>
            <Dropzone {...props} onDrop={files => props.ondrop(files, props.name)} className="test" style={{}}>
              <Icon className="ns-upload" />
              {' '}
              {props.uploadtitle ? <span>{props.uploadtitle}</span> : (
                <span>
Upload document
                  {props.multiple ? 's' : ''}
                </span>
              )}
            </Dropzone>
          </div>
        ) : null
      }
      {(isArray(toJS(value)) && value.length)
        ? value.map((item, key) => (
          <div className="file-uploader attached">
            {!props.disabled
              && (
              <Aux>
                <Responsive
                  as={Button}
                  minWidth={768}
                  size="tiny"
                  compact
                  className="ghost-button remove pull-right"
                  onClick={e => props.onremove(e, props.name, key)}
                >
                  Remove
                </Responsive>
                <Responsive
                  as={Icon}
                  maxWidth={767}
                  name="remove"
                  className="pull-right"
                  onClick={e => props.onremove(e, props.name, key)}
                />
              </Aux>
              )
            }
            <span title={item}>{item}</span>
          </div>
        )) : !isArray(toJS(value)) && value
        && (
        <div className="file-uploader attached">
          {!props.disabled
            && (
            <Aux>
              <Responsive
                as={Button}
                minWidth={768}
                size="tiny"
                compact
                className="ghost-button remove pull-right"
                onClick={e => props.onremove(e, props.name)}
              >
                Remove
              </Responsive>
              <Responsive
                as={Icon}
                maxWidth={767}
                name="remove"
                className="pull-right"
                onClick={e => props.onremove(e, props.name)}
              />
            </Aux>
            )
          }
          <span title={value}>{value}</span>
        </div>
        )
      }
      {error
        && <FieldError error={error} />
      }
    </div>
  );
});

export default DropZone;
