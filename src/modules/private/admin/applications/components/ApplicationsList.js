import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Form, Grid, Input, Button, Card, Table, Header, Item, Rating } from 'semantic-ui-react';
import { get } from 'lodash';
import { DropdownFilter } from '../../../../../theme/form/Filters';
import { FILTER_META } from '../../../../../constants/user';
import { FormCheckbox } from '../../../../../theme/form';
import { ApplicationListStepColumn } from './ApplicationListStepColumn';
import ApplicationListButtons from './ApplicationListButtons';
import { AppStatusLabel } from './AppStatusLabel';
import { InlineLoader, NsPaginationType2 } from '../../../../../theme/shared';
import { BUSINESS_APPLICATION_STATUS } from '../../../../../services/constants/businessApplication';
import { DataFormatter } from '../../../../../helper';

@inject('businessAppAdminStore', 'uiStore')
@observer
export default class ApplicationsList extends Component {
  componentWillMount() {
    const { match } = this.props;
    const { fetchBusinessApplicationsByStatus } = this.props.businessAppAdminStore;
    if (match.isExact) {
      fetchBusinessApplicationsByStatus(match.params.applicationType);
    }
  }

  setSearchParam = (e, { name, value }) => this.props.businessAppAdminStore.setInitiateSrch(name, value);

  executeSearch = (e) => {
    if (e.charCode === 13) {
      this.props.businessAppAdminStore.setInitiateSrch('keyword', e.target.value);
    }
  }

  paginate = params => this.props.businessAppAdminStore.initRequest(params);

  render() {
    const { match } = this.props;
    const {
      getBusinessApplication, requestState, filterApplicationStatus, columnTitle,
      totalRecords, businessApplicationsList, setKeyword, exportBusinessApplications,
    } = this.props.businessAppAdminStore;
    const { inProgress } = this.props.uiStore;
    if (businessApplicationsList.loading) {
      return <InlineLoader />;
    }
    return (
      <>
        <Form>
          <Grid>
            <Grid.Row verticalAlign="bottom">
              <Grid.Column width={8}>
                <Input fluid onKeyPress={this.executeSearch} onChange={setKeyword} value={requestState.search.keyword} icon={{ className: 'ns-search' }} iconPosition="left" placeholder="Search by keyword or phrase" />
              </Grid.Column>
              <Grid.Column width={4}>
                <DropdownFilter name="Sort By Field" keyName="by" change={this.setSearchParam} value={requestState.sort.by} options={FILTER_META.businessAppSortField} />
              </Grid.Column>
              <Grid.Column width={3} floated="right" textAlign="right">
                <Button primary className="relaxed" loading={inProgress} content="Export" onClick={() => exportBusinessApplications(this.props.match.params.applicationType)} />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column width={10}>
                <FormCheckbox
                  fielddata={filterApplicationStatus}
                  name="applicationStatus"
                  changed={this.setSearchParam}
                  defaults
                  containerclassname="ui list horizontal"
                />
              </Grid.Column>
              <Grid.Column width={6} textAlign="right">
                <NsPaginationType2 floated="right" initRequest={({ first, page }) => this.paginate({ first, page, noFilter: true })} meta={{ totalRecords, requestState }} />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Form>
        <Card fluid>
          <div className="table-wrapper">
            <Table unstackable className="application-list">
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Info</Table.HeaderCell>
                  <Table.HeaderCell width={4}>Comments</Table.HeaderCell>
                  <Table.HeaderCell width={4}>{columnTitle}</Table.HeaderCell>
                  <Table.HeaderCell textAlign="center">Action</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {getBusinessApplication.length
                  ? getBusinessApplication.map(application => (
                    (application.applicationStatus || application.prequalStatus)
                    !== BUSINESS_APPLICATION_STATUS.APPLICATION_REMOVED
                    && (
                      <Table.Row verticalAlign="top">
                        <Table.Cell singleLine>
                          <Header as="h6">
                            <Link to={`${match.url}/view/${application.applicationId || application.id}/${application.userId || 'new'}`}>
                              {application.prequalDetails
                                ? application.prequalDetails.businessGeneralInfo.businessName
                                : application.businessGeneralInfo.businessName}
                            </Link>
                            <AppStatusLabel application={application} />
                          </Header>
                          <div className="table-info-wrap">
                            <p>
                              <span>{application.primaryPOC
                                ? `${application.primaryPOC.firstName} ${application.primaryPOC.lastName}`
                                : `${application.firstName} ${application.lastName}`
                              }
                              </span>
                              <span>
                                {application.primaryPOC && application.primaryPOC.email
                                  ? `${application.primaryPOC.email}` : `${application.email}`
                                }
                              </span>
                              <span>
                                {application.primaryPOC && application.primaryPOC.phone
                                  ? `${application.primaryPOC.phone.number}` : application.businessGeneralInfo.contactDetails && `${application.businessGeneralInfo.contactDetails.phone.number}`
                                }
                              </span>
                            </p>
                            <p>
                              {get(application, 'signupCode') && get(application, 'utmSource') && (
                                <>
                                  <span>Sign-Up Code <b>{get(application, 'signupCode')}</b></span>
                                  <span>Utm Source <b>{get(application, 'utmSource')}</b></span>
                                </>
                              )}
                              <span>
                                Started{' '}
                                <b>
                                  {match.params.applicationType === 'prequal-failed' ? (` ${application.submittedDate}` ? DataFormatter.getDateInLocalTimeZone(` ${application.submittedDate}`, true, false, false) : '-') : (` ${get(application, 'created.date')}` ? DataFormatter.getDateInCST(` ${application.created.date}`, true, false, false) : '-')}
                                </b>
                              </span>
                              <span>Updated <b>{application.updated ? DataFormatter.getDateInLocalTimeZone(` ${application.updated.date}`, true, false, false) : '-'}</b></span>
                            </p>
                          </div>
                        </Table.Cell>
                        <Table.Cell>
                          <Item>
                            <Item.Header><Rating size="large" disabled defaultRating={application.rating || 0} maxRating={5} /></Item.Header>
                            {application.comments && application.comments.length
                              && (
                                <Item.Content>
                                  <Item.Description>
                                    {application.comments[application.comments.length - 1].text}
                                  </Item.Description>
                                  <Item.Extra>
                                    {application.comments[application.comments.length - 1].commentor
                                      && (
                                        <b>{DataFormatter.getDateInLocalTimeZone(application.comments[application.comments.length - 1].commentor.date, true, false, true)}</b>
                                      )
                                    }
                                    {application.comments[application.comments.length - 1].commentor
                                      && (
                                        <b>{' '}
                                          {application.comments[application.comments.length - 1].commentor.by}
                                        </b>
                                      )
                                    }
                                  </Item.Extra>
                                </Item.Content>
                              )
                            }
                          </Item>
                        </Table.Cell>
                        <ApplicationListStepColumn
                          application={application}
                        />
                        <ApplicationListButtons
                          refLink={match.url}
                          application={application}
                        />
                      </Table.Row>
                    )
                  ))
                  : (
                    <Table.Row>
                      <Table.Cell colSpan="6">
                        <InlineLoader text="No data available." />
                      </Table.Cell>
                    </Table.Row>
                  )
                }
              </Table.Body>
            </Table>
          </div>
        </Card>
      </>
    );
  }
}
