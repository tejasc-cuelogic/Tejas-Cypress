import React from 'react';
import Aux from 'react-aux';
import findLastIndex from 'lodash/findLastIndex';
import { Grid, Popup, Header, List } from 'semantic-ui-react';
import Helper from '../../../../../../../helper/utility';

const data = {
  invested: 7500,
  milestones: [
    {
      amount: 500,
      reward: {
        head: 'Invest $500 or more',
        subHead: 'Cooking Class',
        highlights: ['$50 Gift Card', 'Invitation for 2 to the Launch Party'],
      },
    },
    {
      amount: 1000,
      reward: {
        head: 'Invest $1000 or more',
        subHead: 'Cooking Class',
        highlights: ['$50 Gift Card', 'Invitation for 2 to the Launch Party'],
      },
    },
    {
      amount: 2500,
      reward: {
        head: 'Invest $2500 or more',
        subHead: 'Cooking Class',
        highlights: ['$50 Gift Card', 'Invitation for 2 to the Launch Party'],
      },
    },
    {
      amount: 5000,
      reward: {
        head: 'Invest $5000 or more',
        subHead: 'Cooking Class',
        highlights: ['$50 Gift Card', 'Invitation for 2 to the Launch Party'],
      },
    },
    {
      amount: 10000,
      reward: {
        head: 'Invest $500 or more',
        subHead: 'Cooking Class',
        highlights: ['$50 Gift Card', 'Invitation for 2 to the Launch Party'],
      },
    },
    {
      amount: 25000,
      reward: {
        head: 'Invest $500 or more',
        subHead: 'Cooking Class',
        highlights: ['$50 Gift Card', 'Invitation for 2 to the Launch Party'],
      },
    },
    {
      amount: 50000,
      reward: {
        head: 'Invest $500 or more',
        subHead: 'Cooking Class',
        highlights: ['$50 Gift Card', 'Invitation for 2 to the Launch Party'],
      },
    },
  ],
};

const calcSmartProgress = (milestones, amount) => {
  const pIndex = findLastIndex(milestones, m => m.amount <= amount);
  return ((pIndex / (milestones.length - 1)) * 100) +
    (((amount - milestones[pIndex].amount) /
      (milestones[pIndex + 1].amount - milestones[pIndex].amount)) *
        (100 / (milestones.length - 1)));
};

const InvestmentTimeline = (props) => {
  const progress = calcSmartProgress(data.milestones, data.invested);
  return (
    <Aux>
      <Header as="h4">{props.title}</Header>
      <Grid columns="equal" textAlign="center" className="investment-scale">
        <div className="invested">
          <span className="investment-progress" style={{ width: `${progress}%` }} />
          <div className="amount" style={{ left: `${progress}%` }}>Your investment <span>{Helper.CurrencyFormat(data.invested)}</span></div>
        </div>
        <Grid.Row>
          {
            data.milestones.map((milestone, index) => (
              <Grid.Column
                className={`${(data.milestones[index].amount <= data.invested && data.milestones[index + 1].amount >= data.invested) ? 'crossed' : ''}`}
                key={`m_${milestone.amount}`}
              >
                <Popup
                  trigger={<span>{Helper.CurrencyFormat(milestone.amount)}</span>}
                  position="bottom center"
                  className="reward-info"
                  wide
                >
                  <Popup.Content>
                    <Header as="h4" className="mb-half">
                      {milestone.reward.head}
                      <Header.Subheader>{milestone.reward.subHead}</Header.Subheader>
                    </Header>
                    <List bulleted>
                      {
                        milestone.reward.highlights.map(h => (
                          <List.Item key={`m_${h}`}>{h}</List.Item>
                        ))
                      }
                    </List>
                  </Popup.Content>
                </Popup>
              </Grid.Column>
            ))
          }
        </Grid.Row>
      </Grid>
    </Aux>
  );
};

export default InvestmentTimeline;
