import { request } from '../request';

export function getWorkOrderInfos(workorders: string[]) {
  return request<Api.ChangeOver.WorkOrderInfos>({
    url: '/GetWorkOrderInfos',
    method: 'post',
    data: workorders
  });
}
