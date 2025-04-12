import React, { useEffect, useRef, useState } from "react";
import { Toast, Dialog, Button, Popup, Form, Input, Radio, Space, InfiniteScroll, ImageUploader, ImageUploadItem, TextArea, Mask } from "antd-mobile";
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
import { Crop, ReactCrop } from 'react-image-crop' // 添加引入
import 'react-image-crop/dist/ReactCrop.css'  // 添加引入
import { imgCompress } from "@/utils";

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
    const [imgFile, setImgFile] = useState<File>();
    const [crop, setCrop] = useState<Crop>({
        unit: 'px',
        x: 25,
        y: 25,
        width: 121,
        height: 68,
    });
    const [cropSrc, setCropSrc] = useState<string>();
    const [showCrop, setShowCrop] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        if (isLoad) {
            getCollectionList();
        }
    }, [params]);

    const getCollectionList = async () => {
        const res = await request("/newApi/works/pageForH5", {
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
            res.data.coverImg = [
                {
                    url: res.data.coverImg,
                },
            ]
            setItemData(res.data);
            form.setFieldsValue(res.data); // 更新表单字段的值
        }
    };

    const addCollection = async (params: AddFolderParams): Promise<boolean> => {
        const data = {
            title: params.title,
            coverImg: params.coverImg,
            promotionUrl: params.promotionUrl,
            enablePromotion: params.enablePromotion
                ? PromotionEnum.start
                : PromotionEnum.end,
            info: params?.info,
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
        const coverImg = await startUpload();
        console.log(coverImg, item);
        const data = {
            id: itemData?.id,
            title: item.title,
            coverImg: coverImg?.url ?? item.coverImg[0]?.url,
            promotionUrl: item.promotionUrl,
            enablePromotion: item.enablePromotion
                ? PromotionEnum.start
                : PromotionEnum.end,
            info: item.info
        };
        if (item?.enablePromotion && !item.promotionUrl) {
            Toast.show({
                icon: "fail",
                content: "推广失败，请输入推广链接",
            })
            return;
        }
        const res = await request("/newApi/works/update", {
            method: "POST",
            body: data,
        });

        const status = res.code === RequstStatusEnum.success;
        Toast.show({
            content: status ? "更新成功" : res?.msg??"更新失败",
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
                                    console.log(item)
                                    if (item?.promotionUrl) {
                                        await isPromotion(item.id, PromotionEnum.start);
                                        await reload();
                                    } else {
                                        Toast.show({
                                            icon: "fail",
                                            content: "推广失败，请输入推广链接",
                                        })
                                    }
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
        if (formValue?.enablePromotion && !formValue.promotionUrl) {
            Toast.show({
                icon: "fail",
                content: "请输入推广链接",
            })
            return;
        }
        const coverImg = await startUpload();
        const addStatus = await addCollection({ ...formValue, coverImg: coverImg?.url ?? '' });
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

    const reload = () => {
        resetForm();
        setIsLoad(true);
        setParmas({
            page: 1,
            rows: 5,
            type: 'folder'
        });
    };

    interface CropCompleteEvent extends CustomEvent {
        detail: File;
    }

    const beforeUpload = (file: File, files: File[]) => {
        if (file.size > 2 * 1024 * 1024) {
            Toast.show('请选择小于 2M 的图片')
            return null
        }
        return new Promise((resolve) => {
            const reader = new FileReader()
            reader.onload = () => {
                setCropSrc(reader.result as string)
                setShowCrop(true)
                setImgFile(file)

                // 修改事件监听器的类型
                const handleCropDone = (event: Event) => {
                    const cropEvent = event as CropCompleteEvent;
                    resolve(cropEvent.detail)
                    window.removeEventListener('cropComplete', handleCropDone)
                }

                window.addEventListener('cropComplete', handleCropDone)
            }
            reader.readAsDataURL(file)
        })
    }

    const upload = async (file: File): Promise<ImageUploadItem> => {
        const compressFile = await imgCompress(file, { maxWidth: 750, maxHeight: 422 })
        setImgFile(compressFile)
        return {
            url: URL.createObjectURL(file),
        };
    }

    const startUpload = async () => {
        if (!imgFile) return;
        const formdata = new FormData();
        formdata.append("file", imgFile);

        const res = await fetch("/apiFile/file/upload", {
            method: 'POST',
            headers: {
                'Authorization': localStorage.getItem('Token') as string
            },
            body: formdata,
        })
        const data = await res.json();
        return {
            url: data.data,
        }
    }

    const handleCropComplete = async () => {
        if (!imgRef.current || !crop) return

        const canvas = document.createElement('canvas')
        const scaleX = imgRef.current.naturalWidth / imgRef.current.width
        const scaleY = imgRef.current.naturalHeight / imgRef.current.height
        canvas.width = crop.width
        canvas.height = crop.height
        const ctx = canvas.getContext('2d')

        ctx?.drawImage(
            imgRef.current,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height
        )

        canvas.toBlob(async (blob) => {
            if (blob) {
                const file = new File([blob], 'cropped.png', { type: 'image/png' })
                const compressedFile = file;
                setImgFile(compressedFile)

                // 创建预览URL并更新UI
                const previewUrl = URL.createObjectURL(compressedFile)
                setFileList([{ url: previewUrl }])

                // 触发裁剪完成事件
                window.dispatchEvent(new CustomEvent('cropComplete', { detail: compressedFile }))
                setShowCrop(false)
            }
        }, 'image/png')
    }

    return (
        <div className="collectionContainer" style={{ padding: "46px 0" }}>
            <NavBarBack
                content={"合集管理"}
                style={{
                    maxWidth: '450px',
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
                        maxWidth: '450px'
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
                            <Form.Item name="title" label="合集名" rules={[
                                { required: true },
                            ]}>
                                <Input placeholder="请输入" />
                            </Form.Item>
                            <Form.Item
                                name='coverImg'
                                label='合集封面'
                                rules={[
                                    { required: true },
                                ]}
                            >
                                <ImageUploader
                                    value={fileList}
                                    onChange={setFileList}
                                    beforeUpload={beforeUpload}
                                    upload={upload}
                                    maxCount={1}
                                />
                            </Form.Item>
                            <Form.Item name="promotionUrl" label={<div>
                                <span>推广</span>
                                (<span style={{color: '#ff3141'}}>网盘地址</span>)
                            </div>}>
                                <Input placeholder="请输入" />
                            </Form.Item>
                            <Form.Item name="enablePromotion" label="是否推广" rules={[
                                { required: true },
                            ]} initialValue={0}>
                                <Radio.Group >
                                    <Space>
                                        <Radio value={1}>是</Radio>
                                        <Radio value={0}>否</Radio>
                                    </Space>
                                </Radio.Group>
                            </Form.Item>
                            <Form.Item name="info" label="合集简介">
                                <TextArea placeholder="请输入" rows={2} showCount />
                            </Form.Item>
                        </Form>
                    </div>
                </Popup>
            </div>
            <InfiniteScroll loadMore={getCollectionList} hasMore={hasMore} />
            <Mask visible={visible} />
            {showCrop && cropSrc && (
                <div className="crop-modal">
                    <div style={{ marginBottom: '10px', textAlign: 'center' }}>
                        当前裁剪尺寸: {Math.round(crop.width)} x {Math.round(crop.height)} 像素
                    </div>
                    <ReactCrop
                        crop={crop}
                        onChange={c => setCrop(c)}
                        aspect={16 / 9}
                    >
                        <img ref={imgRef} src={cropSrc} />
                    </ReactCrop>
                    <div className="crop-actions">
                        <Button onClick={handleCropComplete}>确认</Button>
                        <Button onClick={() => setShowCrop(false)}>取消</Button>
                    </div>
                </div>
            )}
        </div>
        
    );
}
