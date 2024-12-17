import React, { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import { Add, Delete } from '@mui/icons-material';
import { ActionType, FilterItemType, TableFilterAction, DataColumnsProp } from '../types/Table.type';
import { Button, IconButton, Popover, Tooltip, Typography } from '@mui/material';
import { toast } from 'react-toastify';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { tableVariables } from '../../utils/variables';
import { useTranslation } from 'react-i18next';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useReduxSelector } from '../../store/Store';
import useTextToSpeech from '../../logics/useTextToSpeech';

type TableFilterProps = {
  Columns: DataColumnsProp[];
  Filters: FilterItemType[];
  setFilters: Dispatch<SetStateAction<FilterItemType[]>>;
};

const TableFilter: React.FC<TableFilterProps> = ({ Columns, Filters, setFilters }) => {
  const { i18n, t } = useTranslation(['table']);

  const { handlePlay, handleStop } = useTextToSpeech();

  const TypeOperatorMap = useMemo(
    () => ({
      string: [
        { key: 'contains', text: t('contains', { ns: ['table'] }) },
        { key: 'notcontains', text: t('notcontains', { ns: ['table'] }) },
        { key: '=', text: '=' },
        { key: '!=', text: '!=' },
        { key: 'empty', text: t('empty', { ns: ['table'] }) },
        { key: 'notempty', text: t('notempty', { ns: ['table'] }) },
      ],
      number: [
        { key: '=', text: '=' },
        { key: '!=', text: '!=' },
        { key: '>', text: '>' },
        { key: '<', text: '<' },
        { key: '>=', text: '>=' },
        { key: '<=', text: '<=' },
        { key: 'empty', text: t('empty', { ns: ['table'] }) },
        { key: 'notempty', text: t('notempty', { ns: ['table'] }) },
      ],
      boolean: [
        { key: '=', text: '=' },
        { key: '!=', text: '!=' },
        { key: 'empty', text: t('empty', { ns: ['table'] }) },
        { key: 'notempty', text: t('notempty', { ns: ['table'] }) },
      ],
      date: [
        { key: '>', text: '>' },
        { key: '<', text: '<' },
        { key: '>=', text: '>=' },
        { key: '<=', text: '<=' },
        { key: '=', text: '=' },
        { key: '!=', text: '!=' },
        { key: 'empty', text: t('empty', { ns: ['table'] }) },
        { key: 'notempty', text: t('notempty', { ns: ['table'] }) },
      ],
      datetime: [
        { key: '>', text: '>' },
        { key: '<', text: '<' },
        { key: '>=', text: '>=' },
        { key: '<=', text: '<=' },
        { key: '=', text: '=' },
        { key: '!=', text: '!=' },
        { key: 'empty', text: t('empty', { ns: ['table'] }) },
        { key: 'notempty', text: t('notempty', { ns: ['table'] }) },
      ],
      select: [
        { key: '=', text: '=' },
        { key: '!=', text: '!=' },
        { key: 'empty', text: t('empty', { ns: ['table'] }) },
        { key: 'notempty', text: t('notempty', { ns: ['table'] }) },
      ],
    }),
    [t],
  );

  const filterReducer = useCallback(
    (state: FilterItemType[], action: ActionType) => {
      /** @ts-expect-error */
      const { type: TYPE, target: T, key: K, value: V, data: DATA, Columns: Columns } = action;
      const S = structuredClone(state);

      switch (TYPE) {
        case TableFilterAction.ADD: {
          S.push(DATA);
          return S;
        }

        case TableFilterAction.DELETE: {
          S.splice(T, 1);
          return S;
        }

        case TableFilterAction.CHANGE: {
          S[T][K] = V;
          if (K === 'key') {
            const type_ = Columns.find(({ id }) => id === V) as any;
            const type = type_ ? type_.type : 'string';
            S[T].type = type;
            S[T].operator = type && TypeOperatorMap[type as keyof typeof TypeOperatorMap][0].key;
            S[T].value = '';
          }
          return S;
        }

        case TableFilterAction.RESET:
          return DATA;

        case TableFilterAction.INIT:
          return DATA;

        default:
          return S;
      }
    },
    [TypeOperatorMap],
  );

  const booleanOptions = ['true', 'false'];
  const nameColumn = Columns.some((item) => item.id === 'name');
  const initialKey = nameColumn ? 'name' : Columns[0].id;
  const initialtype = Object.values(Columns).find((item) => item.id === initialKey) as any;
  const initialType = initialtype ? initialtype.type : 'string';
  const initialOperator = initialType ? (initialType !== 'string' ? 'notempty' : TypeOperatorMap[initialType as keyof typeof TypeOperatorMap][0].key) : 'contains';
  const initialValue = initialOperator === 'contains' ? '' : 0;

  const initialState = useMemo(
    () => [
      {
        key: initialKey,
        type: initialType,
        operator: initialOperator,
        value: initialValue,
      } as FilterItemType,
    ],
    [initialKey, initialOperator, initialType, initialValue],
  );

  const [state, dispatch] = useReducer(filterReducer, null, () => (Filters.length ? Filters : initialState));
  const isFilterChanged = Object.is(Filters, state);
  const resetFn = (hard?: boolean) => dispatch({ type: TableFilterAction.RESET, data: hard ? initialState : Filters });
  const addNewFn = () => dispatch({ type: TableFilterAction.ADD, data: initialState[0] });
  const deleteFn = (target: number) => dispatch({ type: TableFilterAction.DELETE, target });
  const changeFn = (target: number, key: keyof FilterItemType, value: any) => dispatch({ type: TableFilterAction.CHANGE, target, key, value, Columns });

  const [onClose, setOnClose] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const filterFn = () => {
    setFilters(state);
    setOnClose(true);
  };

  useEffect(() => {
    setOnClose(false);
  }, [onClose]);

  useEffect(() => {
    dispatch({ type: TableFilterAction.INIT, data: Filters.length ? Filters : initialState });
  }, [Filters, initialState]);

  const isLightMode = useReduxSelector((state) => state.home.lightMode);
  const isBackground = useReduxSelector((state) => state.home.pagesWithBackground);
  const buttonsColorBorder = useMemo(
    () => (isBackground ? (isLightMode ? tableVariables.buttonsColorBorderBackground : tableVariables.buttonsColorBorder) : tableVariables.buttonsColorBorder),
    [isBackground, isLightMode],
  );

  const backgroundColor_ = useMemo(
    () =>
      isBackground
        ? isLightMode
          ? tableVariables.backgroundColor
          : tableVariables.backgroundColorBackGroundDark
        : isLightMode
          ? tableVariables.backgroundColorLight
          : tableVariables.backgroundColorDark,
    [isBackground, isLightMode],
  );
  const textColor = useMemo(() => (isLightMode ? tableVariables.titleTextColor : tableVariables.titleTextColorDark), [isLightMode]);
  const buttonsColorText = useMemo(
    () => (isBackground ? tableVariables.titleTextColorDark : isLightMode ? tableVariables.titleTextColor : tableVariables.titleTextColorDark),
    [isBackground, isLightMode],
  );

  return (
    <>
      <button
        className={`inline-block bg-transparent  px-4 border ${tableVariables.buttonsHeight} ${buttonsColorBorder} ${tableVariables.buttonsColorHover} hover:text-white hover:border-transparent py-0 rounded-full`}
        aria-describedby={'pop'}
        onClick={handleClick}
        onMouseEnter={() => handlePlay(t('filter', { ns: ['table'] }))}
        onMouseLeave={() => handleStop()}
      >
        <Tooltip title={t('filter', { ns: ['table'] })}>
          <Typography sx={{ color: buttonsColorText }}>
            <span>{t('filter', { ns: ['table'] }).toUpperCase()}</span>
          </Typography>
        </Tooltip>
      </button>

      <Popover
        id={'pop'}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Typography sx={{ border: 1, borderColor: tableVariables.buttonsColor, color: textColor, backgroundColor: backgroundColor_, padding: 3 }}>
          {/* <div className="m-8"> */}
          {state.map((item: any, i: number) => {
            const itemType = item.type && TypeOperatorMap[item.type as keyof typeof TypeOperatorMap] ? item.type : 'string';
            const selectValues = Columns.find((element) => element.id === item.key) as any;
            const isSelectInput = (item.type !== 'boolean' && item.type !== 'select') || (item.type === 'select' && item.operator === 'contains') || item.operator === 'notcontains';
            const isSelect = item.type === 'select' && (item.operator === '=' || item.operator === '!=');
            const isSelectBoolean = item.type === 'boolean';
            const isEmpty = item.operator === 'empty' || item.operator === 'notempty';
            if (isSelect && !item.value) changeFn(i, 'value', selectValues['select'][0].id);
            if (isSelectBoolean && !item.value) changeFn(i, 'value', booleanOptions[0]);

            if (item.type === 'date' && !item.value) changeFn(i, 'value', new Date());
            if (item.type === 'datetime' && !item.value) changeFn(i, 'value', new Date());

            return (
              <>
                <div key={i} className="flex">
                  <label htmlFor="columns" className="mb-1 text-sm font-medium">
                    {t('columns', { ns: ['table'] })}
                  </label>
                  <label htmlFor="operator" className={`${i18n.language === 'en' ? 'ml-[100px]' : 'ml-[110px]'} mb-1 text-sm font-medium`}>
                    {t('operator', { ns: ['table'] })}
                  </label>
                  <label htmlFor="value" className={`${i18n.language === 'en' ? 'ml-[100px]' : 'ml-[110px]'} mb-1 text-sm font-medium`}>
                    {t('value', { ns: ['table'] })}
                  </label>
                </div>

                <div key={item.key} className="flex">
                  <select id="columns" className="h-[40px] w-[150px] border border-theme-neutral-200 bg-transparent px-4 py-2" value={item.key} onChange={(e) => changeFn(i, 'key', e.target.value)}>
                    {Columns.map(({ id, label, hidden }) => {
                      return (
                        !hidden && (
                          <option key={id + label} value={id}>
                            {label}
                          </option>
                        )
                      );
                    })}
                  </select>

                  <select
                    id="operator"
                    className="ml-1 h-[40px] w-[150px] border border-theme-neutral-200 bg-transparent px-4 py-2"
                    value={item.operator}
                    onChange={(e) => changeFn(i, 'operator', e.target.value)}
                  >
                    {TypeOperatorMap[itemType as keyof typeof TypeOperatorMap].map(({ key, text }) => {
                      return (
                        <option key={key} value={key}>
                          {text}
                        </option>
                      );
                    })}
                  </select>

                  {isEmpty ? (
                    <>
                      <input id="value" className="ml-1 w-[250px] border border-theme-neutral-200 bg-transparent px-4 py-2" disabled />
                      <Tooltip arrow title={t('deleteFilter', { ns: ['table'] })}>
                        <button className="text-red-500" onClick={() => deleteFn(i)}>
                          <Delete />
                        </button>
                      </Tooltip>
                    </>
                  ) : (
                    <>
                      {isSelectInput && item.type !== 'date' && item.type !== 'datetime' && (
                        <>
                          <Typography sx={{ color: 'black', backgroundColor: 'white' }}>
                            <input
                              id="value"
                              type={item.type}
                              value={item.value}
                              onChange={(e) => changeFn(i, 'value', e.target.value)}
                              className="ml-1 h-[40px] w-[250px] border border-theme-neutral-200 px-4 py-2"
                            />
                            <Tooltip arrow title={t('deleteFilter', { ns: ['table'] })}>
                              <button className="text-red-500" onClick={() => deleteFn(i)}>
                                <Delete />
                              </button>
                            </Tooltip>
                          </Typography>
                        </>
                      )}

                      {isSelectInput && (item.type === 'date' || item.type === 'datetime') && (
                        <>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <span id="value" className="ml-1">
                              <DatePicker
                                onChange={(e: any) => {
                                  if (!Number.isNaN(new Date(e).getTime()) && e !== null) {
                                    changeFn(i, 'value', item.type === 'date' ? new Date(e) : e);
                                  } else toast.error('Invalid date');
                                }}
                                defaultValue={dayjs(item.value)}
                                className="h-[40px] w-[250px] border border-theme-neutral-200 bg-transparent px-4 py-2"
                                slotProps={{ textField: { size: 'small' } }}
                              />
                            </span>
                          </LocalizationProvider>
                          <button className="text-red-500" onClick={() => deleteFn(i)}>
                            <Delete />
                          </button>
                        </>
                      )}

                      {isSelect && (
                        <>
                          <select
                            id="value"
                            className="ml-1 h-[40px] w-[250px] border border-theme-neutral-200 bg-transparent px-4 py-2"
                            value={item.value}
                            onChange={(e) => changeFn(i, 'value', e.target.value)}
                          >
                            {selectValues
                              ? selectValues['select']?.map(
                                  (
                                    item: {
                                      id: string;
                                      label: string;
                                    },
                                    index: number,
                                  ) => (
                                    <option key={index} value={item.id}>
                                      {item.label}
                                    </option>
                                  ),
                                )
                              : ''}
                          </select>

                          <Tooltip arrow title={t('deleteFilter', { ns: ['table'] })}>
                            <button className="text-red-500" onClick={() => deleteFn(i)}>
                              <Delete />
                            </button>
                          </Tooltip>
                        </>
                      )}

                      {isSelectBoolean && (
                        <>
                          <select
                            id="value"
                            className="ml-1 h-[40px] w-[250px] border border-theme-neutral-200 bg-transparent px-4 py-2"
                            value={item.value}
                            onChange={(e) => changeFn(i, 'value', e.target.value)}
                          >
                            {booleanOptions.map((value) => (
                              <option key={value} value={value}>
                                {value}
                              </option>
                            ))}
                          </select>
                          <Tooltip arrow title={t('deleteFilter', { ns: ['table'] })}>
                            <button className="text-red-500" onClick={() => deleteFn(i)}>
                              <Delete />
                            </button>
                          </Tooltip>
                        </>
                      )}
                    </>
                  )}
                </div>
                {i !== state.length - 1 ? <div className="py-1 text-sky-600">{t('and', { ns: ['table'] })}</div> : ''}
              </>
            );
          })}

          <Tooltip arrow title={t('addFilter', { ns: ['table'] })}>
            <IconButton aria-controls="menu-export" aria-haspopup="true" onClick={() => addNewFn()}>
              <span className={`bg-transparent px-[8px] pb-[4px] ${buttonsColorText} ${tableVariables.buttonsColorHover} hover:text-white rounded-full `}>
                <Add sx={{ fontSize: 25, color: textColor }} />
              </span>
            </IconButton>
          </Tooltip>

          <div className="flex justify-end gap-5 mb-7">
            <Button onClick={() => resetFn(true)}>
              <span className="bg-transparent text-red-500 px-4 border border-red-500 hover:bg-red-500 hover:text-white hover:border-transparent py-0 hover:scale-125 rounded-full">
                {t('reset', { ns: ['table'] })}
              </span>
            </Button>

            {/* <Button onClick={() => resetFn()} disabled={isFilterChanged}>
              <span className="bg-transparent text-sky-600 px-4 border border-sky-600 hover:bg-sky-600 hover:text-white hover:border-transparent py-0 hover:scale-125 rounded-full">
                {t('restore', { ns: ['table'] })}
              </span>
            </Button> */}

            <Button onClick={() => filterFn()}>
              <span className="bg-transparent text-sky-600 px-4 border border-sky-600 hover:bg-sky-600 hover:text-white hover:border-transparent py-0 hover:scale-125 rounded-full">
                {t('filter', { ns: ['table'] })}
              </span>
            </Button>
          </div>
          {/* </div> */}
        </Typography>
      </Popover>
    </>
  );
};

export default TableFilter;
