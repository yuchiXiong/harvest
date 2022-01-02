import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import Taro from '@tarojs/taro';
import { AtList, AtListItem } from 'taro-ui';
import request from '../../utils/request';

import 'taro-ui/dist/style/index.scss';
import './index.scss'

interface IBill {
  amount: string,
  category: number,
  description: string,
  id: number
  in_or_out: number
  recorded_at: string
}


const IndexPage = () => {

  const [bills, setBills] = useState<IBill[]>([]);

  useEffect(() => {
    request({
      url: 'http://localhost:3000/bills',
      header: {
        'access-token': Taro.getStorageSync('harvest:jwt')
      },
      success: res => {
        setBills(res.data.data);
      }
    });
    // Taro.getUserInfo({
    //   success: res => {
    //     console.log(res);
    //   }
    // })
  }, []);

  return <AtList>
    {
      bills.map(item => <AtListItem key={item.id}
        title={item.description}
        note={dayjs(item.recorded_at).format('YYYY-MM-DD')}
        extraText={`${item.in_or_out === 1 ? '-' : '+'} ${item.amount}`}
        arrow={null}
        thumb='http://img12.360buyimg.com/jdphoto/s72x72_jfs/t10660/330/203667368/1672/801735d7/59c85643N31e68303.png'
      />)
    }
  </AtList>
};

export default IndexPage;