import { HOST } from '../config/config';
import request, { IStandardResponse } from '../utils/request';

export interface IBill {
  amount: string,
  category: number,
  description: string,
  id: number,
  inOrOut: number,
  recordedAt: string,
}

/**
 * @description 拉取用户账目数据
 * @param {Number} page - 页码，当前固定每页100条数据
 */
const getBills: (page: number) => Promise<IStandardResponse<{ bills: IBill[] }>> = page => request({
  url: `${HOST}/bills`,
  method: 'GET',
  data: {
    page,
  }
});

export default {
  getBills
}