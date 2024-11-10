import React, { useEffect, useMemo, useState } from "react";
import { history, useLocation, useParams } from "umi";
import {
    ImageUploader,
    ImageUploadItem,
    Toast,
    Picker,
    List,
} from "antd-mobile";
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
    const [defaultClassify, setDefaultClasify] = useState([])
    const [videClassify, setVideoClassify] = useState<[][]>([]);
    const [fileImgList, setFileImgList] = useState<ImageUploadItem[]>();
    const [fileVideo, setfileVideot] = useState<string>();
    const [videoVisible, setVideoVisible] = useState(false);
    const [colllectionVisible, setColllectionVideoVisible] = useState(false);
    const [videoValue, setVideoValue] = useState<(string | null)[]>(["6"]);
    const [colllectionValue, setColllectionValue] = useState<(string | null)[]>([]);
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
        classify[0]?.value && setDefaultClasify([classify[0]?.value])
    };

    const getVideoDetail = async () => {
        const res = await request(`/newApi/works/getById/${id}`, { method: "GET" });
        if (res.code === RequstStatusEnum.success && res.data) {
            res.data.collection = [Number(res.data.pid)];
            res.data.coverImg = [
                {
                    url: res.data.coverImg,
                },
            ];
            res.code === RequstStatusEnum.success && setVideoDetail(res.data);
        }
    };

    const addVideo = async (values: any): Promise<boolean> => {
        const data = {
            title: values.title, //标题
            info: values.info, //简介
            coverImg: values.coverImg?.length > 0 ? values.coverImg[0]?.url : "", //封面
            playUrl: values.playUrl, //上传视频的地址
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
        const data = {
            id: videoDetail?.id,
            title: values.title,
            info: values.info,
            coverImg: values.coverImg.length > 0 ? values.coverImg[0]?.url : "",
            playUrl: values.playUrl,
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

    function beforeUpload(file: File) {
        return file;
    }

    const uploadImg = async (file: File): Promise<ImageUploadItem> => {
        const formdata = new FormData();
        formdata.append("file", file);

        const res = await fetch("/apiFile/file/upload", {
            method: "POST",
            headers: {
                Authorization: localStorage.getItem("Token") as string,
            },
            body: formdata,
        });
        const data = await res.json();
        return {
            url: data.data,
        };
    };

    const uploadVideo = async (file: File): Promise<ImageUploadItem> => {
        if (file.size > 200 * 1024 * 1024) {
            Toast.show({
                content: `视频大小不能超过200Mb`,
            });
            return Promise.reject();
        }
        const formdata = new FormData();
        formdata.append("file", file);

        const res = await fetch("/apiFile/file/upload", {
            method: "POST",
            headers: {
                Authorization: localStorage.getItem("Token") as string,
            },
            body: formdata,
        });
        const data = await res.json();
        return {
            url: data.data,
        };
    };

    const uploadVideoChange = (url: string): string => {
        return url;
    };

    const VideoUploader = ({ upload, onChange, value }) => {
        const [previewUrl, setPreviewUrl] = useState<string>(value);
        const [isHidden, setHidden] = useState(false);

        const handleChange = (e) => {
            const file = e.target.files[0];
            if (file) {
                upload(file)
                    .then((data: { url: string }) => {
                        setPreviewUrl(data.url);
                        setHidden(true);
                        onChange(data.url);
                        e.target.value = "";
                    })
                    .catch((error: Error) => {
                        Toast.show("上传失败，请重试");
                        console.error("Upload failed:", error);
                    });
            }
        };

        const handleRemove = () => {
            setPreviewUrl("");
            setHidden(false);
        };

        return (
            <div>
                <input
                    type="file"
                    accept="video/*"
                    onChange={handleChange}
                    id="hiddenFileInput"
                    style={{ display: "none" }}
                />
                <label htmlFor="hiddenFileInput">
                    {!isHidden && !previewUrl && (
                        <ImageUploader
                            disableUpload={true}
                            maxCount={1}
                            style={{ width: "100%" }}
                            upload={function (file: File): Promise<ImageUploadItem> {
                                throw new Error("Function not implemented.");
                            }}
                        />
                    )}
                </label>

                {previewUrl && (
                    <div style={{ marginTop: 10, position: "relative" }}>
                        <video
                            src={previewUrl}
                            controls
                            style={{ width: "140px", height: "80px" }}
                        >
                            您的设备不支持视频播放
                        </video>
                        <span onClick={handleRemove} className="close-btn">
                            &times;
                        </span>
                    </div>
                )}
            </div>
        );
    };

    const videoUploadEl = useMemo(() => {
        return (
            <VideoUploader
                upload={uploadVideo}
                onChange={uploadVideoChange}
                value={fileVideo}
            />
        );
    }, [fileVideo]);

    return (
        <div>
            <Form
                name="form"
                form={form}
                onFinish={onFinish}
                initialValues={videoDetail}
                footer={
                    <Button block type="submit" color="primary" size="large">
                        提交
                    </Button>
                }
            >
                <Form.Item
                    name="coverImg"
                    rules={[{ required: true }]}
                    label={
                        <div className="uploadTip">
                            <span className="uploadHeadtitle">上传封面</span>
                            <span className="uploadSubtitle">尺寸(16/9)</span>
                        </div>
                    }
                >
                    <ImageUploader
                        value={fileImgList}
                        onChange={setFileImgList}
                        upload={uploadImg}
                        beforeUpload={beforeUpload}
                        maxCount={1}
                        style={{ width: "140px" }}
                    />
                </Form.Item>
                <Form.Item
                    name="playUrl"
                    rules={[{ required: true }]}
                    label={
                        <div className="uploadTip">
                            <span className="uploadHeadtitle">上传视频</span>
                            <span className="uploadSubtitle">小于200Mb</span>
                        </div>
                    }
                >
                    {/* <VideoUploader upload={uploadVideo} onChange={uploadVideoChange} value={fileVideo} /> */}
                    {videoUploadEl}
                </Form.Item>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <Form.Item
                        name="money"
                        label={
                            <div>
                                价格
                                <span style={{ color: "#1677ff", fontSize: "10px" }}>
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
                        setVideoVisible(true);
                    }}
                    rules={[{ required: true }]}
                >
                    <Picker
                        columns={videClassify}
                        visible={videoVisible}
                        value={videoValue}
                        onClose={() => {
                            setVideoVisible(false);
                        }}
                        onConfirm={(v) => {
                            setVideoValue(v);
                        }}
                        onSelect={(val, extend) => {
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
                        setColllectionVideoVisible(true);
                    }}
                    rules={[{ required: true }]}
                >
                    <Picker
                        columns={colllectionClassify}
                        visible={colllectionVisible}
                        value={colllectionValue}
                        onClose={() => {
                            setColllectionVideoVisible(false);
                        }}
                        onConfirm={(v) => {
                            setColllectionValue(v);
                        }}
                        onSelect={(val, extend) => {
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
                <Form.Item name="title" label="视频名" rules={[{ required: true }]}>
                    <Input placeholder="请输入" />
                </Form.Item>
                {/* <Form.Item name="useTime" label="使用时间" rules={[{ required: true }]}>
                    <Input placeholder="请输入" />
                </Form.Item> */}
                <Form.Item name="info" label="简介" rules={[{ required: true }]}>
                    <TextArea placeholder="请输入" maxLength={30} rows={2} showCount />
                </Form.Item>
            </Form>
        </div>
    );
}
