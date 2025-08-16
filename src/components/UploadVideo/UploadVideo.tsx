import React, { useEffect, useMemo, useRef, useState } from "react";
import { history, useLocation, useParams } from "umi";
import {
    ImageUploader,
    ImageUploadItem,
    Toast,
    Picker,
    List,
    SpinLoading,
    Mask,
} from "antd-mobile";
import { Form, Input, Button, TextArea } from "antd-mobile";
import "./index.less";
import request from "@/utils/request/request";
import { RequstStatusEnum } from "@/utils/request/request.type";
import { AuditStatusEnum } from "@/utils/type/global.type";
import { AliOSSUpload, getOSSCredentials, imgCompress, isCredentialsExpired, SingleAliOSSUpload } from "@/utils";
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';
import { toBlobURL } from '@ffmpeg/util';
import { Crop, ReactCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

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
    const [imgFile, setImgFile] = useState<File>();
    const [videoFile, setVideoFile] = useState<File>();
    const [visible, setVisible] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [ffmpeg] = useState<FFmpeg>(() => new FFmpeg());
    const [compressing, setCompressing] = useState(false);
    const [compressComplete, setCompressComplete] = useState(false);
    const [crop, setCrop] = useState<Crop>({
        unit: 'px',
        x: 25,
        y: 25,
        width: 121,  // 16
        height: 68, // 9
    });
    const [cropSrc, setCropSrc] = useState<string>();
    const [showCrop, setShowCrop] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);
    let [aliOSSUploader, setAliOSSUploader] = useState<AliOSSUpload>()
    const [videoId, setVideoId] = useState<string>()

    useEffect(() => {
        const loadFFmpeg = async () => {
            try {
                // 加载 FFmpeg
                await ffmpeg.load({
                    coreURL: 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.js',
                    wasmURL: 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.wasm',
                });
                console.log('FFmpeg 加载成功');
            } catch (error) {
                console.error('FFmpeg 加载失败:', error);
            }
        };

        // loadFFmpeg();

        const updateOSSCredentials = async () => {
            let oSSCredentials = JSON.parse(window.localStorage.getItem('OSSCredentials') as string)
            if (isCredentialsExpired(oSSCredentials)) {
                oSSCredentials = await getOSSCredentials()
            }
            const loader = SingleAliOSSUpload.getInstance(oSSCredentials.accessKeyId, oSSCredentials.accessKeySecret, oSSCredentials.securityToken, oSSCredentials.expiration)
            setAliOSSUploader(loader)
        }
        updateOSSCredentials()
    }, []);

    useEffect(() => {
        if (aliOSSUploader) {
            aliOSSUploader.onProgressChange = (progress: number) => {
                setUploadProgress(progress);
            };
        }
    }, [aliOSSUploader]);

    useEffect(() => {
        console.log('上传进度变化:', uploadProgress + '%');
    }, [uploadProgress]);

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
        setVisible(true)
        let status;
        if (type === UploadType.edit) {
            status = await updateVideo(values);
        } else {
            status = await addVideo(values);
        }
        Toast.show({
            content: status.status ? "上传/更新成功" : status.data,
        });

        if (status.status) {
            form.resetFields();
            history.back();
        }
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
                    // labelList: item.labelList,
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
            // res.data.labelList = [Number(res.data.labelList[0])];
            res.code === RequstStatusEnum.success && setVideoDetail(res.data);
        }
    };

    const addVideo = async (values: any): Promise<{ status: boolean; data: any }> => {
        let coverImg = values.coverImg[0]?.url
        let playUrl = values.playUrl
        if (isBlobUrl(coverImg)) {
            coverImg = await startUploadImg()
            form.setFieldValue('coverImg', [{ url: coverImg }])
        }
        if (isBlobUrl(playUrl)) {
            try {
                playUrl = await startUploadVideo() // 等待上传完成
                form.setFieldValue('playUrl', playUrl.videoId)
                setVideoId(playUrl.videoId)
            } catch (error) {
                console.error('视频上传失败:', error);
                Toast.show('视频上传失败');
                setVisible(false);
                return { status: false, data: '视频上传失败' };
            }
        }
        const data = {
            title: values.title, //标题
            info: values.info, //简介
            coverImg: coverImg ? coverImg : "", //封面
            playUrl: playUrl.videoId ?? videoId, //上传视频的地址
            collNum: Number(values.collNum), //集数
            pid: id ? id : values.collection[0], //合集的id
            useTime: values.useTime, //购买一次使用的时间，单位 小时
            money: Number(values.money), //价格
            // labelList: values.labelList, //分类id
        };
        const res = await request("/newApi/works/addVideo", {
            method: "POST",
            body: data,
        });
        setVisible(false)
        return {
            status: res.code === RequstStatusEnum.success,
            data: res.msg
        };
    };

    const isBlobUrl = (url: string): boolean => {
        try {
            return url.startsWith('blob:');
        } catch (e) {
            return false;
        }
    }

    const updateVideo = async (values: any): Promise<{ status: boolean; data: any }> => {
        let coverImg = values.coverImg[0]?.url
        let playUrl = values.playUrl
        if (isBlobUrl(coverImg)) {
            coverImg = await startUploadImg()
            form.setFieldValue('coverImg', [{ url: coverImg }])
        }
        if (isBlobUrl(playUrl)) {
            try {
                playUrl = await startUploadVideo() // 等待上传完成
                form.setFieldValue('playUrl', playUrl.videoId)
                setVideoId(playUrl.videoId)
            } catch (error) {
                console.error('视频上传失败:', error);
                Toast.show('视频上传失败');
                setVisible(false);
                return { status: false, data: '视频上传失败' };
            }
        }
        const data = {
            id: videoDetail?.id,
            title: values.title,
            info: values.info,
            coverImg: coverImg ? coverImg : "", //封面
            playUrl: playUrl.videoId ?? videoId, //上传视频的地址values.playUrl,
            collNum: Number(values.collNum),
            pid: values.collection[0],
            useTime: values.useTime,
            money: Number(values.money),
            // labelList: values.labelList,
        };
        const res = await request("/newApi/works/update", {
            method: "POST",
            body: data,
        });
        setVisible(false)
        return {
            status: res.code === RequstStatusEnum.success,
            data: res.msg
        };
    };

    interface CropCompleteEvent extends CustomEvent {
        detail: File;
    }

    async function beforeUpload(file: File): Promise<File | null> {
        if (file.size > 5 * 1024 * 1024) {
            Toast.show('请选择小于 5M 的图片')
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

    const startUploadImg = async () => {
        if (!imgFile) return null;
        const formdata = new FormData();
        formdata.append("file", imgFile);

        const res = await fetch("/apiFile/file/upload", {
            method: "POST",
            headers: {
                Authorization: localStorage.getItem('Token') as string,
            },
            body: formdata,
        });
        const data = await res.json();
        return data.data
    }

    const startUploadVideo = async () => {
        if (!videoFile) return null
        
        return new Promise((resolve, reject) => {
            if (!aliOSSUploader) {
                reject(new Error('上传器未初始化'));
                return;
            }

            // 设置上传成功回调
            aliOSSUploader.onUploadSuccess = (uploadInfo: any) => {
                console.log('uploadInfo', uploadInfo);
                resolve(uploadInfo);
            };

            // 设置上传失败回调
            aliOSSUploader.onUploadFailed = (uploadInfo: any, code: any, message: any) => {
                console.log('上传失败:', message);
                reject(new Error(message || '上传失败'));
            };

            // 开始上传
            aliOSSUploader.uploader.startUpload();
        });
    }

    const uploadImg = async (file: File): Promise<ImageUploadItem> => {
        const compressFile = await imgCompress(file, { maxWidth: 750, maxHeight: 422 })
        setImgFile(compressFile)
        return {
            url: URL.createObjectURL(compressFile),
        };
    };

    const uploadVideo = async (file: File): Promise<ImageUploadItem> => {
        if (file.size > 1024 * 1024 * 1024) {
            Toast.show({
                content: `视频大小不能超过1G`,
            });
            return Promise.reject('视频大小不能超过1G');
        }
        console.log('pre ', file)
        // const compressedFile = await videoCompress(file);
        // 压缩视频
        const compressedFile = file;
        console.log('after', compressedFile)
        setVideoFile(compressedFile);
        const paramData = JSON.stringify({
            Vod: {
                TemplateGroupId: '18ea3c3ee4c67b23d9a79e57c2923a2f'
            }
        })
        aliOSSUploader?.uploader.addFile(compressedFile, null, null, null, paramData)

        return {
            url: URL.createObjectURL(compressedFile),
        };
    };

    const start = () => {
        aliOSSUploader?.uploader.startUpload()
    }

    const videoCompress = async (file: File): Promise<File> => {
        try {
            setCompressing(true); // 开始压缩时显示 loading
            setCompressComplete(false); // 重置完成状态
            // 将文件加载到 FFmpeg
            const inputFileName = 'input.mp4';
            await ffmpeg.writeFile(inputFileName, await fetchFile(file));
            // 执行压缩命令
            await ffmpeg.exec([
                '-i', inputFileName,                    // 输入文件

                // 视频编码设置
                '-c:v', 'libx264',                     // 使用 H.264 编码器
                '-crf', '28',                          // 压缩质量(0-51): 0=无损,23=默认,28=压缩率高,51=最差
                '-preset', 'veryfast',                 // 编码速度预设
                '-profile:v', 'baseline',              // H.264 配置
                '-vf', 'scale=-1:1080',              // 固定分辨率为1920x1080
                '-r', '25',                            // 帧率
                '-b:v', '128k',                       // 视频比特率(总比特率1364k - 音频比特率64k)
                '-maxrate', '2048k',                   // 最大视频码率
                '-bufsize', '409600k',                 // 编码器缓冲区大小
                '-movflags', '+faststart',             // 优化网络播放

                // 音频编码设置
                '-c:a', 'aac',                         // 音频编码器
                '-b:a', '62k',                         // 固定音频码率为64k
                '-ar', '22050',                        // 音频采样率
                '-ac', '1',                            // 声道数
                '-af', 'volume=1.0',                   // 音频滤镜

                // 其他设置
                '-threads', '0',                       // CPU线程数
                '-y',                                  // 自动覆盖输出文件
                'output.mp4'                           // 输出文件名
            ]);


            // 获取压缩后的文件
            const data = await ffmpeg.readFile('output.mp4');
            const compressedFile = new File([data], file.name, { type: 'video/mp4' });

            // 清理内存
            await ffmpeg.deleteFile(inputFileName);
            await ffmpeg.deleteFile('output.mp4');

            setCompressComplete(true); // 设置压缩完成
            return compressedFile;
        } catch (error) {
            console.error('视频压缩失败:', error);
            return file; // 如果压缩失败则返回原文件
        } finally {
            setCompressing(false); // 无论成功失败都关闭 loading
        }
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
                        Toast.show(error);
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
                            controlsList="nodownload"
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
    }, [fileVideo, aliOSSUploader]);

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
                const compressedFile = await imgCompress(file, { maxWidth: 750, maxHeight: 422 })
                setImgFile(compressedFile)

                // 创建预览URL并更新UI
                const previewUrl = URL.createObjectURL(compressedFile)
                setFileImgList([{ url: previewUrl }])

                // 触发裁剪完成事件
                window.dispatchEvent(new CustomEvent('cropComplete', { detail: compressedFile }))
                setShowCrop(false)
            }
        }, 'image/png')
    }

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
                    disabled={type === UploadType.edit && (videoDetail?.status === AuditStatusEnum.normal || videoDetail?.status === AuditStatusEnum.audit)}
                    label={
                        <div className="uploadTip">
                            <span className="uploadHeadtitle">上传视频</span>
                            <span className="uploadSubtitle">只支持16/9的视频且小于1G</span>
                        </div>
                    }
                >
                    {videoUploadEl}
                </Form.Item>
                <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', bottom: '-0', right: '0', fontSize: '14px', display: 'flex', alignItems: 'center' }}>
                        {compressing && (
                            <>
                                <SpinLoading color='primary' style={{ marginRight: '5px' }} />
                                <span>
                                    <div>
                                        转码中...
                                    </div>
                                    <div>
                                        预计5分钟,请勿退出！！！
                                    </div>
                                </span>
                            </>
                        )}
                        {!compressing && compressComplete && (
                            <span style={{ color: '#52c41a' }}>转码成功</span>
                        )}
                    </div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <Form.Item
                        name="money"
                        label={
                            <div>
                                价格
                                <span style={{ color: "#1677ff", fontSize: "10px" }}>
                                    10灵动币=1元
                                </span>
                            </div>
                        }
                        extra={
                            <div
                                style={{ position: "relative", top: "15px", fontSize: "13px" }}
                            >
                                灵动币
                            </div>
                        }
                        initialValue={0}
                    >
                        <Input placeholder="请输入" type="number" />
                    </Form.Item>
                    <Form.Item name="collNum" label="集数">
                        <Input placeholder="请输入" type="number" />
                    </Form.Item>
                </div>
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
                            // const value = colllectionClassify.find(item => item[0]?.value === v[0])?.[0]?.labelList
                            // setVideoValue(value);
                            // form.setFieldValue('labelList', value)
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
                {/* <Form.Item
                    name="labelList"
                    label="分类"
                    trigger="onConfirm"
                    onClick={(e) => {
                        setVideoVisible(true);
                    }}
                    disabled={true}
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
                </Form.Item> */}
                <Form.Item name="title" label="视频名" rules={[{ required: true }]}>
                    <Input placeholder="请输入" />
                </Form.Item>
                <Form.Item name="info" label="简介">
                    <TextArea placeholder="请输入" rows={2} showCount />
                </Form.Item>
            </Form>
            <div style={{ position: 'fixed', top: "50%", left: "50%", transform: "translate(-50%, -50%)", display: `${visible ? '' : 'none'}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexFlow: 'column' }}>
                    <SpinLoading color='primary' />
                    <span>{`视频上传中进度：${uploadProgress}%`}</span>
                </div>
            </div>
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
