/* eslint-disable no-tabs */
import React from 'react';
import { inject, observer } from 'mobx-react';
import { Grid, Card } from 'semantic-ui-react';
import { InlineLoader, NsPagination } from '../../../../../../theme/shared';
import { FillTable } from '../../../../../../theme/table/NSTable';

function RdsList(props) {
	const { loadingArray } = props.nsUiStore;
	if (loadingArray.includes('adminRunRdsQuery')) {
		return <InlineLoader />;
	}
	const { rdsListingColumns, rdsListingRows, totalRecords, requestState, pageRequest } = props.rdsPluginStore;
	return (
		<Grid>
			<Grid.Row>
				<Grid.Column width={16}>
					<Card fluid>
						<FillTable result={{ rows: rdsListingRows, columns: rdsListingColumns }} />
					</Card>
					{totalRecords > 0 && totalRecords > requestState.perPage
						&& <NsPagination floated="right" initRequest={pageRequest} meta={{ totalRecords, requestState }} />
					}
				</Grid.Column>
			</Grid.Row>
		</Grid>
	);
}
export default inject('rdsPluginStore', 'nsUiStore')(observer(RdsList));
