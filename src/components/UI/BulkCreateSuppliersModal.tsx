import React, { ChangeEvent, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { Button, DialogActions, IconButton, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useReduxDispatch, useReduxSelector } from '../../store/Store';
import { tableActions } from '../../store/appSlices/TableSlice';
import { useTranslation } from 'react-i18next';
import { useAPI } from '../../logics/useAPI';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { KeyedMutator } from 'swr';
import { tableVariables } from '../../utils/variables';
import { SelectAutoWidth } from './Select';
import { Spinner } from './Spinner';

type BulkCreateSuppliersModalProps = {
  mutate: KeyedMutator<any>;
  apiLink: string;
};

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" mountOnEnter unmountOnExit ref={ref} {...props} onExited={() => {}} />;
});

export const BulkCreateSuppliersModal: React.FC<BulkCreateSuppliersModalProps> = ({ mutate, apiLink }) => {
  const { t } = useTranslation(['supplier']);
  const [numberValue, setNumberValue] = React.useState('5');
  const dispatch = useReduxDispatch(); 
  const isBulkCreateSuppliersModalOpen = useReduxSelector((state) => state.table.isBulkCreateSuppliersModalOpen);
  const [supplierNameInitialIncrese, setSupplierNameInitialIncrese] = useState(1);
  const { createBulkData } = useAPI(); 
  const [generating, setGenerating] = useState(false);

  const handleClose = () => {
    dispatch(tableActions.setIsBulkCreateSuppliersModalOpen(false));
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      await createBulkData(numberValue, `${apiLink}`, supplierNameInitialIncrese); 
      mutate(); 
      dispatch(tableActions.setIsBulkCreateSuppliersModalOpen(false));
      setGenerating(false);
    } catch (error) {
      const err = error as AxiosError;
      toast.error(`${err.response?.statusText}`);
      setGenerating(false);
    }
  };

  const onChangeField = (e: ChangeEvent<HTMLInputElement>) => {
    setSupplierNameInitialIncrese(parseInt(e.target.value));
  };

  return (
    <React.Fragment>
      <Dialog open={isBulkCreateSuppliersModalOpen} TransitionComponent={Transition} keepMounted onClose={handleClose} aria-describedby="alert-dialog-slide-description" className="w-full">
        <div className="flex w-[400px]">
          <DialogTitle className="text-blue-600" variant="h5">
            {t('bulkCreateSuppliersModal', { ns: ['supplier'] })}
          </DialogTitle>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'blue',
            }}
          >
            <CloseIcon />
          </IconButton>
        </div>

        {!generating ? (
          <DialogContent>
            <div className="flex flex-column justify-center items-center w-full">
              <SelectAutoWidth
                selectLabel={t('number', { ns: ['supplier'] })}
                selectValue={numberValue}
                onSelect={setNumberValue}
                selectOptions={[
                  { id: '5', label: '5' },
                  { id: '10', label: '10' },
                  { id: '20', label: '20' },
                  { id: '50', label: '50' },
                  { id: '100', label: '100' },
                  { id: '500', label: '500' },
                  { id: '1000', label: '1000' },
                  { id: '5000', label: '5000' },
                  { id: '10000', label: '10000' },
                ]}
                rounded={false}
                minWidth={100}
                minHeight={tableVariables.selectHeight}
                nonEditable={false}
                disabled={false}
              />
            </div>

            <div className="flex flex-column justify-center items-center w-full">
              <TextField
                margin="dense"
                size="small"
                value={supplierNameInitialIncrese}
                label={t('supplierNameInitial', { ns: ['supplier'] })}
                type={'number'}
                onChange={onChangeField}
                fullWidth
                variant="standard"
                disabled={false}
                InputLabelProps={{ required: true }}
              />
            </div>

            <div className="mt-5">
              <DialogContentText id="dialog-slide-description">{t('bulkCreateText', { ns: ['supplier'] })}</DialogContentText>
            </div>
          </DialogContent>
        ) : (
          <Spinner text={'Creating ...'} color="error" />
        )}

        <DialogActions>
          <div className="m-3">
            <Button variant="contained" onClick={handleGenerate}>
              {t('generate', { ns: ['supplier'] })}
            </Button>
          </div>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};
