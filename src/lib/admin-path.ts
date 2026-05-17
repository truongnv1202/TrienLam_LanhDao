/** Đường dẫn CMS — không công khai trên menu trang chủ */
export const ADMIN_BASE_PATH = "/admin1111";
export const ADMIN_LOGIN_PATH = `${ADMIN_BASE_PATH}/login`;

export function isAdminPath(pathname: string): boolean {
  return (
    pathname === ADMIN_BASE_PATH ||
    pathname.startsWith(`${ADMIN_BASE_PATH}/`)
  );
}

export function isAdminLoginPath(pathname: string): boolean {
  return pathname === ADMIN_LOGIN_PATH;
}
