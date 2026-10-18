const PROFILE_KEY = "skillnode_profile";
const RESULTS_KEY = "skillnode_results";
const ALERTS_KEY = "skillnode_alerts";
const PUBLIC_KEY = "skillnode_public_profiles";

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage errors so the UI remains usable.
  }
}

function createId(prefix = "sn") {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `${prefix}_${crypto.randomUUID()}`;
  }
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function trim(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeProfile(profile) {
  if (!profile?.id) return null;
  const rawName = trim(profile.name);
  const rawUsername = trim(profile.username);
  const username = rawUsername || (rawName ? rawName.toLowerCase().replace(/[^a-z0-9_]/g, "") : "operator");
  return {
    id: profile.id,
    name: rawName || username,
    username,
    email: trim(profile.email),
    password: profile.password || "",
    phone: trim(profile.phone),
    region: trim(profile.region) || "Global",
    bio: trim(profile.bio),
    githubUrl: trim(profile.githubUrl),
    linkedinUrl: trim(profile.linkedinUrl),
    portfolioUrl: trim(profile.portfolioUrl),
    xUrl: trim(profile.xUrl),
    dpUrl: typeof profile.dpUrl === "string" ? profile.dpUrl : null,
    createdAt: Number(profile.createdAt) || Date.now(),
    updatedAt: Number(profile.updatedAt) || Date.now(),
  };
}

function persistProfile(profile) {
  const normalized = normalizeProfile(profile);
  if (!normalized) return null;

  writeJson(PROFILE_KEY, normalized);

  const shared = readJson(PUBLIC_KEY, {});
  shared[normalized.id] = normalized;
  writeJson(PUBLIC_KEY, shared);

  return normalized;
}

function toNumber(value) {
  return Number.isFinite(value) ? Number(value) : 0;
}

function toNullableNumber(value) {
  return Number.isFinite(value) ? Number(value) : null;
}

async function fileToDataUrl(file) {
  if (!file) return null;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : null);
    reader.onerror = () => reject(new Error("Could not read the selected image."));
    reader.readAsDataURL(file);
  });
}

function allResults() {
  const parsed = readJson(RESULTS_KEY, []);
  return Array.isArray(parsed) ? parsed : [];
}

function allAlerts() {
  const parsed = readJson(ALERTS_KEY, []);
  return Array.isArray(parsed) ? parsed : [];
}

function bestResultsFor(results) {
  const bestByType = new Map();

  for (const result of results) {
    const existing = bestByType.get(result.activityType);
    if (
      !existing ||
      result.score > existing.bestScore ||
      (result.score === existing.bestScore && (result.accuracy ?? -1) > (existing.bestAccuracy ?? -1))
    ) {
      bestByType.set(result.activityType, {
        activityType: result.activityType,
        bestScore: result.score,
        bestAccuracy: result.accuracy,
      });
    }
  }

  return [...bestByType.values()].sort((a, b) => b.bestScore - a.bestScore);
}

function profileIdOrGuest(userId) {
  return userId || getSessionProfile()?.id || "guest";
}

export function getSessionProfile() {
  return normalizeProfile(readJson(PROFILE_KEY, null));
}

export function hasActiveSession() {
  return Boolean(getSessionProfile()?.id);
}

export async function loginWithCredentials({ usernameOrEmail, password }) {
  const query = trim(usernameOrEmail).toLowerCase();
  if (!query) throw new Error("Please enter a username or email.");

  const allShared = readJson(PUBLIC_KEY, {});
  let matched = Object.values(allShared).find(
    (p) =>
      (p?.email && p.email.toLowerCase() === query) ||
      (p?.username && p.username.toLowerCase() === query)
  );

  if (!matched) {
    const current = getSessionProfile();
    if (
      current &&
      ((current.email && current.email.toLowerCase() === query) ||
        (current.username && current.username.toLowerCase() === query))
    ) {
      matched = current;
    }
  }

  if (matched) {
    if (matched.password && password && matched.password !== password) {
      throw new Error("Invalid password. Please check your credentials.");
    }
    return persistProfile({
      ...matched,
      password: password || matched.password || "",
      updatedAt: Date.now(),
    });
  }

  // Auto-provision player profile
  const isEmail = query.includes("@");
  const identifier = isEmail ? query.split("@")[0].replace(/[^a-z0-9_]/g, "") : query.replace(/[^a-z0-9_]/g, "");
  return persistProfile({
    id: createId("player"),
    name: identifier || "Operator",
    username: identifier || "operator",
    email: isEmail ? query : `${identifier}@skillnode.dev`,
    password: password || "",
    region: "Global",
    bio: "SkillNODE Operator",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });
}

export async function createSessionProfile(input) {
  const current = getSessionProfile();
  const dpUrl = input.dpFile ? await fileToDataUrl(input.dpFile) : current?.dpUrl || null;
  const rawName = trim(input.name);
  const rawUsername = trim(input.username);
  const username = rawUsername || (rawName ? rawName.toLowerCase().replace(/[^a-z0-9_]/g, "") : "operator");

  return persistProfile({
    id: current?.id || createId("player"),
    name: rawName || username,
    username,
    email: trim(input.email),
    password: input.password || "",
    phone: trim(input.phone),
    region: trim(input.region) || "Global",
    bio: current?.bio || "",
    githubUrl: current?.githubUrl || "",
    linkedinUrl: current?.linkedinUrl || "",
    portfolioUrl: current?.portfolioUrl || "",
    xUrl: current?.xUrl || "",
    dpUrl,
    createdAt: current?.createdAt || Date.now(),
    updatedAt: Date.now(),
  });
}

export async function updateSessionProfile(input) {
  const current = getSessionProfile();
  if (!current) throw new Error("No active local profile found.");

  const dpUrl = input.dpFile ? await fileToDataUrl(input.dpFile) : current.dpUrl || null;
  const rawName = trim(input.name ?? current.name);
  const rawUsername = trim(input.username ?? current.username);
  const username = rawUsername || (rawName ? rawName.toLowerCase().replace(/[^a-z0-9_]/g, "") : "operator");

  return persistProfile({
    ...current,
    name: rawName || username,
    username,
    email: trim(input.email ?? current.email),
    password: input.password ?? current.password ?? "",
    phone: trim(input.phone ?? current.phone),
    region: trim(input.region ?? current.region),
    bio: trim(input.bio ?? current.bio),
    githubUrl: trim(input.githubUrl ?? current.githubUrl),
    linkedinUrl: trim(input.linkedinUrl ?? current.linkedinUrl),
    portfolioUrl: trim(input.portfolioUrl ?? current.portfolioUrl),
    xUrl: trim(input.xUrl ?? current.xUrl),
    dpUrl,
    updatedAt: Date.now(),
  });
}

export function clearSessionProfile() {
  try {
    localStorage.removeItem(PROFILE_KEY);
  } catch {
    // Ignore storage errors on sign-out.
  }
}

export function saveActivityResult(payload) {
  const profile = getSessionProfile();
  const result = {
    id: createId("result"),
    userId: profile?.id || "guest",
    name: profile?.name || "Player",
    region: profile?.region || "",
    dpUrl: profile?.dpUrl || null,
    activityType: trim(payload.activityType),
    score: toNumber(payload.score),
    accuracy: toNullableNumber(payload.accuracy),
    durationMs: toNullableNumber(payload.durationMs),
    metadata: payload.metadata || {},
    createdAt: Date.now(),
  };

  writeJson(RESULTS_KEY, [result, ...allResults()].slice(0, 240));
  return result;
}

export function recordFairPlayEvent(payload) {
  const profile = getSessionProfile();
  const event = {
    id: createId("alert"),
    userId: profile?.id || "guest",
    type: trim(payload.type),
    activityId: trim(payload.activityId),
    message: trim(payload.message),
    meta: payload.meta || {},
    createdAt: Date.now(),
  };

  writeJson(ALERTS_KEY, [event, ...allAlerts()].slice(0, 180));
  return event;
}

export function getSummary(userId = profileIdOrGuest()) {
  const targetUserId = profileIdOrGuest(userId);
  const results = allResults().filter((item) => item.userId === targetUserId);
  const alerts = allAlerts().filter((item) => item.userId === targetUserId);

  return {
    totals: {
      totalAttempts: results.length,
      alertCount: alerts.length,
    },
    bestResults: bestResultsFor(results),
    recentResults: results
      .slice(0, 8)
      .map((item) => ({
        id: item.id,
        activityType: item.activityType,
        score: item.score,
        accuracy: item.accuracy,
        durationMs: item.durationMs,
        createdAt: item.createdAt,
      })),
  };
}

export function getLeaderboard(activityType, take = 5) {
  const filtered = allResults().filter((item) => item.activityType === activityType);
  const bestByUser = new Map();

  for (const result of filtered) {
    const existing = bestByUser.get(result.userId);
    if (
      !existing ||
      result.score > existing.bestScore ||
      (result.score === existing.bestScore && (result.accuracy ?? -1) > (existing.bestAccuracy ?? -1))
    ) {
      bestByUser.set(result.userId, {
        userId: result.userId,
        name: result.name || "Player",
        region: result.region || "",
        dpUrl: result.dpUrl || null,
        bestScore: result.score,
        bestAccuracy: result.accuracy,
      });
    }
  }

  return [...bestByUser.values()]
    .sort((a, b) => b.bestScore - a.bestScore || (b.bestAccuracy ?? 0) - (a.bestAccuracy ?? 0))
    .slice(0, take)
    .map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));
}

export function getPublicProfile(userId) {
  const shared = readJson(PUBLIC_KEY, {});
  const profile = normalizeProfile(shared?.[userId] || (getSessionProfile()?.id === userId ? getSessionProfile() : null));
  if (!profile) return null;

  const summary = getSummary(userId);
  return {
    ...profile,
    bestResults: summary.bestResults,
    recentResults: summary.recentResults,
  };
}

function toBase64(text) {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}

function fromBase64(value) {
  const binary = atob(value);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function encodePublicProfilePayload(userId) {
  const profile = getPublicProfile(userId);
  if (!profile) return "";

  try {
    const payload = {
      ...profile,
      dpUrl: typeof profile.dpUrl === "string" && profile.dpUrl.startsWith("data:") ? null : profile.dpUrl,
      recentResults: Array.isArray(profile.recentResults) ? profile.recentResults.slice(0, 4) : [],
    };
    return toBase64(JSON.stringify(payload));
  } catch {
    return "";
  }
}

export function decodePublicProfilePayload(value) {
  if (!value) return null;

  try {
    return JSON.parse(fromBase64(value));
  } catch {
    return null;
  }
}
