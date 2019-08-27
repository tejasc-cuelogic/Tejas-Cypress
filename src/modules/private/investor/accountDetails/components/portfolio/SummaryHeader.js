import React from 'react';
import { Link } from 'react-router-dom';
import snakeCase from 'lodash/snakeCase';
import { Card, Grid, Popup, Divider, Statistic, Icon, Header } from 'semantic-ui-react';
import { AccTypeTitle } from '../../../../../../theme/shared';
import Helper from '../../../../../../helper/utility';
/*
  type =>
  0 / undefined: display as it is
  1: amount so prefix $ sign
  2: date representation
*/
const isMobile = document.documentElement.clientWidth < 992;
const showValue = props => ((props.type === 1) && (props.title !== 'TNAR')
  ? (Helper.MoneyMathDisplayCurrency(props.content)) : (props.type === 1) && (props.title === 'TNAR') ? (props.content !== 'N/A') ? `${props.content} %` : `${props.content}`
    : (((props.type === 2) ? `date ${props.content}` : props.content)));

const SummaryTitle = props => ((props.details.businessName) ? (
  <Header as="h3">
    {props.details.businessName}
  </Header>
) : !props.isAdmin && (
  <>
    <Card.Content>
      <Card.Header className="with-icon"><AccTypeTitle /></Card.Header>
    </Card.Content>
    <Divider horizontal className="only-border" />
  </>
));

const SummaryHeader = props => (
  <>
    {props.details.title !== false && props.details.businessName
      && <SummaryTitle {...props} />
    }
    <Card fluid className={props.details.className || ''}>
      {props.details.title !== false && !props.details.businessName
        && <SummaryTitle {...props} />
      }
      {/* {isMobile
        ? (
        <Table basic>
          {
            props.details.summary.map(row => (
            <Table.row>
              <Table.Cell>
              {row.title}
              {row.info
                && (
                <Popup
                  trigger={<Icon className="ns-help-circle" />}
                  content={row.info}
                  position="top center"
                  wide
                  hoverable
                />
                )
              }
              </Table.Cell>
              <Table.Cell>
                {showValue(row)}
              </Table.Cell>
            </Table.row>
            ))
          }
        </Table>
        ) : ( */}
        <Grid stackable doubling celled columns={props.cols || props.details.summary.length} className="custom-divided">
          {
            props.details.summary.map(row => (
              <Grid.Column key={snakeCase(row.title)}>
                <Card.Content>
                  <Statistic size="mini" horizontal={isMobile} className={row.status}>
                    <Statistic.Label>
                      <div>
                        {row.title}
                        {row.info
                          && (
                          <Popup
                            trigger={<Icon className="ns-help-circle" />}
                            content={row.info}
                            position="top center"
                            wide
                            hoverable
                          />
                          )
                        }
                      </div>
                      {row.title === 'Total Balance'
                        && isMobile && <Link to={`/app/account-details/${props.details.accountType}/transfer-funds/add`}><b>Deposit funds</b></Link>
                      }
                    </Statistic.Label>
                    <Statistic.Value>{showValue(row)}</Statistic.Value>
                    {row.title === 'Total Balance'
                      && !isMobile && <Statistic.Label as={Link} className={props.details.isAccountFrozen ? 'disabled' : ''} to={`/app/account-details/${props.details.accountType}/transfer-funds/add`}>Deposit funds</Statistic.Label>
                    }
                  </Statistic>
                </Card.Content>
              </Grid.Column>
            ))
          }
        </Grid>
        {/* )} */}
    </Card>
  </>
);

export default SummaryHeader;
