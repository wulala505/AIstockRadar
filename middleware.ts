import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['zh-TW', 'en'],
  defaultLocale: 'zh-TW'
});

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
};
