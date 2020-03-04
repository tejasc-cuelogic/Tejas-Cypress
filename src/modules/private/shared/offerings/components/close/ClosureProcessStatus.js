import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Header, Grid, Table, Button, Icon } from 'semantic-ui-react';
import { capitalize, isEmpty } from 'lodash';
import { DataFormatter } from '../../../../../../helper';

@inject('offeringCreationStore')
@observer
export default class ClosureProcessStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
        autoReload: false,
        showClosureProcessStatus: false,
        loading: false,
        closureProcess: this.props.closureProcess,
    };
    // offer.ClosureProcessStatus(offer.id);
  }

  toggleVisibilityStatus = (of) => {
    const currStatus = this.state[of];
    this.setState({ [of]: !currStatus });
  }

  handleAutoReload = () => {
    this.setState({ autoReload: !this.state.autoReload }, () => {
      this.getClosureProcessStatus();
    });
  }

  getClosureProcessStatus = async () => {
    if (this.state.autoReload) {
      const { getOfferingClosureProcessMeta, currentOfferingSlug } = this.props.offeringCreationStore;
      this.setState({ loading: true });
      const res = await getOfferingClosureProcessMeta(currentOfferingSlug);
      this.setState({ ...this.state, closureProcess: res });
      setTimeout(() => {
        this.getClosureProcessStatus();
      }, 5000);
      this.setState({ loading: false });
    }
  }

  render() {
    const {
        closureProcess,
    } = this.state;
    return (
        <>
          <div className="header-with-button">
            <Header as="h4" className="mb-0">
            Closure Process Status
              <Icon onClick={() => this.toggleVisibilityStatus('showClosureProcessStatus')} className={`ns-chevron-${this.state.showClosureProcessStatus === true ? 'up' : 'down'}-compact right`} color="blue" />
            </Header>
            {this.state.showClosureProcessStatus
              && (
                  <>
                  <Button icon loading={this.state.loading} labelPosition="left" onClick={() => this.handleAutoReload('showClosureProcessStatus')} primary={!this.state.autoReload}><Icon name={(this.state.autoReload) ? 'pause' : 'play'} />{(this.state.autoReload) ? 'Pause' : 'Autoload'}</Button>
                  </>
              )
            }
          </div>
          {(this.state.showClosureProcessStatus)
            ? isEmpty(closureProcess)
            ? (
            <section className="bg-midwhite center-align">
                <Header as="h4">No Data Found</Header>
            </section>
            )
            : (
                <Grid columns={3} className="mt-30">
                {!isEmpty(closureProcess) && Object.keys(closureProcess).map(key => (
                (key !== '__typename')
                 && (
                  <Grid.Column className="center-align" key={key}><Header as="h5">{capitalize(key.replace(/([a-z0-9])([A-Z])/g, '$1 $2'))}</Header>
                    <div className="table-wrapper">
                    <Table unstackable basic="very">
                        <Table.Body>
                        {closureProcess[key] ? ['Status', 'Started', 'Finished'].map(k => (
                            <Table.Row key={k}>
                            <Table.Cell>{k}</Table.Cell>
                            <Table.Cell>
                                {k === 'Status'
                                && (
                                    <>
                                    {closureProcess[key].status
                                        ? (
                                        <>
                                            <b className={closureProcess[key].status === 'COMPLETE' ? 'positive-text' : closureProcess[key].status === 'PENDING' ? 'warning-text' : 'negative-text'}>{closureProcess[key].status}</b>
                                            {closureProcess[key].finished && closureProcess[key].started
                                            && (
                                                <span> ({DataFormatter.getDateDifference(closureProcess[key].started, closureProcess[key].finished)})</span>
                                            )
                                            }
                                        </>
                                        )
                                        : <>-</>
                                    }
                                    </>
                                )
                                }
                                {k === 'Started'
                                && (
                                    <>
                                    {(closureProcess[key].started || closureProcess[key].startedCount) ? (
                                        <>
                                        {closureProcess[key].startedCount || '0'} - {closureProcess[key].started ? DataFormatter.getDateAsPerTimeZone(closureProcess[key].started, true, false, false, 'M/D/YYYY h:mm a') : ''}
                                        </>
                                    ) : <>-</>
                                    }
                                    </>
                                )
                                }
                                {k === 'Finished'
                                && (
                                    <>
                                    {
                                        (closureProcess[key].remainingCount || closureProcess[key].finished)
                                        ? (
                                            <>{closureProcess[key].startedCount - closureProcess[key].remainingCount || '0'} - {closureProcess[key].finished ? DataFormatter.getDateAsPerTimeZone(closureProcess[key].finished, true, false, false, 'M/D/YYYY h:mm a') : ''}
                                            </>
                                        ) : <>-</>
                                    }
                                    </>
                                )
                                }
                            </Table.Cell>
                            </Table.Row>
                        )) : (
                            <section className="center-align">
                                <Header as="h6">No Data Found</Header>
                            </section>
                            )
                        }
                        </Table.Body>
                    </Table>
                    </div>
                </Grid.Column>
                )))}
            </Grid>
            ) : ''}
      </>
    );
  }
}
