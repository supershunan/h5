import React, { useEffect, useState } from "react";
import { Toast, Dialog, Button, Popup, Form, Input, Radio, Space, InfiniteScroll, ImageUploader, ImageUploadItem } from "antd-mobile";
import { history } from "umi";
import { Action } from "antd-mobile/es/components/popover";
import NavBarBack from "@/components/NavBarBack/NavBarBack";
import ContentList from "@/components/ContentList/ContentList";
import request from "@/utils/request/request";
import { RequstStatusEnum } from "@/utils/request/request.type";
import {
    ItemOperateEnum,
    AddFolderParams,
    CollectionItem,
    PromotionEnum,
} from "./type";
import "./index.less";
import { sleep } from "antd-mobile/es/utils/sleep";

export default function CollectionManagement() {
    const [data, setData] = useState<any[]>([]);
    const [fileList, setFileList] = useState<ImageUploadItem[]>([
        {
          url: 'https://inews.gtimg.com/om_bt/OGlQWfsaAoKkuCcMZ2o9IVEPqd-72DQy5EAN02XBHUwfYAA/641',
        },
      ])
    const [itemData, setItemData] = useState<CollectionItem | undefined>();
    const actions: Action[] = [
        { key: ItemOperateEnum.setting, text: "设置" },
        { key: ItemOperateEnum.startPromotion, text: "开始推广" },
        { key: ItemOperateEnum.overPromotion, text: "关闭推广" },
        { key: ItemOperateEnum.delete, text: "删除" },
    ];
    const [visible, setVisible] = useState(false);
    const [form] = Form.useForm();
    const [isCollectionUpdate, setIsCollectionUpdate] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [params, setParmas] = useState<{ page: number, rows: number, type: string }>({ page: 1, rows: 5, type: 'folder' });
    const [isLoad, setIsLoad] = useState(false);

    useEffect(() => {
        if (isLoad) {
            getCollectionList();
        }
    }, [params]);

    const getCollectionList = async () => {
        const res = await request("/newApi/works/page", {
            method: "POST",
            body: params
        });
        const status = res.code === RequstStatusEnum.success && res.rows.length > 0;
        if (status && !isLoad) {
            setData([
                ...data,
                ...res.rows
            ]);
            setParmas({
                page: params.page + 1,
                rows: params.rows,
                type: 'folder'
            })
        }
        if (isLoad) {
            setData(res.rows);
            setParmas({
                page: params.page + 1,
                rows: params.rows,
                type: 'folder'
            });
            setIsLoad(false);
        }
        setHasMore(status)
    };

    const getCollectionItem = async (id: number) => {
        const res = await request(`/newApi/works/getById/${id}`, { method: "GET" });
        if (res.code === RequstStatusEnum.success) {
            setItemData(res.data);
            form.setFieldsValue(res.data); // 更新表单字段的值
        }
    };

    const addCollection = async (params: AddFolderParams): Promise<boolean> => {
        const data = {
            title: params.title,
            coverImg:
                "https://inews.gtimg.com/om_bt/OGlQWfsaAoKkuCcMZ2o9IVEPqd-72DQy5EAN02XBHUwfYAA/641",
            promotionUrl: params.promotionUrl,
            enablePromotion: params.enablePromotion
                ? PromotionEnum.start
                : PromotionEnum.end,
        };
        const res = await request("/newApi/works/addFolder", {
            method: "POST",
            body: data,
        });
        return res.code === RequstStatusEnum.success;
    };

    const deleteCollection = async (id: number) => {
        const res = await request(`/newApi/works/removeColl/${id}`, {
            method: "DELETE",
        });
        Toast.show({
            content: res.code === RequstStatusEnum.success ? "删除成功" : "删除失败",
        });
    };

    const updateCollection = async (item: CollectionItem) => {
        const data = {
            id: itemData?.id,
            title: item.title,
            coverImg:
                "https://inews.gtimg.com/om_bt/OGlQWfsaAoKkuCcMZ2o9IVEPqd-72DQy5EAN02XBHUwfYAA/641",
            promotionUrl: item.promotionUrl,
            enablePromotion: item.enablePromotion
                ? PromotionEnum.start
                : PromotionEnum.end,
        };
        const res = await request("/newApi/works/update", {
            method: "POST",
            body: data,
        });

        const status = res.code === RequstStatusEnum.success;
        Toast.show({
            content: status ? "更新成功" : "更新失败",
        });
        setVisible(!status);
        reload();
    };

    const isPromotion = async (id: number, enablePromotion: number) => {
        const res = await request(
            `/newApi/works/enablePromotion/${id}/${enablePromotion}`,
            { method: "POST" }
        );
        Toast.show({
            content: res.code === RequstStatusEnum.success ? "推广成功" : "推广失败",
        });
    };

    const handlePop = async (node: Action, item: CollectionItem) => {
        switch (node.key) {
            case ItemOperateEnum.setting:
                await getCollectionItem(item.id);
                setVisible(true);
                setIsCollectionUpdate(true);
                break;
            case ItemOperateEnum.startPromotion:
                Dialog.show({
                    content: "开启推广?",
                    closeOnAction: true,
                    actions: [
                        [
                            {
                                key: "cancel",
                                text: "取消",
                            },
                            {
                                key: "ok",
                                text: "确认",
                                bold: true,
                                danger: true,
                                onClick: async () => {
                                    await isPromotion(item.id, PromotionEnum.start);
                                    await reload();
                                },
                            },
                        ],
                    ],
                });
                break;
            case ItemOperateEnum.overPromotion:
                Dialog.show({
                    content: "关闭推广?",
                    closeOnAction: true,
                    actions: [
                        [
                            {
                                key: "cancel",
                                text: "取消",
                            },
                            {
                                key: "ok",
                                text: "确认",
                                bold: true,
                                danger: true,
                                onClick: async () => {
                                    await isPromotion(item.id, PromotionEnum.end);
                                    await reload();
                                },
                            },
                        ],
                    ],
                });
                break;
            case ItemOperateEnum.delete:
                Dialog.show({
                    content: "确认删除吗?",
                    closeOnAction: true,
                    actions: [
                        [
                            {
                                key: "cancel",
                                text: "取消",
                            },
                            {
                                key: "delete",
                                text: "删除",
                                bold: true,
                                danger: true,
                                onClick: async () => {
                                    await deleteCollection(item.id);
                                    await reload();
                                },
                            },
                        ],
                    ],
                });
                break;
            default:
                break;
        }
    };

    const goDetail = (item: CollectionItem) => {
        getCollectionItem(item.id); // 获取数据时更新表单
        history.push(`/collectionManagement/${item.id}?name=${item.title}`);
    };

    const handleAdd = async () => {
        const formValue = form.getFieldsValue();
        const addStatus = await addCollection(formValue);
        setVisible(!addStatus);
        Toast.show({
            content: addStatus ? "创建成功" : "创建失败",
        });
        if (addStatus) {
            form.resetFields();
            setItemData(undefined); // 成功创建后重置 itemData
        }
        reload();
    };

    const resetForm = () => {
        setItemData(undefined);
        form.resetFields();
    }

    const reload =() => {
        resetForm();
        setIsLoad(true);
        setParmas({
            page: 1,
            rows: 5,
            type: 'folder'
        });
    };

    const beforeUpload = (file: File, files: File[]) => {
        // if (file.size > 1024 * 1024) {
        //   Toast.show('请选择小于 1M 的图片')
        //   return null
        // }
        return file
    }

    const upload = async (file: File): Promise<ImageUploadItem> => {
        console.log(file)
        const formdata = new FormData();
        formdata.append("file", file);

        await fetch("https://ksys.qfyingshi.cn/apiFile/file/upload", {
            method: 'POST',
            headers: {
                'Authorization': localStorage.getItem('Token') as string
            },
            body: formdata,
        })

        return {
            url: URL.createObjectURL(file),
        }
    }

    return (
        <div className="collectionContainer" style={{ padding: "46px 0" }}>
            <NavBarBack
                content={"合集管理"}
                style={{
                    background: "#f8f8fb",
                    position: "fixed",
                    top: "0",
                    width: "100%",
                    zIndex: "99",
                }}
            />
            <div className="collectContent">
                <ContentList
                    contentList={data}
                    actions={actions}
                    handlePop={handlePop}
                    handleItem={goDetail}
                />
                <div className="floatBtn">
                    <Button
                        onClick={() => {
                            resetForm();
                            setVisible(true);
                            setIsCollectionUpdate(false);
                        }}
                        block
                        color="primary"
                        size="large"
                    >
                        创建合辑
                    </Button>
                </div>
                <Popup
                    visible={visible}
                    onMaskClick={() => {
                        resetForm();
                        setVisible(false);
                    }}
                    onClose={() => {
                        resetForm();
                        setVisible(false);
                    }}
                    showCloseButton
                    bodyStyle={{
                        borderTopLeftRadius: "8px",
                        borderTopRightRadius: "8px",
                        minHeight: "40vh",
                    }}
                >
                    <div className="createcollection">
                        <Form
                            form={form}
                            onFinish={isCollectionUpdate ? updateCollection : handleAdd}
                            initialValues={itemData}
                            footer={
                                <Button block type="submit" color="primary" size="large">
                                    提交
                                </Button>
                            }
                        >
                            <Form.Header>
                                <div style={{ textAlign: "center" }}>创建合集</div>
                            </Form.Header>
                            <Form.Item name="title" label="合集名">
                                <Input placeholder="请输入" />
                            </Form.Item>
                            <Form.Item
                                name='coverImg'
                                label='合集封面'
                            >
                                <ImageUploader
                                    value={fileList}
                                    onChange={setFileList}
                                    beforeUpload={beforeUpload}
                                    upload={upload}
                                    maxCount={1}
                                />
                            </Form.Item>
                            <Form.Item name="promotionUrl" label="推广">
                                <Input placeholder="请输入" />
                            </Form.Item>
                            <Form.Item name="enablePromotion" label="是否推广">
                                <Radio.Group>
                                    <Space>
                                        <Radio value={1}>是</Radio>
                                        <Radio value={0}>否</Radio>
                                    </Space>
                                </Radio.Group>
                            </Form.Item>
                        </Form>
                    </div>
                </Popup>
            </div>
            <InfiniteScroll loadMore={getCollectionList} hasMore={hasMore} />
        </div>
    );
}
