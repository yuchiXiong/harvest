import { useState, useEffect } from 'react';
import Taro, { usePullDownRefresh, useReachBottom } from '@tarojs/taro';
import { AtCard, AtList, AtListItem } from 'taro-ui';
import { CalendarThirtyTwo } from '@icon-park/react';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import { IBill } from '../../api/bill';
import API from '../../api';
import styles from './index.module.scss';

dayjs.locale('zh-cn');

const IndexPage = () => {

  const [bills, setBills] = useState<IBill[]>([]);
  // const [month, setMonth] = useState<string>(dayjs().format('YYYY年M月'));

  useEffect(() => {
    fetchMore();
  }, []);

  const fetchMore = () => {
    API.getBills(dayjs().subtract(1, 'month').format('YYYY-MM-DD')).then(res => {
      setBills([...bills.concat(res.bills)]);
      // setMonth(dayjs(res.recordedAtByMonth).format('YYYY年M月'));
      Taro.setNavigationBarTitle({
        title: dayjs(res.recordedAtByMonth).format('YYYY年M月')
      })
    }, error => {
      Taro.showToast({
        title: error,
        icon: "none",
        duration: 2000
      });
    });
  }

  // usePullDownRefresh(() => {
  //   console.log('pull')
  // });

  // useReachBottom(() => {
  //   console.log('bottom')
  // });

  /**
   * @description 是否应该展示记录日期的分组标题
   * @param {IBill} item - 当前项 
   * @param {Number} index - 当前项下标
   * @returns {Boolean} 是否应该显示 title
   */
  const shouldIShowTitle: (item: IBill, index: number) => boolean = (item, index) => {
    if (index === 0) { // 如果是第一项则直接返回true
      return true;
    }
    const currentDay = dayjs(item.recordedAt).format('YYYY/MM/DD');
    const preDay = dayjs(bills[index - 1].recordedAt).format('YYYY/MM/DD');
    return currentDay !== preDay;
  }

  const totalAmount: (current: IBill) => string = current => {
    const billGroupByDay = bills.filter(bill => dayjs(bill.recordedAt).format('YYYY/MM/DD') === dayjs(current.recordedAt).format('YYYY/MM/DD'))
    return billGroupByDay.reduce((result, item) => result += Number(item.amount) * (item.inOrOut === 1 ? -1 : 1), 0).toFixed(2);
  }

  return <AtList>
    {
      bills.map((item, index) => <>
        {
          shouldIShowTitle(item, index) && <AtCard
            title={dayjs(item.recordedAt).format('YYYY/MM/DD dddd')}
            renderIcon={
              <CalendarThirtyTwo theme="multi-color" size="24" fill={['#333', '#ff8ca0', '#FFF', '#43CCF8']} />
            }
            extra={totalAmount(item)}
            isFull={true}
            className={styles.title}
          />
        }
        <AtListItem key={item.id}
          title={item.description}
          extraText={`${item.inOrOut === 1 ? '-' : '+'} ${Number(item.amount).toFixed(2)}`}
          arrow={null}
          thumb='http://img12.360buyimg.com/jdphoto/s72x72_jfs/t10660/330/203667368/1672/801735d7/59c85643N31e68303.png'
        />
      </>)
    }
  </AtList>

};

export default IndexPage;
