import { useAuthStore } from '@/store/modules/auth';
import { localStg } from '@/utils/storage';
import { fetchRefreshToken } from '../api';
import type { RequestInstanceState } from './type';

/**
 * 从本地存储中获取 token，并返回带有 Bearer 前缀的授权头格式（如果 token 存在).为需要授权的 API 请求提供 Authorization 头部信息。
 *
 * @returns 如果 token 不存在，返回 null。
 */
export function getAuthorization() {
  const token = localStg.get('token'); // 从本地存储中获取 token。
  const Authorization = token ? `Bearer ${token}` : null; // 拼接 Bearer 格式。
  return Authorization; // 返回 Authorization。
}

/**
 * 使用 refreshToken 向服务器请求新的 token 和 refreshToken。 如果刷新成功，更新本地存储中的令牌；如果失败，重置用户登录状态 自动刷新令牌，确保用户的访问令牌有效，避免频繁重新登录。
 *
 * @returns 刷新成功返回true 失败返回flase
 */
async function handleRefreshToken() {
  const { resetStore } = useAuthStore(); // 从 AuthStore 中解构出重置状态的方法。
  const rToken = localStg.get('refreshToken') || ''; // 从本地存储获取 refreshToken。

  const { error, data } = await fetchRefreshToken(rToken); // 调用 API 刷新令牌。
  if (!error) {
    localStg.set('token', data.token); // 成功时，更新 token。
    localStg.set('refreshToken', data.refreshToken); // 更新 refreshToken。
    return true; // 返回刷新成功标志。
  }

  resetStore(); // 刷新失败时，重置用户状态（例如退出登录）。
  return false; // 返回刷新失败标志。
}

/**
 * 在令牌过期的情况下，调用刷新令牌逻辑，并对多个请求共享刷新操作（避免重复刷新）
 *
 * @param state
 * @returns
 */
export async function handleExpiredRequest(state: RequestInstanceState) {
  if (!state.refreshTokenFn) {
    state.refreshTokenFn = handleRefreshToken(); // 如果当前没有刷新操作，则开始刷新。
  }

  const success = await state.refreshTokenFn; // 等待刷新完成。

  setTimeout(() => {
    state.refreshTokenFn = null; // 1 秒后清空刷新状态。
  }, 1000);

  return success; // 返回刷新是否成功的结果。
}

/**
 * 用于显示错误消息，同时管理错误消息队列，避免重复显示相同消息。
 *
 * @param state
 * @param message
 */
export function showErrorMsg(state: RequestInstanceState, message: string) {
  if (!state.errMsgStack?.length) {
    state.errMsgStack = []; // 初始化错误消息栈。
  }

  const isExist = state.errMsgStack.includes(message); // 检查消息是否已存在。
  if (!isExist) {
    state.errMsgStack.push(message); // 如果不存在，添加消息。
    window.$message?.error(message, {
      // 调用消息提示框显示错误消息。
      onLeave: () => {
        state.errMsgStack = state.errMsgStack.filter(msg => msg !== message); // 消息离开后从栈中移除。
        setTimeout(() => {
          state.errMsgStack = []; // 延迟清空栈，防止频繁弹出。
        }, 5000);
      }
    });
  }
}
