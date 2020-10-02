import * as React from 'react'
import { Box, Heading } from 'grommet'
import { Pool } from '../../../../config'
import { ITinlake as ITinlakeV3 } from '@centrifuge/tinlake-js-v3'
import { connect, useDispatch, useSelector } from 'react-redux'
import { loadPool } from '../../../../ducks/pool'

import { ExplainerCard } from './styles'
import PoolOverview from './PoolOverview'
import TrancheOverview from './TrancheOverview'
import EpochOverview from './EpochOverview'
import AdminActions from './AdminActions'
import { useInterval } from '../../../../utils/hooks'
import { AuthState } from '../../../../ducks/auth'

interface Props {
  activePool: Pool
  tinlake: ITinlakeV3
  auth?: AuthState
}

export type EpochData = {
  id: number
  state: 'open' | 'can-be-closed' | 'in-submission-period' | 'in-challenge-period' | 'challenge-period-ended'
  isBlockedState: boolean
  minimumEpochTime: number
  lastEpochClosed: number
  latestBlockTimestamp: number
}

const InvestmentsView: React.FC<Props> = (props: Props) => {
  const isAdmin = props.auth?.permissions?.canSetMinimumJuniorRatio

  const [epochData, setEpochData] = React.useState<EpochData | undefined>(undefined)

  const updateEpochData = async () => {
    const state = await props.tinlake.getCurrentEpochState()
    setEpochData({
      state,
      id: await props.tinlake.getCurrentEpochId(),
      isBlockedState:
        state === 'in-submission-period' || state === 'in-challenge-period' || state === 'challenge-period-ended',
      minimumEpochTime: await props.tinlake.getMinimumEpochTime(),
      lastEpochClosed: await props.tinlake.getLastEpochClosed(),
      latestBlockTimestamp: await props.tinlake.getLatestBlockTimestamp(),
    })
  }

  useInterval(() => {
    updateEpochData()
  }, 60000)

  const dispatch = useDispatch()
  const address = useSelector<any, string | null>((state) => state.auth.address)

  React.useEffect(() => {
    dispatch(loadPool(props.tinlake))
    updateEpochData()
  }, [address])

  return (
    <Box margin={{ top: 'medium' }}>
      <Heading level="4">Pool Overview {props.activePool?.name}</Heading>
      <ExplainerCard margin={{ bottom: 'medium' }}>
        Investors can invest into this Tinlake pool through two tokens that are backed by collateral locked by the Asset
        Originator: TIN and DROP. Both tokens represent the liquidity deposited into Tinlake and accrue interest over
        time. TIN, known as the “risk token,” takes the risk of defaults first but also receives higher returns. DROP,
        known as the “yield token,” is protected against defaults by the TIN token and receives stable (but usually
        lower) returns at the DROP rate.
      </ExplainerCard>

      <PoolOverview />

      <Heading level="4">Invest/Redeem in {props.activePool?.name}</Heading>
      <ExplainerCard margin={{ bottom: 'medium' }}>
        Please place your DROP and TIN investments and redemptions below. Tinlake pool investments and redemptions are
        locked in throughout the current “Epoch” and executed at the end of the Epoch based on available capital
        considering the pools risk metrics. You can cancel your order at any time until the end of the Epoch. Please
        find more detailed information about Epochs, the Epoch matching mechanism and how to invest and redeem into
        Tinlake here…
      </ExplainerCard>

      <Box direction="row" justify="between" gap="medium">
        <Box>
          <TrancheOverview epochData={epochData} pool={props.activePool} tinlake={props.tinlake} tranche="senior" />
          <TrancheOverview epochData={epochData} pool={props.activePool} tinlake={props.tinlake} tranche="junior" />
        </Box>

        {epochData && <EpochOverview epochData={epochData} tinlake={props.tinlake} />}
      </Box>

      {isAdmin && (
        <>
          <Heading level="4">Admin actions for {props.activePool?.name}</Heading>
          <AdminActions tinlake={props.tinlake} />
        </>
      )}
    </Box>
  )
}

export default connect((state) => state)(InvestmentsView)