import React, { useEffect, useState } from 'react'
import { useLocation } from 'umi';
import { Button, Card, Form, Input, Picker, Popup, TextArea, Toast } from 'antd-mobile'
import './index.less'
import NavBarBack from '@/components/NavBarBack/NavBarBack'
import request from "@/utils/request/request";
import { RequstStatusEnum } from "@/utils/request/request.type";

export default function withdrawal() {
    const [form] = Form.useForm();
    const { search } = useLocation();
    const params = new URLSearchParams(search);
    const totalIncome = params.get('totalIncome');
    const [visible, setVisible] = useState(false)
    const [value, setValue] = useState<(string | null)[]>([])
    const basicColumns = [
        [
            { label: '支付宝', value: 'ALIPAY' },
        ]
    ]
    const [allTotalIncome, setAllTotalIncome] = useState();
    const [withdrawRules, setWithdrawRules] = useState<{ val: string; }>();
    const [rulesVisibility, setRulesVisibility] = useState(false);

    useEffect(() => {
        getWithdrawRule();
    }, []);

    const getWithdrawRule = async () => {
        const res = await request('/newApi/gconfig/getWithdrawalRules', { method: 'GET'});
        res.code === RequstStatusEnum.success && setWithdrawRules(res.data);
    }

    const onFinish = () => {
        startWithdraw()
    }

    const startWithdraw = async () => {
        const formValues = form.getFieldsValue();
        console.log(formValues)
        const data = {
            type: formValues.type?.length > 0 ? formValues?.type[0] : 'ALIPAY', //WECHART或ALIPAY 目前只支持 ALIPAY
            amount: formValues?.amount, //余额单位（元）用户信息 canWithdrawalBalance字段，可提现余额
            realName: formValues?.realName, //真实姓名 支付宝绑定的
            account: formValues?.account //支付宝登录账号
        }
        const res = await request('/newApi/withdrawal/doWithdrawal', {
            method: 'POST',
            body: data
        })

        if (res.code === RequstStatusEnum.success) {
            Toast.show(res.msg);
            form.resetFields();
            history.back();
        } else {
            Toast.show(`提现失败，${res.msg}`);
        }

    }

    return (
        <div style={{ padding: '46px 0' }}>
            <NavBarBack content={'提现'} style={{ background: '#fff', position: 'fixed', top: '0', width: '100%', zIndex: '99' }} />
            <div style={{ padding: '0 6px', marginTop: '20px' }}>
                <Card>
                    <Form
                        name='form'
                        form={form}
                        layout='horizontal'
                    >
                        <Form.Item name='amount' label='提现金额'>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Input placeholder='请输入' type='number' value={allTotalIncome} />
                                <Button
                                onClick={() => setAllTotalIncome(totalIncome) }
                                style={{ width: '150px', fontSize: '13px' }}>
                                    全部提现
                                </Button>
                            </div>
                        </Form.Item>
                        <Form.Item
                            name='type'
                            label='提现方式'
                            trigger='onConfirm'
                            onClick={(e) => {
                                console.log(e)
                                setVisible(true)
                            }}
                        >
                            <Picker
                                columns={basicColumns}
                                visible={visible}
                                value={value}
                                onClose={() => {
                                    setVisible(false)
                                }}
                                onConfirm={v => {
                                    setValue(v)
                                }}
                                onSelect={(val, extend) => {
                                    console.log('onSelect', val, extend.items)
                                }}
                            >
                                {(items, { open }) => {
                                    return (
                                        <>
                                            {items.every(item => item === null)
                                                ? '未选择'
                                                : items.map(item => item?.label ?? '未选择').join(' - ')}
                                        </>
                                    )
                                }}
                            </Picker>
                        </Form.Item>
                        <Form.Item
                            name='realName'
                            label='姓名'
                        >
                            <Input placeholder='请输入' />
                        </Form.Item>
                        <Form.Item name='account' label='账号'>
                            <Input placeholder='请输入' />
                        </Form.Item>
                    </Form>
                </Card>
                <Card
                onClick={() => {
                    setRulesVisibility(true)
                }} 
                style={{ margin: '10px 0' }}>
                    提现规则
                </Card>
                <Button onClick={onFinish} block type='submit' color='primary' size='large'>
                    确认提现
                </Button>
            </div>
            <Popup
                visible={rulesVisibility}
                onMaskClick={() => {
                    setRulesVisibility(false)
                }}
                onClose={() => {
                    setRulesVisibility(false)
                }}
                bodyStyle={{
                    borderTopLeftRadius: '8px',
                    borderTopRightRadius: '8px',
                    minHeight: '40vh',
                }}
                >
                {withdrawRules?.val}
            </Popup>
        </div>
    )
}
