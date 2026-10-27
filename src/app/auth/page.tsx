"use client";

import { FormEvent, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [feedback, setFeedback] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent, mode: "signIn" | "signUp") {
    event.preventDefault();
    setBusy(true);
    setFeedback("");
    try {
      const supabase = createSupabaseBrowserClient();
      const result = mode === "signIn"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });
      if (result.error) throw result.error;
      setFeedback(mode === "signUp" ? "Account created. Check your email if confirmation is enabled." : "Signed in successfully.");
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "Authentication is not available.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="landing-shell">
      <section className="game-card auth-card">
        <div className="eyebrow">MANTRA ACCOUNT</div>
        <h1>Keep your journey yours.</h1>
        <p className="muted">Authentication is optional for the local demo. Supabase credentials are required for real accounts.</p>
        <form onSubmit={(event) => submit(event, "signIn")}>
          <div className="field">
            <label htmlFor="auth-email">Email</label>
            <input id="auth-email" className="game-input" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="auth-password">Password</label>
            <input id="auth-password" className="game-input" type="password" minLength={8} required value={password} onChange={(event) => setPassword(event.target.value)} />
          </div>
          <button className="pixel-btn pink" disabled={busy}>{busy ? "WORKING…" : "SIGN IN →"}</button>
          <button className="pixel-btn dark" type="button" disabled={busy} onClick={(event) => submit(event, "signUp")}>CREATE ACCOUNT →</button>
        </form>
        {feedback && <p className="result" aria-live="polite">{feedback}</p>}
      </section>
    </main>
  );
}
