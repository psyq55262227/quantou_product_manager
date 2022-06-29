import Mock from 'mockjs';
import { isSSR } from '@/utils/is';
import setupMock from '@/utils/setupMock';
import { generatePermission } from '@/routes';

if (!isSSR) {
  Mock.XHR.prototype.withCredentials = false;

  setupMock({
    setup: () => {
      // 用户信息
      const userRole = window.localStorage.getItem('userRole') || 'admin';
      Mock.mock(new RegExp('/api/user/userInfo'), () => {
        return Mock.mock({
          username: '王立群',
          permissions: generatePermission(userRole),
        });
      });
    },
  });
}
