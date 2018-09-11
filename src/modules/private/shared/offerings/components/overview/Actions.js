import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';

const actions = {
  pause: { label: 'Pause', color: 'blue inverted' },
  'soft-close': { label: 'Soft Close', color: 'red inverted' },
  close: { label: 'Close', color: 'red' },
};

export default class Actions extends Component {
  render() {
    return (
      <Button.Group textAlign="right" compact size="mini">
        {Object.keys(actions).map(action => (
          <Button className={actions[action].color}>
            {actions[action].label}
          </Button>
        ))}
      </Button.Group>
    );
  }
}
