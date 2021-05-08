import * as React from 'react';
import { DataGrid, GridCellParams, GridColumns, GridRowId, GridSortModel } from '@material-ui/data-grid';
import * as medalData from './medals.json';
import { Tooltip, makeStyles, TextField, Switch, FormGroup, FormControlLabel } from '@material-ui/core';
import { computeDamagePotential } from './computations';
import { debounceOnChange } from './debounce';
import { useStickyState } from './useStickyState';

const DebouncedTextField = debounceOnChange(TextField);

function HighlightSearchTerms({ children, searchTerms, id }: {
  children: string,
  searchTerms: string[],
  id: GridRowId,
}) {
  return (
    <div>
      {children.split(new RegExp(`(${searchTerms.map(escapeRegExp).join('|')})`, 'gi')).map((v, i) => (
        <React.Fragment key={id.toString() + i}>{i % 2 == 0 ? v : <mark>{v}</mark>}</React.Fragment>
      ))}
    </div>
  );
}

function OverflowCell({ children, fullText }: {
  fullText?: string,
  children: React.ReactElement | string
}) {
  return (
    <Tooltip
      arrow
      style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
      title={fullText || children}>
      <span>{children}</span>
    </Tooltip>
  );
}

function escapeRegExp(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

function roundValue(value: number, precision = 2) {
  return Math.round(value * Math.pow(10, precision)) / Math.pow(10, precision);
}

function getAbilityCondition(medal) {
  return 'Condition' in medal.Ability ? medal.Ability.Condition : undefined;
}

const medals = Array.from({ ...medalData, length: 2100 })
  .filter(medal => !!medal)
  .map(medal => ({
    ...medal,
    id: medal.AlbumNum,
    abilityText: medal.Ability.Text,
    abilityCondition: getAbilityCondition(medal),
    damagePotential: roundValue(computeDamagePotential(medal, { includeSupernova: true })),
    multiAll: 'Multi' in medal ? medal.Multi : (
      'LowMulti' in medal
        ? `${medal.LowMulti} - ${medal.HighMulti} (${getAbilityCondition(medal)})`
        : ''
    ),
    supernovaText: 'Supernova' in medal ? medal.Supernova.Text : '',
  }))
  .sort(comparing(medal => medal.damagePotential))
  .reverse()
  .map((medal, i) => ({
    ...medal,
    rank: i + 1,
  }));

function comparing<T>(getter: (value: T) => string | number): (a: T, b: T) => number {
  return (a, b) => {
    const valueA = getter(a);
    const valueB = getter(b);
    if (valueA == valueB) {
      return 0;
    }
    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return valueA.localeCompare(valueB);
    }
    return valueA < valueB ? -1 : 1;
  }
}

const columns: GridColumns = [
  {
    field: 'MedalImage',
    flex: 0,
    renderCell: (params: GridCellParams) => (
      <Tooltip placement="right" arrow
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
  { field: 'rank', headerName: 'Rank', flex: 0, type: 'number' },
  { field: 'damagePotential', headerName: 'Damage Potential Score', flex: 1, type: 'number' },
  { field: 'DEF', flex: 0, type: 'number', hide: true },
  { field: 'Multi', headerName: 'Multiplier', flex: 0, type: 'number', hide: true },
  { field: 'LowMulti', headerName: 'Low Multiplier', flex: 0, type: 'number', hide: true },
  { field: 'HighMulti', headerName: 'High Multiplier', flex: 0, type: 'number', hide: true },
  { field: 'abilityCondition', headerName: 'Multiplier Condition', flex: 0, hide: true },
  {
    field: 'multiAll',
    flex: 0,
    headerName: 'Multiplier (all)',
    renderCell: params => <OverflowCell>{params.value.toString()}</OverflowCell>,
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
  {
    field: 'abilityText',
    headerName: 'Ability Text',
    flex: 1,
    renderCell: params => (
      <OverflowCell fullText={params.value.toString()}>
        {params.value.toString()}
      </OverflowCell>
    ),
  },
  {
    field: 'supernovaText',
    headerName: 'Supernova Text',
    flex: 1,
    renderCell: params => (
      <OverflowCell fullText={params.value.toString()}>
        {params.value.toString()}
      </OverflowCell>
    ),
  },
];

const useStyles = makeStyles(() => ({
  menuBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  }
}))

export function MedalTable() {
  const classes = useStyles();
  const [searchTerms, setSearchTerms] = React.useState([]);
  const [sortModel, setSortModel] = React.useState<GridSortModel>([{ field: 'damagePotential', sort: 'desc' }])
  const [selectedIds, setSelectedIds] = useStickyState([], 'selectedIds');
  const [hideUnselected, setHideUnselected] = React.useState(false);

  const rows = medals
    .filter(medal => {
      return searchTerms.every(searchTerm => {
        return columns.some(column => {
          const value: string = medal[column.field]?.toString() || '';
          return value.toLowerCase().includes(searchTerm.toLowerCase());
        });
      });
    })
    .filter(medal => !hideUnselected || selectedIds.includes(medal.AlbumNum));

  const handleSearchChange = (searchString: string) => {
    setSearchTerms(searchString.split(' ').filter(s => !!s && s !== ''));
  };

  const handleSelectionChange = (newSelection) => {
    setSelectedIds(previousIds => [
      // do not remove rows that are filtered out
      ...previousIds.filter(id => rows.every(row => row.AlbumNum != id)),
      ...newSelection.selectionModel
    ]);
  };

  return (
    <>
      <div className={classes.menuBar}>
        <DebouncedTextField
          label="Search"
          helperText="Search text from any field (e.g. 'xion upright power')"
          onChange={e => handleSearchChange(e.target.value)}
          debounceTimeout={200}
          variant="outlined" />
        <FormGroup row>
          <FormControlLabel
            control={
              <Switch title="Hide unselected"
                checked={hideUnselected}
                onChange={(e, value) => setHideUnselected(value)} />}
            label="Hide unselected"
          />
        </FormGroup>
      </div>

      <div style={{ display: 'flex', height: '100%' }}>
        <div style={{ flexGrow: 1 }}>
          <DataGrid
            pageSize={50}
            sortModel={sortModel}
            onSortModelChange={params => setSortModel(params.sortModel)}
            checkboxSelection
            onSelectionModelChange={handleSelectionChange}
            selectionModel={selectedIds}
            density="comfortable"
            disableColumnFilter={false}
            rows={rows}
            columns={columns.map(column => ({
              ...column,
              renderCell: column.renderCell ? column.renderCell : ((params: GridCellParams) => (
                <HighlightSearchTerms
                  id={params.id}
                  searchTerms={searchTerms}>
                  {params.value.toString()}
                </HighlightSearchTerms>
              )),
            }))} />
        </div>
      </div>
    </>
  );
}
