import React, { Fragment, SetStateAction, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  Paper,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Zoom,
  useTheme,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { Numeric, NumericFormatCustom, convertKey, debounce } from '../../utils/common';
import { SelectAutoWidth } from './Select';
import { SelectSearch } from './SelectSearch';
import { DateTimeSelect } from './DateTimeSelect';
import 'dayjs/locale/hu';
import 'dayjs/locale/en';
import { API_DATA, serverPagination, tableVariables } from '../../utils/variables';
import { Add, Remove } from '@mui/icons-material';
import { getPlugins } from './PdfDesigner/helper';
import { Lang, Template, checkTemplate } from '@pdfme/common';
import { Viewer } from '@pdfme/ui';
import { useAxios } from '../../logics/useAxios';
import { usePermissions } from '../../logics/usePermissions';
import useSWR from 'swr';
import { toast } from 'react-toastify';

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

type InvoiceModalProps = {
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

const LANGUAGE_CHOICES = { HU: 'HU', EN: 'EN' };
const PAID = { EN: { 0: 'Not paid', 1: 'Paid' }, HU: { 0: 'Nincs fizetve', 1: 'Kifizetett' } };
const INVOICE_TYPE = { EN: { 1: 'Normal', 2: 'Storno', 3: 'Fee request', 6: 'Modify' }, HU: { 1: 'Normál', 2: 'Stornó', 3: 'Díjbekérő', 6: 'Módosító' } };
const E_INVOICE = { EN: { 1: 'E-invoice', 2: 'Paper' }, HU: { 1: 'E-számla', 2: 'Papír' } };
const PAYMENT_TYPE = { EN: { 1: 'Transfer', 2: 'Cash' }, HU: { 1: 'Átutalás', 2: 'Készpénz' } };
const VAT_RATE = { 0: '0 %', 5: '5 %', 27: '27 %' };
const INVOICE_LABEL = { EN: 'Invoice', HU: 'Számla' };
const ASIDE_LABEL = { EN: 'Aside', HU: 'Tervezet' };
const SUPPLIER_LABEL = { EN: 'Supplier:', HU: 'Szállító:' };
const PARTNER_LABEL = { EN: 'Customer:', HU: 'Vevő:' };
const SUPPLIER_TAX_NUMBER_LABEL = { EN: 'Tax number:', HU: 'Adószám:' };
const SUPPLIER_EU_TAX_NUMBER_LABEL = { EN: 'Eu tax number:', HU: 'Közösségi adószám:' };
const SUPPLIER_EMAIL_LABEL = { EN: 'Email:', HU: 'Email:' };
const SUPPLIER_BANK_NUMBER_LABEL = { EN: 'Bank:', HU: 'Bank:' };
const PARTNER_TAX_NUMBER_LABEL = { EN: 'Tax number:', HU: 'Adószám:' };
const PARTNER_EU_TAX_NUMBER_LABEL = { EN: 'Eu tax number:', HU: 'Közösségi adószám:' };
const PARTNER_EMAIL_LABEL = { EN: 'Email:', HU: 'Email:' };
const INVOICE_NUMBER_LABEL = { EN: 'Invoice number:', HU: 'Számla sorszám:' };
const PAYMENT_TYPE_LABEL = { EN: 'Payment type', HU: 'Fizetés módja' };
const CURRENCY_LABEL = { EN: 'Currency', HU: 'Pénznem' };
const COMPLETION_DATE_LABEL = { EN: 'Completion', HU: 'Teljesítés' };
const ISSUE_DATE_LABEL = { EN: 'Issue date', HU: 'Számla kelte' };
const PAYMENT_TERM_DATE_LABEL = { EN: 'Payment term', HU: 'Fizetési határidő' };
const NET_TOTAL_LABEL = { EN: 'Net total:', HU: 'Nettó összesen:' };
const VAT_TOTAL_LABEL = { EN: 'VAT total:', HU: 'ÁFA összesen:' };
const GROSS_TOTAL_LABEL = { EN: 'Gross total:', HU: 'Bruttó összesen:' };

const ITEMS_HEAD = {
  EN: ['Description', 'Quant.', 'Net unit price', 'Net value', 'VAT %', 'VAT value', 'Gross value'],
  HU: ['Megnevezés', 'Menny.', 'Nettó egységár', 'Nettó érték', 'ÁFA kulcs', 'ÁFA érték', 'Bruttó érték'],
};

const DATE_FORMAT = { EN: 'DD/MM/YYYY', HU: 'YYYY-MM-DD' };

const InvoiceModal: React.FC<InvoiceModalProps> = ({
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
  const viewerRef = useRef<HTMLDivElement | null>(null);
  const viewer = useRef<Viewer | null>(null);
  const [templatePreset, setTemplatePreset] = useState<string>('invoice');
  const [templateData, setTemplateData] = useState<Template>();
  const [langPdf, setLangPdf] = useState<Lang>('en');
  const [items_, setItems_] = useState('');
  const formRef = useRef<any>(null);
  const [showPdf, setShowPdf] = useState(true);
  const [initPdf, setInitPdf] = useState(true);

  const [input, setInput] = useState({
    completionDate: dayjs().format(DATE_FORMAT[i18n.language.toUpperCase() as 'EN' | 'HU']),
    currency: '',
    eInvoice: '',
    editable: true,
    grossTotal: '',
    invoiceNumber: '',
    invoiceType: 1,
    issueDate: dayjs().format(DATE_FORMAT[i18n.language.toUpperCase() as 'EN' | 'HU']),
    language: i18n.language.toUpperCase() as 'EN' | 'HU',
    netTotal: '',
    partnerAddress: '',
    partnerEmail: '',
    partnerEuTaxNumber: '',
    partnerName: '',
    partnerTaxNumber: '',
    paymentTermDate: dayjs().format(DATE_FORMAT[i18n.language.toUpperCase() as 'EN' | 'HU']),
    paymentType: 1,
    pdfSchemaId: defaultValues.pdfSchemaId,
    supplierAddress: defaultValues.supplierAddress,
    supplierEuTaxNumber: defaultValues.supplierEuTaxNumber,
    supplierName: defaultValues.supplierName,
    supplierTaxNumber: defaultValues.supplierTaxNumber,
    vatTotal: '',
  });

  const inputs_ = useMemo(() => {
    return [
      {
        invoice_label: INVOICE_LABEL[input.language],
        aside_label: input.editable ? ASIDE_LABEL[input.language] : '',

        invoice_number: input.editable ? '' : input.invoiceNumber ? input.invoiceNumber : 'XXXXXXX',

        supplier_label: SUPPLIER_LABEL[input.language],
        supplier_name: input.supplierName,
        supplier_address: input.supplierAddress,
        supplier_tax_number: input.supplierTaxNumber,
        supplier_eu_tax_number: input.supplierEuTaxNumber,
        supplier_tax_number_label: SUPPLIER_TAX_NUMBER_LABEL[input.language],
        supplier_eu_tax_number_label: SUPPLIER_EU_TAX_NUMBER_LABEL[input.language],
        supplier_email_label: SUPPLIER_EMAIL_LABEL[input.language],
        supplier_bank_number_label: SUPPLIER_BANK_NUMBER_LABEL[input.language],

        partner_label: PARTNER_LABEL[input.language],
        partner_name: input.partnerName,
        partner_address: input.partnerAddress,
        partner_email: input.partnerEmail,
        partner_tax_number: input.partnerTaxNumber,
        partner_eu_tax_number: input.partnerEuTaxNumber,
        partner_tax_number_label: PARTNER_TAX_NUMBER_LABEL[input.language],
        partner_eu_tax_number_label: PARTNER_EU_TAX_NUMBER_LABEL[input.language],
        partner_email_label: PARTNER_EMAIL_LABEL[input.language],

        invoice_number_label: INVOICE_NUMBER_LABEL[input.language],

        invoice_type: INVOICE_TYPE[input.language][input.invoiceType as 1 | 2 | 3 | 6],
        payment_type: PAYMENT_TYPE[input.language][input.paymentType as 1 | 2],
        currency: input.currency || 'HUF',

        payment_type_label: PAYMENT_TYPE_LABEL[input.language],
        currency_label: CURRENCY_LABEL[input.language],
        completion_date_label: COMPLETION_DATE_LABEL[input.language],
        issue_date_label: ISSUE_DATE_LABEL[input.language],
        payment_term_date_label: PAYMENT_TERM_DATE_LABEL[input.language],

        issue_date: dayjs(input.issueDate).format(DATE_FORMAT[input.language]),
        completion_date: dayjs(input.completionDate).format(DATE_FORMAT[input.language]),
        payment_term_date: dayjs(input.paymentTermDate).format(DATE_FORMAT[input.language]),
        items: items_,

        net_total_label: NET_TOTAL_LABEL[input.language],
        vat_total_label: VAT_TOTAL_LABEL[input.language],
        gross_total_label: GROSS_TOTAL_LABEL[input.language],
        net_total: input.netTotal.toString(),
        vat_total: input.vatTotal.toString(),
        gross_total: input.grossTotal.toString(),
      },
    ];
  }, [
    input.language,
    input.editable,
    input.invoiceNumber,
    input.supplierName,
    input.supplierAddress,
    input.supplierTaxNumber,
    input.supplierEuTaxNumber,
    input.partnerName,
    input.partnerAddress,
    input.partnerEmail,
    input.partnerTaxNumber,
    input.partnerEuTaxNumber,
    input.invoiceType,
    input.paymentType,
    input.currency,
    input.issueDate,
    input.completionDate,
    input.paymentTermDate,
    input.netTotal,
    input.vatTotal,
    input.grossTotal,
    items_,
  ]);

  useEffect(() => {
    if (inputs_ && viewer.current) {
      viewer.current.setInputs(inputs_);
    }
  }, [inputs_]);

  const inputFromData = (template: Template, inputs_: { [key: string]: string }[]): { [key: string]: string }[] => {
    const input: { [key: string]: string } = {};
    template.schemas.forEach((schema) => {
      Object.entries(schema).forEach(([key, value]) => {
        if (!value.readOnly) {
          if (key === 'logo') {
            input[key] = Object.prototype.hasOwnProperty.call(inputs_[0], key) ? inputs_[0][key] : value.content || '';
          } else {
            input[key] = Object.prototype.hasOwnProperty.call(inputs_[0], key) ? inputs_[0][key] : '';
          }
        }
      });
    });
    return [input];
  };

  const inputs = useMemo(() => (templateData ? inputFromData(templateData, inputs_) : undefined), [inputs_, templateData]);

  const {
    mixins: { toolbar },
  } = useTheme();

  const appHeight = parseInt(toolbar?.minHeight as string) + 8;

  useEffect(() => {
    if (initPdf && showPdf && viewerRef.current && templateData && inputs) {
      const template = templateData as Template;

      try {
        checkTemplate(template);

        if (input.pdfSchemaId === defaultValues.pdfSchemaId) template.schemas[0].items.head = ITEMS_HEAD[input.language];
        viewer.current = null;
        viewer.current = new Viewer({
          domContainer: viewerRef.current,
          template,
          inputs,
          plugins: getPlugins(),
        });
        setInitPdf(false);
      } catch {
        console.log('Error');
      }
    }
  }, [viewerRef, inputs, templateData, input.language, input.pdfSchemaId, defaultValues, showPdf, initPdf]);

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

  const { handleSubmit, reset, control, getValues, setValue, watch } = useForm<FormInputsProps>({
    defaultValues: defaultItemsValues,
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'jsonField' });
  const [init, setInit] = useState(true);
  const [initDefaultPdfSchema, setInitDefaultPdfSchema] = useState(true);
  const [disableCreate, setDisableCreate] = useState<boolean | undefined>(undefined);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const { apiService } = useAxios();
  const { isSupportUser, isSupplierUser, userSupplierId, userSupplierName } = usePermissions();
  const {
    data: fetchedDataPdfSchema,
    error: isLoadingDataErrorPdfSchema,
    isLoading: isLoadingDataPdfSchema,
    isValidating: isFetchingDataPdfSchema,
  } = useSWR(init && !edit ? [API_DATA + `/list/pdfschemasupplier/${userSupplierId}`, 'GET', ''] : null, ([url, method, body]) => apiService({ url: url, method: method, data: body }));

  const dataPdfSchema = useMemo(() => {
    if (fetchedDataPdfSchema) {
      if (!serverPagination) return fetchedDataPdfSchema;
      return fetchedDataPdfSchema.results;
    } else return undefined;
  }, [fetchedDataPdfSchema]);

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

  useEffect(() => {
    if (initDefaultPdfSchema && !edit && defaultValues.pdfSchemaId && dataPdfSchema) {
      const template = dataPdfSchema.find((item: any) => item.id === defaultValues.pdfSchemaId).data;
      if (template) {
        setTemplateData(template);
        setInitDefaultPdfSchema(false);
      }
    }
  }, [dataPdfSchema, defaultValues, edit, initDefaultPdfSchema]);

  const handleCancelModal = () => {
    setShowPdf(false);
    setInitPdf(true);
    reset();
    handleCancel();
  };

  const handleShowPdf = () => {
    if (showPdf) {
      setShowPdf(false);
      setInitPdf(false);
    }

    if (!showPdf) {
      setShowPdf(true);
      setInitPdf(true);
    }
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

  useEffect(() => {
    const subscription_ = watch((value, { name, type }) => {
      if (name && type === 'change') {
        switch (name) {
          case 'baseField.pdfSchemaId': {
            const pdfSchemaId = value.baseField.pdfSchemaId;
            const template = dataPdfSchema.find((item: any) => item.id === pdfSchemaId).data;
            setTemplateData(template);
            if (viewer.current) {
              viewer.current.updateTemplate(template);
            }
            break;
          }
        }
      }
    });

    return () => subscription_.unsubscribe();
  }, [dataPdfSchema, watch]);

  const onJsonData = () => {
    const data = getValues();

    const jsonObj = [] as any;
    Object.values(data.jsonField).map((item: any) => {
      const row: string[] = [];
      row.push(item.productName ? item.productName : '');
      row.push(item.quantity ? item.quantity.toString() : '');
      row.push(item.netUnitPrice ? item.netUnitPrice.toString() : '');
      row.push(item.netPrice ? item.netPrice.toString() : '');
      row.push(item.vatKey ? item.vatKey.toString() : '');
      row.push(item.vatValue ? item.vatValue.toString() : '');
      row.push(item.grossPrice ? item.grossPrice.toString() : '');
      jsonObj.push(row);
    });

    const netTotal = data.sumField.netTotal ? data.sumField.netTotal.toString() : '';
    const grossTotal = data.sumField.grossTotal ? data.sumField.grossTotal.toString() : '';
    const vatTotal = data.sumField.vatTotal ? data.sumField.vatTotal.toString() : '';

    setInput((prev) => ({ ...prev, ['netTotal']: netTotal, ['grossTotal']: grossTotal, ['vatTotal']: vatTotal }));
    setItems_(JSON.stringify(jsonObj));
  };

  const handleTyping = debounce((value: string, fieldName: string) => {
    setInput((prev) => ({ ...prev, [fieldName]: value }));
  }, 700);

  const handleChecked = debounce((value: boolean, fieldName: string) => {
    setInput((prev) => ({ ...prev, [fieldName]: value }));
  }, 100);

  const handleSelect = debounce((value: SetStateAction<string>, fieldName: string) => {
    setInput((prev) => ({ ...prev, [fieldName]: value }));
  }, 100);

  const handleDate = debounce((value: string, fieldName: string) => {
    setInput((prev) => ({ ...prev, [fieldName]: dayjs(value).format(DATE_FORMAT[input.language]) }));
  }, 100);

  const handleJsonData = debounce((value: any, fieldName: string, inputIndex) => {
    const name_ = fieldName;
    const index_ = inputIndex;
    const values = getValues();
    const item = values.jsonField[index_];

    if (name_ === 'vatKey') {
      const vatValue = ((parseFloat(value) || 0) * (parseFloat(item.netPrice) || 0)) / 100;
      setValue(`jsonField[${index_}].vatValue`, vatValue);
      const grossPrice = ((parseFloat(item.netPrice) || 0) * (100 + (parseFloat(value) || 0))) / 100;
      setValue(`jsonField[${index_}].grossPrice`, grossPrice);
      const grossUnitPrice = ((parseFloat(item.netUnitPrice) || 0) * (100 + (parseFloat(value) || 0))) / 100;
      setValue(`jsonField[${index_}].grossUnitPrice`, grossUnitPrice);
    } else if (name_ === 'netUnitPrice') {
      const grossUnitPrice = ((parseFloat(value) || 0) * (100 + (parseFloat(item.vatKey) || 0))) / 100;
      setValue(`jsonField[${index_}].grossUnitPrice`, grossUnitPrice);
      const netPrice = (parseFloat(item.quantity) || 0) * (parseFloat(value) || 0);
      setValue(`jsonField[${index_}].netPrice`, netPrice);
      const grossPrice = ((parseFloat(item.netPrice) || 0) * (100 + (parseFloat(item.vatKey) || 0))) / 100;
      setValue(`jsonField[${index_}].grossPrice`, grossPrice);
      const vatValue = ((parseFloat(item.vatKey) || 0) * (parseFloat(item.netPrice) || 0)) / 100;
      setValue(`jsonField[${index_}].vatValue`, vatValue);
    } else if (name_ === 'quantity') {
      const netPrice = (parseFloat(value) || 0) * (parseFloat(item.netUnitPrice) || 0);
      setValue(`jsonField[${index_}].netPrice`, netPrice);
      const grossPrice = ((parseFloat(item.netPrice) || 0) * (100 + (parseFloat(item.vatKey) || 0))) / 100;
      setValue(`jsonField[${index_}].grossPrice`, grossPrice);
      const vatValue = ((parseFloat(item.vatKey) || 0) * (parseFloat(item.netPrice) || 0)) / 100;
      setValue(`jsonField[${index_}].vatValue`, vatValue);
    }

    if (['vatKey', 'netUnitPrice', 'quantity'].includes(name_)) {
      let sumNetTotal = 0;
      let sumGrossTotal = 0;
      let sumVatTotal = 0;

      const sumVatBase = { '0': 0, '5': 0, '27': 0 };
      const sumGross = { '0': 0, '5': 0, '27': 0 };
      const sumVatValue = { '0': 0, '5': 0, '27': 0 };

      values.jsonField.forEach((x: any) => {
        sumVatBase[x.vatKey as keyof typeof sumVatBase] += parseFloat(x.netPrice);
        sumNetTotal += parseFloat(x.netPrice);
        sumGross[x.vatKey as keyof typeof sumGross] += parseFloat(x.grossPrice);
        sumGrossTotal += parseFloat(x.grossPrice);
        sumVatValue[x.vatKey as keyof typeof sumVatValue] += parseFloat(x.vatValue);
        sumVatTotal += parseFloat(x.vatValue);
      });
      setValue('sumField.netTotal', sumNetTotal);
      setValue('sumField.sumVatBase0', sumVatBase['0']);
      setValue('sumField.sumVatBase5', sumVatBase['5']);
      setValue('sumField.sumVatBase27', sumVatBase['27']);
      setValue('sumField.grossTotal', sumGrossTotal);
      setValue('sumField.sumGross0', sumGross['0']);
      setValue('sumField.sumGross5', sumGross['5']);
      setValue('sumField.sumGross27', sumGross['27']);
      setValue('sumField.vatTotal', sumVatTotal);
      setValue('sumField.sumVatValue0', sumVatValue['0']);
      setValue('sumField.sumVatValue5', sumVatValue['5']);
      setValue('sumField.sumVatValue27', sumVatValue['27']);
    }

    onJsonData();
  }, 700);

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
              return fieldType === 'boolean' ? (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={!!value}
                      onChange={(e) => {
                        onChange(e.target.checked);
                        handleChecked(e.target.checked, fieldName);
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
                  onChange={(e) => {
                    onChange(e);
                    handleDate(e, fieldName);
                  }}
                  rounded={false}
                  minWidth={100}
                  nonEditable={nonEditableField}
                  error={error}
                  dateWithTime={false}
                />
              ) : fieldType === 'select' ? (
                fieldSelectSearch ? (
                  <SelectSearch
                    selectLabel={t(`${fieldName}`, { ns: [translation] })}
                    selectValue={value}
                    onSelect={(e) => {
                      onChange(e);
                      handleSelect(e, fieldName);
                    }}
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
                    onSelect={(e) => {
                      onChange(e);
                      handleSelect(e, fieldName);
                    }}
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
                  onChange={(e) => {
                    onChange(e.target.value);
                    handleTyping(e.target.value, fieldName);
                  }}
                  fullWidth
                  variant="standard"
                  disabled={disabled || nonEditableField}
                  InputLabelProps={{ required: requiredField }}
                  InputProps={{
                    inputComponent: fieldType === 'numeric' || fieldType === 'currency' ? (NumericFormatCustom as any) : undefined,
                  }}
                />
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
            return fieldType === 'select' ? (
              fieldSelectSearch ? (
                <SelectSearch
                  selectLabel={t(`${fieldName}`, { ns: [translation] })}
                  selectValue={value}
                  onSelect={(e) => {
                    onChange(e);
                    handleJsonData(e, fieldName, inputIndex);
                  }}
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
                  onSelect={(e) => {
                    onChange(e);
                    handleJsonData(e, fieldName, inputIndex);
                  }}
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
                onChange={(e) => {
                  onChange(e.target.value);
                  handleJsonData(e.target.value, fieldName, inputIndex);
                }}
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
    onJsonData();
  };

  return (
    <>
      <div className={` flex h-[calc(100%-${appHeight}px)] w-[100%] top-[calc(${appHeight}px)] `}>
        <Box sx={{ m: 3 }}>
          <div className="flex justify-between">
            <div className="flex justify-start gap-9 mr-7 mb-3 ">
              <Button onClick={handleCancelModal}>
                <span className="bg-transparent text-red-500 px-4 border border-red-500 hover:bg-red-500 hover:text-white hover:border-transparent py-0 hover:scale-125 rounded-full">
                  {t('cancel', { ns: [translation] })}
                </span>
              </Button>

              {disableCreate === undefined || disableCreate === false ? (
                <>
                  <Button type="submit" form="hook-form" id="0">
                    <span className="bg-transparent text-sky-600 px-4 border border-sky-600 hover:bg-sky-600 hover:text-white hover:border-transparent py-0 hover:scale-125 rounded-full">
                      {submitText}
                    </span>
                  </Button>
                </>
              ) : (
                <></>
              )}
            </div>
            <div className="justify-end">
              <FormControlLabel control={<Switch checked={showPdf} onChange={handleShowPdf} inputProps={{ 'aria-label': 'controlled' }} />} label={t('showPdf', { ns: [translation] })} />
            </div>
          </div>

          <Box sx={{ display: 'flex', flexDirection: 'column', width: '60vw', maxHeight: 'calc(90vh - 100px)', overflow: 'auto', mt: 1 }}>
            <div className="flex items-center justify-center text-2xl">{modalTitle}</div>
            <div>
              <Zoom in={true} style={{ transitionDelay: openModal ? '100ms' : '0ms' }} timeout={700}>
                {disableCreate ? (
                  <span className="flex items-center justify-center text-2xl">{t('cannotCreate', { ns: ['invoice'] })}</span>
                ) : (
                  <form id="hook-form" ref={formRef} onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex items-center justify-center pb-5">{contentText}</div>

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
            </div>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', width: '40vw', height: 'calc(100vh - 100px)', overflow: 'auto', mt: 3, mx: 1 }}>
          {showPdf && (
            <div>
              <Zoom in={true} style={{ transitionDelay: openModal ? '100ms' : '0ms' }} timeout={700}>
                <div ref={viewerRef} />
              </Zoom>
            </div>
          )}
        </Box>
      </div>
    </>
  );
};

export default InvoiceModal;
