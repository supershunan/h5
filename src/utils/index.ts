// 图片压缩
export const imgCompress = async (file: File, options: { maxWidth?: number, maxHeight?: number }): Promise<File> => {
    return new Promise((resolve) => {
        const img = new Image()
        img.src = URL.createObjectURL(file)
        img.onload = () => {
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')
            const maxWidth = options.maxWidth || img.width
            const maxHeight = options.maxHeight || img.width
            let width = img.width
            let height = img.height
            if (img.width > maxWidth || img.height > maxHeight) {
                if (img.width > img.height) {
                    width = maxWidth
                    height = Math.round(img.height * maxWidth / img.width)
                } else {
                    height = maxHeight
                    width = Math.round(img.width * maxHeight / img.height)
                }
            }
            canvas.width = width
            canvas.height = height
            ctx?.drawImage(img, 0, 0, width, height)
            const base64 = canvas.toDataURL('image/jpeg', 0.7)
            const compressFile = dataURLToBlob(base64)
            compressFile.lastModified = file.lastModified
            compressFile.name = file.name
            URL.revokeObjectURL(img.src)
            resolve(compressFile as File)
        }
    })
}

const dataURLToBlob = (dataURL: string): Blob => {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
};