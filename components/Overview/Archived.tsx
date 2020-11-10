import * as React from 'react'
import { Box, Heading, Table, TableCell, TableRow, TableBody } from 'grommet'
import { baseToDisplay, feeToInterestRate } from '@centrifuge/tinlake-js'
import { ArchivedPoolData } from '../../ducks/pool'
import { ArchivedPool } from '../../config'
import { toPrecision } from '../../utils/toPrecision'
import { addThousandsSeparators } from '../../utils/addThousandsSeparators'
import { LoadingValue } from '../../components/LoadingValue/index'
import { ExplainerCard } from '../../containers/Investment/RevolvingPool/View/styles'

interface Props {
  selectedPool: ArchivedPool
}

class Archived extends React.Component<Props> {
  render() {
    const { selectedPool } = this.props

    const poolData: ArchivedPoolData = selectedPool.archivedValues
    const totalFinanced = poolData?.totalFinancedCurrency
    const totalFinancings = poolData?.financingsCount
    const seniorInterest = poolData?.seniorInterestRate
    const averageFee = poolData?.averageFinancingFee

    return (
      <Box margin={{ bottom: 'large', top: 'medium' }}>
        <Heading level="4">Pool Overview of {selectedPool.metadata.name} </Heading>

        <Box direction="row" margin={{ bottom: 'large' }}>
          <Box basis={'1/3'}>
            <Box>
              <ExplainerCard margin={{ bottom: 'medium' }}>
                This pool has been fully repaid and closed. For current Tinlake pools, please check{' '}
                <a href={'https://tinlake.centrifuge.io'}>here.</a>
              </ExplainerCard>
              <Heading level="5" margin={{ top: 'small', bottom: 'small' }}>
                Pool Details
              </Heading>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell scope="row">Total Financed</TableCell>
                    <TableCell style={{ textAlign: 'end' }}>
                      <LoadingValue done={totalFinanced !== undefined}>
                        {addThousandsSeparators(toPrecision(baseToDisplay(totalFinanced || '0', 18), 0))} DAI
                      </LoadingValue>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell scope="row">Total Financings</TableCell>
                    <TableCell style={{ textAlign: 'end' }}>
                      <LoadingValue done={totalFinancings !== undefined}>{totalFinancings}</LoadingValue>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell scope="row">DROP APR</TableCell>
                    <TableCell style={{ textAlign: 'end' }}>
                      <LoadingValue done={seniorInterest !== undefined}>
                        {toPrecision(feeToInterestRate(seniorInterest || '0'), 2)} %
                      </LoadingValue>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell scope="row">Average Financing Fee</TableCell>
                    <TableCell style={{ textAlign: 'end' }}>
                      <LoadingValue done={averageFee !== undefined}>
                        {toPrecision(feeToInterestRate(averageFee || '0'), 2)} %
                      </LoadingValue>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Box>
          <Box basis={'2/3'} margin={{ top: '0', left: 'xxlarge' }}>
            <div>
              <Heading level="5" margin={{ top: 'small' }}>
                Asset Originator Details
              </Heading>
              <a href={selectedPool.metadata.website} target="_blank">
                <img src={selectedPool.metadata.logo} style={{ maxHeight: '80px', maxWidth: '50%' }} />
              </a>

              <p>{selectedPool.metadata.description}</p>

              <p>
                {Object.keys(selectedPool.metadata.details).map((key: string) => (
                  <React.Fragment key={key}>
                    <strong>{key}:&nbsp;</strong> {selectedPool.metadata.details[key]}
                    <br />
                  </React.Fragment>
                ))}
              </p>

              {selectedPool.metadata.discourseLink && (
                <>
                  <h4 style={{ marginBottom: '0' }}>Learn more about this asset originator</h4>
                  <a href={selectedPool.metadata.discourseLink} target="_blank">
                    Join the discussion on Discourse
                  </a>
                </>
              )}
            </div>
          </Box>
        </Box>
      </Box>
    )
  }
}

export default Archived