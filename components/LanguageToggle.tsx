'use client';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';

const LOCALES = [
  { code: 'zh-TW', label: '繁中' },
  { code: 'en',    label: 'EN'   },
  { code: 'ja',    label: '日本語' },
] as const;

export default function LanguageToggle() {
  const locale = useLocale();
  const router  = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: string) => {
    if (newLocale === locale) return;
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };

  return (
    <div className="flex items-center gap-1 bg-white/8 rounded-full p-1 border border-white/10">
      {LOCALES.map(({ code, label }) => (
        <button
          key={code}
          onClick={() => switchLocale(code)}
          className={`
            px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-200
            ${locale === code
              ? 'bg-[#f0ad23] text-[#0a1628] font-semibold shadow-sm'
              : 'text-white/50 hover:text-white/80 hover:bg-white/10'
            }
          `}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
