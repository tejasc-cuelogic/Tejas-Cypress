import React from 'react';
import Aux from 'react-aux';
import { Button, Icon } from 'semantic-ui-react';

const ToggleEdit = props => (
  <Aux>
    <h3>{props.title}</h3>
    <div className="actions">
      {(props.editCard === props.card) ? (
        <Aux>
          <Button onClick={() => props.setEditCard(0)} className="negative">Cancel</Button>
          <Button onClick={props.save} circular color="green" size="mini" to=""><Icon name="check" />Save</Button>
        </Aux>
      ) :
        <Button onClick={() => props.setEditCard(props.card)}><Icon name="pencil" />Edit</Button>
      }
    </div>
  </Aux>
);

export default ToggleEdit;
