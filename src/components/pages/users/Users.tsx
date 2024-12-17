import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useReduxDispatch, useReduxSelector } from '../../../store/Store';
import { IconButton, Tooltip, Typography, useTheme } from '@mui/material';
import { usePermissions } from '../../../logics/usePermissions';
import { useAxios } from '../../../logics/useAxios';
import { API_DATA, API_LIST_USERS, authVariables, tableVariables } from '../../../utils/variables';
import { SelectAutoWidth } from '../../UI/Select';
import { useTable } from '../../../logics/useTable';
import { Refresh } from '@mui/icons-material';
import { useCreateUserFields } from '../../fields/user/createFields';
import { useUser } from '../../../logics/useUser';
import InputModal from '../../UI/InputModal';
import ConfirmModal from '../../UI/ConfirmModal';
import { useDataColumnsUser } from '../../fields/user/dataColumns';
import { useFilters } from '../../../logics/useFilters';
import TableFilter from '../../UI/TableFilter';
import { FilterItemType } from '../../types/Table.type';
import { ItemModal } from '../../UI/ItemModal';
import useSWRImmutable from 'swr/immutable';
import { TableMain } from '../../UI/Table/TableMain';
import { useColors } from '../../../logics/useColors';
import { homeActions } from '../../../store/appSlices/HomeSlice';
import useTextToSpeech from '../../../logics/useTextToSpeech';

const Users: React.FC = () => {
  const { t } = useTranslation(['user']);
  const selectLabel = t('userType', { ns: ['user'] });
  const selectLabelProfile = t('withProfile', { ns: ['user'] });
  const isUserSignedIn = useReduxSelector((state) => state.auth.isSignedIn);
  const isItemModalOpen = useReduxSelector((state) => state.table.isItemModalOpen);
  const isBulkCreateModalOpen = useReduxSelector((state) => state.table.isBulkCreateModalOpen);
  const isUserCreateModalOpen = useReduxSelector((state) => state.table.isUserCreateModalOpen);
  const isUserEditModalOpen = useReduxSelector((state) => state.table.isUserEditModalOpen);
  const isUserDeleteModalOpen = useReduxSelector((state) => state.table.isUserDeleteModalOpen);
  const rowCustom = useReduxSelector((state) => state.table.rowCustom) as any;
  const [userType, setUserType] = useState('0');
  const [withProfile, setWithProfile] = useState('true');
  const [loadingSelectList, setLoadingSelectList] = useState(true);
  const [Filters, setFilters] = useState<FilterItemType[]>([]);
  const { isSupportUser, userId, userSupplierId } = usePermissions();

  const dispatch = useReduxDispatch();
  const { apiService } = useAxios();

  const { handlePlay, handleStop } = useTextToSpeech();

  const {
    mixins: { toolbar },
  } = useTheme();
  const appHeight = parseInt(toolbar?.minHeight as string) + 8;

  const { titleTextColor, buttonsColorBorder, buttonsColorText } = useColors();

  const defaultvalues = useMemo(
    () =>
      userSupplierId
        ? {
            supplierId: userSupplierId,
          }
        : {},
    [userSupplierId],
  );

  const {
    data: fetchedData,
    error: isLoadingDataError,
    isLoading: isLoadingData,
    isValidating: isFetchingData,
    mutate,
  } = useSWRImmutable(isUserSignedIn && isSupportUser ? [API_DATA + `${API_LIST_USERS}/${userType ? `?type=${userType}` : ''}`, 'GET', ''] : null, ([url, method, body]) =>
    apiService({ url: url, method: method, data: body }),
  );

  const { selectOptions, dataColumns, dataColumnsProfile } = useDataColumnsUser();

  const { openDeleteSelectedConfirm, openBulkCreateModal } = useTable({ apiValue: 'users' });

  const { fetchedData_filtered } = useFilters({ Filters: Filters, Columns: dataColumns, fetchedData: fetchedData });

  const {
    handleOpenCreateModal,
    handleCloseCreate,
    handleCloseCreateModal,
    handleCancelCreate,
    onSubmitCreateProp,
    handleOpenEditModal,
    handleCloseEdit,
    handleCloseEditModal,
    handleCancelEdit,
    onSubmitEditProp,
    handleOpenDeleteModal,
    handleCloseDelete,
    handleCloseDeleteModal,
    handleCancelDelete,
    onDelete,
    handleOpenRowDetailModal,
  } = useUser({
    mutate,
  });

  const { fields: createFields, supportUserProfileFields, supplierUserProfileFields, customerUserProfileFields } = useCreateUserFields(setLoadingSelectList);
  const editFieldsNoPasswords = createFields.map((field) => ({ ...field, items: field.items.filter((el) => !['password', 'passwordRe'].includes(el.name)) }));

  const dataColumns_ = useMemo(() => {
    if (withProfile === 'true' && dataColumnsProfile) return [...dataColumns, ...dataColumnsProfile];
    else return dataColumns;
  }, [dataColumns, dataColumnsProfile, withProfile]);

  useEffect(() => {
    dispatch(homeActions.setPageName('users'));
  }, [dispatch]);

  return isUserSignedIn && isSupportUser ? (
    <>
      <div className="bg-transparent h-full">
        <div className="mt-2 flex gap-5 items-center">
          <Tooltip arrow title={t('refreshData', { ns: ['table'] })}>
            <IconButton onClick={() => mutate()} onMouseEnter={() => handlePlay(t('refreshData', { ns: ['table'] }))} onMouseLeave={() => handleStop()}>
              <Refresh sx={{ fontSize: 30, color: tableVariables.buttonsColor, '&:hover': { scale: '1.5' } }} />
            </IconButton>
          </Tooltip>

          <button
            className={`bg-transparent ${buttonsColorText} px-4 border ${tableVariables.buttonsHeight} align-middle ${buttonsColorBorder} ${tableVariables.buttonsColorHover} hover:text-white hover:border-transparent py-0 rounded-full`}
            onClick={handleOpenCreateModal}
            onMouseEnter={() => handlePlay(t('createUser', { ns: ['user'] }))}
            onMouseLeave={() => handleStop()}
          >
            <Tooltip title={t('createUser', { ns: ['user'] })}>
              <Typography sx={{ color: buttonsColorText }}>
                <span>{t('createUser', { ns: ['user'] }).toUpperCase()}</span>
              </Typography>
            </Tooltip>
          </button>

          <SelectAutoWidth selectLabel={selectLabel!} selectValue={userType} onSelect={setUserType} selectOptions={selectOptions!} minHeight={tableVariables.selectHeight} />
          <SelectAutoWidth
            selectLabel={selectLabelProfile!}
            selectValue={withProfile}
            onSelect={setWithProfile}
            selectOptions={[
              { id: 'true', label: t('trueProfile', { ns: ['user'] }) },
              { id: 'false', label: t('falseProfile', { ns: ['user'] }) },
            ]}
            minHeight={tableVariables.selectHeight}
          />
          <TableFilter Columns={dataColumns_} Filters={Filters} setFilters={setFilters} />

          <div className="m-auto" style={{ color: titleTextColor }}>
            {t('usersTitle', { ns: ['user'] })}
          </div>
        </div>

        <div className={` flex justify-items-center h-[calc(100%-${appHeight}px)]`}>
          <div className={`w-[100%] absolute left-[50%] top-[calc(${appHeight}px)] -translate-x-1/2`}>
            <TableMain
              rows={fetchedData_filtered}
              isLoadingData={isLoadingData}
              isFetchingData={isFetchingData}
              dataColumns={dataColumns_}
              selectId={'id'}
              handleOpenEditModal={handleOpenEditModal}
              handleOpenDeleteModal={handleOpenDeleteModal}
              mutate={mutate}
              apiValue="users"
              translation="user"
            />
          </div>
        </div>

        {isUserCreateModalOpen && !loadingSelectList && (
          <InputModal
            openModal={isUserCreateModalOpen}
            handleCloseModal={handleCloseCreateModal}
            handleClose={handleCloseCreate}
            handleCancel={handleCancelCreate}
            onSubmitProp={onSubmitCreateProp}
            resetOnSubmit
            modalTitle={t('createUserTitle', { ns: ['user'] })}
            contentText={
              t('userMinMaxLen', { min: authVariables.userNameMinCharacter, max: authVariables.userNameMaxCharacter, ns: ['user'] }) +
              ' ' +
              t('toCreateUser', { minChar: authVariables.userPasswordMinCharacter, minDigit: authVariables.userPasswordMinDigit, minUpper: authVariables.userPasswordMinUpper, ns: ['user'] })
            }
            submitText={t('create', { ns: ['user'] })}
            fields={createFields}
            supportUserProfileFields={supportUserProfileFields}
            supplierUserProfileFields={supplierUserProfileFields}
            customerUserProfileFields={customerUserProfileFields}
            translation="user"
            createUserProfile={true}
            defaultValues={defaultvalues}
          />
        )}

        {isUserEditModalOpen && !loadingSelectList && (
          <InputModal
            openModal={isUserEditModalOpen}
            handleCloseModal={handleCloseEditModal}
            handleClose={handleCloseEdit}
            handleCancel={handleCancelEdit}
            onSubmitProp={onSubmitEditProp}
            resetOnSubmit
            modalTitle={t('editUserTitle', { ns: ['user'] })}
            contentText={
              t('userMinMaxLen', { min: authVariables.userNameMinCharacter, max: authVariables.userNameMaxCharacter, ns: ['user'] }) +
              ' ' +
              t('toCreateUser', { minChar: authVariables.userPasswordMinCharacter, minDigit: authVariables.userPasswordMinDigit, minUpper: authVariables.userPasswordMinUpper, ns: ['user'] })
            }
            submitText={t('update', { ns: ['user'] })}
            fields={editFieldsNoPasswords}
            supportUserProfileFields={supportUserProfileFields}
            supplierUserProfileFields={supplierUserProfileFields}
            customerUserProfileFields={customerUserProfileFields}
            translation="user"
            defaultValues={rowCustom}
            userId={userId}
            editUserProfile={rowCustom ? (rowCustom.type === '1' ? supportUserProfileFields : rowCustom.type === '2' ? supplierUserProfileFields : customerUserProfileFields) : undefined}
            edit
          />
        )}

        {isUserDeleteModalOpen && (
          <ConfirmModal
            openModal={isUserDeleteModalOpen}
            handleCloseModal={handleCloseDeleteModal}
            handleClose={handleCloseDelete}
            handleCancel={handleCancelDelete}
            onConfirmProp={onDelete}
            modalTitle={t('deleteUserTitle', { ns: ['user'] })}
            contentText={t('toDeleteUser', { ns: ['user'] })}
            confirmText={t('delete', { ns: ['user'] })}
            translation="user"
          />
        )}
        {isItemModalOpen && <ItemModal apiLink={'/list/supplier'} title={t('listSupplierTitle', { ns: ['user'] })} translation="supplier" />}
      </div>
    </>
  ) : (
    <></>
  );
};

export default Users;
