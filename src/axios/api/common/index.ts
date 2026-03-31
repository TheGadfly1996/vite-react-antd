import useAxios from '@/axios/request/index'

const { request } = useAxios()

export const getUploadAuth = (params: {
  video_name: string
  cover_url: string
  filename: string
}) =>
  request<{
    UploadAuth: string
    UploadAddress: string
    VideoId: string
  }>({
    url: '/mall_admin/editor/tutorial/video/certificate',
    method: 'POST',
    data: params,
  })

export const refreshUploadAuth = (params: { video_oss_id: string }) =>
  request<{
    UploadAuth: string
    UploadAddress: string
    VideoId: string
  }>({
    url: '/mall_admin/editor/tutorial/video/refresh',
    method: 'POST',
    data: params,
  })
