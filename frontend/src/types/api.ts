export interface ResponseResult<T> {
  statusCode: number;
  data: T;
  message: string;
}

export interface LoginRequestData {
  sch_id: string;
  pass: string;
  captcha: string;
}

export interface LoginResultData {
  id: number;
  name: string;
  nick_name: string;
  description: string;
  avatar_src: string;
  role: string;
  direction?: string;
  department: string;
  sch_id: string;
  cur_point: number;
  total_point: number;
  join_date: string;
  delete_date?: string;
  is_deleted: number;
}
