import React from 'react';
// import { Link } from 'react-router-dom';
import { Card } from 'semantic-ui-react';

const RewardList = ({ list }) => (
  <Card.Group stackable itemsPerRow={3}>
    {
      list.map(card => (
        <Card key={card.id}>
          <Card.Content>
            <Card.Header>{card.title}</Card.Header>
            <Card.Description>
              {card.description}
            </Card.Description>
            {/* {card.action === 'redeem' &&
              <Button as={Link} to={`${match.url}/redeem/${card.id}`}
              color="green">Redeem Reward</Button>
            }

            {card.action === 'voucher' &&
              <Button inverted color="green">Download voucher</Button>
            }

            {card.expiry &&
              <div className="action-meta">Exp. date<br /><b>{card.expiry}</b></div>
            } */}
          </Card.Content>
        </Card>
      ))
    }
  </Card.Group>
);

export default RewardList;
