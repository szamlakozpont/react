import React, { useEffect, useMemo, useState } from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, styled } from '@mui/material';
import { getComparator, keyConvert, stableSort } from '../../../utils/common';
import { useTranslation } from 'react-i18next';
import { Pagination } from '../Table/Pagination';
import { DataColumnsProp, Order } from '../../types/Table.type';
import { Check, Remove } from '@mui/icons-material';

type TableListJsonProps = {
  rows: any;
  selectId: string;
  columns?: DataColumnsProp[];
  translation: string;
};

export const TableListJson: React.FC<TableListJsonProps> = ({ rows, selectId, columns, translation }) => {
  const { t } = useTranslation(['table']);
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState(selectId);
  const [page, setPage] = useState(0);
  const [rows_, setRows_] = useState<any>([{}]);
  const rowsPerPageOptions = [5, 10, 25, { label: 'All', value: -1 }];
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const emptyRows = page > 0 && rows_ ? Math.max(0, (1 + page) * rowsPerPage - rows_.length) : 0;
  const visibleRows = useMemo(
    () => (rows_.length > 0 ? stableSort(rows_, getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : undefined),
    [order, orderBy, page, rowsPerPage, rows_],
  );

  useEffect(() => {
    if (rows) {
      let newRows = [] as any;
      Object.keys(rows).map((item: any) => {
        newRows = [...newRows, rows[item]];
      });
      setRows_(newRows);
    }
  }, [rows]);

  return visibleRows ? (
    <Paper sx={{ width: '100%', overflow: 'hidden', mb: 2 }}>
      <TableContainer sx={{ maxWidth: '100%', maxHeight: '60vh' }}>
        <Table stickyHeader aria-labelledby="tableTitle" size={'medium'}>
          <TableHead>
            {columns
              ? columns.map((item, index) => {
                  if (!item.hidden) {
                    return (
                      <TableCell key={index} align={item.type === 'number' ? 'right' : 'center'}>
                        <span className="font-semibold">{item.label}</span>
                      </TableCell>
                    );
                  }
                })
              : Object.keys(rows_[0]).map((key) => (
                  <TableCell key={key} align="right">
                    <span className="font-semibold">{t(keyConvert(key), { ns: [translation] })}</span>
                  </TableCell>
                ))}
          </TableHead>
          <TableBody>
            {visibleRows.map((row: any, index: number) => (
              <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                {columns
                  ? columns.map((item, index) => {
                      if (!item.hidden) {
                        const value = row[item.id as keyof typeof row];
                        return (
                          <TableCell key={index} align={item.type === 'number' ? 'right' : 'center'}>
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
                    })
                  : Object.keys(row).map((key) => (
                      <TableCell key={key} align="right">
                        <span className="text-nowrap">{row[key]}</span>
                      </TableCell>
                    ))}
              </TableRow>
            ))}
            {emptyRows > 0 && (
              <TableRow
                style={{
                  height: 58 * emptyRows,
                }}
              >
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Pagination rows={rows_} rowsPerPageOptions={rowsPerPageOptions} rowsPerPage={rowsPerPage} setRowsPerPage={setRowsPerPage} page={page} setPage={setPage} />
    </Paper>
  ) : (
    <div className="flex justify-start m-8">
      <Typography>{`${t('noData', { ns: ['table'] })} 😳`}</Typography>
    </div>
  );
};
