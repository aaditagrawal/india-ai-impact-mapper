# Styling

Component declarations are compiled from `app/ui.stylex.js` through the StyleX Babel and PostCSS plugins. `lib/utils.ts` retains the components' `className` composition API by registering compiled styles and combining them with `stylex.props`. It does not parse utility classes at runtime.

`app/reset.css` preserves the former reset, theme variables, animation definitions, and custom global CSS. Its first layer-order declaration must stay before any imported layer: Next can hoist imports ahead of the declaration in `globals.css`. The copied CSS licenses are adjacent to that file.

`app/ui-states.css` preserves responsive, descendant, data-state, feature-query, and pseudo-element rules. Scope markers remain for group/peer behavior, inverted dark menus, and explicit SVG sizes. Scoped exclusions preserve overrides that the former utility merger removed: wider dialogs, small button icons, destructive focus colors, and zero-width input-group rings. Keep opaque color fallbacks and their feature-query alternatives together.

## Migration verification

The baseline was commit `702c718`. Browser comparisons use element order, direct text nodes, bounding rectangles, and every non-custom computed CSS property; custom properties are checked through their resolved effects. Finite animations are compared at their endpoint. Production builds were used for the comparisons.

- All 11,908 session-view elements match at widths 390, 639, 640, 767, 768, 1023, 1024, 1279, 1280, 1535, 1536, and 1920.
- Empty search, session details, command palette, and populated search results match at mobile and desktop sizes, including the 640px dialog breakpoint.
- The exhibitor list matches all 5,183 elements at widths 390, 640, 768, 1280, and 1536. Exhibitor detail dialogs match at mobile, 640px, and desktop sizes.
- A temporary 316-element fixture covers all button sizes/variants, badges and links, cards, tooltips, inputs, file inputs, field orientations, input-group addon positions, textareas, and toggles. All computed styles, geometry, and direct text match in 14 light/dark, mobile/desktop, hover, focus, invalid, expanded, and disabled cases. Hover/focus selectors were activated in place without changing their cascade order. The fixture is not shipped.
- An AST comparison of all 36 changed TSX files confirms that non-styling expressions, attributes, component structure, and normalized text remain unchanged.
- Development and production match the baseline for the 895-element filtered mobile view, expanded map, hovered zone, selected-zone filter, and open venue selector. The selected-map screenshot is byte-identical after fixing the pulse animation to a common phase.

This is a styling-system migration; it does not claim a runtime performance improvement.
