// Localization utility for multi-language support (Kinyarwanda & English)
export type Language = 'en' | 'rw';

const translations: Record<Language, Record<string, string>> = {
  en: {
    'user.registered': 'User registered successfully',
    'user.retrieved': 'User retrieved successfully',
    'user.verified': 'User verified successfully',
    'property.created': 'Property created successfully',
    'property.retrieved': 'Property retrieved successfully',
    'property.updated': 'Property updated successfully',
    'property.verified': 'Property verified successfully',
    'request.created': 'Request created successfully',
    'request.retrieved': 'Request retrieved successfully',
    'request.connected': 'Request connected successfully',
    'request.completed': 'Request completed successfully',
    'commission.created': 'Commission recorded successfully',
    'commission.retrieved': 'Commission retrieved successfully',
    'auth.login.success': 'Login successful',
    'auth.login.failed': 'Invalid credentials',
    'auth.unauthorized': 'Unauthorized access',
    'auth.forbidden': 'Forbidden: Insufficient permissions',
    'validation.failed': 'Validation failed',
    'not.found': 'Resource not found',
    'server.error': 'Internal server error',
  },
  rw: {
    'user.registered': 'Umukoresha wiyandikishije neza',
    'user.retrieved': 'Umukoresha wabonetse neza',
    'user.verified': 'Umukoresha wemejwe neza',
    'property.created': 'Inzu yashyizweho neza',
    'property.retrieved': 'Inzu yabonetse neza',
    'property.updated': 'Inzu yahinduwe neza',
    'property.verified': 'Inzu yemejwe neza',
    'request.created': 'Gusaba kwashyizweho neza',
    'request.retrieved': 'Gusaba kwabonetse neza',
    'request.connected': 'Gusaba kwiyunze neza',
    'request.completed': 'Gusaba gwarangiye neza',
    'commission.created': 'Komisiyo yanditswe neza',
    'commission.retrieved': 'Komisiyo yabonetse neza',
    'auth.login.success': 'Kwinjira byagenze neza',
    'auth.login.failed': 'Amakuru atari ukuri',
    'auth.unauthorized': 'Ntugomba kwinjira',
    'auth.forbidden': 'Ntugomba kugira uburenganzira',
    'validation.failed': 'Gukemura byanze',
    'not.found': 'Ntibyabonetse',
    'server.error': 'Ikosa mu seriveri',
  },
};

export function translate(key: string, lang: Language = 'en'): string {
  return translations[lang]?.[key] || key;
}

export function getLanguageFromHeader(acceptLanguage?: string): Language {
  if (!acceptLanguage) return 'en';
  return acceptLanguage.toLowerCase().includes('rw') ? 'rw' : 'en';
}

