import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useColors } from '../../../logics/useColors';
import { IconButton, Tooltip, useTheme } from '@mui/material';
import useSWRImmutable from 'swr/immutable';
import { useAxios } from '../../../logics/useAxios';
import { usePermissions } from '../../../logics/usePermissions';
import { useReduxDispatch, useReduxSelector } from '../../../store/Store';
import { API_DATA, API_LIST_EMAILS, serverPagination, tableVariables } from '../../../utils/variables';
import { useFilters } from '../../../logics/useFilters';
import { FilterItemType } from '../../types/Table.type';
import { Refresh } from '@mui/icons-material';
import TableFilter from '../../UI/TableFilter';
import { useDataColumnsEmail } from '../../fields/email/dataColumns';
import { TableMain } from '../../UI/Table/TableMain';
import { ListModal } from '../../UI/ListModal';
import { homeActions } from '../../../store/appSlices/HomeSlice';
import useTextToSpeech from '../../../logics/useTextToSpeech';

const Emails: React.FC = () => {
  const { t } = useTranslation(['email']);
  const isUserSignedIn = useReduxSelector((state) => state.auth.isSignedIn);
  const [Filters, setFilters] = useState<FilterItemType[]>([]);
  const [emailType, setEmailType] = useState('0');
  const isEmailSentLogJsonListModalOpen = useReduxSelector((state) => state.table.isEmailSentLogJsonListModalOpen);
  const isEmailErrorLogJsonListModalOpen = useReduxSelector((state) => state.table.isEmailErrorLogJsonListModalOpen);
  const isEmailLoginJsonListModalOpen = useReduxSelector((state) => state.table.isEmailLoginJsonListModalOpen);
  const isEmailDataJsonListModalOpen = useReduxSelector((state) => state.table.isEmailDataJsonListModalOpen);

  const { isSupportUser, userId, userSupplierId } = usePermissions();
  const { apiService } = useAxios();
  const dispatch = useReduxDispatch();

  const { handlePlay, handleStop } = useTextToSpeech();

  const {
    mixins: { toolbar },
  } = useTheme();
  const appHeight = parseInt(toolbar?.minHeight as string) + 8;

  const { titleTextColor, buttonsColorBorder, buttonsColorText } = useColors();

  const {
    data: fetchedData,
    error: isLoadingDataError,
    isLoading: isLoadingData,
    isValidating: isFetchingData,
    mutate: mutateEmails,
  } = useSWRImmutable(isUserSignedIn && isSupportUser ? [API_DATA + `${API_LIST_EMAILS}/${emailType ? `?type=${emailType}` : ''}`, 'GET', ''] : null, ([url, method, body]) =>
    apiService({ url: url, method: method, data: body }),
  );

  const data = useMemo(() => {
    if (fetchedData) {
      if (!serverPagination) return fetchedData;
      return fetchedData.results;
    } else return undefined;
  }, [fetchedData]);

  const { dataColumns, dataColumnsLogin, dataColumnsData } = useDataColumnsEmail();
  const { fetchedData_filtered } = useFilters({ Filters: Filters, Columns: dataColumns, fetchedData: data });

  useEffect(() => {
    dispatch(homeActions.setPageName('emails'));
  }, [dispatch]);

  return isSupportUser ? (
    <div className="bg-transparent h-full">
      <div className="mt-2 flex gap-5 items-center">
        <Tooltip arrow title={t('refreshData', { ns: ['table'] })}>
          <IconButton onClick={() => mutateEmails()} onMouseEnter={() => handlePlay(t('refreshData', { ns: ['table'] }))} onMouseLeave={() => handleStop()}>
            <Refresh sx={{ fontSize: 30, color: tableVariables.buttonsColor, '&:hover': { scale: '1.5' } }} />
          </IconButton>
        </Tooltip>
        <TableFilter Columns={dataColumns} Filters={Filters} setFilters={setFilters} />

        <div className="m-auto" style={{ color: titleTextColor }}>
          {t('emailsTitle', { ns: ['email'] })}
        </div>
      </div>

      <>
        <div className={` flex justify-items-center h-[calc(100%-${appHeight}px)]`}>
          <div className={`w-[100%] absolute left-[50%] top-[calc(${appHeight}px)] -translate-x-1/2`}>
            <TableMain
              rows={fetchedData_filtered}
              isLoadingData={isLoadingData}
              isFetchingData={isFetchingData}
              dataColumns={dataColumns}
              selectId={'id'}
              // handleOpenEditModal={handleOpenEditModal}
              // handleOpenDeleteModal={handleOpenDeleteModal}
              mutate={mutateEmails}
              apiValue="emails"
              translation={'email'}
            />
          </div>
        </div>

        {/* {isEmailSentLogJsonListModalOpen && <ListModal modal={6} jsonData={[data]} columns={undefined} title={t('listEmailSentLogJsonTitle', { ns: ['email'] })} translation="email" noJson />}
        {isEmailErrorLogJsonListModalOpen && <ListModal modal={7} jsonData={[data]} columns={undefined} title={t('listEmailErrorLogJsonTitle', { ns: ['email'] })} translation="email" noJson />} */}
        {isEmailLoginJsonListModalOpen && <ListModal modal={8} jsonData={data} columns={dataColumnsLogin} title={t('listEmailLoginJsonTitle', { ns: ['email'] })} translation="email" />}
        {isEmailDataJsonListModalOpen && <ListModal modal={9} jsonData={[data]} columns={dataColumnsData} title={t('listEmailDataJsonTitle', { ns: ['email'] })} translation="email" />}
      </>
    </div>
  ) : (
    <></>
  );
};

export default Emails;
