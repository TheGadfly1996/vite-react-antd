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

export const uploadImage = (params: FormData) =>
  request<{
    resource_id: string
    image_url: string
  }>({
    url: '/management/mini/image/upload',
    method: 'POST',
    data: params,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
