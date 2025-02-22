// 专门出来用户相关的网络请求
import request from "@/utils/request";

/**
 * @description: 用户登录
 */
export function login(username,password) {
  return request({
    method: "post",
    url: "/api/login",
    params:{
        username:username,
        password:password 
    },
  });
}
