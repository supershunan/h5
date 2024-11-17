import React, { useEffect, useState } from 'react'
import NavBarBack from '@/components/NavBarBack/NavBarBack'
import { Button, Card, Form, Input, TextArea, Toast } from 'antd-mobile'
import request from '@/utils/request/request';
import { RequstStatusEnum } from '@/utils/request/request.type';
import { useParams } from 'umi';
import './index.less'

export default function ApplyForPromotion() {
    const { id } = useParams<{ id: string, name: string }>();
    const [form] = Form.useForm();
    const [promationDetails, setPromationDetails] = useState();

    useEffect(() => {
        getPromationDetail();
    }, [id]);

    const getPromationDetail = async () => {
        const res = await request(`/newApi/works/getById/${id}`, { method: 'GET' });
        res.code === RequstStatusEnum.success && setPromationDetails(res.data)
        form.setFieldsValue({
            keywords: undefined,
            worksId: id,
            title: res.data?.title,
            createBy: res.data?.createBy
        })
    }

    const onFinish = () => {
        form.validateFields().then(async () => {
            const data = form.getFieldsValue();
            const res = await request('/newApi/worksAlias/add', {
                method: 'POST',
                body: data
            })
            if (res.code === RequstStatusEnum.success) {
                Toast.show({
                    icon: 'success',
                    content: `申请成功`,
                    afterClose: () => {
                        history.back();
                    }
                });
                form.resetFields();
            } else {
                Toast.show({
                    icon: 'fail',
                    content: res?.msg??'申请失败',
                });
            }
        }).catch((error) => {
            console.log(error)
        })
    }
    return (
        <div style={{ padding: '46px 0' }} className='applyForPromotion-id'>
            <NavBarBack content={'申请推广'} style={{ maxWidth: '450px', background: '#f8f8fb', position: 'fixed', top: '0', width: '100%', zIndex: '99' }} />
            <div style={{ padding: '6px 6px' }} className='promationDetail-id'>
                <Card>
                    <Form
                        name='form'
                        form={form}
                        layout='horizontal'
                        initialValues={{
                            keywords: undefined,
                            workId: id,
                            title: promationDetails?.title,
                            createBy: promationDetails?.createBy
                        }}
                    >
                        <Form.Item
                            name='keywords'
                            label='关键字'
                            rules={[{required: true}]}
                        >
                            <Input placeholder='请输入' />
                        </Form.Item>
                        <Form.Item name='worksId' label='合集ID' rules={[{required: true}]}>
                            <Input disabled placeholder='请输入' />
                        </Form.Item>
                        <Form.Item name='title' label='合集名称' rules={[{required: true}]}>
                            <Input disabled placeholder='请输入' />
                        </Form.Item>
                        <Form.Item name='createBy' label='作者' rules={[{required: true}]}>
                            <Input disabled placeholder='请输入' />
                        </Form.Item>
                    </Form>
                </Card>
                <div className='floatBtn-id'>
                    <Button onClick={onFinish} block type='submit' color='primary' size='large'>
                        确认
                    </Button>
                </div>
            </div>
            
        </div>
    )
}
