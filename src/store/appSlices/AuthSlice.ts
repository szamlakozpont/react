import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type User = {
  id?: string;
  name?: string;
  email?: string;
  password?: string;
  type?: string;
  isStaff?: boolean;
  isSuperuser?: boolean;
  isActive?: boolean;
  hasTFA?: string;
  isTFAVerified?: boolean;
  dateJoined?: string;
  lastLogin?: string;
};

export type ProfileSupport = {
  firstName?: string;
  lastName?: string;
  customEmail?: string;
  supplierId?: string;
  supplierName?: string;
  language?: string;
  phone?: string;
};

export type ProfileSupplier = {
  firstName?: string;
  lastName?: string;
  customEmail?: string;
  supplierId?: string;
  supplierName?: string;
  language?: string;
  phone?: string;
};

export type ProfileCustomer = {
  firstName?: string;
  lastName?: string;
  customEmail?: string;
  language?: string;
  phone?: string;
};

export type UserProfile = ProfileSupport & ProfileSupplier & ProfileCustomer;

type AuthState = {
  isSignedIn: boolean;
  token: string | null;
  refreshToken: string | null;
  user: User;
  profileSupport: ProfileSupport;
  profileSupplier: ProfileSupplier;
  profileCustomer: ProfileCustomer;
};

const data = '';
const hasData = false;

const initialState: AuthState = {
  isSignedIn: false,
  token: null,
  refreshToken: null,
  user: {
    id: hasData ? JSON.parse(data).id : '',
    name: hasData ? JSON.parse(data).name : '',
    email: hasData ? JSON.parse(data).email : '',
    password: hasData ? JSON.parse(data).password : '',
    type: hasData ? JSON.parse(data).type : '',
    isStaff: hasData ? JSON.parse(data).is_staff : '',
    isSuperuser: hasData ? JSON.parse(data).is_superuser : '',
    isActive: hasData ? JSON.parse(data).is_active : '',
    hasTFA: hasData ? JSON.parse(data).has_tfa : '',
    isTFAVerified: hasData ? JSON.parse(data).is_tfa_verified : '',
    dateJoined: hasData ? JSON.parse(data).date_joined : '',
    lastLogin: hasData ? JSON.parse(data).last_login : '',
  },

  profileSupport: {
    firstName: '',
    lastName: '',
    customEmail: '',
    supplierId: '',
    supplierName: '',
    language: '',
    phone: '',
  },

  profileSupplier: {
    firstName: '',
    lastName: '',
    customEmail: '',
    supplierId: '',
    supplierName: '',
    language: '',
    phone: '',
  },

  profileCustomer: {
    firstName: '',
    lastName: '',
    customEmail: '',
    language: '',
    phone: '',
  },
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setIsSignedIn(state, action: PayloadAction<boolean>) {
      state.isSignedIn = action.payload;
    },
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
    },
    setRefreshToken(state, action: PayloadAction<string>) {
      state.refreshToken = action.payload;
    },

    setUserId(state, action: PayloadAction<string>) {
      state.user.id = action.payload;
    },
    setUserName(state, action: PayloadAction<string>) {
      state.user.name = action.payload;
    },
    setUserEmail(state, action: PayloadAction<string>) {
      state.user.email = action.payload;
    },
    setUserPassword(state, action: PayloadAction<string>) {
      state.user.password = action.payload;
    },
    setUserType(state, action: PayloadAction<string>) {
      state.user.type = action.payload;
    },
    setUserIsStaff(state, action: PayloadAction<boolean>) {
      state.user.isStaff = action.payload;
    },
    setUserIsSuperuser(state, action: PayloadAction<boolean>) {
      state.user.isSuperuser = action.payload;
    },
    setUserIsActive(state, action: PayloadAction<boolean>) {
      state.user.isActive = action.payload;
    },
    setUserHasTFA(state, action: PayloadAction<string>) {
      state.user.hasTFA = action.payload;
    },
    setUserIsTFAVerified(state, action: PayloadAction<boolean>) {
      state.user.isTFAVerified = action.payload;
    },
    setUserDateJoined(state, action: PayloadAction<string>) {
      state.user.dateJoined = action.payload;
    },
    setUserLastLogin(state, action: PayloadAction<string>) {
      state.user.lastLogin = action.payload;
    },

    setProfileSupportFirstName(state, action: PayloadAction<string>) {
      state.profileSupport.firstName = action.payload;
    },
    setProfileSupportLastName(state, action: PayloadAction<string>) {
      state.profileSupport.lastName = action.payload;
    },
    setProfileSupportCustomEmail(state, action: PayloadAction<string>) {
      state.profileSupport.customEmail = action.payload;
    },
    setProfileSupportSupplierId(state, action: PayloadAction<string>) {
      state.profileSupport.supplierId = action.payload;
    },
    setProfileSupportSupplierName(state, action: PayloadAction<string>) {
      state.profileSupport.supplierName = action.payload;
    },
    setProfileSupportLanguage(state, action: PayloadAction<string>) {
      state.profileSupport.language = action.payload;
    },
    setProfileSupportPhone(state, action: PayloadAction<string>) {
      state.profileSupport.phone = action.payload;
    },

    setProfileSupplierFirstName(state, action: PayloadAction<string>) {
      state.profileSupplier.firstName = action.payload;
    },
    setProfileSupplierLastName(state, action: PayloadAction<string>) {
      state.profileSupplier.lastName = action.payload;
    },
    setProfileSupplierCustomEmail(state, action: PayloadAction<string>) {
      state.profileSupplier.customEmail = action.payload;
    },
    setProfileSupplierSupplierId(state, action: PayloadAction<string>) {
      state.profileSupplier.supplierId = action.payload;
    },
    setProfileSupplierSupplierName(state, action: PayloadAction<string>) {
      state.profileSupplier.supplierName = action.payload;
    },
    setProfileSupplierLanguage(state, action: PayloadAction<string>) {
      state.profileSupplier.language = action.payload;
    },
    setProfileSupplierPhone(state, action: PayloadAction<string>) {
      state.profileSupplier.phone = action.payload;
    },

    setProfileCustomerFirstName(state, action: PayloadAction<string>) {
      state.profileCustomer.firstName = action.payload;
    },
    setProfileCustomerLastName(state, action: PayloadAction<string>) {
      state.profileCustomer.lastName = action.payload;
    },
    setProfileCustomerCustomEmail(state, action: PayloadAction<string>) {
      state.profileCustomer.customEmail = action.payload;
    },
    setProfileCustomerLanguage(state, action: PayloadAction<string>) {
      state.profileCustomer.language = action.payload;
    },
    setProfileCustomerPhone(state, action: PayloadAction<string>) {
      state.profileCustomer.phone = action.payload;
    },

    logout() {
      return initialState;
    },
  },
});

export const authActions = authSlice.actions;
export default authSlice.reducer;
