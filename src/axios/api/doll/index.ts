import createAxiosInstance from '@/axios/request'
import type { DollSeriesParams, DollSeriesResponse, DollImageConfigParams, DollImageConfigResponse } from './types'

const { request } = createAxiosInstance()

/**
 * 玩偶管理相关 API
 */
export const dollApi = {
  /**
   * 创建或更新玩偶系列信息
   * TODO: 由用户定义具体的接口地址和参数
   */
  createOrUpdateSeries: (params: DollSeriesParams) =>
    request<DollSeriesResponse>({
      url: '/api/doll/series',
      method: 'POST',
      data: params,
    }),

  /**
   * 获取玩偶系列列表
   * TODO: 由用户定义具体的接口地址和参数
   */
  getSeriesList: () =>
    request({
      url: '/api/doll/series/list',
      method: 'GET',
    }),

  /**
   * 更新玩偶图片配置
   * TODO: 由用户定义具体的接口地址和参数
   */
  updateImageConfig: (params: DollImageConfigParams) =>
    request<DollImageConfigResponse>({
      url: '/api/doll/image-config',
      method: 'POST',
      data: params,
    }),

  /**
   * 获取角色列表（用于下拉选择）
   * TODO: 由用户定义具体的接口地址和参数
   */
  getCharacterList: () =>
    request({
      url: '/api/doll/characters',
      method: 'GET',
    }),

  /**
   * 上传图片
   * TODO: 由用户定义具体的接口地址和参数
   */
  uploadImage: (file: FormData) =>
    request({
      url: '/api/doll/upload/image',
      method: 'POST',
      data: file,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),

  /**
   * 上传视频
   * TODO: 由用户定义具体的接口地址和参数
   */
  uploadVideo: (file: FormData) =>
    request({
      url: '/api/doll/upload/video',
      method: 'POST',
      data: file,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
}
