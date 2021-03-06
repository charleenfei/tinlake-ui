import * as React from 'react'
import { AuthState } from '../../../ducks/auth'
import { InvestorState, loadInvestor } from '../../../ducks/investments'
import { connect } from 'react-redux'
import { Box, Tab, Tabs } from 'grommet'
import Alert from '../../../components/Alert'
import { Spinner } from '@centrifuge/axis-spinner'
import { isValidAddress } from '../../../utils/address'
import TrancheView from '../Tranche'
import { TransactionState } from '../../../ducks/transactions'
import { PoolState, loadPool } from '../../../ducks/pool'

interface Props {
  tinlake: any
  auth: AuthState
  loadInvestor?: (tinlake: any, address: string) => Promise<void>
  investments?: InvestorState
  transactions?: TransactionState
  loadPool?: (tinlake: any) => Promise<void>
  pool?: PoolState
  investorAddress: string
}

interface State {
  errorMsg: string
  is: string | null
  selectedTab: number
}

class InvestorView extends React.Component<Props, State> {
  state: State = {
    errorMsg: '',
    is: null,
    selectedTab: 0,
  }

  showInvestor = async () => {
    const { investorAddress } = this.props
    const { loadInvestor, tinlake } = this.props
    this.setState({ is: null, errorMsg: '' })
    if (!isValidAddress(investorAddress)) {
      this.setState({ is: 'error', errorMsg: 'Please input a valid Ethereum address.' })
      return
    }
    loadInvestor && loadInvestor(tinlake, investorAddress)
  }

  componentDidMount() {
    if (this.props.auth.address) {
      this.props.loadPool && this.props.loadPool(this.props.tinlake)
    }

    this.showInvestor()
    this.setState({ selectedTab: 0 })
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.investorAddress !== prevProps.investorAddress) {
      this.showInvestor()
    }

    if (this.props.auth.address !== prevProps.auth.address) {
      this.props.loadPool && this.props.loadPool(this.props.tinlake)
    }
  }

  selectTab(tab: number) {
    this.setState({ selectedTab: tab })
  }

  render() {
    const { is, errorMsg, selectedTab } = this.state
    const { tinlake, investments, auth, pool } = this.props
    const investor = investments && investments.investor
    const investorState = investments && investments.investorState
    const dropAddress = this.props.tinlake.contractAddresses.SENIOR_TOKEN as string
    const tinAddress = this.props.tinlake.contractAddresses.JUNIOR_TOKEN as string

    const dropToken = {
      [dropAddress]: {
        symbol: 'DROP',
        logo: '../../static/DROP_final.svg',
        decimals: 18,
        name: 'DROP',
      },
    }
    const tinToken = {
      [tinAddress]: {
        symbol: 'TIN',
        logo: '../../static/TIN_final.svg',
        decimals: 18,
        name: 'TIN',
      },
    }

    const seniorTranche = pool?.data ? { ...pool.data.senior, ...{ tokenData: { ...dropToken } } } : null
    const juniorTranche = pool?.data ? { ...pool.data.junior, ...{ tokenData: { ...tinToken } } } : null

    if (investorState && investorState === 'loading') {
      return <Spinner height={'calc(100vh - 89px - 84px)'} message={'Loading Investor information...'} />
    }

    return (
      <Box>
        <Box pad={{ horizontal: 'medium' }}>
          {is === 'error' && <Alert type="error">{errorMsg && <div>{errorMsg}</div>}</Alert>}
        </Box>
        {pool && pool.data && (
          <Box pad={{ horizontal: 'medium', top: 'large' }}>
            <Tabs justify="center" activeIndex={selectedTab} flex="grow" onActive={(i) => this.selectTab(i)}>
              <Tab
                title="Senior tranche / DROP token"
                style={{
                  flex: 1,
                  fontWeight: 900,
                }}
              >
                <TrancheView tinlake={tinlake} auth={auth} investor={investor} tranche={seniorTranche} />
              </Tab>
              <Tab
                title="Junior tranche / TIN token"
                style={{
                  flex: 1,
                  fontWeight: 900,
                }}
              >
                <span></span>
                <TrancheView tinlake={tinlake} auth={auth} investor={investor} tranche={juniorTranche} />
              </Tab>
            </Tabs>
          </Box>
        )}
      </Box>
    )
  }
}

export default connect((state) => state, { loadInvestor, loadPool })(InvestorView)
