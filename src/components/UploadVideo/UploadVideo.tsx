import React, { useEffect, useState } from "react";
import { history, useLocation, useParams } from "umi";
import { ImageUploader, ImageUploadItem, Toast, Picker } from "antd-mobile";
import { Form, Input, Button, TextArea } from "antd-mobile";
import "./index.less";
import request from "@/utils/request/request";
import { RequstStatusEnum } from "@/utils/request/request.type";

enum UploadType {
    edit = "edit",
    add = "add",
}

export default function UploadVideo() {
    const { search } = useLocation();
    const urlParams = new URLSearchParams(search);
    const id = urlParams.get("id");
    const type = urlParams.get("type");
    const [form] = Form.useForm();
    const [colllectionClassify, setColllectionClassify] = useState<[][]>([]);
    const [videClassify, setVideoClassify] = useState<[][]>([]);
    const [fileList, setFileList] = useState<ImageUploadItem[]>();
    const [videoVisible, setVideoVisible] = useState(false);
    const [colllectionVisible, setColllectionVideoVisible] = useState(false);
    const [videoValue, setVideoValue] = useState<(string | null)[]>(['6']);
    const [colllectionValue, setColllectionValue] = useState<(string | null)[]>(['70']);
    const [videoDetail, setVideoDetail] = useState();

    useEffect(() => {
        videoClass();
        collectionClass();
    }, []);

    useEffect(() => {
        if (type === UploadType.edit) {
            getVideoDetail();
        }
    }, [type]);

    useEffect(() => {
        form.resetFields();
    }, [videoDetail]);

    function beforeUpload(file: File) {
        if (file.size > 1024 * 1024) {
            Toast.show("请选择小于 1M 的图片");
            return null;
        }
        return file;
    }
    const onFinish = async (values: any) => {
        let status;
        if (type === UploadType.edit) {
            status = await updateVideo(values);
        } else {
            status = await addVideo(values);
        }
        Toast.show({
            content: status ? "上传/更新成功" : "上传/更新失败",
        });
        status && form.resetFields();
        history.back();
    };

    const videoClass = async () => {
        const res = await request("/newApi/label/videoList", { method: "GET" });
        const classify = res.data?.map(
            (item: { name: String; code: string; id: number }) => {
                return {
                    label: item.name,
                    value: item.id,
                };
            }
        );
        res.code === RequstStatusEnum.success && setVideoClassify([classify]);
    };

    const collectionClass = async () => {
        const res = await request("/newApi/works/listFolder", { method: "GET" });
        const classify = res.data?.map(
            (item: { title: String; code: string; id: number }) => {
                return {
                    label: item.title,
                    value: item.id,
                };
            }
        );
        res.code === RequstStatusEnum.success && setColllectionClassify([classify]);
    };

    const getVideoDetail = async () => {
        const res = await request(`/newApi/works/getById/${id}`, { method: "GET" });
        res.data.collection = [Number(res.data.pid)];
        console.log(res.data)
        res.code === RequstStatusEnum.success && setVideoDetail(res.data);
    };

    const addVideo = async (values: any): Promise<boolean> => {
        const data = {
            title: values.title, //标题
            info: values.info, //简介
            coverImg:
                "https://wx1.sinaimg.cn/mw690/00607PsZgy1hrtf4c3522j31z41z4kjo.jpg", //封面
            playUrl: "http://fjf.bd/dtylmw", //上传视频的地址
            collNum: values.collNum, //集数
            pid: id ? id : values.collection[0], //合集的id
            useTime: values.useTime, //购买一次使用的时间，单位 小时
            money: values.money, //价格
            labelList: values.labelList, //分类id
        };
        const res = await request("/newApi/works/addVideo", {
            method: "POST",
            body: data,
        });
        return res.code === RequstStatusEnum.success;
    };

    const updateVideo = async (values: any): Promise<boolean> => {
        console.log('wkkk', values)
        const data = {
            id: videoDetail?.id,
            title: values.title,
            info: values.info,
            coverImg: "https://wx1.sinaimg.cn/mw690/00607PsZgy1hrtf4c3522j31z41z4kjo.jpg",
            playUrl: "http://cprpmihlfd.il/jqiljsd",
            collNum: values.collNum,
            pid: values.collection[0],
            useTime: values.useTime,
            money: values.money,
        };
        const res = await request("/newApi/works/update", {
            method: "POST",
            body: data,
        });
        return res.code === RequstStatusEnum.success;
    };

    return (
        <div>
            <Form
                name="form"
                form={form}
                onFinish={ onFinish }
                initialValues={videoDetail}
                footer={
                    <Button block type="submit" color="primary" size="large">
                        提交
                    </Button>
                }
            >
                {/* <div className="uploadImgVideo">
                    <Form.Item name='coverImg'>
                        <div className="upladImg">
                            <div className='uploadTip'>
                                <span className='uploadHeadtitle'>上传封面</span>
                                <span className='uploadSubtitle'>尺寸(750/422)</span>
                            </div>
                            <ImageUploader
                                value={fileList}
                                onChange={setFileList}
                                upload={''}
                                beforeUpload={beforeUpload}
                                maxCount={1}
                            />
                        </div>
                    </Form.Item>
                    <Form.Item name='playUrl'>
                        <div className="upladVideo">
                            <div className='uploadTip'>
                                <span className='uploadHeadtitle'>上传视频</span>
                                <span className='uploadSubtitle'>小于200Mb</span>
                            </div>
                            <ImageUploader
                                value={fileList}
                                onChange={setFileList}
                                upload={''}
                                beforeUpload={beforeUpload}
                                maxCount={1}
                                style={{ width: '100%' }}
                            />
                        </div>
                    </Form.Item>
                </div> */}
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <Form.Item
                        name="money"
                        label={
                            <div>
                                价格
                                <span style={{ color: "#ff3141", fontSize: "10px" }}>
                                    100次元币=1元
                                </span>
                            </div>
                        }
                        extra={
                            <div
                                style={{ position: "relative", top: "15px", fontSize: "13px" }}
                            >
                                次元币
                            </div>
                        }
                    >
                        <Input placeholder="请输入" type="number" />
                    </Form.Item>
                    <Form.Item name="collNum" label="集数">
                        <Input placeholder="请输入" type="number" />
                    </Form.Item>
                </div>
                <Form.Item
                    name="labelList"
                    label="分类"
                    trigger="onConfirm"
                    onClick={(e) => {
                        console.log(e);
                        setVideoVisible(true);
                    }}
                >
                    <Picker
                        columns={videClassify}
                        visible={videoVisible}
                        value={videoValue}
                        onClose={() => {
                            setVideoVisible(false);
                        }}
                        onConfirm={(v) => {
                            console.log('wkkk', v);
                            setVideoValue(v);
                        }}
                        onSelect={(val, extend) => {
                            console.log("onSelect", val, extend.items);
                        }}
                    >
                        {(items, { open }) => {
                            return (
                                <>
                                    {items?.every((item) => item === null)
                                        ? "未选择"
                                        : items.map((item) => item?.label ?? "未选择").join(" - ")}
                                </>
                            );
                        }}
                    </Picker>
                </Form.Item>
                <Form.Item
                    name="collection"
                    label="合集选择"
                    trigger="onConfirm"
                    onClick={(e) => {
                        console.log(e);
                        setColllectionVideoVisible(true);
                    }}
                >
                    <Picker
                        columns={colllectionClassify}
                        visible={colllectionVisible}
                        value={colllectionValue}
                        onClose={() => {
                            setColllectionVideoVisible(false);
                        }}
                        onConfirm={(v) => {
                            console.log('wkkk', v);
                            setColllectionValue(v);
                        }}
                        onSelect={(val, extend) => {
                            console.log("onSelect", val, extend.items);
                        }}
                    >
                        {(items, { open }) => {
                            return (
                                <>
                                    {items.every((item) => item === null)
                                        ? "未选择"
                                        : items.map((item) => item?.label ?? "未选择").join(" - ")}
                                </>
                            );
                        }}
                    </Picker>
                </Form.Item>
                <Form.Item name="title" label="视频名">
                    <Input placeholder="请输入" />
                </Form.Item>
                <Form.Item name="useTime" label="使用时间">
                    <Input placeholder="请输入" />
                </Form.Item>
                <Form.Item name="info" label="简介">
                    <TextArea placeholder="请输入" maxLength={30} rows={2} showCount />
                </Form.Item>
            </Form>
        </div>
    );
}
