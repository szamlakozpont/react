import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type TableState = {
  rowId: string;
  rowCustom: object;
  rowCustom_: object;
  isItemModalOpen: boolean;
  isPartnersListModalOpen: boolean;
  isInvoicesListModalOpen: boolean;
  isInvoiceJsonListModalOpen: boolean;
  isInvoiceNumbersListModalOpen: boolean;
  isPdfSchemaJsonListModalOpen: boolean;
  isEmailSentLogJsonListModalOpen: boolean;
  isEmailErrorLogJsonListModalOpen: boolean;
  isEmailLoginJsonListModalOpen: boolean;
  isEmailDataJsonListModalOpen: boolean;
  isPdfSchemaSuppliersModalOpen: boolean;
  isBulkCreateModalOpen: boolean;
  isBulkCreatePartnersModalOpen: boolean;
  isBulkCreateSuppliersModalOpen: boolean;
  isSupplierCreateModalOpen: boolean;
  isSupplierEditModalOpen: boolean;
  isSupplierDeleteModalOpen: boolean;
  isPartnerCreateModalOpen: boolean;
  isPartnerEditModalOpen: boolean;
  isPartnerDeleteModalOpen: boolean;
  isUserCreateModalOpen: boolean;
  isUserEditModalOpen: boolean;
  isUserDeleteModalOpen: boolean;
  isInvoiceCreateModalOpen: boolean;
  isInvoiceEditModalOpen: boolean;
  isInvoiceDeleteModalOpen: boolean;
  isBulkInvoiceCreateModalOpen: boolean;
  isBulkInvoiceEditModalOpen: boolean;
  isBulkInvoiceDeleteModalOpen: boolean;
  isCustomerCreateModalOpen: boolean;
  isCustomerEditModalOpen: boolean;
  isCustomerDeleteModalOpen: boolean;
  isInvoiceNumberCreateModalOpen: boolean;
  isInvoiceNumberEditModalOpen: boolean;
  isInvoiceNumberDeleteModalOpen: boolean;
  isBulkInvoiceImportModalOpen: boolean;
  isPdfSchemaCreateModalOpen: boolean;
  isPdfSchemaEditModalOpen: boolean;
  isPdfSchemaDeleteModalOpen: boolean;
  chosenSuppliersIds: string[];
  chosenSuppliersNames: string[];
  isChosenSuppliersModalInit: boolean;
  pdfschemaName: string;
  pdfschemaSuppliers: string[];
  isPdfSchemaDefaultModalOpen: boolean;
  isDefaultPdfSchemaModalInit: boolean;
  chosenDefaultSuppliersIds: string[];
  chosenDefaultSuppliersNames: string[];
  isInvoiceRecipientsListModalOpen: boolean;
  isInvoiceAttachmentsListModalOpen: boolean;
  isInvoceAttachmentSignatureListModalOpen: boolean;
  isMapModalOpen: boolean;
};

const initialState: TableState = {
  rowId: '',
  rowCustom: {},
  rowCustom_: {},
  isItemModalOpen: false,
  isPartnersListModalOpen: false,
  isInvoicesListModalOpen: false,
  isInvoiceJsonListModalOpen: false,
  isInvoiceNumbersListModalOpen: false,
  isPdfSchemaJsonListModalOpen: false,
  isEmailSentLogJsonListModalOpen: false,
  isEmailErrorLogJsonListModalOpen: false,
  isEmailLoginJsonListModalOpen: false,
  isEmailDataJsonListModalOpen: false,
  isPdfSchemaSuppliersModalOpen: false,
  isBulkCreateModalOpen: false,
  isBulkCreatePartnersModalOpen: false,
  isBulkCreateSuppliersModalOpen: false,
  isSupplierCreateModalOpen: false,
  isSupplierEditModalOpen: false,
  isSupplierDeleteModalOpen: false,
  isPartnerCreateModalOpen: false,
  isPartnerEditModalOpen: false,
  isPartnerDeleteModalOpen: false,
  isUserCreateModalOpen: false,
  isUserEditModalOpen: false,
  isUserDeleteModalOpen: false,
  isInvoiceCreateModalOpen: false,
  isInvoiceEditModalOpen: false,
  isInvoiceDeleteModalOpen: false,
  isBulkInvoiceCreateModalOpen: false,
  isBulkInvoiceEditModalOpen: false,
  isBulkInvoiceDeleteModalOpen: false,
  isCustomerCreateModalOpen: false,
  isCustomerEditModalOpen: false,
  isCustomerDeleteModalOpen: false,
  isInvoiceNumberCreateModalOpen: false,
  isInvoiceNumberEditModalOpen: false,
  isInvoiceNumberDeleteModalOpen: false,
  isBulkInvoiceImportModalOpen: false,
  isPdfSchemaCreateModalOpen: false,
  isPdfSchemaEditModalOpen: false,
  isPdfSchemaDeleteModalOpen: false,
  chosenSuppliersIds: [],
  chosenSuppliersNames: [],
  isChosenSuppliersModalInit: false,
  pdfschemaName: '',
  pdfschemaSuppliers: [],
  isPdfSchemaDefaultModalOpen: false,
  isDefaultPdfSchemaModalInit: false,
  chosenDefaultSuppliersIds: [],
  chosenDefaultSuppliersNames: [],
  isInvoiceRecipientsListModalOpen: false,
  isInvoiceAttachmentsListModalOpen: false,
  isInvoceAttachmentSignatureListModalOpen: false,
  isMapModalOpen: false,
};

const tableSlice = createSlice({
  name: 'table',
  initialState,
  reducers: {
    setRowId(state, action: PayloadAction<string>) {
      state.rowId = action.payload;
    },
    setRowCustom(state, action: PayloadAction<object>) {
      state.rowCustom = action.payload;
    },
    setRowCustom_(state, action: PayloadAction<object>) {
      state.rowCustom_ = action.payload;
    },
    setIsItemModalOpen(state, action: PayloadAction<boolean>) {
      state.isItemModalOpen = action.payload;
    },
    setIsPartnersListModalOpen(state, action: PayloadAction<boolean>) {
      state.isPartnersListModalOpen = action.payload;
    },
    setIsInvoicesListModalOpen(state, action: PayloadAction<boolean>) {
      state.isInvoicesListModalOpen = action.payload;
    },
    setIsInvoiceJsonListModalOpen(state, action: PayloadAction<boolean>) {
      state.isInvoiceJsonListModalOpen = action.payload;
    },
    setIsInvoiceNumbersListModalOpen(state, action: PayloadAction<boolean>) {
      state.isInvoiceNumbersListModalOpen = action.payload;
    },
    setIsPdfSchemaJsonListModalOpen(state, action: PayloadAction<boolean>) {
      state.isPdfSchemaJsonListModalOpen = action.payload;
    },
    setIsEmailSentLogJsonListModalOpen(state, action: PayloadAction<boolean>) {
      state.isEmailSentLogJsonListModalOpen = action.payload;
    },
    setIsEmailErrorLogJsonListModalOpen(state, action: PayloadAction<boolean>) {
      state.isEmailErrorLogJsonListModalOpen = action.payload;
    },
    setIsEmailLoginJsonListModalOpen(state, action: PayloadAction<boolean>) {
      state.isEmailLoginJsonListModalOpen = action.payload;
    },
    setIsEmailDataJsonListModalOpen(state, action: PayloadAction<boolean>) {
      state.isEmailDataJsonListModalOpen = action.payload;
    },
    setIsPdfSchemaSuppliersModalOpen(state, action: PayloadAction<boolean>) {
      state.isPdfSchemaSuppliersModalOpen = action.payload;
    },
    setIsBulkCreateModalOpen(state, action: PayloadAction<boolean>) {
      state.isBulkCreateModalOpen = action.payload;
    },
    setIsBulkCreatePartnersModalOpen(state, action: PayloadAction<boolean>) {
      state.isBulkCreatePartnersModalOpen = action.payload;
    },
    setIsBulkCreateSuppliersModalOpen(state, action: PayloadAction<boolean>) {
      state.isBulkCreateSuppliersModalOpen = action.payload;
    },
    setIsSupplierCreateModalOpen(state, action: PayloadAction<boolean>) {
      state.isSupplierCreateModalOpen = action.payload;
    },
    setIsSupplierEditModalOpen(state, action: PayloadAction<boolean>) {
      state.isSupplierEditModalOpen = action.payload;
    },
    setIsSupplierDeleteModalOpen(state, action: PayloadAction<boolean>) {
      state.isSupplierDeleteModalOpen = action.payload;
    },
    setIsPartnerCreateModalOpen(state, action: PayloadAction<boolean>) {
      state.isPartnerCreateModalOpen = action.payload;
    },
    setIsPartnerEditModalOpen(state, action: PayloadAction<boolean>) {
      state.isPartnerEditModalOpen = action.payload;
    },
    setIsPartnerDeleteModalOpen(state, action: PayloadAction<boolean>) {
      state.isPartnerDeleteModalOpen = action.payload;
    },
    setIsUserCreateModalOpen(state, action: PayloadAction<boolean>) {
      state.isUserCreateModalOpen = action.payload;
    },
    setIsUserEditModalOpen(state, action: PayloadAction<boolean>) {
      state.isUserEditModalOpen = action.payload;
    },
    setIsUserDeleteModalOpen(state, action: PayloadAction<boolean>) {
      state.isUserDeleteModalOpen = action.payload;
    },
    setIsInvoiceCreateModalOpen(state, action: PayloadAction<boolean>) {
      state.isInvoiceCreateModalOpen = action.payload;
    },
    setIsInvoiceEditModalOpen(state, action: PayloadAction<boolean>) {
      state.isInvoiceEditModalOpen = action.payload;
    },
    setIsInvoiceDeleteModalOpen(state, action: PayloadAction<boolean>) {
      state.isInvoiceDeleteModalOpen = action.payload;
    },
    setIsBulkInvoiceCreateModalOpen(state, action: PayloadAction<boolean>) {
      state.isBulkInvoiceCreateModalOpen = action.payload;
    },
    setIsBulkInvoiceEditModalOpen(state, action: PayloadAction<boolean>) {
      state.isBulkInvoiceEditModalOpen = action.payload;
    },
    setIsBulkInvoiceDeleteModalOpen(state, action: PayloadAction<boolean>) {
      state.isBulkInvoiceDeleteModalOpen = action.payload;
    },
    setIsCustomerCreateModalOpen(state, action: PayloadAction<boolean>) {
      state.isCustomerCreateModalOpen = action.payload;
    },
    setIsCustomerEditModalOpen(state, action: PayloadAction<boolean>) {
      state.isCustomerEditModalOpen = action.payload;
    },
    setIsCustomerDeleteModalOpen(state, action: PayloadAction<boolean>) {
      state.isCustomerDeleteModalOpen = action.payload;
    },
    setIsInvoiceNumberCreateModalOpen(state, action: PayloadAction<boolean>) {
      state.isInvoiceNumberCreateModalOpen = action.payload;
    },
    setIsInvoiceNumberEditModalOpen(state, action: PayloadAction<boolean>) {
      state.isInvoiceNumberEditModalOpen = action.payload;
    },
    setIsInvoiceNumberDeleteModalOpen(state, action: PayloadAction<boolean>) {
      state.isInvoiceNumberDeleteModalOpen = action.payload;
    },
    setIsBulkInvoiceImportModalOpen(state, action: PayloadAction<boolean>) {
      state.isBulkInvoiceImportModalOpen = action.payload;
    },
    setIsPdfSchemaCreateModalOpen(state, action: PayloadAction<boolean>) {
      state.isPdfSchemaCreateModalOpen = action.payload;
    },
    setIsPdfSchemaEditModalOpen(state, action: PayloadAction<boolean>) {
      state.isPdfSchemaEditModalOpen = action.payload;
    },
    setIsPdfSchemaDeleteModalOpen(state, action: PayloadAction<boolean>) {
      state.isPdfSchemaDeleteModalOpen = action.payload;
    },
    setChosenSuppliersIds(state, action: PayloadAction<string[]>) {
      state.chosenSuppliersIds = action.payload;
    },
    setChosenSuppliersNames(state, action: PayloadAction<string[]>) {
      state.chosenSuppliersNames = action.payload;
    },
    setIsChosenSuppliersModalInit(state, action: PayloadAction<boolean>) {
      state.isChosenSuppliersModalInit = action.payload;
    },
    setPdfSchemaName(state, action: PayloadAction<string>) {
      state.pdfschemaName = action.payload;
    },
    setPdfSchemaSuppliers(state, action: PayloadAction<string[]>) {
      state.pdfschemaSuppliers = action.payload;
    },
    setIsPdfSchemaDefaultModalOpen(state, action: PayloadAction<boolean>) {
      state.isPdfSchemaDefaultModalOpen = action.payload;
    },
    setIsDefaultPdfSchemaModalInit(state, action: PayloadAction<boolean>) {
      state.isDefaultPdfSchemaModalInit = action.payload;
    },
    setChosenDefaultSuppliersIds(state, action: PayloadAction<string[]>) {
      state.chosenDefaultSuppliersIds = action.payload;
    },
    setChosenDefaultSuppliersNames(state, action: PayloadAction<string[]>) {
      state.chosenDefaultSuppliersNames = action.payload;
    },
    setIsInvoiceRecipientsListModalOpen(state, action: PayloadAction<boolean>) {
      state.isInvoiceRecipientsListModalOpen = action.payload;
    },
    setIsInvoiceAttachmentsListModalOpen(state, action: PayloadAction<boolean>) {
      state.isInvoiceAttachmentsListModalOpen = action.payload;
    },
    setIsInvoiceAttachmentSignatureListModalOpen(state, action: PayloadAction<boolean>) {
      state.isInvoceAttachmentSignatureListModalOpen = action.payload;
    },
    setIsMapModalOpen(state, action: PayloadAction<boolean>) {
      state.isMapModalOpen = action.payload;
    },
  },
});

export const tableActions = tableSlice.actions;

export default tableSlice.reducer;
