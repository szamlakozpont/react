import React, { Fragment } from 'react';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { Button, DialogActions, TextField, Zoom } from '@mui/material';
import { useReduxDispatch, useReduxSelector } from '../../store/Store';
import { tableActions } from '../../store/appSlices/TableSlice';
import { useTranslation } from 'react-i18next';
import useSWR from 'swr';
import { useAxios } from '../../logics/useAxios';
import { API_DATA } from '../../utils/variables';
import { keyConvert } from '../../utils/common';

type ItemModalProps = {
  apiLink: string;
  title: string;
  translation: string;
};

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" mountOnEnter unmountOnExit ref={ref} {...props} onExited={() => {}} />;
});

export const ItemModal: React.FC<ItemModalProps> = ({ apiLink, title, translation }) => {
  const { t } = useTranslation(['table']);
  const dispatch = useReduxDispatch();
  const isItemModalOpen = useReduxSelector((state) => state.table.isItemModalOpen);
  const rowId = useReduxSelector((state) => state.table.rowId);

  const { apiService } = useAxios();

  const {
    data: fetchedData,
    error: isLoadingDataError,
    isLoading: isLoadingData,
    isValidating: isFetchingData,
  } = useSWR(isItemModalOpen && rowId ? [API_DATA + apiLink + `/${parseInt(rowId)}`, 'GET', ''] : null, ([url, method, body]) => apiService({ url: url, method: method, data: body }));

  const handleClose = () => {
    dispatch(tableActions.setIsItemModalOpen(false));
    dispatch(tableActions.setRowId(''));
  };

  const handleCloseModal: DialogProps['onClose'] = (event, reason) => {
    if (reason && reason === 'backdropClick') return;
    dispatch(tableActions.setIsItemModalOpen(false));
    dispatch(tableActions.setRowId(''));
  };

  return (
    <Fragment>
      <Dialog open={isItemModalOpen && !isLoadingData && fetchedData} onClose={handleCloseModal} TransitionComponent={Transition} keepMounted scroll="paper" className="w-full">
        <DialogTitle className="flex items-center justify-center text-2xl py-5">{title}</DialogTitle>
        <DialogContent dividers={true}>
          <Zoom in={true} style={{ transitionDelay: isItemModalOpen ? '100ms' : '0ms' }} timeout={700}>
            <div className="bg-transparent mb-7 pb-1 px-4 border border-sky-600">
              {fetchedData ? (
                Object.entries(fetchedData).map(([key, value]) => {
                  const label = keyConvert(key);
                  return (
                    <Fragment key={key}>
                      <TextField margin="dense" size="small" defaultValue={value} inputProps={{ readOnly: true }} label={t(label, { ns: [translation] })} fullWidth variant="standard" />
                    </Fragment>
                  );
                })
              ) : (
                <span>{`${t('noData', { ns: ['table'] })} 😳`}</span>
              )}
            </div>
          </Zoom>
        </DialogContent>
        <DialogActions>
          <div className="flex gap-9 mr-7 mb-7">
            <Button onClick={handleClose}>
              <span className="bg-transparent text-red-500 px-4 border border-red-500 hover:bg-red-500 hover:text-white hover:border-transparent py-0 hover:scale-125 rounded-full">
                {t('close', { ns: ['table'] })}
              </span>
            </Button>
          </div>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};
