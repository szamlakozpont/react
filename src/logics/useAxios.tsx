import React from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { useReduxSelector } from '../store/Store';

export type ResponseType = 'arraybuffer' | 'blob' | 'document' | 'json' | 'text' | 'stream';

export const useAxios = () => {
  const { t } = useTranslation(['home']);
  const token = useReduxSelector((state) => state.auth.token);

  const apiService = async (props: { url: string; method: string; data?: string; responseType?: string; returnErrorData?: boolean }) => {
    const { url, method, data, responseType, returnErrorData } = props;
    const body = data ? data : null;
    try {
      if (!responseType) {
        const response = await axios({
          method: method,
          url: url,
          data: method === 'DELETE' ? { data: body } : body,
          headers: token
            ? {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              }
            : {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
        });
        const data = await response.data;
        return data;
      } else {
        const response = await axios({
          method: method,
          url: url,
          data: method === 'DELETE' ? { data: body } : body,
          headers: token
            ? {
                Accept: 'application/json, text/plain, */*',
                'Content-Type': 'application/json, application/octet-stream',
                Authorization: `Bearer ${token}`,
              }
            : {
                Accept: 'application/json, text/plain, */*',
                'Content-Type': 'application/json, application/octet-stream',
              },

          responseType: responseType as ResponseType,
        });

        const data = await response.data;
        return data;
      }
    } catch (err: any) {
      if (err.response.data.error) {
        toast.error(err.response.data.error);
        if (returnErrorData) return err.response.data;
      } else if (err.message) {
        toast.error(err.message);
      } else if (err.request) {
        toast.error(err.request.responseText);
      } else {
        throw new Error(`${t('axiosFailed', { ns: ['user'] })}`);
      }
    }
  };
  return { apiService };
};
