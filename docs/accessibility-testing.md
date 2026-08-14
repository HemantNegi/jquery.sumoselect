# Accessibility test plan

This test plan covers the custom-rendered single-select accessibility work. Automated DOM tests verify roles, states, keyboard state transitions, source `<select>` synchronization, and change-event counts. They do not validate speech output or browser/accessibility-API interoperability.

## Automated checks

Run:

```sh
npm test
```

GitHub Actions runs the suite on Node.js 22 and 24. The `jsdom` development dependency requires Node.js 18 or newer; the release workflow therefore no longer uses Node.js 14.

The suite covers:

- combobox, listbox, option, group, and form-state attributes;
- accessible-name priority and associated-label focus;
- unique IDs across instances;
- open, close, arrow, Home, End, Enter, Space, Escape, and Tab behavior;
- simple (including the letter `A`), multi-character, repeated-character, expired-buffer, accented, disabled, and hidden-option typeahead;
- visible search focus, filtering, active-option repair, no-match status, and stale-option prevention;
- exactly one `change` event after an explicit single-select commit;
- mouse selection and public API synchronization;
- `enable()`, `disable()`, `reload()`, option add/remove, and item enable/disable;
- replacement elements returned by `renderLi`, including restored data, events, and ARIA state;
- an elementary multiple-select regression guard, including its historical `Ctrl+A` shortcut and the absence of a partial listbox model;
- native mobile fallback when custom rendering is not forced.

## Keyboard-only recipe

Use a page containing at least two single selects, one with `search: false` and one with `search: true`. Include France, Finland, Germany, a disabled option, an option with `hidden`, and enough options to require scrolling.

1. Press Tab through the page. Each SumoSelect must receive focus once, with a visible focus indicator.
2. Activate the associated `<label>`. Focus must move to the visible SumoSelect control.
3. Open with Enter and repeat with Space. `aria-expanded` and the popup visibility must agree.
4. Navigate with Arrow Up, Arrow Down, Home, and End. Disabled and hidden options must never become active.
5. With the popup closed, type `F` then `r` quickly. France must become active and be scrolled into view, while the original select value and `change` count remain unchanged.
6. Press Enter, then repeat with Space. France must be committed, the popup must close, and exactly one `change` event must fire.
7. Activate another option and press Escape. The popup must close and the previously committed value must remain selected.
8. Activate another option and press Tab. Focus must leave the component without committing the active-only option.
9. With search enabled, filter out the active option. A visible enabled result must become active. Enter must never commit the old hidden option.
10. Enter a query with no matches. The no-match message must be announced once without repeated announcements on unrelated navigation.

## Assistive-technology matrix

These checks require real browsers and assistive technologies. Record the exact browser and screen-reader versions used.

| Environment | Required checks | Status in this PoC |
| --- | --- | --- |
| Firefox + NVDA | Label, combobox role/value, expanded state, active option and selected state; full keyboard recipe | Not run |
| Safari + VoiceOver on macOS | Label, role/value, rotor behavior, popup and active-option announcements; full keyboard recipe | Not run |
| Chrome + JAWS | Regression for upstream #298: every arrow/typeahead move announces the active option; full keyboard recipe | Not run |
| Keyboard only | Focus order/visibility, no trap, commit/cancel behavior, scroll | Automated state checks only; visual run required |
| Mouse | Label focus, open/close, option commit, outside click | Automated state checks only; visual run required |
| Mobile native | Native `<select>` remains the only focus target when custom rendering is not forced | Automated DOM check; device run required |
| Mobile forced custom | Touch opening, scrolling, selection, focus restoration, screen-reader gestures | Not run |

Do not use an automated axe/WAVE result as a substitute for this interaction and announcement matrix.

The visible-search variant needs particular attention: DOM focus moves into `.search-txt`, while `role="combobox"` and `aria-expanded` remain on the wrapper and `aria-activedescendant` is mirrored to the input. Automated tests verify the state synchronization, but only real accessibility APIs can establish whether NVDA, VoiceOver, and JAWS announce this arrangement consistently.

## Markup and compatibility notes

The historical class names and hierarchy remain in place: `.SumoSelect`, `.CaptionCont`, `.optWrapper`, `.options`, `.opt`, `.sel`, `.selected`, `.SumoUnder`, and `.search-txt`. No CSS selector migration is required.

The custom single-select wrapper changes from `role="button"` to `role="combobox"`. In single-select custom mode only, the existing `<ul class="options">` receives `role="listbox"` and a generated ID; option `<li>` elements receive generated IDs, `role="option"`, `aria-selected`, and `aria-disabled`. The original single select receives `aria-hidden="true"` and `tabindex="-1"`; `unload()` restores its original attributes. The visible-search no-match element becomes a polite status region.

Tab deliberately preserves historical SumoSelect behavior: it closes and leaves without committing an option that was only navigated to. This differs from the WAI-ARIA APG select-only example, which commits on Tab, and prevents unexpected AJAX/facet updates before Enter, Space, or click.

Multiple-select keyboard and screen-reader behavior is outside this PoC. Its original wrapper role and interaction are retained, its source `<select multiple>` is not hidden from assistive technologies, and no listbox/option roles are added. It is guarded against elementary regression but must not yet be described as fully accessible.
