import request from '@/utils/request/request';

// 图片压缩
export const imgCompress = async (
  file: File,
  options: { maxWidth?: number; maxHeight?: number, compressWidth?: number, compressHeight?: number }
): Promise<File> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const maxWidth = options.maxWidth || img.width;
      const maxHeight = options.maxHeight || img.width;
      let width = img.width;
      let height = img.height;
      if (img.width > maxWidth || img.height > maxHeight) {
        if (img.width > img.height) {
          width = maxWidth;
          height = Math.round((img.height * maxWidth) / img.width);
        } else {
          height = maxHeight;
          width = Math.round((img.width * maxHeight) / img.height);
        }
      }
      canvas.width = options.compressWidth || width;
      canvas.height = options.compressHeight || height;
      ctx?.drawImage(img, 0, 0, width, height);
      const base64 = canvas.toDataURL("image/jpeg", 0.7);
      const compressFile = dataURLToBlob(base64);
      compressFile.lastModified = file.lastModified;
      compressFile.name = file.name;
      URL.revokeObjectURL(img.src);
      resolve(compressFile as File);
    };
  });
};

const dataURLToBlob = (dataURL: string): Blob => {
  const arr = dataURL.split(",");
  const mime = arr[0].match(/:(.*?);/)?.[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
};

/** 获取阿里云视频上传凭证 */
export const getOSSCredentials = async (): Promise<{
    accessKeyId: string;
    accessKeySecret: string;
    securityToken: string;
    expiration: string;
}> => {
    const res = await request('/newApi/aliyun/vod/getCredentials', {
        method: 'GET',
    });
    window.localStorage.setItem('OSSCredentials', JSON.stringify(res.data))
    return res.data;
};

/**
 * 判断临时凭证是否到期。
 **/
export function isCredentialsExpired(credentials: {
    accessKeyId: string;
    accessKeySecret: string;
    securityToken: string;
    expiration: string;
}): boolean {
  if (!credentials) {
    return true;
  }
  const expireDate = new Date(credentials.expiration);
  const now = new Date();
  // 如果有效期不足一分钟，视为过期。
  return expireDate.getTime() - now.getTime() <= 60000;
}

export class AliOSSUpload {
    public uploader: AliyunUpload.Vod;
    public statusText: string;
    public progressPercent: number;
    public onProgressChange?: (progress: number) => void;
    public onUploadSuccess?: (uploadInfo: any) => void;
    public onUploadFailed?: (uploadInfo: any, code: any, message: any) => void;

    constructor() {
        this.uploader = null;
        this.statusText = '';
        this.progressPercent = 0;
    }

    init(accessKeyId: string, accessKeySecret: string, secretToken: string, expiration: string) {
        const self = this;
        this.uploader = new AliyunUpload.Vod({
          timeout: 60000,
          partSize: Math.round(1048576),
          parallel: 5,
          retryCount: 3,
          retryDuration: 2,
          region: 'cn-beijing',
          userId: 'ldd',
          // localCheckpoint: true, //此参数是禁用服务端缓存
          // 添加文件成功
          addFileSuccess: function (uploadInfo: any) {
            console.log("addFileSuccess: " + uploadInfo.file.name)
          },
          // 开始上传
          onUploadstarted: (uploadInfo: any) => {
            this.uploader.setSTSToken(uploadInfo, accessKeyId, accessKeySecret, secretToken)
            console.log("onUploadStarted:", uploadInfo)
          },
          // 文件上传成功
          onUploadSucceed: function (uploadInfo: any) {
            console.log('onUploadSucceed', uploadInfo)
            if (self.onUploadSuccess) {
                self.onUploadSuccess(uploadInfo);
            }
            self.statusText = '文件上传成功!'
          },
          // 文件上传失败
          onUploadFailed: function (uploadInfo: any, code: any, message: any) {
            console.log("onUploadFailed: file:", uploadInfo)
            if (self.onUploadFailed) {
                self.onUploadFailed(uploadInfo, code, message);
            }
            self.statusText = '文件上传失败!'
          },
          // 取消文件上传
          onUploadCanceled: function (uploadInfo: any, code: any, message: any) {
            console.log("Canceled file: ", uploadInfo)
            self.statusText = '文件已暂停上传'
          },
          // 文件上传进度，单位：字节, 可以在这个函数中拿到上传进度并显示在页面上
          onUploadProgress: function (uploadInfo: any, totalSize: any, progress: any) {
            let progressPercent = Math.ceil(progress * 100)
            self.progressPercent = progressPercent // 更新进度
            self.statusText = '文件上传中...'
            console.log('上传进度:', progressPercent + '%')
            
            // 触发进度变化回调
            if (self.onProgressChange) {
                self.onProgressChange(progressPercent);
            }
          },
          // 上传凭证超时
          onUploadTokenExpired: function (uploadInfo: any) {
            // 如果是上传方式二即根据 STSToken 实现时，从新获取STS临时账号用于恢复上传
            // 上传文件过大时可能在上传过程中 sts token 就会失效, 所以需要在 token 过期的回调中调用 resumeUploadWithSTSToken 方法
            // 这里是测试接口, 所以我直接获取了 STSToken
            this.uploader.resumeUploadWithSTSToken(accessKeyId, accessKeySecret, secretToken, expiration)
            self.statusText = '文件超时...'
          },
          // 全部文件上传结束
          onUploadEnd: function (uploadInfo: any) {
            console.log("onUploadEnd: uploaded all the files")
            self.statusText = '文件上传完毕'
          }
        })
    }
}

export class SingleAliOSSUpload {
    private static aliOSSUploaderInstance;

    public static getInstance(accessKeyId: string, accessKeySecret: string, secretToken: string, expiration: string) {
        if (!this.aliOSSUploaderInstance) {
            this.aliOSSUploaderInstance = new AliOSSUpload()
            this.aliOSSUploaderInstance.init(accessKeyId, accessKeySecret, secretToken, expiration)
        }
        return this.aliOSSUploaderInstance
    }

    public static resetInstance(accessKeyId: string, accessKeySecret: string, secretToken: string, expiration: string) {
        this.aliOSSUploaderInstance = null
        this.getInstance(accessKeyId, accessKeySecret, secretToken, expiration)
    }
}
