import React from "react";
import { GlobalState } from "@/store";
import { useSelector } from "react-redux";

export default ({ children, role = 'admin' }) => {
  // 从store中获取sign和isJudge，根据sign得知是否为管理，根据isJudge得知是否为评委
  // role='admin'需要admin权限，role='judge'需要judge权限，默认需要管理权限
  const { sign, isJudge } = useSelector((state: GlobalState) => state.userInfo);
  return (
    <>
      {
        (role === 'admin' && sign) || (role === 'judge' && isJudge) ? children : null
      }
    </>
  )
}