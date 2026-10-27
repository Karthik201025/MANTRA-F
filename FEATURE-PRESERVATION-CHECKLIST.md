# Mantra Feature-Preservation Checklist

Use this checklist as a release gate for every future refactor or redesign. A checked item means the behavior, wording, data, identity, and visual intent were verified against [`index (2).html`](./index%20%282%29.html), not merely that an equivalent-looking replacement exists.

## Preservation rules

- [ ] Do not redraw, recolour, regenerate, optimise, or substitute `mantra-mark`.
- [ ] Preserve the original four SVG path definitions, fills, viewBox, and symbol id.
- [ ] Preserve the landing, onboarding, and application shell concepts.
- [ ] Preserve all page keys and names: `home`, `companion`, `career`, `game`, `match`, `communities`, `feed`, `callie`, `panic`, `moderation`.
- [ ] Preserve all user-facing copy unless a change is explicitly approved.
- [ ] Preserve the pixel/pastel visual identity, typography intent, theme variables, shadows, borders, illustrations, and animations.
- [ ] Preserve disclaimers that the product is peer/wellbeing support, not therapy, diagnosis, emergency service, or a real-person match.
- [ ] Do not remove unused/legacy functions, placeholder content, or data until their preservation impact is documented and approved.

## Screens and routes

- [ ] Landing hero, CTA buttons, smooth-scroll section, animated pixel world, feature cards, footer.
- [ ] Universe selection for Avengers, Barbie, Sanrio, DC Heroes, Disney Princesses, Minecraft.
- [ ] Character selection and all character names, descriptions, tuple fields, and illustrations.
- [ ] Display name input and default `Hero` behavior.
- [ ] Built-in themes: Original Purple, Hello Kitty Pink, Cloud Blue, Black & Gold, Mint Dream, Lavender.
- [ ] Character-specific theme overrides and sidebar theme menu.
- [ ] Home welcome, companion guide, and all five feature cards.
- [ ] Companion chat, pending state, server error state, history slicing, read-aloud action.
- [ ] Career profile, roadmap request, follow-up, history, status, and provider warning.
- [ ] Emotional check-in and suggested-world selection.
- [ ] All six wellbeing games, both play modes, action messages, score/finish/reflection handoff.
- [ ] Legacy story quest data/functions remain accounted for.
- [ ] Right Match seven questions, deterministic result styles, and non-clinical disclaimer.
- [ ] Six worlds and all three community entry questions/checks.
- [ ] Feed posting, escaped rendering, support count, report flow, and local-only warning.
- [ ] Reflection prompts, mood selector, session-only save status.
- [ ] Breath pause/resume and 5–4–3–2–1 voice guide/stop action.
- [ ] Safety/report review, close/dismiss, remove post, suspend/check actions, demo-only warnings.
- [ ] Logout cancels speech and returns to landing.

## Data and state

- [ ] `themes`, `universes`, `characterThemeOverrides`, `pages`, `questions`, `worlds`, `companionGameScenes`, and `wellnessGames` are preserved exactly unless approved.
- [ ] Runtime state transitions are covered: onboarding → app → navigation → logout.
- [ ] All five localStorage keys are inventoried and behavior is intentionally preserved or migrated.
- [ ] Browser-only demo warnings remain visible until the feature becomes server-backed.
- [ ] No user data is silently moved from memory/localStorage to a server.
- [ ] Any persistence migration has an explicit retention, deletion, and privacy decision.

## Logo and metadata

- [ ] `mantra-mark` remains byte-for-byte identical.
- [ ] Landing, onboarding, and sidebar use the exact symbol through `<use href="#mantra-mark">`.
- [ ] Any favicon/manifest icon is an exact exported copy and is checksum-compared.
- [ ] Title, theme color, viewport, charset, and external font intent are preserved or changes are approved.
- [ ] New metadata does not expose secrets or claim unavailable backend functionality.

## Accessibility and responsive behavior

- [ ] Keyboard can reach every control and preserve visible focus.
- [ ] Route changes expose the new page title/subtitle and move focus appropriately.
- [ ] Sidebar behavior remains usable at widths ≤850 px; compact layout remains usable at widths ≤480 px.
- [ ] Reduced-motion preference continues to suppress/minimise animations and smooth scrolling.
- [ ] Live regions remain for toast, pending AI messages, career status, entry results, moderation status, and wellbeing messages.
- [ ] Labels remain associated with inputs and textareas.
- [ ] Voice unavailability and speech errors are communicated without blocking the rest of the product.
- [ ] No component-library default styles override Mantra contrast, focus, spacing, or typography.

## Security and server readiness

- [ ] `/api/chat` existence is verified in source/deployment before enabling production claims.
- [ ] `/api/career` existence is verified in source/deployment before enabling production claims.
- [ ] Provider secrets are server-side only and absent from HTML, client JavaScript, commits, and logs.
- [ ] AI requests have authentication/authorisation, rate limits, size limits, timeout/abort, response validation, and safe error handling.
- [ ] Sensitive message handling has consent, minimisation, retention, deletion/export, and provider-processing documentation.
- [ ] Community posts/reports/suspensions have server-side identity, roles, access control, validation, auditability, and abuse controls.
- [ ] Browser localStorage is not treated as an identity, moderation, access-control, or security boundary.
- [ ] Dynamic content remains escaped or rendered through safe DOM APIs; inline event handlers are reviewed before server content is introduced.
- [ ] CSP and other security headers are defined for production hosting.

## Third-party component gate

- [ ] Exact component page URL and live preview URL are recorded.
- [ ] Actual source is obtained and reviewed; metadata-only pages are not treated as source review.
- [ ] Direct and transitive dependencies are inventoried.
- [ ] Licence and attribution requirements are confirmed; “unknown” is not accepted as approval.
- [ ] Visual preview is checked against Mantra desktop, mobile, keyboard, touch, and reduced-motion states.
- [ ] Only approved interaction ideas are adapted; default visual styling is not imported blindly.
- [ ] No 21st.dev API key, generated secret, or unreviewed generated code is committed.

## Validation sign-off

- [ ] Baseline screenshot/reference captured before edits.
- [ ] Every route and interaction above manually exercised.
- [ ] Existing text, data counts, themes, illustrations, and logo compared with baseline.
- [ ] Targeted automated checks pass.
- [ ] Mobile and reduced-motion checks pass.
- [ ] API failure/offline checks pass.
- [ ] Privacy/security review completed for any newly server-backed feature.
- [ ] User explicitly approved any architecture, framework, component, visual, route, data, or behavior change.
