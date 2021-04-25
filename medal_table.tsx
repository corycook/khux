import * as React from 'react';
import { DataGrid, ColDef, ValueGetterParams, GridCellParams } from '@material-ui/data-grid';
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
  }));

export function MedalTable() {
  const classes = useStyles();

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <DataGrid rows={rows} autoHeight columns={[
        {
          field: 'MedalImage',
          headerName: 'MedalImage',
          flex: 0,
          renderCell: (params: GridCellParams) => (
            <Tooltip placement="right" arrow classes={{ tooltip: classes.noMaxWidth }}
              title={<img src={`/images/medals/en/${params.value}`} width="300" />}>
              <img src={`/images/medals/en/${params.value}`} width="75" />
            </Tooltip>
          ),
          sortable: false,
          filterable: false,
        },
        { field: 'ID', headerName: 'ID', flex: 0, type: 'number' },
        { field: 'Name', headerName: 'Name', flex: 1 },
        { field: 'Rarity', headerName: 'Rarity', flex: 0, type: 'number' },
        { field: 'Direction', headerName: 'Direction', flex: 1, },
        { field: 'STR', headerName: 'STR', flex: 0, type: 'number' },
        { field: 'DEF', headerName: 'DEF', flex: 0, type: 'number', },
      ]} pageSize={50} />
    </div>
  );
}