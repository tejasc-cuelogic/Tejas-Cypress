import React from 'react';
import { Button, Icon, Header } from 'semantic-ui-react';

const ToggleEdit = props => (
  <>
    <Header as="h4">{props.title}</Header>
    <div className="actions">
      {(props.editCard === props.card) ? (
        <>
          <Button onClick={() => props.setEditCard(0)} className="negative">Cancel</Button>
          <Button onClick={props.save} circular color="green" size="mini" to="">
            <Icon name="check" />
Save
          </Button>
        </>
      )
        : <Button onClick={() => props.setEditCard(props.card)}><Icon name="pencil" />Edit</Button>
      }
    </div>
  </>
);

export default ToggleEdit;
