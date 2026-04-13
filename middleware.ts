import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['zh-TW', 'en', 'ja'],
  defaultLocale: 'zh-TW'
});

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
};
