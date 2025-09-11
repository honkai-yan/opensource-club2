export enum ExceptionEnum {
  RequestParamExceptionCode = 401,
  RequestParamException = '请求参数错误',

  CaptchaErrorExceptionCode = 401,
  CaptchaErrorException = '验证码错误',

  UserNotFoundExceptionCode = 404,
  UserNotFoundException = '用户不存在',

  PasswordIncorrectExceptionCode = 401,
  PasswordIncorrectException = '密码错误',

  InternalServerErrorExceptionCode = 500,
  InternalServerErrorException = '服务器内部错误',

  RefreshTokenInvalidExceptionCode = 401,
  RefreshTokenInvalidException = '登录信息已失效',

  AccessTokenInvalidExceptionCode = 401,
  AccessTokenInvalidException = '登录信息已失效',

  InvalidUserExceptionCode = 401,
  InvalidUserException = '非法用户',

  NoPermissionExceptionCode = 401,
  NoPermissionException = '权限不足',

  DuplicateUserExceptionCode = 409,
  DuplicateUserException = '用户已存在',

  // 未知角色
  UnknownRoleExceptionCode = 400,
  UnknownRoleException = '未知角色',

  // 重复添加小组
  DuplicateGroupExceptionCode = 409,
  DuplicateGroupException = '小组已存在',
}
