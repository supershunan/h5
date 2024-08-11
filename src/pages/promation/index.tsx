import React, { useState } from 'react'
import { history } from 'umi'
import { SearchBar, Card } from 'antd-mobile'
import ContentList from '@/components/ContentList/ContentList'
import './index.less'
import request from "@/utils/request/request";
import { RequstStatusEnum } from "@/utils/request/request.type";

export default function Promation() {
    const [data, setData] = useState([])

    const goDetail = (item) => {
        history.push(`/promation/${item.id}?name=${item.title}`);
    }

    const getPromotionList = async (value: string) => {
        const params = {
            page: 1,
            rows: 10,
            keyword: value
        };
        const queryString = new URLSearchParams(params).toString();
        const res = await request(`/newApi/works/getTaskPageList?${queryString}`, { method: 'GET' });
        res.rows = [
            {
                "page": 1,
                "rows": 20,
                "id": 43,
                "code": "WORKS15beff90-8124",
                "title": "快手清风第8集",
                "info": "都覅黑以后那股容易过热第四u复活节俄欧i给乙方",
                "content": null,
                "coverImg": "https://file.qfyingshi.cn/app/ksys/works/0f35a477-f216-4851-880e-6114a7869b0c.jpg",
                "bgImg": null,
                "playCount": 5,
                "playBuy": 0,
                "playTime": 229,
                "playUrl": "https://file.qfyingshi.cn/app/ksys/works/9e6a9422-5ff5-415e-80b7-dcc3485113af.mp4",
                "collNum": 8,
                "type": "video",
                "pid": "29",
                "idIndex": "000029-000043",
                "num": 8,
                "useTime": 1,
                "money": 5.0,
                "sort": null,
                "status": 1,
                "state": 1,
                "createTime": 1721454436386,
                "createBy": "21",
                "updateTime": 1721484156369,
                "updateBy": "1",
                "expert": null,
                "createName": "清风风",
                "buyStatus": null,
                "labelId": null,
                "incomeData": null,
                "labelList": [],
                "labelDataList": [],
                "dianZanNum": null,
                "shouCangNum": null,
                "avatar": "https://file.qfyingshi.cn/app/ksys/user/f977bf95-a91a-4742-9c31-e93162acb59b.jpg",
                "focusStatus": null,
                "collStatus": null,
                "likeStatus": null,
                "promotionUrl": null,
                "enablePromotion": null
            },
        ]
        res.code === RequstStatusEnum.success && setData(res.rows)
    }
    
    return (
        <div style={{ padding: '46px 6px' }}>
            <div className="search">
                <SearchBar placeholder='请输入内容' onSearch={getPromotionList} showCancelButton={() => true} />
            </div>
            <Card title="推广任务">
                <ContentList contentList={data} isPullToRefresh={true} handleItem={goDetail} />
            </Card>
        </div>
    )
}
