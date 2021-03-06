import * as React from 'react'
import WithTinlake from '../../../../../components/WithTinlake'
import IssueLoan from '../../../../../containers/Loan/Issue'
import { Box, Heading } from 'grommet'
import Header from '../../../../../components/Header'
import SecondaryHeader from '../../../../../components/SecondaryHeader'
import { menuItems } from '../../../../../menuItems'
import { BackLink } from '../../../../../components/BackLink'
import Auth from '../../../../../components/Auth'
import withRouter, { WithRouterProps } from 'next/dist/client/with-router'
import WithFooter from '../../../../../components/WithFooter'
import config, { Pool } from '../../../../../config'
import { GetStaticProps } from 'next'
import Container from '../../../../../components/Container'
import Head from 'next/head'

interface Props extends WithRouterProps {
  root: string
  pool: Pool
}

class LoanIssuePage extends React.Component<Props> {
  render() {
    const { pool } = this.props
    const { tokenId, registry }: { tokenId: string; registry: string } = this.props.router.query as any

    return (
      <WithFooter>
        <Head>
          <title>Open Financing: {pool.metadata.name} | Tinlake | Centrifuge</title>
        </Head>
        <Header
          poolTitle={pool.metadata.shortName || pool.metadata.name}
          selectedRoute={'/assets/issue'}
          menuItems={menuItems}
        />
        <Container>
          <Box justify="center" direction="row">
            <Box width="xlarge">
              <WithTinlake
                version={pool.version}
                addresses={pool.addresses}
                contractConfig={pool.contractConfig}
                render={(tinlake) => (
                  <Auth
                    tinlake={tinlake}
                    render={(auth) => (
                      <Box>
                        <SecondaryHeader>
                          <Box direction="row" gap="small" align="center">
                            <BackLink href={'/assets'} />
                            <Heading level="3">Open Financing</Heading>
                          </Box>
                        </SecondaryHeader>
                        <IssueLoan
                          tinlake={tinlake}
                          poolConfig={pool}
                          auth={auth}
                          tokenId={tokenId}
                          registry={registry}
                        />
                      </Box>
                    )}
                  />
                )}
              />
            </Box>
          </Box>
        </Container>
      </WithFooter>
    )
  }
}

export async function getStaticPaths() {
  // We'll pre-render only these paths at build time.
  const paths = config.pools.map((pool) => ({
    params: { root: pool.addresses.ROOT_CONTRACT, slug: pool.metadata.slug },
  }))

  // { fallback: false } means other routes should 404.
  return { paths, fallback: false }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  return { props: { root: params?.root, pool: config.pools.find((p) => p.addresses.ROOT_CONTRACT === params?.root) } }
}

export default withRouter(LoanIssuePage)
