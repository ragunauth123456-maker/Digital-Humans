import { createServerFn } from "@tanstack/react-start";

export interface ProfileData {
  display_name: string;
  title?: string;
  biography?: string;
  expertise_areas?: string[];
  years_experience?: number;
  credentials?: { name: string; issuer: string; year: number }[];
  education?: { degree: string; institution: string; year: number }[];
  certifications?: { name: string; issuer: string; year: number }[];
  languages?: string[];
  avatar_url?: string;
}

export interface Profile extends ProfileData {
  id: number;
  clerk_user_id: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

const ensureTable = async (sql: ReturnType<typeof import("@neondatabase/serverless").neon>) => {
  await sql`CREATE TABLE IF NOT EXISTS profiles (
    id SERIAL PRIMARY KEY,
    clerk_user_id TEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    title TEXT,
    biography TEXT,
    expertise_areas JSONB DEFAULT '[]',
    credentials JSONB DEFAULT '[]',
    years_experience INTEGER,
    education JSONB DEFAULT '[]',
    certifications JSONB DEFAULT '[]',
    languages JSONB DEFAULT '[]',
    avatar_url TEXT,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  )`;
};

export const createProfile = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    const obj = data as { clerkUserId?: string } & ProfileData;
    if (!obj.clerkUserId || typeof obj.clerkUserId !== "string") {
      throw new Error("Authentication required.");
    }
    if (!obj.display_name || typeof obj.display_name !== "string" || !obj.display_name.trim()) {
      throw new Error("Display name is required.");
    }
    const display_name = obj.display_name.trim();
    const title = obj.title?.trim() || undefined;
    const biography = obj.biography?.trim() || undefined;
    const expertise_areas = Array.isArray(obj.expertise_areas) ? obj.expertise_areas.filter(Boolean) : [];
    const years_experience = obj.years_experience && Number.isFinite(obj.years_experience) ? obj.years_experience : undefined;
    const credentials = Array.isArray(obj.credentials) ? obj.credentials : [];
    const education = Array.isArray(obj.education) ? obj.education : [];
    const certifications = Array.isArray(obj.certifications) ? obj.certifications : [];
    const languages = Array.isArray(obj.languages) ? obj.languages.filter(Boolean) : [];
    return {
      clerk_user_id: obj.clerkUserId,
      display_name,
      title,
      biography,
      expertise_areas,
      years_experience,
      credentials,
      education,
      certifications,
      languages,
    };
  })
  .handler(async ({ data }) => {
    let neonPkg: typeof import("@neondatabase/serverless") | null = null;
    try {
      neonPkg = await import("@neondatabase/serverless");
    } catch {
      return { success: false as const, error: "no-db" as const };
    }

    const url = process.env.DATABASE_URL;
    if (!url) {
      return { success: false as const, error: "no-db" as const };
    }

    const sql = neonPkg.neon(url);

    try {
      await ensureTable(sql);
    } catch {
      return { success: false as const, error: "no-db" as const };
    }

    // Check for duplicate
    try {
      const existing = await sql`
        SELECT id FROM profiles WHERE clerk_user_id = ${data.clerk_user_id}
      `;
      if (existing.length > 0) {
        return { success: false as const, error: "duplicate" as const, existingId: existing[0].id as number };
      }
    } catch {
      return { success: false as const, error: "no-db" as const };
    }

    try {
      const result = await sql`
        INSERT INTO profiles (
          clerk_user_id, display_name, title, biography,
          expertise_areas, years_experience,
          credentials, education, certifications, languages,
          is_published
        ) VALUES (
          ${data.clerk_user_id}, ${data.display_name}, ${data.title ?? null},
          ${data.biography ?? null},
          ${JSON.stringify(data.expertise_areas)},
          ${data.years_experience ?? null},
          ${JSON.stringify(data.credentials)},
          ${JSON.stringify(data.education)},
          ${JSON.stringify(data.certifications)},
          ${JSON.stringify(data.languages)},
          true
        )
        RETURNING id
      `;
      return { success: true as const, profileId: result[0].id as number };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("unique") || msg.includes("duplicate")) {
        return { success: false as const, error: "duplicate" as const };
      }
      return { success: false as const, error: "unknown" as const };
    }
  });

export const getProfile = createServerFn({ method: "GET" })
  .validator((data: unknown) => {
    const obj = data as { profileId?: number };
    if (!obj.profileId || !Number.isFinite(obj.profileId)) {
      throw new Error("Profile ID is required.");
    }
    return { profileId: obj.profileId };
  })
  .handler(async ({ data }) => {
    let neonPkg: typeof import("@neondatabase/serverless") | null = null;
    try {
      neonPkg = await import("@neondatabase/serverless");
    } catch {
      return { success: false as const, error: "no-db" as const };
    }

    const url = process.env.DATABASE_URL;
    if (!url) {
      return { success: false as const, error: "no-db" as const };
    }

    const sql = neonPkg.neon(url);

    try {
      await ensureTable(sql);
    } catch {
      return { success: false as const, error: "no-db" as const };
    }

    try {
      const rows = await sql`
        SELECT * FROM profiles WHERE id = ${data.profileId}
      `;
      if (rows.length === 0) {
        return { success: false as const, error: "not-found" as const };
      }
      const p = rows[0];
      const profile: Profile = {
        id: p.id as number,
        clerk_user_id: p.clerk_user_id as string,
        display_name: p.display_name as string,
        title: p.title as string | undefined,
        biography: p.biography as string | undefined,
        expertise_areas: (p.expertise_areas as string[]) ?? [],
        years_experience: p.years_experience as number | undefined,
        credentials: (p.credentials as ProfileData["credentials"]) ?? [],
        education: (p.education as ProfileData["education"]) ?? [],
        certifications: (p.certifications as ProfileData["certifications"]) ?? [],
        languages: (p.languages as string[]) ?? [],
        avatar_url: p.avatar_url as string | undefined,
        is_published: (p.is_published as boolean) ?? false,
        created_at: String(p.created_at),
        updated_at: String(p.updated_at),
      };
      return { success: true as const, profile };
    } catch {
      return { success: false as const, error: "no-db" as const };
    }
  });

export const getMyProfile = createServerFn({ method: "GET" })
  .validator((data: unknown) => {
    const obj = data as { clerkUserId?: string };
    if (!obj.clerkUserId || typeof obj.clerkUserId !== "string") {
      throw new Error("Authentication required.");
    }
    return { clerkUserId: obj.clerkUserId };
  })
  .handler(async ({ data }) => {
    let neonPkg: typeof import("@neondatabase/serverless") | null = null;
    try {
      neonPkg = await import("@neondatabase/serverless");
    } catch {
      return { success: false as const, error: "no-db" as const };
    }

    const url = process.env.DATABASE_URL;
    if (!url) {
      return { success: false as const, error: "no-db" as const };
    }

    const sql = neonPkg.neon(url);

    try {
      await ensureTable(sql);
    } catch {
      return { success: false as const, error: "no-db" as const };
    }

    try {
      const rows = await sql`
        SELECT * FROM profiles WHERE clerk_user_id = ${data.clerkUserId}
      `;
      if (rows.length === 0) {
        return { success: false as const, error: "not-found" as const };
      }
      const p = rows[0];
      const profile: Profile = {
        id: p.id as number,
        clerk_user_id: p.clerk_user_id as string,
        display_name: p.display_name as string,
        title: p.title as string | undefined,
        biography: p.biography as string | undefined,
        expertise_areas: (p.expertise_areas as string[]) ?? [],
        years_experience: p.years_experience as number | undefined,
        credentials: (p.credentials as ProfileData["credentials"]) ?? [],
        education: (p.education as ProfileData["education"]) ?? [],
        certifications: (p.certifications as ProfileData["certifications"]) ?? [],
        languages: (p.languages as string[]) ?? [],
        avatar_url: p.avatar_url as string | undefined,
        is_published: (p.is_published as boolean) ?? false,
        created_at: String(p.created_at),
        updated_at: String(p.updated_at),
      };
      return { success: true as const, profile };
    } catch {
      return { success: false as const, error: "no-db" as const };
    }
  });
