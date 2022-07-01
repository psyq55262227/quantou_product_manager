import React from "react";
import { GlobalState } from "@/store";
import { useSelector } from "react-redux";

export default ({ children }) => {
  // 从store中获取sign，根据sign得知是否为管理。若为管理，则显示子组件
  const { sign } = useSelector((state: GlobalState) => state.userInfo);
  return (
    <>
      {
        sign ? children : null
      }
    </>
  )
}