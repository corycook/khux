import * as React from 'react';
import { DataGrid, GridCellParams, GridValueGetterParams } from '@material-ui/data-grid';
import * as medals from './medals.json';
import { Tooltip, createStyles, makeStyles, Theme } from '@material-ui/core';
import { computeDamagePotential } from './computations';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    noMaxWidth: {
      maxWidth: 'none',
    },
  }),
);

const rows = Array.from({ ...medals, length: 2100 })
  .filter(medal => !!medal)
  .map(medal => ({
    ...medal,
    id: medal.AlbumNum,
    abilityText: medal.Ability?.Text,
    abilityCondition: 'Condition' in medal.Ability ? medal.Ability.Condition : undefined,
    damagePotential: computeDamagePotential(medal),
  }));

export function MedalTable() {
  const classes = useStyles();

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      <div style={{ flexGrow: 1 }}>
        <DataGrid
          pageSize={50}
          sortModel={[{ field: 'damagePotential', sort: 'desc' }]}
          density="comfortable"
          disableColumnFilter={false}
          rows={rows}
          columns={[
            {
              field: 'MedalImage',
              flex: 0,
              renderCell: (params: GridCellParams) => (
                <Tooltip placement="right" arrow classes={{ tooltip: classes.noMaxWidth }}
                  title={<img src={`images/medals/${params.value}`} width="300" />}>
                  <img src={`images/medals/${params.value}`} height="50" />
                </Tooltip>
              ),
              renderHeader: () => <i></i>,
              sortable: false,
              filterable: false,
            },
            { field: 'ID', headerName: 'Release Number', flex: 0, type: 'number', hide: true },
            { field: 'AlbumNum', headerName: 'Album Number', flex: 0, type: 'number' },
            { field: 'Name', flex: 1 },
            { field: 'Rarity', flex: 0, type: 'number', hide: true },
            {
              field: 'Direction',
              flex: 0,
              renderCell: (params: GridCellParams) => params.value && (
                <Tooltip arrow placement="bottom" title={`Direction: ${params.value}`}>
                  <div style={{
                    alignItems: 'center',
                    backgroundSize: '100px',
                    backgroundImage: params.value == 'Upright'
                      ? 'url("images/icons/genUp.png")'
                      : 'url("images/icons/genRev.png")',
                    backgroundPosition: 'center',
                    display: 'flex',
                    height: '50px',
                    width: '50px',
                  }}></div>
                </Tooltip>
              ),
            },
            {
              field: 'Attribute',
              flex: 0,
              renderCell: (params) => (params.value && params.value !== 'None') ? (
                <Tooltip arrow title={`Attribute: ${params.value}`}>
                  <img src={`images/icons/Element${params.value}.png`}
                    height="50" alt={params.value.toString()} />
                </Tooltip>
              ) : null,
            },
            {
              field: 'Guilt',
              flex: 0,
              hide: true,
              renderCell: (params) => params.value && (
                <Tooltip arrow title={`Guilt: ${params.value}`}>
                  <img src={`images/icons/Guilt${params.value}.png`} height="50" />
                </Tooltip>
              ),
              type: 'number',
            },
            { field: 'STR', flex: 0, type: 'number', hide: true },
            { field: 'damagePotential', headerName: 'Damage Potential Score', flex: 1, type: 'number' },
            { field: 'DEF', flex: 0, type: 'number', hide: true },
            { field: 'Multi', headerName: 'Multiplier', flex: 0, type: 'number', hide: true },
            { field: 'LowMulti', headerName: 'Low Multiplier', flex: 0, type: 'number', hide: true },
            { field: 'HighMulti', headerName: 'High Multiplier', flex: 0, type: 'number', hide: true },
            { field: 'abilityCondition', headerName: 'Multiplier Condition', flex: 0, hide: true },
            {
              field: 'MultiAll',
              flex: 0,
              headerName: 'Multiplier (all)',
              renderCell: overflowCell,
              valueGetter: (params: GridValueGetterParams) => (params.getValue('Multi')
                || `${params.getValue('LowMulti')} - ${params.getValue('HighMulti')} (${params.getValue('abilityCondition')})`),
              hide: true,
            },
            { field: 'Gauge', flex: 0, type: 'number', hide: true },
            {
              field: 'Target',
              flex: 0,
              renderCell: (params) => params.value && (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <img src={`images/icons/Target_${params.value}.png`} height="25" />&nbsp;{params.value}
                </div>
              ),
            },
            { field: 'abilityText', headerName: 'Ability Text', flex: 1, renderCell: overflowCell },
          ]} />
      </div>
    </div>
  );
}

function overflowCell(params: GridCellParams) {
  return (
    <Tooltip
      arrow
      style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
      title={params.value}>
      <span>{params.value}</span>
    </Tooltip>
  );
}