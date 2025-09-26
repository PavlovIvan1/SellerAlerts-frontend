// Допустимые скоупы - получаем из запроса /tokens/scopes
export interface TokenScope {
  [key: number]: string;
}

// Маппинг позиций битов -> "читаемые" названия
export const TokenScopeMap: TokenScope = {
  1: "CONTENT",
  2: "CONTENT_ANALYTICS", 
  3: "DISCOUNT_AND_PRICES",
  4: "MARKETPLACE",
  5: "STATISTICS",
  6: "ADVERT",
  7: "QUESTIONS_AND_FEEDBACK",
  8: "RECOMMENDATIONS",
  9: "BUYER_CHAT",
  10: "SUPPLIES",
  11: "RETURNS",
  12: "DOCUMENTS",
  30: "READ_ONLY",
};

export interface DecodedToken {
  supplierId: string | null;
  exp: number;
  expiredAt: Date;
  expired: boolean;
  scopesMask: number;
  scopes: number[];
  scopesNamed: string[];
  readOnly: boolean;
  isValidForOurUse: boolean;
}

export interface Scope {
  name: string;
  value: "content" | "contentanalytics" | "discountsandprices" | "marketplace" | "statistics" | "advert" | "questionsandfeedback" | "recommendations" | "buyerchat" | "supplies" | "returns" | "documents" | "read-only";
  type: "REQUIRED" | "OPTIONAL";
}

function base64UrlDecodeToJson(str: string): any {
  // base64url -> base64
  const b64 = str.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(str.length / 4) * 4, "=");
  const json = atob(b64);
  return JSON.parse(json);
}

export function decodeWbToken(token: string, allowedScopes: number[]): DecodedToken {
  if (typeof token !== "string") {
    throw new Error("Token must be a string");
  }

  const parts = token.split(".");
  if (parts.length < 2) {
    throw new Error("Invalid JWT");
  }

  // Без проверки подписи: просто читаем payload
  const payload = base64UrlDecodeToJson(parts[1]);
  const supplierId = payload.sid ?? null;
  const exp = payload.exp; // секундный UNIX timestamp
  const scopesMask = payload.s ?? 0;

  // извлекаем скоупы по битовой маске (1-базные позиции)
  const positions = Object.keys(TokenScopeMap).map(Number);
  const scopes = positions.filter((pos) => (scopesMask & (1 << (pos - 1))) !== 0);

  // read_only — это бит 30
  const readOnly = (scopesMask & (1 << (30 - 1))) !== 0;

  // проверка истечения срока
  const nowSec = Math.floor(Date.now() / 1000);
  const expiredAt = typeof exp === "number" ? exp : 0;
  const expired = expiredAt <= nowSec;

  // проверка, что ВСЕ скоупы токена входят в допустимый список
  const scopesAllowedOnly = scopes.every((pos) => allowedScopes.includes(pos));

  return {
    supplierId,
    exp: expiredAt,
    expiredAt: new Date(expiredAt * 1000),
    expired,
    scopesMask,
    scopes, // массив позиций, например [1,4,30]
    scopesNamed: scopes.map((pos) => TokenScopeMap[pos] ?? `UNKNOWN_${pos}`),
    readOnly,
    isValidForOurUse: !expired && scopesAllowedOnly,
  };
}
