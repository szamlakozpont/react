import React, { MouseEvent, useMemo } from 'react';
import { Box, Checkbox, TableCell, TableHead, TableRow, TableSortLabel, Tooltip, Typography, styled } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { DataColumnsProp } from '../../types/Table.type';
import { useTranslation } from 'react-i18next';
import { useReduxSelector } from '../../../store/Store';
import { tableVariables } from '../../../utils/variables';

type Order = 'asc' | 'desc';

type TableHeadComponentProps = {
  dataColumns: DataColumnsProp[];
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: string) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
};

export const TableHeadComponent: React.FC<TableHeadComponentProps> = ({ dataColumns, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort }) => {
  const { t } = useTranslation(['table']);

  const createSortHandler = (property: string) => (event: MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };

  const StyledTableCell = styled(TableCell)({
    paddingTop: 0,
    paddingBottom: 0,
    borderBottom: '1px solid grey',
  });

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

  const textColor = useMemo(() => (isLightMode ? tableVariables.titleTextColor : tableVariables.titleTextColorDark), [isLightMode]);

  return (
    <TableHead sx={{ color: textColor, backgroundColor: backgroundColor }}>
      <TableRow sx={{ color: textColor, backgroundColor: backgroundColor }}>
        <StyledTableCell sx={{ color: textColor, backgroundColor: backgroundColor }}>
          <Typography></Typography>
        </StyledTableCell>
        <StyledTableCell padding="checkbox" style={{ position: 'sticky', left: 0, borderRight: '1px solid grey', zIndex: '9999', color: textColor, backgroundColor: backgroundColor }}>
          <Checkbox
            sx={{ color: textColor, backgroundColor: backgroundColor }}
            // color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all rows',
            }}
          />
        </StyledTableCell>
        {dataColumns.map(
          (item) =>
            !item.hidden && (
              <Tooltip sx={{ color: textColor, backgroundColor: backgroundColor }} key={item.id} title={t('clickToSort', { ns: ['table'] })}>
                <StyledTableCell
                  sx={{ color: textColor, backgroundColor: backgroundColor }}
                  align={item.type === 'number' ? 'right' : 'left'}
                  sortDirection={orderBy === item.id ? order : false}
                  style={item.width ? { minWidth: item.width } : {}}
                >
                  <TableSortLabel
                    sx={{ color: textColor, backgroundColor: backgroundColor }}
                    active={orderBy === item.id}
                    direction={orderBy === item.id ? order : 'asc'}
                    onClick={createSortHandler(item.id)}
                  >
                    <Typography sx={{ color: textColor, backgroundColor: backgroundColor, fontSize: '15px', fontWeight: 600 }}>{item.label}</Typography>
                    {/* <span className="font-semibold">{item.label}</span> */}
                    {orderBy === item.id ? (
                      <Box component="span" sx={visuallyHidden}>
                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                      </Box>
                    ) : null}
                  </TableSortLabel>
                </StyledTableCell>
              </Tooltip>
            ),
        )}
      </TableRow>
    </TableHead>
  );
};
