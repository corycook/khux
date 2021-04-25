import * as React from 'react';
import ReactDOM from 'react-dom';
import { MedalTable } from './medal_table';
import * as medals from "./medals.json";

globalThis.medals = Array.from({ ...medals, length: 2100 });

ReactDOM.render(<MedalTable />, document.querySelector('main'));
