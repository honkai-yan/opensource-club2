export class UserDetailDto {
  id: number;
  name: string;
  nick_name: string;
  description: string;
  avatar_src: string;
  role: string;
  direction: string;
  department: string;
  sch_id: string;
  cur_point: number;
  total_point: number;
  join_date: string;
  delete_date: string;
  is_deleted: number;

  constructor(
    id: number,
    name: string,
    nic_kname: string,
    description: string,
    avatar_src: string,
    role: string,
    direction: string,
    department: string,
    sch_id: string,
    cur_point: number,
    total_point: number,
    join_date: string,
    delete_date: string,
    is_delete: number,
  ) {
    this.id = id;
    this.name = name;
    this.nick_name = nic_kname;
    this.description = description;
    this.avatar_src = avatar_src;
    this.role = role;
    this.direction = direction;
    this.department = department;
    this.sch_id = sch_id;
    this.cur_point = cur_point;
    this.total_point = total_point;
    this.join_date = join_date;
    this.delete_date = delete_date;
    this.is_deleted = is_delete;
  }
}
