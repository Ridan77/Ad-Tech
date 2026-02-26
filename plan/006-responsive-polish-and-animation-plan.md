# Delivery Workflow Item 6 Plan

## Scope
Polish responsiveness and add tasteful motion/visual refinements without changing core behavior:
- desktop and mobile spacing/layout polish
- cleaner hierarchy/typography
- subtle animations for modal, filter/table transitions, and action feedback
- consistent visual language between Tailwind + MUI controls

## Target Areas
- `src/components/clients/clients-page.tsx`
- `src/components/clients/client-filters.tsx`
- `src/components/clients/client-table.tsx`
- `src/components/clients/client-modal.tsx`
- `src/components/clients/delete-client-dialog.tsx`
- `src/app/globals.css`

## Proposed Enhancements
1. Responsive polish
- tighten vertical rhythm on desktop
- improve compactness on mobile cards and filter block
- ensure controls remain tap-friendly on small screens

2. Visual consistency
- align font sizes/weights across MUI and Tailwind wrappers
- unify border radii, border colors, and hover states
- improve empty/loading/error state styling

3. Animations
- table row fade/slide-in (lightweight)
- modal open/close transition tuning
- small interaction feedback on action buttons

4. Accessibility pass
- visible keyboard focus states
- reduce motion support (`prefers-reduced-motion`)
- improve contrast where needed

## Step-by-Step
1. define polish tokens in `globals.css` (if needed)
2. adjust spacing/typography in page + filters + table
3. add motion classes and transition timings
4. add reduced-motion fallback
5. final visual QA on mobile + desktop
6. run lint + typecheck

## Acceptance Criteria
- UI feels intentionally polished on both mobile and desktop
- no layout breakpoints causing overflow/misalignment
- animations are subtle and not distracting
- accessibility basics preserved/improved
- lint and typecheck pass

## Questions (answer these before I implement)
1. Visual direction preference: a
   - A) clean clinical minimal 
   - B) playful friendly
   - C) premium dashboard
2. Animation intensity:
   - A) very subtle a
   - B) medium
   - C) noticeable
3. Keep current light theme only, or add optional dark theme? no, dont add
4. Should I keep MUI default typography, or customize typography in Tailwind/global CSS for a stronger look? all thpography should be the same
5. Do you want item 6 to include microcopy polish (button/label wording) or only visual/motion changes? only visual motion

## Status
- Implemented in code
- Lint passes
- Typecheck passes
