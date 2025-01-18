import type { AxiosResponse } from 'axios';
import { BACKEND_ERROR_CODE, createFlatRequest, createRequest } from '@sa/axios';
import { useAuthStore } from '@/store/modules/auth';
import { $t } from '@/locales';
import { localStg } from '@/utils/storage';
import { getServiceBaseURL } from '@/utils/service';
import { getAuthorization, handleExpiredRequest, showErrorMsg } from './shared';
import type { RequestInstanceState } from './type';

// 判断是否为开发环境并且需要使用 HTTP 代理
const isHttpProxy = import.meta.env.DEV && import.meta.env.VITE_HTTP_PROXY === 'Y';
// 获取基础服务 URL 配置
const { baseURL, otherBaseURL } = getServiceBaseURL(import.meta.env, isHttpProxy);

// 创建一个请求实例，用于处理 API 请求
export const request = createFlatRequest<App.Service.Response, RequestInstanceState>(
  {
    baseURL
    // headers: {
    //   apifoxToken: 'XL299LiMEDZ0H5h3A29PxwQXdMJqWyY2' // 自定义 API token
    // }
  },
  {
    // 请求发送前的处理，添加 Authorization 头
    async onRequest(config) {
      const Authorization = getAuthorization();
      Object.assign(config.headers, { Authorization });

      return config;
    },
    // 判断后台返回的响应是否成功
    isBackendSuccess(response) {
      // 如果后台返回的响应码为 "0000"，表示请求成功
      // 若要修改此逻辑，可以在 `.env` 文件中修改 `VITE_SERVICE_SUCCESS_CODE` 的值
      return String(response.data.code) === import.meta.env.VITE_SERVICE_SUCCESS_CODE;
    },
    // 后台响应失败时的处理逻辑
    async onBackendFail(response, instance) {
      const authStore = useAuthStore();
      const responseCode = String(response.data.code);

      // 处理登出操作
      function handleLogout() {
        authStore.resetStore();
      }

      // 清理登出操作
      function logoutAndCleanup() {
        handleLogout();
        window.removeEventListener('beforeunload', handleLogout);

        request.state.errMsgStack = request.state.errMsgStack.filter(msg => msg !== response.data.msg);
      }

      // 如果后台响应码在 `logoutCodes` 中，表示用户需要登出并跳转到登录页面
      const logoutCodes = import.meta.env.VITE_SERVICE_LOGOUT_CODES?.split(',') || [];
      if (logoutCodes.includes(responseCode)) {
        handleLogout();
        return null;
      }

      // 如果后台响应码在 `modalLogoutCodes` 中，表示用户需要通过弹窗提示登出
      const modalLogoutCodes = import.meta.env.VITE_SERVICE_MODAL_LOGOUT_CODES?.split(',') || [];
      if (modalLogoutCodes.includes(responseCode) && !request.state.errMsgStack?.includes(response.data.msg)) {
        request.state.errMsgStack = [...(request.state.errMsgStack || []), response.data.msg];

        // 阻止用户刷新页面
        window.addEventListener('beforeunload', handleLogout);

        window.$dialog?.error({
          title: $t('common.error'),
          content: response.data.msg,
          positiveText: $t('common.confirm'),
          maskClosable: false,
          closeOnEsc: false,
          onPositiveClick() {
            logoutAndCleanup();
          },
          onClose() {
            logoutAndCleanup();
          }
        });

        return null;
      }

      // 如果后台响应码在 `expiredTokenCodes` 中，表示 token 已过期，需要刷新 token
      const expiredTokenCodes = import.meta.env.VITE_SERVICE_EXPIRED_TOKEN_CODES?.split(',') || [];
      if (expiredTokenCodes.includes(responseCode)) {
        const success = await handleExpiredRequest(request.state);
        if (success) {
          const Authorization = getAuthorization();
          Object.assign(response.config.headers, { Authorization });

          // 重新发起请求
          return instance.request(response.config) as Promise<AxiosResponse>;
        }
      }

      return null;
    },
    // 处理后台响应数据
    transformBackendResponse(response) {
      return response.data.data;
    },
    // 请求出错时的处理逻辑
    onError(error) {
      // 请求失败时，显示错误信息

      let message = error.message;
      let backendErrorCode = '';

      // 获取后台的错误信息和错误码
      if (error.code === BACKEND_ERROR_CODE) {
        message = error.response?.data?.msg || message;
        backendErrorCode = String(error.response?.data?.code || '');
      }

      // 如果错误码属于登出错误码，不显示错误信息
      const modalLogoutCodes = import.meta.env.VITE_SERVICE_MODAL_LOGOUT_CODES?.split(',') || [];
      if (modalLogoutCodes.includes(backendErrorCode)) {
        return;
      }

      // 如果 token 已过期，刷新 token 后重新请求，不显示错误信息
      const expiredTokenCodes = import.meta.env.VITE_SERVICE_EXPIRED_TOKEN_CODES?.split(',') || [];
      if (expiredTokenCodes.includes(backendErrorCode)) {
        return;
      }

      // 显示错误信息
      showErrorMsg(request.state, message);
    }
  }
);

// 创建一个演示请求实例，用于获取示例数据
export const demoRequest = createRequest<App.Service.DemoResponse>(
  {
    baseURL: otherBaseURL.demo
  },
  {
    // 请求发送前的处理，设置 token
    async onRequest(config) {
      const { headers } = config;

      const token = localStg.get('token');
      const Authorization = token ? `Bearer ${token}` : null;
      Object.assign(headers, { Authorization });

      return config;
    },
    // 判断后台返回的响应是否成功
    isBackendSuccess(response) {
      // 如果后台返回的响应码为 "200"，表示请求成功
      return response.data.status === '200';
    },
    // 后台响应失败时的处理逻辑
    async onBackendFail(_response) {
      // 如果后台响应码不是 "200"，表示请求失败
      // 例如：token 过期，刷新 token 后重新请求
    },
    // 处理后台响应数据
    transformBackendResponse(response) {
      return response.data.result;
    },
    // 请求出错时的处理逻辑
    onError(error) {
      let message = error.message;

      // 显示后台的错误信息
      if (error.code === BACKEND_ERROR_CODE) {
        message = error.response?.data?.message || message;
      }

      window.$message?.error(message);
    }
  }
);
