import React, { ChangeEvent, MouseEvent, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DataColumnsProp, Order } from '../../types/Table.type';
import { Checkbox, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Pagination } from './Pagination';
import { KeyedMutator } from 'swr';
import { TableToolbar } from './TableToolbar';
import { TableHeadComponent } from './TableHead';
import { Check, Remove } from '@mui/icons-material';
import { Spinner } from '../Spinner';
import { getComparator, stableSort } from '../../../utils/common';
import { RowMenuCustom } from './RowMenuCustom';
import { tableVariables } from '../../../utils/variables';
import { useReduxSelector } from '../../../store/Store';

type Data = {
  [key: string]: any;
};

type TableMainProps = {
  rows: any;
  isLoadingData: boolean;
  isFetchingData: boolean;
  dataColumns: DataColumnsProp[];
  selectId: string;
  handleOpenEditModal?: (row: any) => void;
  handleOpenDeleteModal?: (rowId: string) => void;
  mutate?: KeyedMutator<any>;
  apiValue?: string;
  tableTitle?: string;
  translation: string;
};

const editableTables: string[] = [];
const deletableTables: string[] = ['invoices'];

export const TableMain: React.FC<TableMainProps> = ({
  rows,
  isLoadingData,
  isFetchingData,
  dataColumns,
  selectId,
  handleOpenEditModal,
  handleOpenDeleteModal,
  mutate,
  apiValue = '',
  tableTitle,
  translation,
}) => {
  const { t } = useTranslation(['table']);
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState(selectId);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const rowsPerPageOptions = [5, 10, 25, { label: 'All', value: -1 }];
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const {
    mixins: { toolbar },
  } = useTheme();

  const appHeight = parseInt(toolbar?.minHeight as string) + 8;

  const columns = useMemo<any[]>(() => {
    const headers = [] as any;
    dataColumns.forEach((item) => {
      if (!item.hidden) {
        headers.push({
          header: item.label,
        });
      }
    });
    return headers;
  }, [dataColumns]);

  const handleRequestSort = (event: MouseEvent<unknown>, property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = rows.map((n: Data) => parseInt(n[selectId]));
      setSelectedRows(newSelected);
      return;
    }
    setSelectedRows([]);
  };

  const handleClick = (event: MouseEvent<unknown>, id: number) => {
    const selectedIndex = selectedRows.indexOf(id);
    let newSelected: number[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedRows, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedRows.slice(1));
    } else if (selectedIndex === selectedRows.length - 1) {
      newSelected = newSelected.concat(selectedRows.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selectedRows.slice(0, selectedIndex), selectedRows.slice(selectedIndex + 1));
    }
    setSelectedRows(newSelected);
  };

  const handleChangeDense = (event: ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked);
  };

  const isSelected = (id: number) => {
    return selectedRows.indexOf(id) !== -1;
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;
  const visibleRows = useMemo(() => stableSort(rows, getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage), [order, orderBy, page, rows, rowsPerPage]);

  const isBackground = useReduxSelector((state) => state.home.pagesWithBackground);
  const isLightMode = useReduxSelector((state) => state.home.lightMode);

  const backgroundColor = useMemo(
    () =>
      isBackground
        ? isLightMode
          ? tableVariables.backgroundColorBackGroundLight
          : tableVariables.backgroundColorBackGroundDark
        : isLightMode
          ? tableVariables.backgroundColorLight
          : tableVariables.backgroundColorDark,
    [isBackground, isLightMode],
  );

  // const titleTextColor = useMemo(() => (isBackground ? tableVariables.titleTextColorBackground : tableVariables.titleTextColor), [isBackground]);
  const textColor = useMemo(() => (isLightMode ? tableVariables.titleTextColor : tableVariables.titleTextColorDark), [isLightMode]);

  return (
    <>
      <div className={`flex justify-items-center h-[calc(100%-${appHeight}px)]`}>
        <div className={`w-[100%] absolute left-[50%] top-[calc(${appHeight}px)] -translate-x-1/2`}>
          {!isLoadingData && !isFetchingData && rows && rows.length > 0 ? (
            <>
              <Paper sx={{ width: '100%', overflow: 'hidden', mb: 2, color: textColor, backgroundColor: backgroundColor }}>
                {mutate && apiValue && (
                  <TableToolbar
                    rows={rows}
                    visibleRows={visibleRows}
                    dataColumns={dataColumns}
                    columns={columns}
                    numSelected={selectedRows.length}
                    selectedRows={selectedRows}
                    setSelectedRows={setSelectedRows}
                    mutate={mutate}
                    apiValue={apiValue}
                    tableTitle={tableTitle}
                    translation={translation}
                    canDelete={deletableTables.includes(apiValue)}
                  />
                )}

                <TableContainer sx={{ maxWidth: '100%', maxHeight: '60vh', border: '1px solid grey', color: textColor, backgroundColor: backgroundColor }}>
                  <Table stickyHeader aria-labelledby="tableTitle" size={dense ? 'small' : 'medium'}>
                    <TableHeadComponent
                      dataColumns={dataColumns}
                      numSelected={selectedRows.length}
                      order={order}
                      orderBy={orderBy}
                      onSelectAllClick={handleSelectAllClick}
                      onRequestSort={handleRequestSort}
                      rowCount={rows.length}
                    />

                    <TableBody>
                      {visibleRows.map((row, index) => {
                        const isItemSelected = isSelected(parseInt(row[selectId] as string));
                        const labelId = `enhanced-table-checkbox-${index}`;

                        return (
                          <TableRow hover role="checkbox" aria-checked={isItemSelected} tabIndex={-1} key={row[selectId]} selected={isItemSelected}>
                            <TableCell padding="none" style={{ color: textColor, backgroundColor: backgroundColor }}>
                              {handleOpenDeleteModal && handleOpenEditModal && (
                                <RowMenuCustom
                                  row={row}
                                  handleOpenEditModal={handleOpenEditModal}
                                  handleOpenDeleteModal={handleOpenDeleteModal}
                                  canDelete={deletableTables.includes(apiValue)}
                                  canEdit={editableTables.includes(apiValue)}
                                />
                              )}
                            </TableCell>

                            <TableCell padding="checkbox" style={{ zIndex: '9', position: 'sticky', left: 0, color: textColor, background: backgroundColor, borderRight: '1px solid grey' }}>
                              <Checkbox
                                sx={{ color: textColor, backgroundColor: backgroundColor }}
                                // color="primary"
                                checked={isItemSelected}
                                inputProps={{
                                  'aria-labelledby': labelId,
                                }}
                                onClick={(event) => handleClick(event, parseInt(row[selectId] as string))}
                              />
                            </TableCell>

                            <TableCell sx={{ color: textColor }} component="th" id={labelId} scope="row" padding="none" align="right">
                              {row[selectId]}
                            </TableCell>
                            {dataColumns.map((item, index) => {
                              if (index > 0 && !item.hidden) {
                                const value = row[item.id as keyof typeof row];
                                return (
                                  <TableCell sx={{ color: textColor }} key={index} align={item.type === 'number' ? 'right' : 'left'}>
                                    {item.component ? (
                                      item.component(row)
                                    ) : item.type === 'boolean' ? (
                                      value ? (
                                        <Check color="success" />
                                      ) : (
                                        <Remove color="error" />
                                      )
                                    ) : (
                                      <span className="text-nowrap">{value}</span>
                                    )}
                                  </TableCell>
                                );
                              }
                            })}
                          </TableRow>
                        );
                      })}

                      {emptyRows > 0 && (
                        <TableRow
                          style={{
                            height: (dense ? 50 : 58) * emptyRows,
                          }}
                        >
                          <TableCell colSpan={6} />
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Pagination rows={rows} rowsPerPageOptions={rowsPerPageOptions} rowsPerPage={rowsPerPage} setRowsPerPage={setRowsPerPage} page={page} setPage={setPage} />
              </Paper>
            </>
          ) : !isLoadingData && !isFetchingData ? (
            <div className="flex justify-center m-8">
              <Typography sx={{ color: textColor, fontSize: tableVariables.noDataFontSize }}>{`${t('noData', { ns: ['table'] })} 😳`}</Typography>
            </div>
          ) : (
            <Spinner text={'Loading ...'} color="primary" />
          )}
        </div>
      </div>
    </>
  );
};
