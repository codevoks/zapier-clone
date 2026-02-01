import api from './client'

export const postRequest = async ({
  path,
  data,
}: {
  path: string
  data: any
}) => {
  return await api.post(path, data)
}

export const getRequest = async ({
  path,
  data,
}: {
  path: string
  data: any
}) => {
  return await api.get(path, { params: data })
}

export const updateRequest = async ({
  path,
  data,
}: {
  path: string
  data: any
}) => {
  return await api.put(path, data)
}

export const deleteRequest = async ({
  path,
  data,
}: {
  path: string
  data: any
}) => {
  return await api.delete(path, { params: data })
}
