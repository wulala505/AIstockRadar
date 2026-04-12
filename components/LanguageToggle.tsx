'use client';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';

export default function LanguageToggle() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLocale = () => {
    const newLocale = locale === 'zh-TW' ? 'en' : 'zh-TW';
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };

  return (
    <button
      onClick={toggleLocale}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium text-white/80 hover:text-white"
    >
      <span>{locale === 'zh-TW' ? '繁中' : 'EN'}</span>
      <span className="text-white/40">→</span>
      <span>{locale === 'zh-TW' ? 'EN' : '繁中'}</span>
    </button>
  );
}
