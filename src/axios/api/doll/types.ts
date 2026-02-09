/**
 * 玩偶系列信息参数
 */
export interface DollSeriesParams {
  seriesId: string
  seriesName: string
  productModel: string
  characterName: string
}

/**
 * 玩偶系列信息响应
 */
export interface DollSeriesResponse {
  success: boolean
  message: string
  data?: {
    id: string
    seriesId: string
    seriesName: string
    productModel: string
    characterName: string
    createdAt: string
    updatedAt: string
  }
}

/**
 * 玩偶图片配置参数
 */
export interface DollImageConfigParams {
  characterName: string
  characterDescription?: string
  videoUrl?: string
  imageWithBase?: string
  thumbnailWithBase?: string
  imageWithoutBase?: string
}

/**
 * 玩偶图片配置响应
 */
export interface DollImageConfigResponse {
  success: boolean
  message: string
  data?: {
    id: string
    characterName: string
    characterDescription?: string
    videoUrl?: string
    imageWithBase?: string
    thumbnailWithBase?: string
    imageWithoutBase?: string
    createdAt: string
    updatedAt: string
  }
}

/**
 * 角色选项
 */
export interface CharacterOption {
  label: string
  value: string
}

/**
 * 文件上传响应
 */
export interface UploadResponse {
  success: boolean
  message: string
  data?: {
    url: string
    filename: string
    size: number
  }
}
