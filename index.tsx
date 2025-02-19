import * as React from 'react';
import ReactDOM from 'react-dom';
import { MedalTable } from './medal_table';
import * as medals from "./medals.json";
import { Container, Typography } from '@material-ui/core';

globalThis.medals = Array.from({ ...medals, length: 2100 });

function Main() {
  return (
    <Container>
      <Typography variant="h4">
        KHUx Medal List
      </Typography>
      <Typography variant="body1" gutterBottom>
        Use this table to compare medals independent of any skills or traits.
      </Typography>
      <Typography variant="body1" gutterBottom>
        The damage potential score is an approximation of the overall damage
        contribution that a medal could provide to a build.
      </Typography>
      <Typography gutterBottom>
        [Damage Potential] = ([Strength] + [Strength Boost] + [Supernova (SN) Strength Boost]) x [Special Attack] x [SN] x ([Guilt] + [Guilt Buff]) x [Ignore Attribute Boost]
      </Typography>
      <MedalTable />
      <Typography variant="body1" gutterBottom>
        Original data was compiled by <a href="//github.com/roboloid">@Roboloid</a> <ContentLink>https://github.com/roboloid/khux</ContentLink>
      </Typography>
    </Container>
  );
}

function ContentLink({ children }: { children: string }) {
  return <a href={children}>{children}</a>;
}

ReactDOM.render(<Main />, document.querySelector('main'));
