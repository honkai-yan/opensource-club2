export interface User {
  id?: number;
  name?: string;
  password?: string;
  nick_name?: string;
  avatar_src?: string;
  sch_id?: string;
  description?: string;
  cur_point?: number;
  total_point?: number;
  join_date?: string;
  delete_date?: string;
  is_deleted?: number;
}
