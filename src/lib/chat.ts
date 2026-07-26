import { createServerFn } from "@tanstack/react-start";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatRequest {
  profileId: number;
  messages: ChatMessage[];
}

interface ProfileForChat {
  display_name: string;
  title?: string;
  biography?: string;
  expertise_areas?: string[];
  years_experience?: number;
  credentials?: { name: string; issuer: string; year: number }[];
}

function buildSystemPrompt(profile: ProfileForChat): string {
  const firstName = profile.display_name.split(" ")[0];

  let prompt = `You are a Digital Human — an AI representation of ${profile.display_name}`;

  if (profile.title) {
    prompt += `, a ${profile.title}`;
  }
  if (profile.years_experience) {
    prompt += ` with ${profile.years_experience} years of experience`;
  }
  prompt += ".";

  if (profile.biography) {
    prompt += `\n\nBIOGRAPHY:\n${profile.biography}`;
  }

  if (profile.expertise_areas && profile.expertise_areas.length > 0) {
    prompt += `\n\nEXPERTISE:\n${profile.expertise_areas.join(", ")}`;
  }

  if (profile.credentials && profile.credentials.length > 0) {
    const creds = profile.credentials
      .map((c) => `${c.name} (${c.issuer}${c.year ? `, ${c.year}` : ""})`)
      .join("; ");
    prompt += `\n\nCREDENTIALS:\n${creds}`;
  }

  prompt += `\n\nINSTRUCTIONS:
- Answer questions as ${profile.display_name} would, based on their expertise, experience, and professional style
- Be professional, thoughtful, and precise
- If asked something outside your expertise, acknowledge the limitation honestly
- Never claim to be the actual person — you are their AI representation
- Keep responses concise and useful`;

  return prompt;
}

export const chatWithDigitalHuman = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    const obj = data as ChatRequest;
    if (!obj.profileId || !Number.isFinite(obj.profileId)) {
      throw new Error("Profile ID is required.");
    }
    if (!Array.isArray(obj.messages)) {
      throw new Error("Messages array is required.");
    }
    // Validate each message
    for (const m of obj.messages) {
      if (!m.role || !["user", "assistant"].includes(m.role)) {
        throw new Error("Invalid message role.");
      }
      if (typeof m.content !== "string") {
        throw new Error("Invalid message content.");
      }
    }
    return {
      profileId: obj.profileId,
      messages: obj.messages as ChatMessage[],
    };
  })
  .handler(async ({ data }) => {
    // Check for API key
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return { success: false as const, error: "not-configured" as const };
    }

    // Fetch profile from DB
    let profile: ProfileForChat | null = null;
    try {
      const neonPkg = await import("@neondatabase/serverless");
      const url = process.env.DATABASE_URL;
      if (!url) {
        return { success: false as const, error: "db-unavailable" as const };
      }
      const sql = neonPkg.neon(url);

      // Ensure table exists
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

      const rows = await sql`
        SELECT display_name, title, biography, expertise_areas, years_experience, credentials
        FROM profiles
        WHERE id = ${data.profileId} AND is_published = true
      `;

      if (rows.length === 0) {
        return { success: false as const, error: "not-found" as const };
      }

      const p = rows[0];
      profile = {
        display_name: p.display_name as string,
        title: p.title as string | undefined,
        biography: p.biography as string | undefined,
        expertise_areas: (p.expertise_areas as string[]) ?? [],
        years_experience: p.years_experience as number | undefined,
        credentials: (p.credentials as ProfileForChat["credentials"]) ?? [],
      };
    } catch (err) {
      return { success: false as const, error: "db-unavailable" as const };
    }

    if (!profile) {
      return { success: false as const, error: "not-found" as const };
    }

    // Call OpenAI
    try {
      const OpenAI = (await import("openai")).default;
      const openai = new OpenAI({ apiKey });

      const systemPrompt = buildSystemPrompt(profile);

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0.7,
        messages: [
          { role: "system", content: systemPrompt },
          ...data.messages.map((m) => ({
            role: m.role as "user" | "assistant",
            content: m.content,
          })),
        ],
      });

      const reply =
        completion.choices[0]?.message?.content ??
        "I apologize, but I wasn't able to generate a response. Please try again.";

      return { success: true as const, reply };
    } catch (err) {
      console.error("OpenAI chat error:", err);
      return {
        success: false as const,
        error: "ai-error" as const,
        message:
          "I'm having trouble responding right now. Please try again in a moment.",
      };
    }
  });
