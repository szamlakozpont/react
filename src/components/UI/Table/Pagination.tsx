import { FirstPage, KeyboardArrowLeft, KeyboardArrowRight, LastPage } from '@mui/icons-material';
import { Box, IconButton, TablePagination, useTheme } from '@mui/material';
import React, { ChangeEvent, Dispatch, useMemo } from 'react';
import { useReduxSelector } from '../../../store/Store';
import { tableVariables } from '../../../utils/variables';

type PaginationProps = {
  rows: any;
  rowsPerPageOptions: (
    | number
    | {
        label: string;
        value: number;
      }
  )[];
  rowsPerPage: number;
  setRowsPerPage: Dispatch<React.SetStateAction<number>>;
  page: number;
  setPage: Dispatch<React.SetStateAction<number>>;
};

type TablePaginationActionsProps = {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: React.MouseEvent<HTMLButtonElement>, newPage: number) => void;
};

const TablePaginationActions = (props: TablePaginationActionsProps) => {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  const isLightMode = useReduxSelector((state) => state.home.lightMode);
  const textColor = useMemo(() => (isLightMode ? tableVariables.titleTextColor : tableVariables.titleTextColorDark), [isLightMode]);

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5, color: textColor }}>
      <IconButton onClick={handleFirstPageButtonClick} disabled={page === 0} aria-label="first page">
        {theme.direction === 'rtl' ? <LastPage sx={{ color: textColor }} /> : <FirstPage sx={{ color: textColor }} />}
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
        {theme.direction === 'rtl' ? <KeyboardArrowRight sx={{ color: textColor }} /> : <KeyboardArrowLeft sx={{ color: textColor }} />}
      </IconButton>
      <IconButton onClick={handleNextButtonClick} disabled={page >= Math.ceil(count / rowsPerPage) - 1} aria-label="next page">
        {theme.direction === 'rtl' ? <KeyboardArrowLeft sx={{ color: textColor }} /> : <KeyboardArrowRight sx={{ color: textColor }} />}
      </IconButton>
      <IconButton onClick={handleLastPageButtonClick} disabled={page >= Math.ceil(count / rowsPerPage) - 1} aria-label="last page">
        {theme.direction === 'rtl' ? <FirstPage sx={{ color: textColor }} /> : <LastPage sx={{ color: textColor }} />}
      </IconButton>
    </Box>
  );
};

export const Pagination: React.FC<PaginationProps> = ({ rows, rowsPerPageOptions, rowsPerPage, setRowsPerPage, page, setPage }) => {
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const isLightMode = useReduxSelector((state) => state.home.lightMode);
  const textColor = useMemo(() => (isLightMode ? tableVariables.titleTextColor : tableVariables.titleTextColorDark), [isLightMode]);

  return (
    <TablePagination
      sx={{ color: textColor }}
      rowsPerPageOptions={rowsPerPageOptions}
      colSpan={3}
      component="div"
      count={rows.length}
      rowsPerPage={rowsPerPage}
      page={page}
      onPageChange={handleChangePage}
      onRowsPerPageChange={handleChangeRowsPerPage}
      ActionsComponent={TablePaginationActions}
    />
  );
};
