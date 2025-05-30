import React, { useEffect, useRef, useState } from 'react'
import { history } from 'umi'
import NavBarBack from '@/components/NavBarBack/NavBarBack'
import { Button, Card, Form, ImageUploader, ImageUploadItem, Input, TextArea, Toast } from 'antd-mobile'
import './index.less'
import request from '@/utils/request/request';
import { RequstStatusEnum } from '@/utils/request/request.type';
import { Crop, ReactCrop } from 'react-image-crop' // 添加引入
import 'react-image-crop/dist/ReactCrop.css'  // 添加引入

export default function Setting() {
    const [form] = Form.useForm();
    const [userInfo, setUserInfo] = useState<{ nickname: string }>();
    const [fileList, setFileList] = useState<ImageUploadItem[]>([{ url: '' }]);
    const [crop, setCrop] = useState<Crop>({
        unit: 'px',
        x: 25,
        y: 25,
        width: 100,
        height: 100
    })
    const [src, setSrc] = useState<string>()
    const [showCrop, setShowCrop] = useState(false)
    const imgRef = useRef<HTMLImageElement>(null)

    useEffect(() => {
        getUserInfo();
    }, []);

    useEffect(() => {
        if (userInfo) {
            form.setFieldsValue(userInfo);
        }
    }, [userInfo]);

    const getUserInfo = async () => {
        const res = await request('/newApi/user/myInfo', { method: 'GET' });
        if (res.code === RequstStatusEnum.success) {
            setUserInfo(res.data)
            setFileList([{ url: res.data.avatar }])
        }
    }

    const onFinish = () => {
        resetUserInfo()
    }

    const resetUserInfo = async () => {
        const formValue = form.getFieldsValue();
        const data1 = {
            avatar: fileList[0].url,
            nickname: formValue.nickname,
            info: formValue.info
        }
        const updateUserInfo = await request('/newApi/user/updateMyInfo', {
            method: 'POST',
            body: data1
        })

        if (updateUserInfo.code === RequstStatusEnum.success) {
            Toast.show('更新成功');
            history.back();
        } else {
            Toast.show('更新失败');
        }
    }

    function beforeUpload(file: File) {
        if (file.size > 5 * 1024 * 1024) {
            Toast.show('请选择小于 5M 的图片')
            return null
        }
        // 读取文件并显示裁剪界面
        const reader = new FileReader()
        reader.onload = () => {
            setSrc(reader.result as string)
            setShowCrop(true)
        }
        reader.readAsDataURL(file)
        return null // 阻止自动上传
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

        // 转换为 File 对象
        canvas.toBlob(async (blob) => {
            if (blob) {
                const file = new File([blob], 'avatar.png', { type: 'image/png' })
                const result = await uploadImg(file)
                setFileList([result])
                setShowCrop(false)
            }
        }, 'image/png')
    }

    const uploadImg = async (file: File): Promise<ImageUploadItem> => {
        const formdata = new FormData();
        formdata.append("file", file);

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

    return (
        <div style={{ padding: '46px 0' }}>
            <NavBarBack content={'设置'} style={{ maxWidth: '450px', background: '#fff', position: 'fixed', top: '0', width: '100%', zIndex: '99' }} />
            <div style={{ padding: '0 6px', marginTop: '60px' }}>
                <Card
                    title={
                        <div className='advator'>
                            <ImageUploader
                                value={fileList}
                                onChange={setFileList}
                                upload={uploadImg}
                                beforeUpload={beforeUpload}
                                maxCount={1}
                                style={{ borderRadius: '50px', width: '50px' }}
                            />
                        </div>
                    }
                >
                    <div></div>
                </Card>
                <Form
                    name="form"
                    form={form}
                    layout='horizontal'
                    initialValues={userInfo}
                >
                    <Form.Item name='nickname' label='昵称'>
                        <Input placeholder="请输入" />
                    </Form.Item>
                    <Form.Item name='info' label='简介'>
                        <TextArea
                            placeholder='请输入'
                        />
                    </Form.Item>
                </Form>
                <Button onClick={onFinish} block type='submit' color='primary' size='large' style={{ marginTop: '10px' }}>
                    提交
                </Button>
            </div>
            {showCrop && src && (
                <div className="crop-modal">
                    <div style={{ marginBottom: '10px', textAlign: 'center' }}>
                        当前裁剪尺寸: {Math.round(crop.width)} x {Math.round(crop.height)} 像素
                    </div>
                    <ReactCrop
                        crop={crop}
                        onChange={c => setCrop(c)}
                        aspect={1}
                        circularCrop
                    >
                        <img ref={imgRef} src={src} />
                    </ReactCrop>
                    <div className="crop-actions">
                        <Button onClick={handleCropComplete}>确认</Button>
                        <Button onClick={() => setShowCrop(false)}>取消</Button>
                    </div>
                </div>
            )}
        </div>
    )
}
