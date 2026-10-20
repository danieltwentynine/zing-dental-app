# Zing — how to build with this design system

Zing is a teeth-brushing coach app for kids aged 4–12, with parent-facing account screens. These are the app's real **React Native** components rendered in the browser through react-native-web. Design phone screens about 390px wide.

## Setup

Wrap the whole tree in `SafeAreaProvider`. Without it, `SafeScreen` throws "No safe area value available"; it does no harm around everything else.

```jsx
const { SafeAreaProvider, SafeScreen, Button } = window.ZingDS;
<SafeAreaProvider><SafeScreen>{/* screen */}</SafeScreen></SafeAreaProvider>
```

## Component API is React Native, not DOM

- Use `onPress`, not `onClick`. `Button` needs `label` + `onPress`; it fills its row by default (`fullWidth={false}` hugs content).
- A component's `style` prop takes an RN style object (camelCase, unitless numbers: `{ marginTop: 12 }`), not CSS strings or classNames.
- Variants are props: `Button variant` = primary | secondary | soft | ghost | outline, `size` = sm | md | lg; `Card tone` = plain | mint | sky | sunken | outline; `Badge tone` = mint | sky | sunny | coral | grape | warning | neutral (+ `solid`); `StreakDisplay layout` = card | chip.
- `MouthMap states` maps zone ids (`top-front`, `top-left`, `top-right`, `top-back-left`, `top-back-right`, `bottom-*` alike) to `empty | active | done | missed`.
- `Avatar avatarId` ∈ `AVATAR_IDS` (shark, robot, rocket, cat, dog, butterfly, star, heart).

## Your own layout glue: divs + CSS tokens

There are no utility classes to use. Write plain elements with inline styles that read the CSS custom properties defined in `styles.css` (via `_ds_bundle.css`):

- Surfaces: `--surface-page` (screen bg), `--surface-card`, `--surface-mint`, `--surface-sky`, `--surface-sunken`
- Text: `--text-primary`, `--text-secondary`, `--text-tertiary`, `--text-link`
- Brand: `--brand-primary` (mint), `--brand-secondary` (sky); ramps `--mint-50…900`, `--sky-50…900`, `--ink-50…900`, accents `--sunny-*`, `--coral-*`, `--grape-*`
- Feedback: `--feedback-warning` / `--warning-*` (missed zones), `--feedback-reward`
- Radius: `--radius-sm|md|lg|xl|2xl|pill`
- Spacing `--space-1…12` (4px grid), `--gutter` (24px); shadows `--shadow-sm|md|lg|card` plus brand glows `--shadow-mint|sky|sunny`; motion `--ease-bounce`, `--dur-base`

Type: `font-family: var(--font-display)` / `var(--font-body)` (both Baloo 2, weighted: headings 800, subheads/buttons 700, body 500, labels 600) and `var(--font-numeric)` (Space Grotesk 700) for scores, timers and streaks. Nunito is reserved for the wordmark. Use `ZingWordmark`, and never set the logo in text.

## Brand rules

- Missed or incomplete things for kids are soft orange (warning), **never red**. Red (`--danger-500`) is only for parent auth errors.
- Kid copy is playful and never clinical. Buttons are active verbs ("Start brushing", "See my progress", "Brush again"), never "Submit", "OK" or "Cancel".
- The coach mascot is Sparky (`ZingMascot`); `CoachCard` titles default to "Sparky says".

Before styling, read `styles.css` and its imports, and each `components/<group>/<Name>/<Name>.prompt.md`.

```jsx
<div style={{ background: 'var(--surface-page)', padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 28, color: 'var(--text-primary)' }}>Great job, Leo!</span>
  <MouthMap size={200} states={{ 'top-front': 'done', 'top-back-left': 'missed' }} />
  <CoachCard score={92} message="Tomorrow, try to reach all the way to your back teeth." />
  <Button label="See my progress" size="lg" onPress={() => {}} />
</div>
```
