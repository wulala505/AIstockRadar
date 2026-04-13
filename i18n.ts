import { getRequestConfig } from 'next-intl/server';
import { readFileSync } from 'fs';
import { join } from 'path';

export default getRequestConfig(async ({ locale }) => {
  const messages = JSON.parse(
    readFileSync(join(process.cwd(), 'messages', `${locale}.json`), 'utf8')
  );
  return { messages };
});
