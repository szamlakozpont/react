import React, { ChangeEvent, useEffect, useMemo, useState } from 'react';
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
import useSWR, { KeyedMutator } from 'swr';
import { API_DATA, API_SELECTLIST_SUPPLIERS, serverPagination, szamlakozpontSupplierId, tableVariables } from '../../utils/variables';
import { useAxios } from '../../logics/useAxios';
import { SelectAutoWidth } from './Select';
import { Spinner } from './Spinner';

type BulkCreatePartnersModalProps = {
  mutate: KeyedMutator<any>;
  apiLink: string;
  apiLinkArgument: string;
};

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" mountOnEnter unmountOnExit ref={ref} {...props} onExited={() => {}} />;
});

export const BulkCreatePartnersModal: React.FC<BulkCreatePartnersModalProps> = ({ mutate, apiLink, apiLinkArgument }) => {
  const { t } = useTranslation(['partner']);
  const [numberValue, setNumberValue] = React.useState('5');
  const dispatch = useReduxDispatch();
  const isBulkCreatePartnersModalOpen = useReduxSelector((state) => state.table.isBulkCreatePartnersModalOpen);
  const [selectOptions, setSelectOptions] = useState<any>([]);
  const [supplierId, setSupplierId] = useState(szamlakozpontSupplierId);
  const [createWithProfile, setCreateWithProfile] = useState('true');
  const [partnerNameInitialIncrese, setPartnerNameInitialIncrese] = useState(1);
  const { createBulkData } = useAPI();
  const [generating, setGenerating] = useState(false);

  const { apiService } = useAxios();

  const {
    data: fetchedDataSuppliers,
    error: isLoadingDataErrorSuppliers,
    isLoading: isLoadingDataSupplier,
    isValidating: isFetchingDataSupplier,
  } = useSWR(isBulkCreatePartnersModalOpen ? [API_DATA + API_SELECTLIST_SUPPLIERS, 'GET', ''] : null, ([url, method, body]) => apiService({ url: url, method: method, data: body }));

  const data = useMemo(() => {
    if (fetchedDataSuppliers) {
      if (!serverPagination) return fetchedDataSuppliers;
      return fetchedDataSuppliers.results;
    } else return undefined;
  }, [fetchedDataSuppliers]);

  useEffect(() => {
    if (data) {
      setSelectOptions(data);
    }
  }, [data]);

  const handleClose = () => {
    dispatch(tableActions.setIsBulkCreatePartnersModalOpen(false));
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      await createBulkData(numberValue, `${apiLink}${parseInt(supplierId)}/${createWithProfile ? `${apiLinkArgument}${createWithProfile}` : ''}`, partnerNameInitialIncrese);
      mutate();
      dispatch(tableActions.setIsBulkCreatePartnersModalOpen(false));
      setGenerating(false);
    } catch (error) {
      const err = error as AxiosError;
      toast.error(`${err.response?.statusText}`);
      setGenerating(false);
    }
  };

  const onChangeField = (e: ChangeEvent<HTMLInputElement>) => {
    setPartnerNameInitialIncrese(parseInt(e.target.value));
  };

  return (
    <React.Fragment>
      <Dialog open={isBulkCreatePartnersModalOpen} TransitionComponent={Transition} keepMounted onClose={handleClose} aria-describedby="alert-dialog-slide-description" className="w-full">
        <div className="flex w-[400px]">
          <DialogTitle className="text-blue-600" variant="h5">
            {t('bulkCreatePartnersModal', { ns: ['partner'] })}
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
                selectLabel={t('selectSupplier', { ns: ['partner'] })}
                selectValue={supplierId}
                onSelect={setSupplierId}
                selectOptions={selectOptions}
                rounded={false}
                minWidth={100}
                minHeight={tableVariables.selectHeight}
                nonEditable={false}
                disabled={false}
              />
            </div>

            <div className="flex flex-column justify-center items-center w-full">
              <SelectAutoWidth
                selectLabel={t('withProfile', { ns: ['partner'] })}
                selectValue={createWithProfile}
                onSelect={setCreateWithProfile}
                selectOptions={[
                  { id: 'true', label: t('trueProfile', { ns: ['partner'] }) },
                  { id: 'false', label: t('falseProfile', { ns: ['partner'] }) },
                ]}
                rounded={false}
                minWidth={100}
                minHeight={tableVariables.selectHeight}
                nonEditable={false}
                disabled={false}
              />
            </div>

            <div className="flex flex-column justify-center items-center w-full">
              <SelectAutoWidth
                selectLabel={t('number', { ns: ['partner'] })}
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
                value={partnerNameInitialIncrese}
                label={t('partnerNameInitial', { ns: ['partner'] })}
                type={'number'}
                onChange={onChangeField}
                fullWidth
                variant="standard"
                disabled={false}
                InputLabelProps={{ required: true }}
              />
            </div>

            <div className="mt-5">
              <DialogContentText id="dialog-slide-description">{t('bulkCreateText', { ns: ['partner'] })}</DialogContentText>
            </div>
          </DialogContent>
        ) : (
          <Spinner text={'Creating ...'} color="error" />
        )}

        <DialogActions>
          <div className="m-3">
            <Button variant="contained" onClick={handleGenerate}>
              {t('generate', { ns: ['partner'] })}
            </Button>
          </div>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};
