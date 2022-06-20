
export const userType = {
  0: '系统管理员',
  1: '普通管理员'
}

export function returnRouteType(type) {
  let myType = type == '0' ? '系统管理员' : '基本管理员'
  return myType
}



