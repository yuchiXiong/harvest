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

interface IGetBillsResponse {
  recordedAtByMonth: string,
  bills: IBill[]
}

/**
 * @description 拉取用户账目数据
 * @param {String} date - 拉取时间
 */
const getBills: (date: string) => Promise<IStandardResponse<IGetBillsResponse>> = date => request({
  url: `${HOST}/bills`,
  method: 'GET',
  data: {
    date,
  }
});

export default {
  getBills
}