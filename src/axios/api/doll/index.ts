import createAxiosInstance from '@/axios/request'
import type {
  DollImageConfigParams,
  DollImageConfigResponse,
  DollInfo,
  DollInfoResponse,
  DollParams,
  DollSeriesInfo,
  DollSeriesParams,
  DollSeriesResponse,
  DollUpdateParams,
} from './types'

const { request } = createAxiosInstance()

/**
 * 玩偶系列相关 API
 */
export const DollSeriesApi = {
  /**
   * 创建玩偶系列
   */
  CreateDollSeries: (params: Omit<DollSeriesInfo, 'id'>) =>
    request({
      url: '/management/mini/doll/series/',
      method: 'POST',
      data: params,
    }),
  /**
   * 获取玩偶系列列表
   */
  GetDollSeriesList: (params: DollSeriesParams) =>
    request<DollSeriesResponse>({
      url: '/management/mini/doll/series/',
      method: 'GET',
      params,
    }),
  /**
   * 更新玩偶系列
   */
  UpdateDollSeries: (params: DollSeriesInfo) =>
    request({
      url: '/management/mini/doll/series/',
      method: 'PUT',
      data: params,
    }),
  /**
   * 删除玩偶系列
   */
  DeleteDollSeries: (id: string) =>
    request({
      url: `/management/mini/doll/series/`,
      method: 'DELETE',
      params: { id },
      isShowLoading: false,
    }),
}
/**
 * 玩偶管理相关 API
 */
export const DollApi = {
  /**
   * 创建玩偶
   */
  CreateDollSeries: (params: DollInfo) =>
    request({
      url: '/management/mini/doll/dolls/',
      method: 'POST',
      data: params,
    }),

  /**
   * 获取玩偶
   */
  GetDollList: (params: DollParams) =>
    request<DollInfoResponse>({
      url: '/management/mini/doll/dolls/',
      method: 'GET',
      params,
    }),

  /**
   * 更新玩偶
   */
  UpdateDoll: (params: DollUpdateParams) =>
    request({
      url: '/management/mini/doll/dolls/',
      method: 'PUT',
      data: params,
    }),
  /**
   * 删除玩偶系列信息
   */
  DeleteDoll: (id: string) =>
    request({
      url: `/management/mini/doll/dolls/`,
      params: { id },
      method: 'DELETE',
    }),

  /**
   * 更新玩偶图片配置
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
