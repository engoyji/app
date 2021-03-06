import React from 'react'
import ReactTable from 'react-table'
import Loader from '@santiment-network/ui/Loader/Loader'
import PanelWithHeader from '@santiment-network/ui/Panel/PanelWithHeader'
import { columns } from './columns'
import GetAssets, {
  FIRST_LOAD_SIZE
} from '../../ducks/Watchlists/Widgets/Table/GetAssets'
import '../../ducks/Watchlists/Widgets/Table/ProjectsTable.scss'
import styles from './EthSpentTable.module.scss'

const EthSpentTable = () => {
  return (
    <GetAssets
      sortBy='eth_balance'
      type='erc20'
      render={({ items = [], isLoading: loading = true, loadingAll }) => {
        return (
          <PanelWithHeader
            header={
              <div className={styles.header}>
                Ethereum spent overview{' '}
                {loadingAll && <Loader className={styles.headerLoader} />}
              </div>
            }
            className={styles.wrapper}
            contentClassName={styles.panel}
          >
            <ReactTable
              loading={loading}
              multiSort
              showPagination
              sortable
              defaultPageSize={FIRST_LOAD_SIZE}
              minRows={0}
              defaultSorted={[
                {
                  id: 'eth_spent',
                  desc: false
                }
              ]}
              resizable={false}
              className={styles.ethSpentTable}
              data={items}
              columns={columns}
              LoadingComponent={({ loading }) =>
                loading && <Loader className={styles.loader} />
              }
            />
          </PanelWithHeader>
        )
      }}
    />
  )
}

export default EthSpentTable
