import * as React from 'react';
import { DataGrid, GridCellParams, GridValueGetterParams } from '@material-ui/data-grid';
import * as medals from './medals.json';
import { Tooltip, createStyles, makeStyles, Theme } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    noMaxWidth: {
      maxWidth: 'none',
    },
  }),
);

const rows = Array.from({ ...medals, length: 2100 })
  .filter(item => !!item)
  .map(item => ({
    ...item,
    id: item.ID,
    abilityText: item.Ability?.Text,
    abilityCondition: 'Condition' in item.Ability ? item.Ability.Condition : undefined,
  }));

export function MedalTable() {
  const classes = useStyles();

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <DataGrid
        pageSize={50}
        sortModel={[{ field: 'id', sort: 'desc' }]}
        rows={rows}
        autoHeight
        columns={[
          {
            field: 'MedalImage',
            flex: 0,
            renderCell: (params: GridCellParams) => (
              <Tooltip placement="right" arrow classes={{ tooltip: classes.noMaxWidth }}
                title={<img src={`/images/medals/${params.value}`} width="300" />}>
                <img src={`/images/medals/${params.value}`} width="75" />
              </Tooltip>
            ),
            sortable: false,
            filterable: false,
          },
          { field: 'id', flex: 0, type: 'number' },
          { field: 'Name', flex: 1 },
          { field: 'Rarity', flex: 0, type: 'number', hide: true },
          { field: 'Direction', flex: 0 },
          { field: 'Attribute', flex: 0 },
          { field: 'Guilt', flex: 0, type: 'number', hide: true },
          { field: 'STR', flex: 0, type: 'number' },
          { field: 'DEF', flex: 0, type: 'number', hide: true },
          { field: 'Multi', headerName: 'Multiplier', flex: 0, type: 'number', hide: true },
          { field: 'LowMulti', headerName: 'Low Multiplier', flex: 0, type: 'number', hide: true },
          { field: 'HighMulti', headerName: 'High Multiplier', flex: 0, type: 'number', hide: true },
          { field: 'abilityCondition', headerName: 'Multiplier Condition', flex: 0, hide: true },
          {
            field: 'MultiAll',
            headerName: 'Multiplier (all)',
            valueGetter: (params: GridValueGetterParams) => (params.getValue('Multi')
              || `${params.getValue('LowMulti')} - ${params.getValue('HighMulti')} (${params.getValue('abilityCondition')})`),
            renderCell: overflowCell,
            flex: 0
          },
          { field: 'Gauge', flex: 0, type: 'number' },
          { field: 'Target', flex: 0 },
          { field: 'abilityText', headerName: 'Ability Text', flex: 1, renderCell: overflowCell },
        ]} />
    </div>
  );
}

function overflowCell(params: GridCellParams) {
  return (
    <Tooltip arrow title={params.value}>
      <span>{params.value}</span>
    </Tooltip>
  );
}