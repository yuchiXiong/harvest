import { useState, useEffect } from 'react';
import Taro from '@tarojs/taro';
import { ScrollView } from '@tarojs/components';
import { AtCard, AtList, AtListItem } from 'taro-ui';
import { CalendarThirtyTwo } from '@icon-park/react';
import dayjs from 'dayjs';
import { IBill } from '../../api/bill';
import API from '../../api';
import styles from './index.module.scss';

const IndexPage = () => {

  const [bills, setBills] = useState<IBill[]>([]);
  const [month, setMonth] = useState<string>(dayjs().format('YYYY年M月'));

  useEffect(() => {
    fetchMore();
  }, []);

  const fetchMore = () => {
    API.getBills(dayjs().format('YYYY-MM-DD')).then(res => {
      if (!res.errorMessage) {
        setBills([...bills.concat(res.data.bills)]);
        setMonth(dayjs(res.data.recordedAtByMonth).format('YYYY年M月'));
        Taro.setNavigationBarTitle({
          title: dayjs(res.data.recordedAtByMonth).format('YYYY年M月')
        })
      }
    });
  }

  const scrollStyle = {
    height: '100vh'
  }

  return <ScrollView
    onScrollToLower={fetchMore}
    onScrollToUpper={() => { }}
    scrollY
    scrollTop={0}
    style={scrollStyle}
    refresherThreshold={100}
  >

    <AtList>
      {
        bills.map(item => <>
          <AtCard
            title={month}
            renderIcon={
              <CalendarThirtyTwo theme="multi-color" size="24" fill={['#333', '#ff8ca0', '#FFF', '#43CCF8']} />
            }
            isFull={true}
            className={styles.title}
          />
          <AtListItem key={item.id}
            title={item.description}
            note={dayjs(item.recordedAt).format('YYYY-MM-DD')}
            extraText={`${item.inOrOut === 1 ? '-' : '+'} ${Number(item.amount).toFixed(2)}`}
            arrow={null}
            thumb='http://img12.360buyimg.com/jdphoto/s72x72_jfs/t10660/330/203667368/1672/801735d7/59c85643N31e68303.png'
          />
        </>)
      }
    </AtList>

  </ScrollView>
};

export default IndexPage;