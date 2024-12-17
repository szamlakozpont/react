import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Zoom,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import { Numeric, NumericFormatCustom, convertKey } from '../../utils/common';
import { SelectAutoWidth } from './Select';
import { SelectSearch } from './SelectSearch';
import { DateTimeSelect } from './DateTimeSelect';
import 'dayjs/locale/hu';
import 'dayjs/locale/en';
import { tableVariables } from '../../utils/variables';
import { Add, Remove } from '@mui/icons-material';

type FieldsProps = {
  name: string;
  required?: boolean;
  type: string;
  pattern?: RegExp;
  validate?: any;
  disabled?: boolean;
  selectOptions?: any;
  selectSearch?: boolean; 
  nonEditable?: boolean; 
  default?: any;
};

type FormInputsProps = {
  [key: string]: any;
};

type FieldsProfileProps = {
  label?: string;
  items: {
    name: string;
    type: string;
    validate?: any;
    pattern?: RegExp;
    required?: boolean;
    default?: any;
  }[];
}[];

type TextFieldGeneratorProps = {
  inputIndex?: number;
  fieldLabel: string;
  index: number;
  fieldName: string;
  requiredField?: boolean; 
  fieldType: string;
  patternField?: string;
  validateField?: any;
  disabled?: boolean; 
  fieldSelectOptions?: any;
  fieldSelectSearch?: boolean;
  nonEditableField?: boolean;
  fieldDefault?: any;
};

type SetDefaultValueProps = {
  defaultValues?: any;
  fieldName: string;
  fieldType: string;
  fieldSelectOptions?: any;
};

type SetDefaultValueItemsProps = {
  defaultValues?: any;
  fieldName: string;
  fieldType: string;
  fieldSelectOptions?: any;
  fieldDefault?: any;
  inputIndex: number | undefined;
};

type InvoiceViewModalProps = {
  openModal: boolean;
  handleCloseModal: any;
  handleClose: () => void;
  handleCancel: () => void;
  onSubmitFunc?: (data: any) => Promise<any>;
  onSubmitSuccess?: string;
  resetOnSubmit?: boolean;
  onSubmitProp?: (data: any) => Promise<any>;
  modalTitle: string;
  contentText: string;
  submitText: string;
  edit?: boolean;
  baseFields: FieldsProfileProps;
  jsonFields: FieldsProfileProps;
  sumFields: FieldsProfileProps;
  defaultValues?: any;
  translation?: string;
  dateFields: string[];
};

const InvoiceViewModal: React.FC<InvoiceViewModalProps> = ({
  openModal,
  handleCloseModal,
  handleClose,
  handleCancel,
  onSubmitFunc,
  onSubmitSuccess,
  resetOnSubmit = false,
  onSubmitProp,
  modalTitle,
  contentText,
  submitText,
  baseFields,
  jsonFields,
  sumFields,
  edit = false,
  defaultValues,
  translation = 'invoice',
  dateFields,
}) => {
  const { i18n, t } = useTranslation([translation]); 

  const [fields_, setFields_] = useState<FieldsProfileProps>(jsonFields);

  const defaultItemsValues = useMemo(() => {
    const items = {} as any;
    jsonFields[0].items.forEach((x) => {
      items[x.name] = items[x.default ? x.default : ''];
    });
    const jsonValues = {
      jsonField: [items],
    };

    return jsonValues;
  }, [jsonFields]);

  const { handleSubmit, reset, control, getValues, setValue, watch } = useForm<FormInputsProps>({ defaultValues: defaultItemsValues });
  const { fields, append, remove } = useFieldArray({ control, name: 'jsonField' });
  const [init, setInit] = useState(true);
  const [disableCreate, setDisableCreate] = useState<boolean | undefined>(undefined);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  useEffect(() => {
    if (init && edit && defaultValues.invoiceItems.data.length) {
      let array = [] as FieldsProfileProps;
      for (let i = 0; i < defaultValues.invoiceItems.data.length; i++) {
        array = array.concat(jsonFields);
      }
      setFields_(array);
      setInit(false);
    }
  }, [defaultValues, edit, init, jsonFields]);

  const handleCancelModal = () => {
    reset();
    handleCancel();
  };

  const onSubmit = async (data: FormInputsProps) => {
    if (onSubmitProp) {
      const response = await onSubmitProp(data); 
      if (response === 'success') {
        if (resetOnSubmit) reset();
        handleClose();
      }
    } else {
      const newData = {} as FormInputsProps; 
      Object.keys(data).map((key: string) => {
        newData[convertKey(key) as keyof typeof newData] = data[key as keyof typeof data];
      });
      try {
        const { message } = await onSubmitFunc!(newData);
        if (onSubmitSuccess) toast.success(onSubmitSuccess);
      } catch (err) {
        return err;
      }
      handleClose();
      if (resetOnSubmit) reset();
    }
  };

  const fieldGroupLabel = (translateLabel: string) => {
    return <label className=" -translate-y-7 bg-white text-sky-600 font-semibold text-sm">{translateLabel}</label>;
  };

  const setDefaultValue = ({ defaultValues, fieldName, fieldType, fieldSelectOptions }: SetDefaultValueProps) => {
    if (defaultValues && defaultValues[fieldName as keyof typeof defaultValues]) {
      if (fieldType === 'select') {
        return (defaultValues[fieldName as keyof typeof defaultValues] as any).toString();
      } else return defaultValues[fieldName as keyof typeof defaultValues];
    }
    if (fieldType === 'select' && fieldSelectOptions[0]?.id) return fieldSelectOptions[0].id;
    if (fieldType === 'boolean') return false;
    return undefined;
  };

  const setDefaultValueItems = ({ defaultValues, fieldName, fieldType, fieldSelectOptions, fieldDefault, inputIndex }: SetDefaultValueItemsProps) => {
    if (defaultValues && inputIndex !== undefined && defaultValues.invoiceItems.data[inputIndex] && defaultValues.invoiceItems.data[inputIndex][fieldName]) {
      if (fieldType === 'select') {
        return (defaultValues.invoiceItems.data[inputIndex][fieldName as keyof typeof defaultValues] as any).toString();
      } else return defaultValues.invoiceItems.data[inputIndex][fieldName as keyof typeof defaultValues];
    }
    if (fieldDefault) return fieldDefault;
    if (fieldType === 'select' && fieldSelectOptions[0]?.id) return fieldSelectOptions[0].id;
    if (fieldType === 'boolean') return false;
    return undefined;
  };

  useEffect(() => {
    if (baseFields.length > 0) {
      const fields_ = baseFields.map((field: any) => field.items.filter((x: any) => x.name === 'invoiceNumberId')).filter((y) => y.length > 0);
      const selectOptions = fields_[0][0]?.selectOptions;
      if (baseFields && selectOptions.length > 0) {
        setDisableCreate(false);
      } else {
        setDisableCreate(true);
      }
    }
  }, [baseFields]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const textFieldGenerator = ({
    fieldLabel,
    index,
    fieldName,
    requiredField = true,
    fieldType,
    fieldSelectOptions,
    patternField,
    validateField,
    disabled = false,
    fieldSelectSearch = false,
    nonEditableField = false,
    fieldDefault,
  }: TextFieldGeneratorProps) => {
    return (
      <Fragment key={index}>
       
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={i18n.language}>
         
          <Controller
            name={`baseField.${fieldName}`}
            control={control}
            defaultValue={!edit && fieldDefault ? fieldDefault : setDefaultValue({ defaultValues: defaultValues, fieldName: fieldName, fieldType: fieldType, fieldSelectOptions: fieldSelectOptions })}
            rules={{
             
              required: requiredField ? t(`${fieldName}Required`, { ns: [translation] }) : undefined,

             
              pattern: patternField
                ? {
                    value: new RegExp(patternField),
                    message: t(`${fieldName}Pattern`, { ns: [translation] }),
                  }
                : undefined,

            
              validate: validateField
                ? (value) => {
                    let response = '';
                    Object.keys(validateField).map((key: any) => {
                      if (key === 'equalField') {
                        if (value !== getValues(validateField[key][0])) response += validateField[key][1] + ' ';
                      } else if (validateField[key](value) !== true) response += validateField[key](value) + ' ';
                    });
                    if (response) return response;
                    else return true;
                  }
                : undefined,
            }}
            render={({ field: { onChange, value }, fieldState: { error } }) => {
              return (
               
                fieldType === 'boolean' ? (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={!!value}
                        onChange={(e) => {
                          onChange(e.target.checked);
                        }}
                        disabled={disabled}
                      />
                    }
                    label={t(`${fieldName}`, { ns: [translation] })}
                    labelPlacement="end"
                  />
                ) : 
                fieldType === 'date' ? (
                  <DateTimeSelect
                    selectLabel={t(`${fieldName}`, { ns: [translation] })}
                    selectValue={value ? dayjs(value) : dayjs('')}
                    disabled={disabled}
                    onChange={onChange}
                    rounded={false}
                    minWidth={100}
                    nonEditable={nonEditableField}
                    error={error}
                    dateWithTime={false}
                  />
                ) :
                fieldType === 'select' ? (
                  fieldSelectSearch ? (
                    <SelectSearch
                      selectLabel={t(`${fieldName}`, { ns: [translation] })}
                      selectValue={value}
                      onSelect={onChange}
                      selectOptions={fieldSelectOptions}
                      rounded={false}
                      minWidth={110}
                      nonEditable={nonEditableField}
                      disabled={disabled}
                    />
                  ) : (
                    <SelectAutoWidth
                      selectLabel={t(`${fieldName}`, { ns: [translation] })}
                      selectValue={value}
                      onSelect={onChange}
                      selectOptions={fieldSelectOptions}
                      rounded={false}
                      minWidth={110}
                      nonEditable={nonEditableField}
                      disabled={disabled}
                     
                    />
                  )
                ) : (
                
                  <TextField
                    error={!!error}
                    helperText={error ? error['message'] : ''}
                    margin="dense"
                    size="small"
                    value={value}
                    label={t(`${fieldName}`, { ns: [translation] })}
                    type={fieldType}
                    onChange={onChange}
                    fullWidth
                    variant="standard"
                    disabled={disabled || nonEditableField}
                    InputLabelProps={{ required: requiredField }}
                    InputProps={{
                      inputComponent: fieldType === 'numeric' || fieldType === 'currency' ? (NumericFormatCustom as any) : undefined,
                    }}
                  />
                )
              );
            }}
          />
        </LocalizationProvider>
      </Fragment>
    );
  };

  const textFieldGeneratorItems = ({
    inputIndex,
    index,
    fieldName,
    requiredField = true,
    fieldType,
    fieldSelectOptions,
    patternField,
    validateField,
    disabled = false,
    fieldSelectSearch = false,
    nonEditableField = false,
    fieldDefault,
  }: TextFieldGeneratorProps) => {
    return (
      <Fragment key={index}>
       
        <Controller
          name={`jsonField[${inputIndex}].${fieldName}`}
          control={control}
          defaultValue={
            !edit && fieldDefault
              ? fieldDefault
              : !edit
                ? setDefaultValue({ defaultValues: defaultValues, fieldName: fieldName, fieldType: fieldType, fieldSelectOptions: fieldSelectOptions })
                : setDefaultValueItems({ defaultValues: defaultValues, fieldName: fieldName, fieldType: fieldType, fieldSelectOptions: fieldSelectOptions, fieldDefault, inputIndex })
          }
          rules={{
            
            required: requiredField ? t(`${fieldName}Required`, { ns: [translation] }) : undefined,

            pattern: patternField
              ? {
                  value: new RegExp(patternField),
                  message: t(`${fieldName}Pattern`, { ns: [translation] }),
                }
              : undefined,

            validate: validateField
              ? (value) => {
                  let response = '';
                  Object.keys(validateField).map((key: any) => {
                    if (key === 'equalField') {
                      if (value !== getValues(validateField[key][0])) response += validateField[key][1] + ' ';
                    } else if (validateField[key](value) !== true) response += validateField[key](value) + ' ';
                  });
                  if (response) return response;
                  else return true;
                }
              : undefined,
          }}
          render={({ field: { onChange, value }, fieldState: { error } }) => {
            return (
            
              fieldType === 'select' ? (
                fieldSelectSearch ? (
                  <SelectSearch
                    selectLabel={t(`${fieldName}`, { ns: [translation] })}
                    selectValue={value}
                    onSelect={onChange}
                    selectOptions={fieldSelectOptions}
                    rounded={false}
                    minWidth={80}
                    nonEditable={nonEditableField}
                    disabled={disabled}
                  />
                ) : (
                  <SelectAutoWidth
                    selectLabel={t(`${fieldName}`, { ns: [translation] })}
                    selectValue={value}
                    onSelect={onChange}
                    selectOptions={fieldSelectOptions}
                    rounded={false}
                    minWidth={110}
                    nonEditable={nonEditableField}
                    disabled={disabled}
                   
                  />
                )
              ) : (
              
                <TextField
                  error={!!error}
                  helperText={error ? error['message'] : ''}
                  margin="dense"
                  size="small"
                  value={value}
                
                  type={fieldType}
                  onChange={onChange}
                  fullWidth
                  variant="standard"
                  disabled={disabled || nonEditableField}
                  InputLabelProps={{ required: requiredField }}
                  InputProps={{
                    inputProps: {
                      style: { textAlign: 'right' },
                    },
                    inputComponent: fieldType === 'numeric' || fieldType === 'currency' ? (NumericFormatCustom as any) : undefined,
                  }}
                  sx={{
                    input: { borderBottom: `1px solid ${disabled ? 'red' : 'black'}` },
                  }}
                />
              )
            );
          }}
        />
      </Fragment>
    );
  };

  const appendItems = () => {
    setFields_((fields_) => [...fields_, ...jsonFields]);
  };

  const deleteItems = () => {
    const array = fields_.slice(0, -1);
    setFields_(array);
    const values = watch();
    const index = Object.keys(values.jsonField).slice(-1);
    remove(parseInt(index[0]));
  };

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      const name_ = name?.split('.')[1];
      const index = name?.split('.')[0].split('jsonField')[1];
      const index_ = index ? parseInt(index.slice(1, index.length - 1)) : 0;
      const item = value.jsonField[index_];

      if (name_ === 'vatKey' && type === 'change') {
        const vatValue = ((parseFloat(item.vatKey) || 0) * (parseFloat(item.netPrice) || 0)) / 100;
        setValue(`jsonField[${index_}].vatValue`, vatValue);
        const grossPrice = ((parseFloat(item.netPrice) || 0) * (100 + (parseFloat(item.vatKey) || 0))) / 100;
        setValue(`jsonField[${index_}].grossPrice`, grossPrice);
        const grossUnitPrice = ((parseFloat(item.netUnitPrice) || 0) * (100 + (parseFloat(item.vatKey) || 0))) / 100;
        setValue(`jsonField[${index_}].grossUnitPrice`, grossUnitPrice);
      }

      else if (name_ === 'netUnitPrice' && type === 'change') {
        const grossUnitPrice = ((parseFloat(item.netUnitPrice) || 0) * (100 + (parseFloat(item.vatKey) || 0))) / 100;
        setValue(`jsonField[${index_}].grossUnitPrice`, grossUnitPrice);
        const netPrice = (parseFloat(item.quantity) || 0) * (parseFloat(item.netUnitPrice) || 0);
        setValue(`jsonField[${index_}].netPrice`, netPrice);
        const grossPrice = ((parseFloat(item.netPrice) || 0) * (100 + (parseFloat(item.vatKey) || 0))) / 100;
        setValue(`jsonField[${index_}].grossPrice`, grossPrice);
        const vatValue = ((parseFloat(item.vatKey) || 0) * (parseFloat(item.netPrice) || 0)) / 100;
        setValue(`jsonField[${index_}].vatValue`, vatValue);
      }

      else if (name_ === 'quantity' && type === 'change') {
        const netPrice = (parseFloat(item.quantity) || 0) * (parseFloat(item.netUnitPrice) || 0);
        setValue(`jsonField[${index_}].netPrice`, netPrice);
        const grossPrice = ((parseFloat(item.netPrice) || 0) * (100 + (parseFloat(item.vatKey) || 0))) / 100;
        setValue(`jsonField[${index_}].grossPrice`, grossPrice);
        const vatValue = ((parseFloat(item.vatKey) || 0) * (parseFloat(item.netPrice) || 0)) / 100;
        setValue(`jsonField[${index_}].vatValue`, vatValue);
      }

      if (name_ === 'netPrice' && type === 'change') {
        let sum = 0;
        const sumVatBase = {
          '0': 0,
          '5': 0,
          '27': 0,
        };
        value.jsonField.forEach((x: any) => {
          sumVatBase[x.vatKey as keyof typeof sumVatBase] += parseFloat(x.netPrice);
          sum += parseFloat(x.netPrice);
        });
        setValue('sumField.netTotal', sum);
        setValue('sumField.sumVatBase0', sumVatBase['0']);
        setValue('sumField.sumVatBase5', sumVatBase['5']);
        setValue('sumField.sumVatBase27', sumVatBase['27']);
      }

      if (name_ === 'grossPrice' && type === 'change') {
        let sum = 0;
        const sumGross = {
          '0': 0,
          '5': 0,
          '27': 0,
        };
        value.jsonField.forEach((x: any) => {
          sumGross[x.vatKey as keyof typeof sumGross] += parseFloat(x.grossPrice);
          sum += parseFloat(x.grossPrice);
        });
        setValue('sumField.grossTotal', sum);
        setValue('sumField.sumGross0', sumGross['0']);
        setValue('sumField.sumGross5', sumGross['5']);
        setValue('sumField.sumGross27', sumGross['27']);
      }

      if ((name_ === 'vatKey' || name_ === 'vatValue') && type === 'change') {
        let sum = 0;
        const sumVatValue = {
          '0': 0,
          '5': 0,
          '27': 0,
        };
        const sumVatBase = {
          '0': 0,
          '5': 0,
          '27': 0,
        };
        value.jsonField.forEach((x: any) => {
          sumVatValue[x.vatKey as keyof typeof sumVatValue] += parseFloat(x.vatValue);
          sumVatBase[x.vatKey as keyof typeof sumVatBase] += parseFloat(x.netPrice);

          sum += parseFloat(x.vatValue);
        });
        setValue('sumField.vatTotal', sum);
        setValue('sumField.sumVatValue0', sumVatValue['0']);
        setValue('sumField.sumVatValue5', sumVatValue['5']);
        setValue('sumField.sumVatValue27', sumVatValue['27']);
        setValue('sumField.sumVatBase0', sumVatBase['0']);
        setValue('sumField.sumVatBase5', sumVatBase['5']);
        setValue('sumField.sumVatBase27', sumVatBase['27']);
      }
    });
    return () => subscription.unsubscribe();
  }, [setValue, watch]);

  return (
    <>
      <Dialog open={openModal} fullWidth={true} maxWidth={'lg'} onClose={handleCloseModal} scroll="paper">
        <DialogTitle className="flex items-center justify-center text-2xl py-5">{modalTitle}</DialogTitle>
        <DialogContent dividers={true}>
          <Zoom in={true} style={{ transitionDelay: openModal ? '100ms' : '0ms' }} timeout={700}>
            {disableCreate ? (
              <span className="flex items-center justify-center text-2xl py-5">{t('cannotCreate', { ns: ['invoice'] })}</span>
            ) : (
              <form id="hook-form" onSubmit={handleSubmit(onSubmit)}>
                <DialogContentText>
                  <div className="flex items-center justify-center pb-5">{contentText}</div>
                </DialogContentText>
                {baseFields.map((item, inputIndex) => {
                  return (
                    <Fragment key={item.label ? item.label + inputIndex : inputIndex}>
                      {fieldGroupLabel(item.label ? item.label : '')}
                      <div className="bg-transparent mb-7 pb-1 px-4 border border-sky-600">
                        {item.items.map((field: FieldsProps, sIndex) => {
                          return textFieldGenerator({
                            fieldLabel: item.label,
                            index: sIndex,
                            fieldName: field.name,
                            requiredField: field.required,
                            fieldType: field.type,
                            fieldSelectOptions: field.selectOptions,
                            fieldSelectSearch: field.selectSearch,
                            patternField: field.pattern,
                            validateField: field.validate,
                            nonEditableField: field.nonEditable,
                            disabled: field.disabled,
                            fieldDefault: field.default,
                          } as TextFieldGeneratorProps);
                        })}
                      </div>
                    </Fragment>
                  );
                })}

                <div>{fieldGroupLabel(t('itemsInvoiceData', { ns: ['invoice'] }))}</div>
                <div className="bg-transparent mb-7 border border-sky-600">
                  <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                    <TableContainer sx={{ maxHeight: 370 }}>
                      <Table sx={{ minWidth: 650 }} stickyHeader aria-label="sticky table">
                        <TableHead>
                          <TableRow>
                            {fields_[0].items.map((x) => (
                              <TableCell key={x.name} component="th" scope="row" align="center">
                                <span className="font-semibold">{t(x.name, { ns: ['invoice'] })}</span>
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {fields_.map((item, inputIndex) => {
                            return (
                              <TableRow hover key={item.label ? item.label + inputIndex : inputIndex} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                {item.items.map((field: FieldsProps, sIndex) => {
                                  return (
                                    <TableCell key={field.name + sIndex} style={{ minWidth: 160 }}>
                                      {textFieldGeneratorItems({
                                        inputIndex: inputIndex,
                                        fieldLabel: item.label,
                                        index: sIndex,
                                        fieldName: field.name,
                                        requiredField: field.required,
                                        fieldType: field.type,
                                        fieldSelectOptions: field.selectOptions,
                                        fieldSelectSearch: field.selectSearch,
                                        patternField: field.pattern,
                                        validateField: field.validate,
                                        nonEditableField: field.nonEditable,
                                        disabled: field.name === 'itemNumber' ? true : field.disabled,
                                        fieldDefault: field.name === 'itemNumber' ? inputIndex + 1 : field.default,
                                      } as TextFieldGeneratorProps)}
                                    </TableCell>
                                  );
                                })}
                              </TableRow>
                            );
                          })}

                          <TableRow>
                            <div className="flex py-5">
                              <div>
                                <Tooltip arrow title={t('addItem', { ns: ['invoice'] })}>
                                  <IconButton aria-controls="menu-export" aria-haspopup="true" onClick={() => appendItems()}>
                                    <span className={`bg-transparent px-[8px] pb-[4px] ${tableVariables.buttonsColorText} ${tableVariables.buttonsColorHover} hover:text-white rounded-full `}>
                                      <Add sx={{ fontSize: 25 }} />
                                    </span>
                                  </IconButton>
                                </Tooltip>

                                {fields_.length > 1 ? (
                                  <Tooltip arrow title={t('deleteItem', { ns: ['invoice'] })}>
                                    <IconButton aria-controls="menu-export" aria-haspopup="true" onClick={() => deleteItems()}>
                                      <span className={`bg-transparent px-[8px] pb-[4px] ${tableVariables.buttonsColorText} ${tableVariables.buttonsColorHover} hover:text-white rounded-full `}>
                                        <Remove sx={{ fontSize: 25 }} />
                                      </span>
                                    </IconButton>
                                  </Tooltip>
                                ) : (
                                  <></>
                                )}
                              </div>
                            </div>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                   
                  </Paper>
                </div>

                <div>{fieldGroupLabel(t('sumInvoiceData', { ns: ['invoice'] }))}</div>
                <div className="bg-transparent mb-7 border border-sky-600">
                  <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                    <TableContainer sx={{ maxHeight: 440 }}>
                      <Table sx={{ minWidth: 650, borderCollapse: 'separate !important' }} stickyHeader aria-label="sticky table">
                        <TableHead>
                          <TableRow>
                            <TableCell style={{ minWidth: 60 }} align="left">
                              <span className="font-semibold">{t('vatDetails', { ns: ['invoice'] })}</span>
                            </TableCell>
                            <TableCell align="right">
                              <span className="font-semibold">{t('vat%', { ns: ['invoice'] })}</span>
                            </TableCell>
                            <TableCell align="right">
                              <span className="font-semibold">{t('vatBase', { ns: ['invoice'] })}</span>
                            </TableCell>
                            <TableCell align="right">
                              <span className="font-semibold">{t('vatValue', { ns: ['invoice'] })}</span>
                            </TableCell>
                            <TableCell align="right">
                              <span className="font-semibold">{t('grossValue', { ns: ['invoice'] })}</span>
                            </TableCell>
                          </TableRow>
                        </TableHead>

                        
                        <TableRow hover>
                          <TableCell style={{ minWidth: 60 }} align="left">
                            {t('payableVat', { ns: ['invoice'] })}
                          </TableCell>
                          <TableCell style={{ minWidth: 60 }} align="right">
                            {t('vat0', { ns: ['invoice'] })}
                          </TableCell>
                          <TableCell style={{ minWidth: 60 }} align="right">
                            <Controller
                              name={'sumField.sumVatBase0'}
                              control={control}
                              defaultValue={edit ? defaultValues.invoiceSums['sumVatBase0'] || '0' : undefined}
                              render={({ field: { value } }) => {
                                return <span>{Numeric(value, 'currency')}</span>;
                              }}
                            ></Controller>
                          </TableCell>
                          <TableCell style={{ minWidth: 60 }} align="right">
                            <Controller
                              name={'sumField.sumVatValue0'}
                              control={control}
                              defaultValue={edit ? defaultValues.invoiceSums['sumVatValue0'] || '0' : undefined}
                              render={({ field: { value } }) => {
                                return <span>{Numeric(value, 'currency')}</span>;
                              }}
                            ></Controller>
                          </TableCell>
                          <TableCell style={{ minWidth: 60 }} align="right">
                            <Controller
                              name={'sumField.sumGross0'}
                              control={control}
                              defaultValue={edit ? defaultValues.invoiceSums['sumGross0'] || '0' : undefined}
                              render={({ field: { value } }) => {
                                return <span>{Numeric(value, 'currency')}</span>;
                              }}
                            ></Controller>
                          </TableCell>
                        </TableRow>

                        
                        <TableRow hover>
                          <TableCell style={{ minWidth: 60 }} align="left">
                            {t('payableVat', { ns: ['invoice'] })}
                          </TableCell>
                          <TableCell style={{ minWidth: 60 }} align="right">
                            {t('vat5', { ns: ['invoice'] })}
                          </TableCell>
                          <TableCell style={{ minWidth: 60 }} align="right">
                            <Controller
                              name={'sumField.sumVatBase5'}
                              control={control}
                              defaultValue={edit ? defaultValues.invoiceSums['sumVatBase5'] || '0' : undefined}
                              render={({ field: { value } }) => {
                                return <span>{Numeric(value, 'currency')}</span>;
                              }}
                            ></Controller>
                          </TableCell>
                          <TableCell style={{ minWidth: 60 }} align="right">
                            <Controller
                              name={'sumField.sumVatValue5'}
                              control={control}
                              defaultValue={edit ? defaultValues.invoiceSums['sumVatValue5'] || '0' : undefined}
                              render={({ field: { value } }) => {
                                return <span>{Numeric(value, 'currency')}</span>;
                              }}
                            ></Controller>
                          </TableCell>
                          <TableCell style={{ minWidth: 60 }} align="right">
                            <Controller
                              name={'sumField.sumGross5'}
                              control={control}
                              defaultValue={edit ? defaultValues.invoiceSums['sumGross5'] || '0' : undefined}
                              render={({ field: { value } }) => {
                                return <span>{Numeric(value, 'currency')}</span>;
                              }}
                            ></Controller>
                          </TableCell>
                        </TableRow>

                      
                        <TableRow hover>
                          <TableCell style={{ minWidth: 60 }} align="left">
                            {t('payableVat', { ns: ['invoice'] })}
                          </TableCell>
                          <TableCell style={{ minWidth: 60 }} align="right">
                            {t('vat27', { ns: ['invoice'] })}
                          </TableCell>
                          <TableCell style={{ minWidth: 60 }} align="right">
                            <Controller
                              name={'sumField.sumVatBase27'}
                              control={control}
                              defaultValue={edit ? defaultValues.invoiceSums['sumVatBase27'] || '0' : undefined}
                              render={({ field: { value } }) => {
                                return <span>{Numeric(value, 'currency')}</span>;
                              }}
                            ></Controller>
                          </TableCell>
                          <TableCell style={{ minWidth: 60 }} align="right">
                            <Controller
                              name={'sumField.sumVatValue27'}
                              control={control}
                              defaultValue={edit ? defaultValues.invoiceSums['sumVatValue27'] || '0' : undefined}
                              render={({ field: { value } }) => {
                                return <span>{Numeric(value, 'currency')}</span>;
                              }}
                            ></Controller>
                          </TableCell>
                          <TableCell style={{ minWidth: 60 }} align="right">
                            <Controller
                              name={'sumField.sumGross27'}
                              control={control}
                              defaultValue={edit ? defaultValues.invoiceSums['sumGross27'] || '0' : undefined}
                              render={({ field: { value } }) => {
                                return <span>{Numeric(value, 'currency')}</span>;
                              }}
                            ></Controller>
                          </TableCell>
                        </TableRow>

                        <TableRow>
                          <TableCell style={{ minWidth: 60 }} align="left">
                            {t('sum', { ns: ['invoice'] })}
                          </TableCell>
                          <TableCell style={{ minWidth: 60 }}></TableCell>
                          <TableCell style={{ minWidth: 60 }} align="right">
                            <Controller
                              name={'sumField.netTotal'}
                              control={control}
                              defaultValue={edit ? defaultValues.invoiceSums['netTotal'] || '0' : undefined}
                              render={({ field: { value } }) => {
                                return <span className="font-semibold">{Numeric(value, 'currency')}</span>;
                              }}
                            ></Controller>
                          </TableCell>
                          <TableCell style={{ minWidth: 60 }} align="right">
                            <Controller
                              name={'sumField.vatTotal'}
                              control={control}
                              defaultValue={edit ? defaultValues.invoiceSums['vatTotal'] || '0' : undefined}
                              render={({ field: { value } }) => {
                                return <span className="font-semibold">{Numeric(value, 'currency')}</span>;
                              }}
                            ></Controller>
                          </TableCell>
                          <TableCell style={{ minWidth: 60 }} align="right">
                            <Controller
                              name={'sumField.grossTotal'}
                              control={control}
                              defaultValue={edit ? defaultValues.invoiceSums['grossTotal'] || '0' : undefined}
                              render={({ field: { value } }) => {
                                return <span className="font-semibold">{Numeric(value, 'currency')}</span>;
                              }}
                            ></Controller>
                          </TableCell>
                        </TableRow>

                        <TableRow>
                          <TableCell style={{ minWidth: 60 }} align="left">
                            {t('rounding', { ns: ['invoice'] })}
                          </TableCell>
                          <TableCell style={{ minWidth: 60 }}></TableCell>
                          <TableCell style={{ minWidth: 60 }}></TableCell>
                          <TableCell style={{ minWidth: 60 }}></TableCell>
                          <TableCell style={{ minWidth: 60 }} align="right">
                            <Controller
                              name={'sumField.rounding'}
                              control={control}
                              defaultValue={edit ? defaultValues.invoiceSums['rounding'] || '0' : undefined}
                              render={({ field: { value } }) => {
                                return <span className="font-semibold">{Numeric(value, 'currency')}</span>;
                              }}
                            ></Controller>
                          </TableCell>
                        </TableRow>

                        <TableRow>
                          <TableCell style={{ minWidth: 60 }} align="left">
                            <span className="font-semibold">{t('grossTotal', { ns: ['invoice'] })}</span>
                          </TableCell>
                          <TableCell style={{ minWidth: 60 }}></TableCell>
                          <TableCell style={{ minWidth: 60 }}></TableCell>
                          <TableCell style={{ minWidth: 60 }}></TableCell>
                          <TableCell style={{ minWidth: 60 }} align="right">
                            <Controller
                              name={'sumField.grossTotal'}
                              control={control}
                              defaultValue={edit ? defaultValues.invoiceSums['grossTotal'] || '0' : undefined}
                              render={({ field: { value } }) => {
                                return <span className="font-semibold">{Numeric(value, 'currency')}</span>;
                              }}
                            ></Controller>
                          </TableCell>
                        </TableRow>
                      </Table>
                    </TableContainer>
                  </Paper>
                </div>
              </form>
            )}
          </Zoom>
        </DialogContent>
        <DialogActions>
          <div className="flex gap-9 mr-7 mb-7">
            <Button onClick={handleCancelModal}>
              <span className="bg-transparent text-red-500 px-4 border border-red-500 hover:bg-red-500 hover:text-white hover:border-transparent py-0 hover:scale-125 rounded-full">
                {t('cancel', { ns: [translation] })}
              </span>
            </Button>
            {disableCreate === undefined || disableCreate === false ? (
              <Button type="submit" form="hook-form">
                <span className="bg-transparent text-sky-600 px-4 border border-sky-600 hover:bg-sky-600 hover:text-white hover:border-transparent py-0 hover:scale-125 rounded-full">
                  {submitText}
                </span>
              </Button>
            ) : (
              <></>
            )}
          </div>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default InvoiceViewModal;
