export interface ParsedUA {
  device: 'desktop' | 'mobile' | 'tablet' | 'bot';
  os: string;
  browser: string;
  isBot: boolean;
  botName?: string;
}

const BOTS: Array<{ name: string; pattern: RegExp }> = [
  { name: 'Googlebot', pattern: /googlebot/i },
  { name: 'Bingbot', pattern: /bingbot/i },
  { name: 'GPTBot', pattern: /gptbot/i },
  { name: 'ChatGPT-User', pattern: /chatgpt-user/i },
  { name: 'ClaudeBot', pattern: /claudebot|anthropic-ai/i },
  { name: 'CCBot', pattern: /ccbot/i },
  { name: 'Bytespider', pattern: /bytespider/i },
  { name: 'Twitterbot', pattern: /twitterbot/i },
  { name: 'LinkedInBot', pattern: /linkedinbot/i },
  { name: 'Slackbot', pattern: /slackbot/i },
  { name: 'Discordbot', pattern: /discordbot/i },
  { name: 'TelegramBot', pattern: /telegrambot/i },
  { name: 'Applebot', pattern: /applebot/i },
  { name: 'DuckDuckBot', pattern: /duckduckbot/i },
  { name: 'Baiduspider', pattern: /baiduspider/i },
  { name: 'YandexBot', pattern: /yandexbot/i },
  { name: 'AhrefsBot', pattern: /ahrefsbot/i },
  { name: 'SemrushBot', pattern: /semrushbot/i },
  { name: 'Generic Bot', pattern: /bot|spider|crawl|slurp|headless|phantomjs/i },
];

export function parseUserAgent(uaString: string = ''): ParsedUA {
  const ua = uaString || '';

  // 1. Check for Bot
  for (const bot of BOTS) {
    if (bot.pattern.test(ua)) {
      return {
        device: 'bot',
        os: 'Bot / Crawler',
        browser: bot.name,
        isBot: true,
        botName: bot.name,
      };
    }
  }

  // 2. Detect Device Type
  let device: 'desktop' | 'mobile' | 'tablet' = 'desktop';
  if (/ipad|tablet|(android(?!.*mobile))/i.test(ua)) {
    device = 'tablet';
  } else if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile|wpdesktop/i.test(ua)) {
    device = 'mobile';
  }

  // 3. Detect Operating System
  let os = 'Unknown OS';
  if (/windows nt 10.0/i.test(ua)) os = 'Windows 11/10';
  else if (/windows nt 6.3/i.test(ua)) os = 'Windows 8.1';
  else if (/windows nt 6.2/i.test(ua)) os = 'Windows 8';
  else if (/windows nt 6.1/i.test(ua)) os = 'Windows 7';
  else if (/windows/i.test(ua)) os = 'Windows';
  else if (/macintosh|mac os x/i.test(ua)) os = 'macOS';
  else if (/iphone|ipad|ipod/i.test(ua)) {
    const match = ua.match(/os (\d+[_.]\d+)/i);
    os = match ? `iOS ${match[1].replace('_', '.')}` : 'iOS';
  } else if (/android/i.test(ua)) {
    const match = ua.match(/android (\d+([._]\d+)?)/i);
    os = match ? `Android ${match[1].replace('_', '.')}` : 'Android';
  } else if (/cros/i.test(ua)) os = 'Chrome OS';
  else if (/ubuntu/i.test(ua)) os = 'Ubuntu';
  else if (/linux/i.test(ua)) os = 'Linux';

  // 4. Detect Browser
  let browser = 'Unknown Browser';
  if (/edg\/|edge\//i.test(ua)) {
    const match = ua.match(/edg(?:e)?\/(\d+(\.\d+)?)/i);
    browser = match ? `Edge ${match[1].split('.')[0]}` : 'Edge';
  } else if (/opr\/|opera/i.test(ua)) {
    const match = ua.match(/(?:opr|opera)\/(\d+)/i);
    browser = match ? `Opera ${match[1]}` : 'Opera';
  } else if (/samsungbrowser/i.test(ua)) {
    const match = ua.match(/samsungbrowser\/(\d+)/i);
    browser = match ? `Samsung Internet ${match[1]}` : 'Samsung Internet';
  } else if (/chrome|crios/i.test(ua) && !/edg|opr/i.test(ua)) {
    const match = ua.match(/(?:chrome|crios)\/(\d+)/i);
    browser = match ? `Chrome ${match[1]}` : 'Chrome';
  } else if (/fxios|firefox/i.test(ua)) {
    const match = ua.match(/(?:firefox|fxios)\/(\d+)/i);
    browser = match ? `Firefox ${match[1]}` : 'Firefox';
  } else if (/safari/i.test(ua) && !/chrome|crios|android/i.test(ua)) {
    const match = ua.match(/version\/(\d+)/i);
    browser = match ? `Safari ${match[1]}` : 'Safari';
  } else if (/msie|trident/i.test(ua)) {
    browser = 'Internet Explorer';
  }

  return {
    device,
    os,
    browser,
    isBot: false,
  };
}
