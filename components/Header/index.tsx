import React, { FunctionComponent } from 'react';
import { Anchor, Box, Button, Image, Text } from 'grommet';
import Link from 'next/link';

export interface MenuItem {
  label: string;
  route: string;
  // external?: boolean;
  secondary?: boolean;
}

interface HeaderProps {
  // user: User | null,
  selectedRoute: string;
  menuItems: MenuItem[];
  // push: (route: string) => void;
  section: string;
}

// tslint:disable-next-line:variable-name
const Header: FunctionComponent<HeaderProps> = (props) => {

  const { selectedRoute, menuItems, section } = props;

  const sectionGap = 'medium';
  const itemGap = 'small';

  return <Box
    justify="center"
    align="center"
    height="xsmall"
    fill="horizontal"
    // TODO move this to axis theme
    style={{ position: 'sticky', top: 0, height: '90px', zIndex: 1 }}
    background="white"
    border={{ side: 'bottom', color: 'light-4' }}
  >
    <Box
      direction="row"
      fill="vertical"
      align="center"
      justify="between"
      pad={{ horizontal: 'medium' }}
      gap={sectionGap}
      width="xlarge"
    >
      <Link href="/">
        <a title="Tinlake"><Image src="/static/logo.svg" style={{ width: 130 }} /></a>
      </Link>
      <Box direction="row" gap={itemGap} margin={{ right: 'auto' }}>

        {menuItems.filter(item => !item.secondary).map((item) => {
          const anchorProps = {
            ...(selectedRoute === item.route ? { className: 'selected' } : {}),
          };
          return <Link href={item.route} key={item.label}><Button
            plain
            label={item.label}
            {...anchorProps}
          /></Link>;
        },
        )}
      </Box>
      <Box direction="row" gap={itemGap} align="center" justify="end">
        <Text>{section}</Text>
      </Box>
      {/* <Box direction="row" gap={itemGap} align="center" justify="end">

        {menuItems.filter(item => item.secondary).map((item) => {
          const anchorProps = {
            ...(selectedRoute === item.route ? { className: 'selected' } : {}),
          };
          return <Link href={item.route} key={item.label}><Anchor
            label={item.label}
            {...anchorProps}
          /></Link>;
        },
        )}
      </Box> */}
    </Box>
  </Box>;
};

Header.displayName = 'Header';

export default Header;