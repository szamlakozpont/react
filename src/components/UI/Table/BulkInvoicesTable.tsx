import React, { ChangeEvent, MouseEvent, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DataColumnsProp } from '../../types/Table.type';
import {
  Box,
  Checkbox,
  FormControlLabel,
  IconButton,
  Paper,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { visuallyHidden } from '@mui/utils';
import { Delete } from '@mui/icons-material';

type Data = {
  partner_id: string;
  e_invoice_pieces: string;
  invoice_store_pieces: string;
  NAV_e_invoice_pieces: string;
  NAV_paper_invoice_pieces: string;
};

type TableComponentProps = {
  rows: any;
  dataColumns: DataColumnsProp[];
  tableTitle: string;
  selectId: keyof Data;
};

type EnhancedTableProps = {
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
};

type EnhancedTableToolbarProps = {
  numSelected: number;
};

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(order: Order, orderBy: Key): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
  return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

export const BulkInvoicesTable: React.FC<TableComponentProps> = ({ rows, dataColumns, tableTitle, selectId }) => {
  const { t } = useTranslation(['table']);
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof Data>(selectId);
  const [selected, setSelected] = useState<readonly number[]>([]);
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const rowsPerPageOptions = [5, 10, 25];
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);

  const EnhancedTableHead = (props: EnhancedTableProps) => {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
    const createSortHandler = (property: keyof Data) => (event: MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

    return (
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
            <Checkbox
              color="primary"
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
              inputProps={{
                'aria-label': 'select all rows',
              }}
            />
          </TableCell>
          {dataColumns.map((item) => (
            <Tooltip key={item.id} title={t('clickToSort', { ns: ['table'] })}>
              <TableCell align={item.type === 'number' ? 'right' : 'left'} sortDirection={orderBy === item.id ? order : false}>
                <TableSortLabel active={orderBy === item.id} direction={orderBy === item.id ? order : 'asc'} onClick={createSortHandler(item.id as keyof Data)}>
                  <span className="font-semibold text-nowrap">{item.label}</span>
                  {orderBy === item.id ? (
                    <Box component="span" sx={visuallyHidden}>
                      {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                    </Box>
                  ) : null}
                </TableSortLabel>
              </TableCell>
            </Tooltip>
          ))}
        </TableRow>
      </TableHead>
    );
  };

  const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
    const { numSelected } = props;

    return (
      <Toolbar
        sx={{
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          ...(numSelected > 0 && {
            bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
          }),
        }}
      >
        {numSelected > 0 ? (
          <Typography sx={{ flex: '1 1 100%' }} color="inherit" variant="subtitle1" component="div">
            {numSelected} {t('selected', { ns: ['table'] })}
          </Typography>
        ) : (
          <Typography sx={{ flex: '1 1 100%' }} id="tableTitle" component="div">
            {tableTitle}
          </Typography>
        )}

        {numSelected > 0 && (
          <Tooltip title={t('delete', { ns: ['table'] })}>
            <IconButton color="error" onClick={() => {}}>
              <Delete />
            </IconButton>
          </Tooltip>
        )}
      </Toolbar>
    );
  };

  const handleRequestSort = (event: MouseEvent<unknown>, property: keyof Data) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = rows.map((n: Data) => parseInt(n[selectId]));
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: MouseEvent<unknown>, id: number) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: readonly number[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event: ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked);
  };

  const isSelected = (id: number) => {
    return selected.indexOf(id) !== -1;
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;
  const visibleRows = useMemo(() => stableSort(rows, getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage), [order, orderBy, page, rows, rowsPerPage]);

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar numSelected={selected.length} />
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={dense ? 'small' : 'medium'}>
            <EnhancedTableHead numSelected={selected.length} order={order} orderBy={orderBy} onSelectAllClick={handleSelectAllClick} onRequestSort={handleRequestSort} rowCount={rows.length} />
            <TableBody>
              {visibleRows.map((row, index) => {
                const isItemSelected = isSelected(parseInt(row[selectId] as string));
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, parseInt(row[selectId] as string))}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row[selectId]}
                    selected={isItemSelected}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                          'aria-labelledby': labelId,
                        }}
                      />
                    </TableCell>

                    <TableCell component="th" id={labelId} scope="row" padding="none" align="right">
                      {row[selectId]}
                    </TableCell>
                    {dataColumns.map(
                      (item, index) =>
                        index > 0 && (
                          <TableCell key={index} align="right">
                            {row[item.id as keyof typeof row]}
                          </TableCell>
                        ),
                    )}
                  </TableRow>
                );
              })}

              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={rowsPerPageOptions}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};
