import React, { MouseEvent, useMemo, useState } from 'react';
import { Box, IconButton, ListItemIcon, Menu, MenuItem, Tooltip, Typography } from '@mui/material';
import { Delete, Edit, MoreHoriz } from '@mui/icons-material';
import { tableVariables } from '../../../utils/variables';
import { useTranslation } from 'react-i18next';
import useTextToSpeech from '../../../logics/useTextToSpeech';

type RowMenuCustomProps = {
  row: any;
  handleOpenEditModal: (row: any) => void;
  handleOpenDeleteModal: (rowId: string) => void;
  canEdit: boolean;
  canDelete: boolean;
};

export const RowMenuCustom: React.FC<RowMenuCustomProps> = ({ row, handleOpenEditModal, handleOpenDeleteModal, canDelete, canEdit }) => {
  const { t } = useTranslation(['table']);
  const [openExport, setOpenExport] = useState<null | HTMLElement>(null);

  const { handlePlay, handleStop } = useTextToSpeech();

  const speedDialActions = useMemo(
    () => [
      {
        icon: (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span className={`bg-transparent px-[5px] pb-[5px] ${tableVariables.buttonsColorText} ${tableVariables.buttonsColorGroupHover} group-hover:text-white rounded-full`}>
              <Edit />
            </span>
          </Box>
        ),
        name: <span className={`text-center bg-transparent ${tableVariables.groupHoverColorText}`}>{t('edit', { ns: ['table'] })}</span>,
        name_: t('edit', { ns: ['table'] }),
        funcProp: () => handleOpenEditModal(row),
        valid: () => canEdit && row.length !== 0,
        menuItemNumber: 1,
      },
      {
        icon: (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span className={`bg-transparent px-[5px] pb-[5px] ${tableVariables.buttonsColorTextError} ${tableVariables.buttonsColorGroupHoverError} group-hover:text-white rounded-full`}>
              <Delete />
            </span>
          </Box>
        ),
        name: <span className={`text-center bg-transparent ${tableVariables.groupHoverColorTextError}`}>{t('delete', { ns: ['table'] })}</span>,
        name_: t('delete', { ns: ['table'] }),
        funcProp: () => handleOpenDeleteModal(row.id),
        valid: () => canDelete && row.length !== 0,
        menuItemNumber: 1,
      },
    ],
    [canDelete, canEdit, handleOpenDeleteModal, handleOpenEditModal, row, t],
  );

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setOpenExport(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenExport(null);
  };

  const handleClickSpeedDialIcon = (e: MouseEvent<HTMLLIElement, globalThis.MouseEvent>, funcProp: () => void) => {
    e.preventDefault();
    funcProp();
    handleCloseMenu();
  };

  return (
    <div className="flex">
      <div>
        <Tooltip arrow title={t('menu', { ns: ['table'] })}>
          <IconButton
            size="large"
            aria-controls="menu"
            aria-haspopup="true"
            onClick={handleOpenMenu}
            color="inherit"
            onMouseEnter={() => handlePlay(t('menu', { ns: ['table'] }))}
            onMouseLeave={() => handleStop()}
          >
            <span className={`bg-transparent px-[5px] pb-[5px] ${tableVariables.buttonsColorHover} hover:text-white rounded-full `}>
              <MoreHoriz sx={{ fontSize: 25 }} />
            </span>
          </IconButton>
        </Tooltip>

        <Menu
          id="menu"
          anchorEl={openExport}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          open={Boolean(openExport)}
          onClose={handleCloseMenu}
        >
          {speedDialActions.map(
            (item, index) =>
              item.valid() && (
                <MenuItem className="group" key={index} onClick={(e) => handleClickSpeedDialIcon(e, item.funcProp)} onMouseEnter={() => handlePlay(item.name_)} onMouseLeave={() => handleStop()}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  {item.name}
                </MenuItem>
              ),
          )}
        </Menu>
      </div>
    </div>
  );
};
