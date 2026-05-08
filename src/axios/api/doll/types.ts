/**
 * 玩偶系列信息（含数据库主键，用于更新/展示）
 */
export interface DollSeriesInfo {
  id: string
  series_id: string
  series_name: string
}


/**
 * 玩偶系列响应
 */
export interface DollSeriesResponse {
  total: number
  content: (DollSeriesInfo & { create_time: string })[]
}

/**
 * 玩偶系列获取参数
 */
export interface DollSeriesParams {
  series_id?: string
  series_name?: string
  page?: number
  limit?: number
}

/**
 * 玩偶列表参数
 */
export interface DollParams {
  limit?: string
  page?: string
  series_id?: string
  doll_name?: string
}

/**
 * 玩偶信息
 */
export interface DollInfo {
  doll_id: string
  doll_name: string
  series_id: string
  series_name: string
  description: string
  doll_image: string
  launch_time: string
}

export interface DollInfoResponse {
  total: number
  content: (DollInfo & { create_time: string })[]
}

/**
 * 更新参数
 */
export interface DollUpdateParams {
  id: string
  description?: string
  doll_id?: string
  doll_image?: string
  doll_name?: string
  launch_time?: string
  series_id?: string
  series_name?: string
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
    resource_id: string
    url: string
    filename: string
    size: number
  }
}
