"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import Image from "next/image";
import { MantraMark } from "@/components/MantraMark";
import { CharacterModel } from "@/components/CharacterModel";
import { characterAssets } from "@/data/character-assets";

type Theme = {
  name: string;
  bg: string;
  panel: string;
  accent: string;
  soft: string;
  text: string;
};

type Character = {
  name: string;
  description: string;
  outfit: string;
  detail: string;
  skin: string;
  hair: string;
  kind: string;
};

type Universe = {
  symbol: string;
  description: string;
  characters: Character[];
};

const themes: Theme[] = [
  { name: "Original Purple", bg: "#111027", panel: "#242047", accent: "#8b70f5", soft: "#f4a8e7", text: "#fff9ff" },
  { name: "Hello Kitty Pink", bg: "#fff2f8", panel: "#ffe0ed", accent: "#ef83b8", soft: "#ffadd4", text: "#46243a" },
  { name: "Cloud Blue", bg: "#edf6ff", panel: "#d9eaff", accent: "#5e9fe8", soft: "#a7d5ff", text: "#172b45" },
  { name: "Black & Gold", bg: "#101014", panel: "#222127", accent: "#d4b34f", soft: "#f3d978", text: "#fff9e8" },
  { name: "Mint Dream", bg: "#effbf5", panel: "#d8f4e6", accent: "#5da987", soft: "#a6e4c8", text: "#17382c" },
  { name: "Lavender", bg: "#f4f0ff", panel: "#e4dcff", accent: "#8c70d6", soft: "#c7b6ff", text: "#2d2347" },
];

const universes: Record<string, Universe> = {
  Avengers: {
    symbol: "✦",
    description: "Marvel-inspired heroes",
    characters: [
      ["Spider-Man", "Friendly, brave and curious", "#d93636", "#2364a8", "#e8bd98", "#17172c", "spider"],
      ["Iron Man", "Inventive and determined", "#d93636", "#d7a82e", "#edc09c", "#241a2c", "iron"],
      ["Black Widow", "Clever and courageous", "#171522", "#bd3434", "#edc09c", "#21182c", "widow"],
      ["Captain America", "Steady and loyal", "#2858a4", "#f2f0f8", "#e8bd98", "#34223a", "shield"],
      ["Thor", "Bold and protective", "#2460a8", "#d7b45d", "#edbd9f", "#6c3e29", "thor"],
      ["Shuri", "Curious and inventive", "#29233f", "#7654d9", "#8b513d", "#171522", "shuri"],
    ].map(toCharacter),
  },
  Barbie: {
    symbol: "♡",
    description: "Dream big and be whoever you want",
    characters: [
      ["Barbie", "Dreamer and friend", "#f08acb", "#f8d6ed", "#f0c39e", "#8a4d32", "barbie"],
      ["Princess Barbie", "Kind and courageous", "#d982d2", "#d9b5ff", "#f0c39e", "#9a633d", "princess"],
      ["Astronaut Barbie", "Curious explorer", "#4b8ad7", "#e9eaf4", "#f0c39e", "#8a4d32", "space"],
      ["Mermaid Barbie", "Ocean dreamer", "#49b9cf", "#8f70e9", "#f0c39e", "#b55b83", "mermaid"],
      ["Artist Barbie", "Creative spirit", "#e6a4df", "#e9c1f5", "#f0c39e", "#8a4d32", "artist"],
    ].map(toCharacter),
  },
  Sanrio: {
    symbol: "♡",
    description: "Sweet and cozy companions",
    characters: [
      ["Hello Kitty", "Warm and friendly", "#f7b9d7", "#fff8fc", "#f0c39e", "#fff8fc", "kitty"],
      ["Kuromi", "Playful and bold", "#252132", "#c9b8ff", "#f0c39e", "#262033", "kuromi"],
      ["My Melody", "Gentle and kind", "#f2a9c8", "#fff0f5", "#f0c39e", "#f3a9c9", "melody"],
      ["Cinnamoroll", "Dreamy and soft", "#8bc8f7", "#fff9ff", "#f0c39e", "#b4d9fa", "cinnamoroll"],
      ["Pompompurin", "Cozy and cheerful", "#d6b16d", "#f7dca0", "#f0c39e", "#9c733a", "pompom"],
      ["Keroppi", "Cheerful explorer", "#62c98c", "#f4f3c4", "#f0c39e", "#62c98c", "keroppi"],
    ].map(toCharacter),
  },
  "DC Heroes": {
    symbol: "⚡",
    description: "Gotham and beyond",
    characters: [
      ["Batman", "Quiet, brave and determined", "#15151f", "#d7c44a", "#e8bd98", "#1a1a24", "batman"],
      ["Superman", "Hopeful and steady", "#2464b6", "#d83d4d", "#e8bd98", "#34223a", "super"],
      ["Wonder Woman", "Strong and compassionate", "#a52c43", "#d8b24d", "#e8bd98", "#3b242e", "wonder"],
      ["Batgirl", "Clever and courageous", "#252238", "#8b70f5", "#e8bd98", "#21182c", "batgirl"],
    ].map(toCharacter),
  },
  "Disney Princesses": {
    symbol: "♕",
    description: "Magic, courage and adventure",
    characters: [
      ["Rapunzel", "Creative and curious", "#d7a45c", "#d6a3e8", "#f0c39e", "#8a4d32", "princess"],
      ["Cinderella", "Hopeful and kind", "#77b9ec", "#e6f4ff", "#f0c39e", "#9a633d", "princess"],
      ["Moana", "Brave explorer", "#bc543d", "#d3a05b", "#9d5e3f", "#171522", "princess"],
      ["Belle", "Book lover", "#d6a82e", "#f3c85b", "#f0c39e", "#6b3d2d", "princess"],
      ["Tiana", "Dreamer and doer", "#32956d", "#c8e7d1", "#8a513b", "#171522", "princess"],
      ["Mulan", "Courageous adventurer", "#bd4d5a", "#e0c6d6", "#edbd9f", "#21182c", "princess"],
    ].map(toCharacter),
  },
  Minecraft: {
    symbol: "▦",
    description: "Blocky explorers and builders",
    characters: [
      ["Block Builder", "Build at your own pace", "#5f9c55", "#7e9c52", "#d5a77d", "#593d2e", "block"],
      ["Cave Explorer", "Discover new paths", "#656a7b", "#3c5368", "#d5a77d", "#342c2a", "block"],
      ["Garden Keeper", "Grow something gentle", "#62a765", "#8cc66d", "#d5a77d", "#593d2e", "block"],
    ].map(toCharacter),
  },
};

const characterThemeOverrides: Record<string, string[]> = {
  "Hello Kitty": ["#fff2f8", "#ffe0ed", "#ef83b8", "#ffadd4", "#46243a"],
  Kuromi: ["#171320", "#2b2038", "#bd8bff", "#ff9bd7", "#fff4ff"],
  "My Melody": ["#fff1f5", "#ffdfeb", "#e98cb7", "#ffc4df", "#542d43"],
  Cinnamoroll: ["#eff8ff", "#dceeff", "#72b8ee", "#b5ddff", "#203b59"],
  Pompompurin: ["#fff7df", "#f4e4b7", "#c99943", "#f4d77d", "#49351d"],
  Keroppi: ["#effff0", "#d7f5dc", "#55ad70", "#a6e8ad", "#20462b"],
  Barbie: ["#fff0fa", "#ffdaef", "#e65caf", "#ffa6dc", "#532041"],
  "Princess Barbie": ["#fff0fc", "#f2dfff", "#c57ce7", "#f6b8f0", "#46244f"],
  "Astronaut Barbie": ["#edf5ff", "#d8e8ff", "#548fe1", "#b5d9ff", "#203756"],
  "Mermaid Barbie": ["#e9fcff", "#d1f3f6", "#38aabf", "#c4b3ff", "#193e4a"],
  "Artist Barbie": ["#fff0fc", "#f2dfff", "#d47bd2", "#ffb9e9", "#49234a"],
  Batman: ["#101014", "#25242c", "#d4b34f", "#f3d978", "#fff9e8"],
  Superman: ["#101e3c", "#1d3765", "#377ed0", "#e84c60", "#f7f7ff"],
  "Wonder Woman": ["#28111d", "#4a1c30", "#c94b63", "#edcc73", "#fff2ed"],
  "Spider-Man": ["#171323", "#2e203c", "#e54444", "#6fb5ff", "#fff5ff"],
  "Iron Man": ["#1d1115", "#392126", "#d94747", "#edc45a", "#fff4e8"],
  "Captain America": ["#101c35", "#1d3154", "#4d84dc", "#e7e8f8", "#f5f6ff"],
  "Black Widow": ["#171216", "#30202a", "#b8324a", "#f19ab0", "#fff3f5"],
  Thor: ["#121b2b", "#23344c", "#578ac6", "#e9c96b", "#f4f7ff"],
  Rapunzel: ["#281b43", "#46305e", "#b78be8", "#f1c3f5", "#fff6ff"],
  Cinderella: ["#edf6ff", "#d8e9ff", "#70a9e9", "#c4ddff", "#233c5d"],
  Moana: ["#102c39", "#1b4b54", "#38a9a1", "#ffb68b", "#f5fff9"],
  Belle: ["#281d16", "#4b3524", "#d3a32d", "#ffe29a", "#fff8e9"],
  Tiana: ["#112c27", "#1d4a3b", "#3ca77b", "#b5e6c9", "#effff6"],
  Mulan: ["#301821", "#512733", "#c34b61", "#f2c2cf", "#fff4f4"],
  "Block Builder": ["#17251a", "#293e2a", "#70b65d", "#c3e68a", "#f5fff0"],
  "Cave Explorer": ["#151b27", "#293547", "#6b8aab", "#b9c8dc", "#f2f7ff"],
  "Garden Keeper": ["#142a20", "#254733", "#65b77a", "#c1e8a9", "#f2fff0"],
};

function toCharacter(values: string[]): Character {
  const [name, description, outfit, detail, skin, hair, kind] = values;
  return { name, description, outfit, detail, skin, hair, kind };
}

function contrastMuted(text: string) {
  return ["#fff9ff", "#fff4ff", "#fff5ff"].includes(text) ? "#c9c3dc" : "#655b75";
}

function characterTheme(character: Character): Theme {
  const custom = characterThemeOverrides[character.name];
  if (custom) {
    const [bg, panel, accent, soft, text] = custom;
    return { name: character.name, bg, panel, accent, soft, text };
  }
  return {
    name: character.name,
    bg: "#171426",
    panel: "#292341",
    accent: character.outfit,
    soft: character.detail,
    text: "#fff9ff",
  };
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.style.setProperty("--bg", theme.bg);
  root.style.setProperty("--panel", theme.panel);
  root.style.setProperty("--accent", theme.accent);
  root.style.setProperty("--soft", theme.soft);
  root.style.setProperty("--fg", theme.text);
  root.style.setProperty("--muted", contrastMuted(theme.text));
}

function LegoFigure({ character }: { character: Character }) {
  const asset = characterAssets.find((item) => item.name === character.name);
  if (asset?.imageExists) {
    return (
      <div className="character-image-frame">
        <Image
          className="character-image"
          src={asset.imagePath}
          alt={`${character.name} character`}
          width={120}
          height={164}
          loading="lazy"
        />
      </div>
    );
  }
  if (asset?.modelFile) {
    return (
      <div className="character-model-frame">
        <CharacterModel url={`/api/models/${encodeURIComponent(asset.modelFile)}`} label={character.name} />
      </div>
    );
  }
  return (
    <div
      className={`lego-figure ${asset?.kind ?? character.kind}`}
      role="img"
      aria-label={`${character.name} toy-style minifigure`}
      style={
        {
          "--skin": character.skin,
          "--hair": character.hair,
          "--outfit": character.outfit,
          "--detail": character.detail,
        } as React.CSSProperties
      }

    >
      <div className="lego-cape" />
      <div className="lego-accessory" />
      <div className="lego-hair" />
      <div className="lego-head" />
      <div className="lego-face" />
      <div className="lego-neck" />
      <div className="lego-body" />
      <div className="lego-arm" />
      <div className="lego-arm right" />
      <div className="lego-leg" />
      <div className="lego-leg right" />
    </div>
  );
}

function PixelWorld() {
  return (
    <div className="pixel-world" aria-label="A pixel-art night world with a glowing portal">
      <div className="stars" />
      <div className="moon" />
      <div className="cloud one" />
      <div className="cloud two" />
      <div className="world-label pixel">
        WORLD 001
        <br />
        THE BEGINNING
      </div>
      <div className="portal" />
      <div className="pixel-person girl">
        <div className="pixel-hair" />
        <div className="pixel-head" />
        <div className="pixel-eyes" />
        <div className="pixel-body" />
        <div className="pixel-arm" />
        <div className="pixel-arm right" />
        <div className="pixel-legs" />
        <div className="pixel-shoes" />
      </div>
      <div className="pixel-person boy">
        <div className="pixel-hair" />
        <div className="pixel-head" />
        <div className="pixel-eyes" />
        <div className="pixel-body" />
        <div className="pixel-arm" />
        <div className="pixel-arm right" />
        <div className="pixel-legs" />
        <div className="pixel-shoes" />
      </div>
      <div className="ground" />
    </div>
  );
}

function Brand({ showTagline = true }: { showTagline?: boolean }) {
  return (
    <div className="brand">
      <MantraMark />
      {showTagline ? (
        <div>
          mantra
          <small>YOUR WORLD. YOUR JOURNEY.</small>
        </div>
      ) : (
        <span>mantra</span>
      )}
    </div>
  );
}

type PageKey = "home" | "companion" | "career" | "match" | "communities" | "feed" | "callie" | "panic" | "moderation";

      const pageInfo: Record<PageKey, [string, string]> = {
        home: ["My World", "Your pace. Your path."],
        companion: ["Talk to Your Companion", "Your chosen companion is here to listen."],
        career: ["Career Guidance", "Explore options and build a realistic, step-by-step roadmap."],
        match: ["Right Match", "Discover the kind of connection that feels right."],
        communities: ["Worlds", "Explore supportive topic-based spaces."],
        feed: ["Community Feed", "Share a thought or a little encouragement."],
        callie: ["Reflection Space", "Pause and explore what is on your mind."],
        panic: ["Take a Pause", "You do not have to solve everything right now."],
        moderation: ["Safety & Reports", "Review reports and manage demo moderation actions."],
      };

      const worlds = [
        ["College Pressure", "Study stress, deadlines and finding balance."],
        ["Confidence & Self-Worth", "Practice being kinder to yourself."],
        ["Friendships & Belonging", "Navigate relationships and feeling included."],
        ["Small Wins Club", "Celebrate tiny steps and everyday progress."],
        ["Life Changes", "A gentle space for uncertainty and new chapters."],
        ["Quiet Corner", "No pressure to share more than you want."],
      ];

      const matchQuestions: [string, string[]][] = [
        ["What kind of support do you want?", ["Someone who listens", "Practical ideas", "Encouragement", "I am not sure"]],
        ["What makes a conversation safe?", ["Gentle and patient replies", "Kind honesty", "Light chat first", "I set the pace"]],
        ["How do you like to communicate?", ["Short messages", "Long conversations", "A mix", "Mostly reading"]],
        ["What is on your mind lately?", ["College or work", "Friendships", "Confidence", "Stress or loneliness", "Prefer not to say"]],
        ["What energy feels right?", ["Calm and quiet", "Warm and encouraging", "Funny and light", "Thoughtful"]],
        ["How often do you want to check in?", ["Most days", "A few times a week", "When I feel like it", "Not sure"]],
        ["What matters most in a match?", ["Similar experiences", "Similar communication", "Respect for boundaries", "Different perspective"]],
      ];

      function readLocal<T>(key: string, fallback: T): T {
        try {
          const value = window.localStorage.getItem(key);
          return value ? (JSON.parse(value) as T) : fallback;
        } catch {
          return fallback;
      }
      }

      function writeLocal(key: string, value: unknown) {
        try {
          window.localStorage.setItem(key, JSON.stringify(value));
          return true;
        } catch {
          return false;
        }
      }

      function Dashboard({ name, companion, onLeave }: { name: string; companion: Character; onLeave: () => void }) {
        const [page, setPage] = useState<PageKey>("home");
        const [toast, setToast] = useState("");
        const [message, setMessage] = useState("");
        const [chat, setChat] = useState<{ role: "assistant" | "user"; text: string }[]>([
          { role: "assistant", text: `Hey ${name || "Hero"}! I'm ${companion.name}. How are you feeling today?` },
        ]);
        const [posts, setPosts] = useState<{ id: number | string; text: string; likes: number }[]>(() => readLocal("mantraDemoPosts", []));
        const [reflection, setReflection] = useState("");
        const [feedback, setFeedback] = useState("");
        const [selectedWorld, setSelectedWorld] = useState<number | null>(null);
        const [matchResult, setMatchResult] = useState("");
        const [breathing, setBreathing] = useState(false);
        const [reports, setReports] = useState<{ id: number; postId: number | string; reason: string; status: "Open" | "Closed" }[]>(() => readLocal("mantraDemoReports", []));
        const [reportingPostId, setReportingPostId] = useState<number | string | null>(null);
        const [reportReason, setReportReason] = useState("");
        const [careerFollowup, setCareerFollowup] = useState("");

        function notify(text: string) {
          setToast(text);
          window.setTimeout(() => setToast(""), 2800);
        }

        const mainHeadingRef = useRef<HTMLHeadingElement>(null);

        useEffect(() => {
          mainHeadingRef.current?.focus();
        }, [page]);

        function navigate(next: PageKey) {
          setPage(next);
          setFeedback("");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }

        async function sendChat(event: FormEvent) {
          event.preventDefault();
          const text = message.trim();
          if (!text) return;
          setMessage("");
          setChat((current) => [...current, { role: "user", text }, { role: "assistant", text: `${companion.name} is thinking…` }]);
          try {
            const response = await fetch("/api/chat", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ message: text, displayName: name || "Hero", companionName: companion.name, history: chat }),
            });
            const data = (await response.json().catch(() => ({}))) as { reply?: string; error?: string };
            if (!response.ok || !data.reply) throw new Error(data.error || "The AI service is not configured.");
            setChat((current) => [...current.slice(0, -1), { role: "assistant", text: data.reply! }]);
          } catch {
            setChat((current) => [...current.slice(0, -1), { role: "assistant", text: "I couldn't reach the AI companion. Check the local provider configuration and try again." }]);
          }
        }

        async function addPost() {
          const text = message.trim();
          if (!text) return notify("Write something before posting.");
          try {
            const response = await fetch("/api/community/posts", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ body: text }),
            });
            if (response.ok) {
              const data = (await response.json()) as { post: { id: string; body: string } };
              const next = [{ id: data.post.id, text: data.post.body, likes: 0 }, ...posts];
              setPosts(next);
              setMessage("");
              notify("Post saved to the community.");
              return;
            }
          } catch {
            // Fall through to the explicit local-only demo mode.
          }
          const next = [{ id: Date.now(), text, likes: 0 }, ...posts];
          setPosts(next);
          writeLocal("mantraDemoPosts", next);
          setMessage("");
          notify("Post added to this browser.");
        }

        function reportPost(postId: number | string) {
          setReportingPostId(postId);
          setReportReason("");
        }

        function submitReport() {
          const reason = reportReason.trim();
          if (reportingPostId === null || !reason) {
            notify("Add a short reason before submitting the report.");
            return;
          }
          const next = [{ id: Date.now(), postId: reportingPostId, reason: reason.slice(0, 300), status: "Open" as const }, ...reports];
          setReports(next);
          writeLocal("mantraDemoReports", next);
          setReportingPostId(null);
          setReportReason("");
          notify("Report saved for review in this browser demo.");
        }

        function chooseMatch() {
          const values = matchQuestions.map((_, index) => Number(document.querySelector<HTMLInputElement>(`input[name="match-${index}"]:checked`)?.value ?? 0));
          const results = [
            "The Gentle Listener — a steady presence who gives you space to speak.",
            "The Encouraging Ally — someone who helps you notice your progress.",
            "The Thoughtful Companion — a reflective connection that respects your pace.",
            "The Easygoing Friend — a relaxed, warm connection for difficult days.",
          ];
          setMatchResult(results[values.reduce((sum, value) => sum + value, 0) % results.length]);
        }

        function renderHome() {
          return <><section className="welcome game-card"><div className="eyebrow">PLAYER {name.toUpperCase() || "HERO"}</div><h2>Your world is yours to build.</h2><p className="muted">Your companion {companion.name} is here to listen while you explore, reflect, or take a breath.</p><button className="pixel-btn pink" onClick={() => navigate("companion")}>TALK TO MY COMPANION →</button></section><div className="lego-guide"><LegoFigure character={companion} /><div><div className="eyebrow">YOUR IN-WORLD GUIDE</div><h3>{companion.name} is here, {name || "Hero"}.</h3><p className="muted">{companion.description} I&apos;ll guide you through your world and listen when you want to talk.</p></div></div><div className="feature-grid">{[["Build your roadmap", "career"], ["Meet your match", "match"], ["Explore new worlds", "communities"], ["Take a pause", "panic"]].map(([title, key]) => <article className="game-card" key={key}><div className="feature-number">QUEST</div><h3>{title}</h3><p className="muted">Find a small next step with your companion.</p><button className="pixel-btn dark" onClick={() => navigate(key as PageKey)}>OPEN →</button></article>)}</div></>;
        }

        function renderCompanion() {
          return <section className="game-card"><div className="companion-banner"><LegoFigure character={companion} /><div><h2>{companion.name}</h2><p className="muted">{companion.description} Tell me about your day.</p></div></div><p className="notice">AI responses require a configured server endpoint. Do not share passwords or highly sensitive identifying information. This is supportive, not therapy or emergency care.</p><div className="chat" aria-live="polite">{chat.map((item, index) => <div className={`bubble ${item.role === "user" ? "mine" : ""}`} key={`${item.text}-${index}`}>{item.text}</div>)}</div><form onSubmit={sendChat}><div className="field"><label htmlFor="companion-message">Tell your companion about your day</label><textarea id="companion-message" className="game-input" value={message} onChange={(event) => setMessage(event.target.value)} maxLength={1000} rows={3} /></div><button className="pixel-btn pink">SEND MESSAGE →</button><button type="button" className="pixel-btn dark" onClick={() => { if ("speechSynthesis" in window) speechSynthesis.speak(new SpeechSynthesisUtterance(chat[chat.length - 1].text)); else notify("Voice is not available in this browser."); }}>READ REPLY ALOUD</button></form></section>;
        }

        function renderCareer() {
          return <section className="game-card"><div className="eyebrow">MANTRA CAREER QUEST</div><h2>Turn your goal into a real plan.</h2><p className="muted">Explore options, identify skill gaps, and create practical milestones. AI guidance can be wrong or out of date; verify requirements with official sources.</p><div className="notice">Career guidance requires a configured Cloudflare agent. The local route validates your request and will show a configuration error instead of inventing a roadmap.</div><div className="field"><label htmlFor="career-goal">What would you like to achieve?</label><textarea id="career-goal" className="game-input" value={message} onChange={(event) => setMessage(event.target.value)} rows={4} maxLength={1200} placeholder="Example: I want to become a UI/UX designer..." /></div><button className="pixel-btn pink" onClick={async () => { const prompt = message.trim(); if (!prompt) return notify("Tell us your goal first."); setFeedback("Building your roadmap…"); try { const response = await fetch("/api/career", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt, displayName: name || "Hero" }) }); const data = (await response.json().catch(() => ({}))) as { roadmap?: unknown; error?: string }; if (!response.ok || !data.roadmap) throw new Error(data.error || "The career agent returned no roadmap."); setFeedback("Your roadmap is ready. Review each step and verify details with official sources."); } catch (error) { setFeedback(error instanceof Error ? error.message : "The career agent could not be reached."); } }}>BUILD MY ROADMAP →</button><div className="field"><label htmlFor="career-followup">Ask a follow-up or adjust your plan</label><textarea id="career-followup" className="game-input" value={careerFollowup} onChange={(event) => setCareerFollowup(event.target.value)} rows={3} maxLength={1000} placeholder="I only have four hours a week. Can you adapt the plan?" /></div><button className="pixel-btn dark" onClick={() => careerFollowup.trim() ? setFeedback("Follow-up requests will use the same configured career agent.") : notify("Write a follow-up first.")}>CONTINUE WITH CAREER GUIDE →</button>{feedback && <p className="result" aria-live="polite">{feedback}</p>}</section>;
        }

        /* Play Together is temporarily hidden; game modules remain available for later restoration.
        function renderGame() {
          const selectedGame = wellnessGames.find(([title]) => title === gameChoice);
          const actions = selectedGame?.[2] ?? [];

          return (
            <>
              <section className="game-card">
                <div className="eyebrow">MANTRA · YOUR EMOTIONAL QUEST</div>
                <h2>Choose a small world for today.</h2>
                <p className="muted">
                  Choose a cozy or adventurous mode. This is not a diagnosis; you can stop or switch worlds at any time.
                </p>
                <div className="button-row">
                  <button className={`pixel-btn ${gameMode === "cozy" ? "pink" : "dark"}`} onClick={() => setGameMode("cozy")}>
                    COZY MODE
                  </button>
                  <button className={`pixel-btn ${gameMode === "adventure" ? "pink" : "dark"}`} onClick={() => setGameMode("adventure")}>
                    ADVENTURE MODE
                  </button>
                </div>
                <div className="feature-grid">
                  {wellnessGames.map(([title, description]) => (
                    <button className="game-card game-card-button" key={title} onClick={() => { setGameChoice(title); setGameAction(""); }}>
                      <div className="feature-number">{gameMode.toUpperCase()} WORLD</div>
                      <h3>{title}</h3>
                      <p className="muted">{description}</p>
                    </button>
                  ))}
                  <button className="game-card game-card-button" onClick={() => { setGameChoice("Story Quest"); setGameAction(""); }}>
                    <div className="feature-number">CO-OP ADVENTURE</div>
                    <h3>Story Quest</h3>
                    <p className="muted">Explore a little story with your companion.</p>
                  </button>
                </div>
              </section>

              {gameChoice === "Story Quest" && (
                <section className="result">
                  <div className="eyebrow">CALM STARS: {storyStars}</div>
                  <h3>{storyScenes[storyIndex][0]}</h3>
                  <p>{storyScenes[storyIndex][1]}</p>
                  {storyScenes[storyIndex][2].map((action) => (
                    <button className="pixel-btn dark" key={action} onClick={chooseStoryAction}>{action}</button>
                  ))}
                  <button className="pixel-btn pink" onClick={() => navigate("companion")}>TALK TO MY COMPANION →</button>
                </section>
              )}

              {gameChoice === "Tiny Step Trail" && (
                <GameSurface gameId="Tiny Step Trail" adapter={tinyStepTrailAdapter} onExit={() => setGameChoice("")} />
              )}

              {gameChoice && gameChoice !== "Story Quest" && gameChoice !== "Tiny Step Trail" && (
                <section className="result">
                  <h3>{gameChoice}</h3>
                  <p>Pick one small action. There are no wrong answers.</p>
                  {actions.map((action) => (
                    <button className="pixel-btn dark" key={action} onClick={() => setGameAction(action)}>{action}</button>
                  ))}
                  {gameAction && (
                    <>
                      <p aria-live="polite">You chose: {gameAction}. Small steps count, and rest is allowed.</p>
                      <button className="pixel-btn pink" onClick={() => navigate("companion")}>TALK TO MY COMPANION →</button>
                    </>
                  )}
                </section>
              )}
            </>
          );
        }

        }
        */

        function renderMatch() {
          return <section className="game-card"><div className="eyebrow">PLAYER QUEST / 01</div><h2>Find your Right Match</h2><p className="muted">Choose the support style that feels most comfortable. This is not a clinical assessment or a real human match.</p>{matchQuestions.map(([question, options], index) => <div className="field" key={question}><label>{index + 1}. {question}</label>{options.map((option, optionIndex) => <label className="option" key={option}><input type="radio" name={`match-${index}`} value={optionIndex} defaultChecked={optionIndex === 0} />{option}</label>)}</div>)}<button className="pixel-btn pink" onClick={chooseMatch}>REVEAL MY MATCH →</button>{matchResult && <div className="result"><h3>{matchResult}</h3><p>This is a playful preference result, not a clinical assessment or a real human match.</p><button className="pixel-btn dark" onClick={() => navigate("communities")}>EXPLORE WORLDS →</button></div>}</section>;
        }

        function renderWorlds() {
          return <><div className="lego-guide"><LegoFigure character={companion} /><div><div className="eyebrow">YOUR GUIDE · {companion.name.toUpperCase()}</div><h3>Choose a safe space together.</h3><p className="muted">Each world has a short entry test about empathy, boundaries and privacy.</p></div></div><div className="feature-grid">{worlds.map(([title, description], index) => <article className="game-card" key={title}><div className="feature-number">WORLD 0{index + 1}</div><h3>{title}</h3><p className="muted">{description}</p><button className="pixel-btn dark" onClick={() => setSelectedWorld(index)}>TAKE ENTRY TEST →</button></article>)}</div>{selectedWorld !== null && <section className="entry-test game-card"><h3>{worlds[selectedWorld][0]} entry test</h3><p className="muted">Answer in your own words. This local demo cannot verify identity or AI-written text.</p>{["How would you respond respectfully to something personal?", "What would you do with a serious safety concern?", "How do you respect a boundary or a request to stop?"].map((question, index) => <div className="field" key={question}><label htmlFor={`entry-${index}`}>{index + 1}. {question}</label><textarea className="game-input" id={`entry-${index}`} rows={3} minLength={35} /></div>)}<label className="option"><input id="entry-own" type="checkbox" /> I wrote these answers myself.</label><label className="option"><input id="entry-rules" type="checkbox" /> I agree not to harass, threaten, pressure, or expose private information.</label><button className="pixel-btn pink" onClick={() => { const fields = [0, 1, 2].map((index) => document.getElementById(`entry-${index}`) as HTMLTextAreaElement); const valid = fields.every((field) => field.value.trim().length >= 35) && (document.getElementById("entry-own") as HTMLInputElement).checked && (document.getElementById("entry-rules") as HTMLInputElement).checked; setFeedback(valid ? "Entry test completed for this browser demo. Real access control requires a server." : "Add specific answers of at least 35 characters and accept both safety confirmations."); }}>SUBMIT ENTRY TEST →</button>{feedback && <p className="result" aria-live="polite">{feedback}</p>}</section>}</>;
        }

        function renderFeed() {
          return <><section className="game-card"><div className="eyebrow">COMMUNITY BOARD</div><h2>Leave a little encouragement.</h2><p className="muted">Share a small win or thought. Avoid private information.</p><textarea className="game-input" value={message} onChange={(event) => setMessage(event.target.value)} rows={4} maxLength={500} placeholder="One thing I want to share today..." /><br /><button className="pixel-btn pink" onClick={addPost}>POST TO MY BOARD →</button><p className="notice">Local demo only. Posts are visible only in this browser.</p></section>{posts.length ? posts.map((post) => <article className="post" key={post.id}><div className="eyebrow">PLAYER / {name || "HERO"}</div><p>{post.text}</p><button className="pixel-btn dark" onClick={() => { const next = posts.map((item) => item.id === post.id ? { ...item, likes: item.likes + 1 } : item); setPosts(next); writeLocal("mantraDemoPosts", next); }}>SUPPORT {post.likes}</button><button className="pixel-btn dark" onClick={() => reportPost(post.id)}>REPORT</button></article>) : <div className="game-card"><h3>The board is quiet.</h3><p className="muted">Start with a kind thought.</p></div>}{reportingPostId !== null && <div className="report-dialog" role="dialog" aria-modal="true" aria-labelledby="report-title"><h3 id="report-title">Report this post</h3><p className="muted">Choose a reason. This local demo stores the report only in this browser.</p><label className="field" htmlFor="report-reason">Reason<textarea id="report-reason" className="game-input" value={reportReason} onChange={(event) => setReportReason(event.target.value)} maxLength={300} rows={3} /></label><div className="button-row"><button className="pixel-btn pink" onClick={submitReport}>SUBMIT REPORT</button><button className="pixel-btn dark" onClick={() => setReportingPostId(null)}>CANCEL</button></div></div>}</>;
        }

        function renderReflection() {
          return <section className="game-card"><div className="eyebrow">REFLECTION SPACE</div><h2>What would you like to untangle?</h2><p className="muted">Saved reflections use private Supabase storage when configured; otherwise they remain in this browser session.</p><textarea className="game-input" value={reflection} onChange={(event) => setReflection(event.target.value)} rows={7} maxLength={2000} placeholder="Today I have been feeling..." /><div className="button-row"><button className="pixel-btn dark" onClick={() => setReflection("What do I need right now? ")}>WHAT DO I NEED?</button><button className="pixel-btn dark" onClick={() => setReflection("What is one thing I can control today? ")}>WHAT CAN I CONTROL?</button></div><button className="pixel-btn pink" onClick={async () => { const body = reflection.trim(); if (!body) return notify("Write a reflection first."); try { const response = await fetch("/api/reflections", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ body }) }); if (response.ok) return notify("Private reflection saved."); } catch { /* Use the local-only message below. */ } notify("Reflection kept in this local session. Sign in and configure Supabase to save it privately."); }}>SAVE THIS REFLECTION</button></section>;
        }

        function renderPause() {
          return <div className="two-column"><section className="game-card"><div className="eyebrow">REST POINT</div><h2>One breath at a time.</h2><p className="muted">Breathe naturally; do not force deep breaths or hold your breath.</p><div className={`breath ${breathing ? "" : "paused"}`}><b>{breathing ? "Breathe in\\ngently" : "Take a natural\\nbreath"}</b></div><button className="pixel-btn pink" onClick={() => setBreathing((value) => !value)}>{breathing ? "PAUSE GUIDE" : "RESUME GUIDE"}</button></section><section className="game-card"><div className="eyebrow">GROUNDING QUEST</div><h2>Reconnect with the present.</h2><p>01 — Name <b>5 things</b> you can see.</p><p>02 — Notice <b>4 things</b> you can feel.</p><p>03 — Listen for <b>3 sounds</b>.</p><p>04 — Identify <b>2 smells</b>.</p><p>05 — Name one thing you need.</p><div className="notice">For severe chest pain, fainting, serious difficulty breathing, or immediate danger, seek urgent medical help.</div></section></div>;
        }

        function renderModeration() {
          return <section className="game-card"><div className="eyebrow">COMMUNITY SAFETY</div><h2>Review reports and manage behaviour</h2><p className="muted">Demo moderation tools affect this browser only. A real service must enforce roles and suspensions on its server.</p><input className="game-input" placeholder="Member display name" /><button className="pixel-btn pink" onClick={() => notify("Seven-day demo suspension recorded locally.")}>SUSPEND FOR 7 DAYS</button><button className="pixel-btn dark" onClick={() => notify("No local suspension record found.")}>CHECK SUSPENSION</button><h3>Reports ({reports.filter((report) => report.status === "Open").length} open)</h3>{reports.length ? reports.map((report) => <div className="moderation-row" key={report.id}><span className="status-pill">{report.status}</span><p>Post #{report.postId}: {report.reason}</p><button className="pixel-btn dark" onClick={() => { const next = reports.map((item) => item.id === report.id ? { ...item, status: "Closed" as const } : item); setReports(next); writeLocal("mantraDemoReports", next); }}>DISMISS REPORT</button></div>) : <p className="muted">No reports yet. Report a post from the Community Feed.</p>}</section>;
        }

        const content = { home: renderHome, companion: renderCompanion, career: renderCareer, match: renderMatch, communities: renderWorlds, feed: renderFeed, callie: renderReflection, panic: renderPause, moderation: renderModeration }[page]();
        return <main className="app-shell"><a className="skip-link" href="#main-content">Skip to main content</a><aside className="app-sidebar"><Brand /><nav className="sidebar-nav" aria-label="Mantra world navigation">{(Object.keys(pageInfo) as PageKey[]).map((key) => <button aria-current={page === key ? "page" : undefined} className={`sidebar-link ${page === key ? "active" : ""}`} key={key} onClick={() => navigate(key)}>{pageInfo[key][0]}</button>)}</nav><button className="pixel-btn dark" onClick={onLeave}>LEAVE WORLD</button></aside><section className="app-main"><header className="app-header"><div><div className="eyebrow">MANTRA WORLD</div><h1 ref={mainHeadingRef} tabIndex={-1}>{pageInfo[page][0]}</h1><p className="muted">{pageInfo[page][1]}</p></div><div className="status-pill">WITH {companion.name.toUpperCase()}</div></header><div className="app-content" id="main-content">{content}</div></section>{toast && <div className="toast" role="status">{toast}</div>}</main>;
}


export function LandingPage() {
  const [screen, setScreen] = useState<"landing" | "intro" | "entered">("landing");
  const [selectedUniverse, setSelectedUniverse] = useState<string | null>(null);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [currentTheme, setCurrentTheme] = useState("Original Purple");
  const [name, setName] = useState("");

  function chooseUniverse(universeName: string) {
    setSelectedUniverse(universeName);
    setSelectedCharacter(universes[universeName].characters[0]);
    document.getElementById("companion-panel")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function chooseCharacter(character: Character) {
    setSelectedCharacter(character);
    const nextTheme = characterTheme(character);
    setCurrentTheme(character.name);
    applyTheme(nextTheme);
  }

  function chooseBuiltInTheme(theme: Theme) {
    setCurrentTheme(theme.name);
    applyTheme(theme);
  }

  if (screen === "entered") {
    if (!selectedCharacter) {
      return <main className="screen"><section className="world-section"><p className="notice">Choose a companion before entering your world.</p><button className="pixel-btn pink" onClick={() => setScreen("intro")}>BACK TO SELECTION</button></section></main>;
    }
    return <Dashboard name={name.trim() || "Hero"} companion={selectedCharacter} onLeave={() => setScreen("landing")} />;
  }

  if (screen === "intro") {
    return (
      <main className="screen">
        <header className="topbar">
            <Brand showTagline={false} />
          <button className="pixel-btn dark" onClick={() => setScreen("landing")}>
            ← BACK
          </button>
        </header>
        <section className="world-section">
          <div className="eyebrow">Character selection · Step 01</div>
          <h1 className="pixel intro-title">
            SELECT YOUR
            <br />
            <span className="gradient">SUPERHERO</span>
          </h1>
          <p className="muted">Choose your character. This is your journey, so start wherever you like.</p>
          <div className="childhood-tag">UNLEASH YOUR CHILDHOOD AGAIN</div>
          <h2>Choose your universe</h2>
          <div className="universe-grid">
            {Object.entries(universes).map(([universeName, universe]) => (
              <button
                className={`universe-choice ${selectedUniverse === universeName ? "selected" : ""}`}
                key={universeName}
                onClick={() => chooseUniverse(universeName)}
              >
                <span className="pixel universe-symbol">{universe.symbol}</span>
                <strong>{universeName}</strong>
                <small>{universe.description}</small>
              </button>
            ))}
          </div>
          {selectedUniverse && selectedCharacter && (
            <div id="companion-panel">
              <h2>Choose your {selectedUniverse} companion</h2>
              <div className="companion-grid">
                {universes[selectedUniverse].characters.map((character) => (
                  <button
                    className={`companion-choice ${selectedCharacter.name === character.name ? "selected" : ""}`}
                    key={character.name}
                    onClick={() => chooseCharacter(character)}
                  >
                    <LegoFigure character={character} />
                    <strong>{character.name}</strong>
                    <small>{character.description}</small>
                  </button>
                ))}
              </div>
              <div className="game-card">
                <div className="field">
                  <label htmlFor="hero-name">What should your companion call you?</label>
                  <input
                    className="game-input"
                    id="hero-name"
                    maxLength={30}
                    placeholder="Your name or nickname"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                  />
                </div>
                <h3>Character themes</h3>
                <p className="muted">
                  Every character has their own colour palette. Pick a character below to apply their theme.
                </p>
                <div className="theme-row">
                  {themes.map((theme) => (
                    <button
                      className={`theme-swatch ${currentTheme === theme.name ? "active" : ""}`}
                      key={theme.name}
                      onClick={() => chooseBuiltInTheme(theme)}
                    >
                      <span className="theme-dot" style={{ "--swatch": theme.accent } as React.CSSProperties} />
                      {theme.name}
                    </button>
                  ))}
                </div>
                <button className="pixel-btn pink" onClick={() => setScreen("entered")}>
                  ENTER MY WORLD →
                </button>
              </div>
            </div>
          )}
        </section>
      </main>
    );
  }

  return (
    <main id="landing">
      <header className="topbar">
        <Brand />
        <button className="pixel-btn" onClick={() => setScreen("intro")}>
          ENTER WORLD →
        </button>
      </header>
      <section className="landing-hero">
        <div className="hero-copy">
          <div className="eyebrow">A new world is waiting</div>
          <div className="childhood-tag">UNLEASH YOUR CHILDHOOD AGAIN</div>
          <h1>
            Your story.
            <br />
            Your world.
            <br />
            <span className="gradient">Your next chapter.</span>
          </h1>
          <p>
            Some days feel like starting from zero. That&apos;s okay. Build your world one small block at a time,
            find spaces where you can be yourself, and discover your own way forward.
          </p>
          <div className="hero-actions">
            <button className="pixel-btn pink" onClick={() => setScreen("intro")}>
              CHOOSE YOUR COMPANION →
            </button>
            <button
              className="pixel-btn dark"
              onClick={() => document.getElementById("inside")?.scrollIntoView({ behavior: "smooth" })}
            >
              EXPLORE MANTRA
            </button>
          </div>
          <p className="hero-disclaimer">A peer-support experience, not a replacement for professional care.</p>
        </div>
        <PixelWorld />
      </section>
      <section className="world-section" id="inside">
        <div className="eyebrow">Your world has many paths</div>
        <h2>Every journey is different.</h2>
        <p className="muted">No leaderboard for healing. No pressure to be perfect.</p>
        <div className="feature-grid">
          <article className="game-card">
            <div className="feature-number">LEVEL 01</div>
            <h3>Find your Right Match</h3>
            <p>Explore the kind of peer support and communication that feels comfortable for you.</p>
          </article>
          <article className="game-card">
            <div className="feature-number">LEVEL 02</div>
            <h3>Enter a community</h3>
            <p>Explore spaces for college pressure, confidence, friendships and everyday life.</p>
          </article>
          <article className="game-card">
            <div className="feature-number">LEVEL 03</div>
            <h3>Take a breather</h3>
            <p>Pause, use grounding prompts, and give yourself a moment.</p>
          </article>
        </div>
      </section>
      <footer className="footer">MANTRA · A LITTLE SPACE TO BE HUMAN</footer>
    </main>
  );
}
