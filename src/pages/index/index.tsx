import { useState, useEffect, useRef } from 'react';
import { ScrollView } from '@tarojs/components';
import dayjs from 'dayjs';
import { AtList, AtListItem } from 'taro-ui';
import bill, { IBill } from '../../api/bill';
import API from '../../api';

import 'taro-ui/dist/style/index.scss';
import './index.scss'


const IndexPage = () => {

  const pageRef = useRef<number>(1);
  const [bills, setBills] = useState<IBill[]>([]);

  useEffect(() => {
    fetchMore();
  }, []);

  const fetchMore = () => {
    API.getBills(pageRef.current).then(res => {
      if (!res.errorMessage) {
        setBills([...bills.concat(res.data.bills)]);
        pageRef.current += 1;
      }
    });
  }

  const scrollStyle = {
    height: '100vh'
  }

  return <ScrollView
    onScrollToLower={fetchMore}
    scrollY
    scrollTop={0}
    style={scrollStyle}
    refresherThreshold={100}
  >
    <AtList>
      {
        bills.map(item => <AtListItem key={item.id}
          title={item.description}
          note={dayjs(item.recordedAt).format('YYYY-MM-DD')}
          extraText={`${item.inOrOut === 1 ? '-' : '+'} ${Number(item.amount).toFixed(2)}`}
          arrow={null}
          thumb='http://img12.360buyimg.com/jdphoto/s72x72_jfs/t10660/330/203667368/1672/801735d7/59c85643N31e68303.png'
        />)
      }
    </AtList>
  </ScrollView>
};

export default IndexPage;