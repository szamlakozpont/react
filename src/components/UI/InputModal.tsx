import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Controller, useForm } from 'react-hook-form';
import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControlLabel, IconButton, InputAdornment, TextField, Typography, Zoom } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import { convertKey } from '../../utils/common';
import { SelectAutoWidth } from './Select';
import { SelectSearch } from './SelectSearch';
import { DateTimeSelect } from './DateTimeSelect';

import 'dayjs/locale';
import { CUSTOMER_USER_TYPE, SUPPLIER_USER_TYPE, SUPPORT_USER_TYPE, szamlakozpontSupplierId, tableVariables } from '../../utils/variables';
import { useReduxSelector } from '../../store/Store';
import useTextToSpeech from '../../logics/useTextToSpeech';

export type FieldsProps = {
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

export type FieldsProfileProps = {
  label: string;
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
  defaultValues?: object;
  fieldName: string;
  fieldType: string;
  fieldSelectOptions?: any;
};

type InputModalProps = {
  openModal: boolean;
  handleCloseModal: any;
  handleClose: () => void;
  handleCancel: () => void;
  onSubmitFunc?: (data: any) => Promise<any>;
  onSubmitSuccess?: string;
  resetOnSubmit?: boolean;
  onSubmitProp?: (data: any, profileFields: FieldsProfileProps | undefined) => Promise<any>;
  modalTitle: string;
  contentText: string;
  submitText: string;
  fields: FieldsProfileProps;
  supportUserProfileFields?: FieldsProfileProps;
  supplierUserProfileFields?: FieldsProfileProps;
  customerUserProfileFields?: FieldsProfileProps;
  defaultValues?: any;
  translation?: string;
  userId?: string;
  createUserProfile?: boolean;
  editUserProfile?: FieldsProfileProps;
  edit?: boolean;
  invoiceNumbers?: boolean;
  userSupplierId?: string;
  partnerProfileFields?: FieldsProfileProps;
  partners?: boolean;
};

type ShowPasswordProps = {
  label: string;
  items: boolean[];
};

const InputModal: React.FC<InputModalProps> = ({
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
  fields,
  supportUserProfileFields,
  supplierUserProfileFields,
  customerUserProfileFields,
  defaultValues,
  translation = 'user',
  userId,
  createUserProfile = false,
  editUserProfile = undefined,
  edit = false,
  invoiceNumbers = false,
  userSupplierId,
  partnerProfileFields,
  partners = false,
}) => {
  const { i18n, t } = useTranslation([translation]);
  const [fields_, setFields_] = useState<FieldsProfileProps>(fields);
  const previewText = t('invoiceNumbersPreview', { ns: [translation] });
  const [sampleInvoiceNumber, setSampleInvoiceNumber] = useState(`${previewText} : 1`);
  const { handleSubmit, reset, control, getValues, watch, setValue } = useForm<FormInputsProps>();

  const { handlePlay, handleStop } = useTextToSpeech();

  const initShowPassword = fields_.map((key) => {
    return {
      label: key.label,
      items: new Array(key.items.length).fill(false) as boolean[],
    };
  });
  const [showPassword, setShowPassword] = useState(initShowPassword);
  const warningToasterUserType = userId && defaultValues ? (defaultValues.type === '1' && defaultValues.id === userId ? true : false) : false;
  const [warningUserType, setWarningUserType] = useState(true);
  const [warningToasterPartnerProfile, setWarningToasterPartnerProfile] = useState(false);
  const [warningPartnerProfile, setWarningPartnerProfile] = useState(true);
  const [isPartnerProfile, setIsPartnerProfile] = useState(false);
  const [showPartnerProfileSelect, setShowPartnerProfileSelect] = useState(false);

  useEffect(() => {
    if (createUserProfile && supportUserProfileFields) {
      setFields_([...fields, ...supportUserProfileFields]);
    }
    if (editUserProfile) {
      setFields_([...fields, ...editUserProfile]);
    }
  }, [supportUserProfileFields, createUserProfile, editUserProfile, fields]);

  useEffect(() => {
    if (invoiceNumbers && fields) {
      const fields_ = fields.map((field) => field.items.filter((x) => x.default));
      let sample_value = '';
      if (fields.length > 0) {
        fields_.forEach((item) => {
          item.forEach((x) => {
            if (x.name === 'invoiceNumberText') {
              sample_value = x.default + '/';
            }
            if (x.name === 'isYear' && x.default) {
              sample_value = sample_value + 'YYYY' + '/';
            }
            if (x.name === 'fillWithZeroLength' && x.default > 1) {
              sample_value = sample_value + '0'.repeat(x.default - 1) + '1';
            }
          });
        });
      }

      if (sample_value.length > 0) setSampleInvoiceNumber(`${previewText} : ${sample_value}`);
    }
  }, [fields, invoiceNumbers, previewText]);

  useEffect(() => {
    if (invoiceNumbers) {
      const preview = watch((value, { name, type }) => {
        let sample_value = '';
        if (value.invoiceNumberText) {
          sample_value = value.invoiceNumberText + '/';
        }
        if (value.isYear) {
          sample_value = sample_value + 'YYYY' + '/';
        }
        if (value.fillWithZeroLength > 1) {
          sample_value = sample_value + '0'.repeat(value.fillWithZeroLength - 1) + '1';
        } else {
          sample_value = sample_value + '1';
        }

        setSampleInvoiceNumber(`${previewText} : ${sample_value}`);
      });
      return () => preview.unsubscribe();
    }
  }, [invoiceNumbers, previewText, sampleInvoiceNumber, watch]);

  useEffect(() => {
    if (partners) {
      if (isPartnerProfile) {
        setFields_([...fields, ...(partnerProfileFields as FieldsProfileProps)]);
      } else {
        setValue('isPartnerProfile', false);
        setFields_(fields);
      }

      const subscriptionUserType = watch((value, { name, type }) => {
        if (name === 'isPartnerProfile' && type === 'change') {
          if (value.isPartnerProfile) {
            setIsPartnerProfile(true);
          } else {
            setIsPartnerProfile(false);
          }
        }

        if (name === 'supplierId' && type === 'change') {
          if (value.supplierId.toString() !== szamlakozpontSupplierId) {
            setShowPartnerProfileSelect(false);
            setIsPartnerProfile(false);
            setValue('isPartnerProfile', false);
          } else {
            setShowPartnerProfileSelect(true);
            setIsPartnerProfile(true);
            setValue('isPartnerProfile', true);
          }
        }
      });
      return () => subscriptionUserType.unsubscribe();
    }
  }, [fields, isPartnerProfile, partnerProfileFields, partners, setValue, watch]);

  useEffect(() => {
    const isPartnerProfileInFields = fields.some((field) => field.items.some(({ name }) => name === 'isPartnerProfile'));
    if (partners && isPartnerProfileInFields) {
      setIsPartnerProfile(defaultValues && defaultValues.isPartnerProfile);
      setShowPartnerProfileSelect(true);
      setWarningToasterPartnerProfile(true);
      setValue('isPartnerProfile', defaultValues && defaultValues.isPartnerProfile);
    }
  }, [defaultValues, edit, fields, partners, setValue]);

  const clickShowPassword = (fieldLabel: string, fieldIndex: number) => {
    const fields = showPassword.map((field) => {
      if (field.label === fieldLabel) {
        const items = field.items.map((value, index) => {
          if (index === fieldIndex) {
            return !value;
          }
          return value;
        });
        return { ...field, items };
      }
      return field;
    }) as ShowPasswordProps[];

    setShowPassword(fields);
  };

  const handleCancelModal = () => {
    reset();
    handleCancel();
  };

  const onSubmit = async (data: FormInputsProps) => {
    if (onSubmitProp) {
      const profileFields =
        userId || createUserProfile
          ? data['type'] === SUPPORT_USER_TYPE
            ? supportUserProfileFields
            : data['type'] === SUPPLIER_USER_TYPE
              ? supplierUserProfileFields
              : customerUserProfileFields
          : partnerProfileFields
            ? partnerProfileFields
            : undefined;
      const response = await onSubmitProp(data, profileFields);
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

  const isBackground = useReduxSelector((state) => state.home.pagesWithBackground);
  const buttonsColorText = useMemo(() => (isBackground ? tableVariables.buttonsColorTextBackground : tableVariables.buttonsColor), [isBackground]);
  const buttonsColorBorder = useMemo(() => (isBackground ? tableVariables.buttonsColorBorderBackground : tableVariables.buttonsColorBorder), [isBackground]);
  const isLightMode = useReduxSelector((state) => state.home.lightMode);

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

  const fieldGroupLabel = (translateLabel: string) => {
    return (
      <Typography sx={{ color: textColor, backgroundColor: backgroundColor_ }}>
        <label className=" -translate-y-7 text-sky-600 font-semibold text-sm">{translateLabel}</label>
      </Typography>
    );
  };

  const setDefaultValue = ({ defaultValues, fieldName, fieldType, fieldSelectOptions }: SetDefaultValueProps) => {
    if (defaultValues && defaultValues[fieldName as keyof typeof defaultValues]) {
      if (fieldType === 'select') {
        return (defaultValues[fieldName as keyof typeof defaultValues] as any).toString();
      } else return defaultValues[fieldName as keyof typeof defaultValues];
    }
    if (fieldType === 'select' && fieldSelectOptions) return fieldSelectOptions[0].id.toString();
    if (fieldType === 'boolean') return false;
    return undefined;
  };

  useEffect(() => {
    if (warningToasterUserType && warningUserType) {
      const subscription = watch((value, { name, type }) => {
        if (name === 'type' && type === 'change') {
          setWarningUserType(false);
          toast.warning('You modifying your Support type!!! You will not able to sign in as Support and set it back!');
        }
      });
      return () => subscription.unsubscribe();
    }
  }, [warningToasterUserType, warningUserType, watch]);

  useEffect(() => {
    if (warningToasterPartnerProfile && warningPartnerProfile) {
      const subscription = watch((value, { name, type }) => {
        if (name === 'isPartnerProfile' && type === 'change' && !value['isPartnerProfile']) {
          setWarningPartnerProfile(false);
          toast.warning('Partner profile data will be deleted !!! ');
        }
      });
      return () => subscription.unsubscribe();
    }
  }, [warningPartnerProfile, warningToasterPartnerProfile, watch]);

  useEffect(() => {
    if (createUserProfile || editUserProfile) {
      const subscriptionUserType = watch((value, { name, type }) => {
        if (name === 'type' && type === 'change') {
          switch (value.type) {
            case SUPPORT_USER_TYPE: {
              setFields_([...fields, ...supportUserProfileFields!]);
              break;
            }
            case SUPPLIER_USER_TYPE: {
              setFields_([...fields, ...supplierUserProfileFields!]);
              break;
            }
            case CUSTOMER_USER_TYPE: {
              setFields_([...fields, ...customerUserProfileFields!]);
              break;
            }
            default:
              setFields_(fields);
          }
        }
      });
      return () => subscriptionUserType.unsubscribe();
    }
  });

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
      !(partners && fieldName === 'isPartnerProfile' && !showPartnerProfileSelect) && (
        <Fragment key={index}>
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={i18n?.language}>
            <Controller
              name={fieldName}
              control={control}
              defaultValue={
                !edit && fieldDefault ? fieldDefault : setDefaultValue({ defaultValues: defaultValues, fieldName: fieldName, fieldType: fieldType, fieldSelectOptions: fieldSelectOptions })
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
              render={({ field: { onChange, value }, fieldState: { error } }) =>
                fieldType === 'boolean' ? (
                  <FormControlLabel
                    control={
                      <Checkbox
                        sx={{ color: textColor, backgroundColor: backgroundColor_ }}
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
                ) : fieldType === 'date' ? (
                  <DateTimeSelect
                    selectLabel={t(`${fieldName}`, { ns: [translation] })}
                    selectValue={value ? dayjs(value) : dayjs('')}
                    disabled={disabled}
                    onChange={onChange}
                    rounded={false}
                    minWidth={100}
                    nonEditable={edit && nonEditableField}
                    error={error}
                    dateWithTime={false}
                  />
                ) : fieldType === 'select' ? (
                  fieldSelectSearch ? (
                    <SelectSearch
                      selectLabel={t(`${fieldName}`, { ns: [translation] })}
                      selectValue={value}
                      onSelect={onChange}
                      selectOptions={fieldSelectOptions}
                      rounded={false}
                      minWidth={100}
                      minHeight={tableVariables.selectHeight}
                      nonEditable={edit && nonEditableField}
                      disabled={disabled}
                    />
                  ) : (
                    <SelectAutoWidth
                      selectLabel={t(`${fieldName}`, { ns: [translation] })}
                      selectValue={value}
                      onSelect={onChange}
                      selectOptions={fieldSelectOptions}
                      rounded={false}
                      minWidth={100}
                      minHeight={tableVariables.selectHeight}
                      nonEditable={edit && nonEditableField}
                      disabled={disabled}
                    />
                  )
                ) : (
                  <TextField
                    sx={{ backgroundColor: isLightMode ? tableVariables.backgroundColor : tableVariables.backgroundColorBackGround }}
                    error={!!error}
                    helperText={error ? error['message'] : ''}
                    margin="dense"
                    size="small"
                    value={value}
                    label={t(`${fieldName}`, { ns: [translation] })}
                    type={fieldType === 'password' ? (showPassword.find(({ label }) => label === fieldLabel)?.items[index] ? 'text' : 'password') : fieldType}
                    onChange={onChange}
                    fullWidth
                    variant="standard"
                    disabled={(edit && nonEditableField) || disabled}
                    InputProps={
                      fieldType === 'password'
                        ? {
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton aria-label="toggle password visibility" onClick={() => clickShowPassword(fieldLabel, index)} edge="end" disabled={!value}>
                                  {showPassword.find(({ label }) => label === fieldLabel)?.items[index] ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }
                        : {}
                    }
                    InputLabelProps={{ required: requiredField }}
                  />
                )
              }
            />
          </LocalizationProvider>
        </Fragment>
      )
    );
  };

  return (
    <>
      <Dialog sx={{ border: 1, borderColor: tableVariables.buttonsColor }} open={openModal} onClose={handleCloseModal} scroll="paper">
        <DialogTitle
          sx={{ color: textColor, backgroundColor: backgroundColor_, padding: 3 }}
          className="flex items-center justify-center text-2xl py-5"
          onMouseEnter={() => handlePlay(modalTitle)}
          onMouseLeave={() => handleStop()}
        >
          {modalTitle}
        </DialogTitle>
        <DialogContent sx={{ color: textColor, backgroundColor: backgroundColor_, padding: 3 }} dividers={true}>
          <Zoom in={true} style={{ transitionDelay: openModal ? '100ms' : '0ms' }} timeout={700}>
            <form id="hook-form" onSubmit={handleSubmit(onSubmit)}>
              <DialogContentText sx={{ color: textColor, backgroundColor: backgroundColor_ }} onMouseEnter={() => handlePlay(contentText)} onMouseLeave={() => handleStop()}>
                <div className="flex items-center justify-center pb-5">{contentText}</div>
                {invoiceNumbers && <div className="flex items-center justify-center pb-5">{sampleInvoiceNumber}</div>}
              </DialogContentText>
              {fields_.map((item, index) => {
                return (
                  <Fragment key={item.label + index}>
                    {fieldGroupLabel(item.label)}
                    <div className="bg-transparent mb-7 pb-1 px-4 border border-sky-600">
                      {item.items.map((field: FieldsProps, sIndex) => {
                        return (
                          <span key={sIndex} onMouseEnter={() => handlePlay(field.name)} onMouseLeave={() => handleStop()}>
                            {textFieldGenerator({
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
                            } as TextFieldGeneratorProps)}
                          </span>
                        );
                      })}
                    </div>
                  </Fragment>
                );
              })}
            </form>
          </Zoom>
        </DialogContent>
        <DialogActions sx={{ color: textColor, backgroundColor: backgroundColor_ }}>
          <Typography sx={{ color: textColor, backgroundColor: backgroundColor_ }}>
            <div className="flex gap-9 pr-7 pb-7">
              <Button onClick={handleCancelModal} onMouseEnter={() => handlePlay(t('cancel', { ns: [translation] }))} onMouseLeave={() => handleStop()}>
                <span className="bg-transparent text-red-500 px-4 border border-red-500 hover:bg-red-500 hover:text-white hover:border-transparent py-0 hover:scale-125 rounded-full">
                  {t('cancel', { ns: [translation] })}
                </span>
              </Button>
              <Button type="submit" form="hook-form" onMouseEnter={() => handlePlay(submitText)} onMouseLeave={() => handleStop()}>
                <span className="bg-transparent text-sky-600 px-4 border border-sky-600 hover:bg-sky-600 hover:text-white hover:border-transparent py-0 hover:scale-125 rounded-full">
                  {submitText}
                </span>
              </Button>
            </div>
          </Typography>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default InputModal;
