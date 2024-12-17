import React from 'react';
import { API_AUTH, API_BULKDELETE, API_DATA, API_USER_SIGN_IN, API_USER_SIGN_IN_TFA, API_USER_SIGN_OUT } from '../utils/variables';
import { useAxios } from './useAxios';
import { User } from '../store/appSlices/AuthSlice';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { passwordFieldsProps } from '../components/fields/user/passwordFields';
import { UserProfileProps } from '../components/fields/user/profileFields';

export type LogoutData = {
  name?: string;
  email?: string;
  refresh_token: string | null;
};

export type SignInTFAData = {
  id: string;
  name: string;
  email: string;
  password: string;
  code: string;
};

export const useAPI = () => {
  const { apiService } = useAxios();

  const userSignIn = async (data: User) => {
    try {
      return await apiService({ url: API_AUTH + API_USER_SIGN_IN, method: 'POST', data: JSON.stringify(data) });
    } catch (error) {
      const err = error as AxiosError;
      toast.error(`${err.response?.statusText}`);
    }
  };

  const userSignInTFA = async (data: SignInTFAData) => {
    try {
      return await apiService({ url: API_AUTH + API_USER_SIGN_IN_TFA, method: 'POST', data: JSON.stringify(data), returnErrorData: true });
    } catch (error) {
      const err = error as AxiosError;
      toast.error(`${err.response?.statusText}`);
    }
  };

  const userSignOut = async (data: LogoutData) => {
    try {
      return await apiService({ url: API_AUTH + API_USER_SIGN_OUT, method: 'POST', data: JSON.stringify(data) });
    } catch (error) {
      const err = error as AxiosError;
      toast.error(`${err.response?.statusText}`);
    }
  };

  const userSignUp = async (x: string, data: User) => {
    try {
      return await apiService({ url: API_AUTH + `/signup/${x}`, method: 'POST', data: JSON.stringify(data) });
    } catch (error) {
      const err = error as AxiosError;
      toast.error(`${err.response?.statusText}`);
    }
  };

  const userUpdateProfile = async (data: UserProfileProps) => {
    try {
      return await apiService({ url: API_AUTH + '/updateprofile', method: 'PATCH', data: JSON.stringify(data) });
    } catch (error) {
      const err = error as AxiosError;
      toast.error(`${err.response?.statusText}`);
    }
  };

  const userUpdatePassword = async (data: passwordFieldsProps) => {
    try {
      return await apiService({ url: API_AUTH + '/updatepassword', method: 'PATCH', data: JSON.stringify(data) });
    } catch (error) {
      const err = error as AxiosError;
      toast.error(`${err.response?.statusText}`);
    }
  };

  const createData = async (api: string, data: any) => {
    try {
      const response = await apiService({ url: api, method: 'POST', data: JSON.stringify(data) });
      toast.success(`${response.message}`);
      return response;
    } catch (error) {
      const err = error as AxiosError;
    }
  };

  const updateData = async (api: string, data: any) => {
    try {
      const response = await apiService({ url: api, method: 'PATCH', data: JSON.stringify(data) });
      toast.success(`${response.message}`);
      return response;
    } catch (error) {
      const err = error as AxiosError;
    }
  };

  const deleteData = async (api: string) => {
    try {
      const response = await apiService({ url: api, method: 'DELETE' });
      toast.success(`${response.message}`);
      return response;
    } catch (error) {
      const err = error as AxiosError;
    }
  };

  const deleteBulkData = async (data: string[], dataName: string) => {
    try {
      const response = await apiService({ url: `${API_DATA}${API_BULKDELETE}/${dataName}/`, method: 'DELETE', data: JSON.stringify(data) });
      toast.success(`${response.message}`);
      return response;
    } catch (error) {
      const err = error as AxiosError;
    }
  };

  const createBulkData = async (data: string, apiLink: string, arg?: number) => {
    try {
      const response = await apiService({ url: `${API_DATA + apiLink}`, method: 'POST', data: JSON.stringify({ number: data, arg: arg?.toString() }) });
      toast.success(`${response.message}`);
      return response;
    } catch (error) {
      const err = error as AxiosError;
    }
  };

  const listIdData = async (id: string) => {
    try {
      const response = await apiService({ url: `${API_DATA}/${id}`, method: 'GET' });
      return response;
    } catch (error) {
      const err = error as AxiosError;
    }
  };

  return {
    userSignIn,
    userSignOut,
    userSignInTFA,
    userSignUp,
    userUpdateProfile,
    userUpdatePassword,
    createData,
    updateData,
    deleteData,
    deleteBulkData,
    createBulkData,
    listIdData,
  };
};
