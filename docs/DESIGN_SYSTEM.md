---
name: design-system-orion-ask-more-from-work
description: Implementation-ready UI guidance for OrionOS, including semantic tokens, component behavior, accessibility, content, and QA standards.
---

# OrionOS Design System

## Context and goals

OrionOS must feel like a calm, precise operating system for work: structurally clear, visually premium, fast to scan, and efficient from keyboard, pointer, or touch.

The product combines the density of Linear and Superhuman, the command model of Raycast, the calm composition of Notion, and the spatial polish of Arc. The system must prioritize consistency over local visual exceptions.

## Design tokens and foundations

### Typography

- The primary family must be `Inter, "Inter Fallback", ui-sans-serif, system-ui, sans-serif`.
- Base body text must use `font.size.lg` (14px), `font.weight.base` (500), and a minimum 1.5 line height.
- Display text should use tight negative letter spacing between `-0.03em` and `-0.05em`.
- Product text must use the defined scale: `xs=11px`, `sm=12px`, `md=13px`, `lg=14px`, `xl=15px`, `2xl=16px`, `3xl=20px`, `4xl=28px`.
- Implementations must not introduce one-off font sizes.

### Semantic color

- Components must use semantic variables such as `--background`, `--foreground`, `--surface`, `--surface-strong`, `--surface-muted`, `--border`, `--muted`, `--accent`, `--success`, `--warning`, and `--danger`.
- Raw colors must not be used in product components unless representing user-generated labels or data-series identity.
- Primary text must meet 4.5:1 contrast against its surface.
- Large text and meaningful icons must meet 3:1 contrast.
- Disabled state contrast may be reduced but the control must remain identifiable.

### Space, radius, elevation, and motion

- Layout spacing must use a 2px base progression: 2, 4, 6, 8, 10, 12, 16, 20, 24, 32px.
- Control radii must use 8, 10, 14, or 20px semantic tiers.
- Floating surfaces should combine a subtle border, restrained shadow, and backdrop blur.
- Interaction motion must use 150ms for immediate feedback, 250ms for menus, and 300–400ms for page or panel transitions.
- Motion must use opacity and transform where possible.
- Reduced-motion preference must remove non-essential movement.

## Component-level rules

### Buttons and icon buttons

- Anatomy must include label, optional leading/trailing icon, and progress indicator.
- Variants must include primary, secondary, ghost, and danger.
- Default state must expose a clear boundary or fill.
- Hover must change fill, border, or opacity without shifting layout.
- Focus-visible must render a persistent high-contrast ring.
- Active must use a restrained scale or tonal change.
- Disabled must block pointer and keyboard activation.
- Loading must preserve width and expose progress to assistive technology.
- Error behavior must use descriptive nearby text; color alone must not communicate failure.
- Touch targets must be at least 44×44px when controls are not densely grouped.

### Inputs, search, and forms

- Anatomy must include visible label, control, optional hint, and error message.
- Placeholder text must not replace a label.
- Error text must identify the problem and correction.
- Long values must scroll horizontally or wrap according to input type.
- Enter should submit single-purpose forms; multiline inputs must preserve Enter for line breaks.
- Validation must run on submit and may run on blur; it should not interrupt typing.

### Navigation and command palette

- Current route must be indicated by more than color.
- Sidebar items must retain labels at desktop sizes and may collapse behind an explicit menu on smaller screens.
- Command palette must open with `Cmd/Ctrl+K`, trap focus, support arrow navigation, activate with Enter, and close with Escape.
- Navigation labels must be specific: “Open inbox” is acceptable; “Go” is prohibited.
- Badges must remain readable at 200% zoom.

### Cards and dashboard widgets

- Cards must have a clear header, content region, and optional action region.
- Interactive cards must expose hover, focus-visible, active, disabled, loading, and error states.
- Empty states must explain what is absent and provide a relevant next action.
- Loading states should use stable skeleton geometry.
- Long titles must wrap to two lines or truncate with an accessible full label.
- Bento layout must collapse to one column on small screens and must not create horizontal page overflow.

### Tables, lists, calendar, and task boards

- Dense collections must provide an accessible name and logical reading order.
- Row actions must be keyboard reachable.
- Drag-and-drop must provide a keyboard alternative.
- Calendar events must expose title, date, start time, and end time as text.
- Task status must not be communicated only through column position or color.
- Horizontal overflow may be used for boards and calendar grids, but page-level navigation must remain stationary.

### Panels, dialogs, menus, and notifications

- Overlays must trap focus and restore focus to the trigger when closed.
- Escape must close non-destructive overlays.
- Clicking the backdrop should close lightweight panels but must not discard unsaved work without confirmation.
- Menus must support arrow keys, Home, End, Enter, Space, and Escape.
- Notifications must use concise titles, context, and timestamps.

## Accessibility requirements and acceptance criteria

- Every interactive element must be reachable and operable using keyboard only; test by completing each primary page flow without a pointer.
- Focus order must match visual order; test using repeated Tab and Shift+Tab.
- Focus indicators must remain visible in both themes and at 200% zoom.
- Text contrast must pass WCAG 2.2 AA in automated checks and manual sampling.
- The interface must remain usable at 320 CSS pixels wide without two-dimensional page scrolling.
- Content must reflow at 400% zoom.
- Icon-only controls must expose an accessible name.
- Form errors must be programmatically associated with controls.
- Status updates such as saving, loading, and errors must be announced through an appropriate live region.
- Motion must respect `prefers-reduced-motion`.
- Pointer targets must satisfy WCAG 2.2 target-size requirements or documented spacing exceptions.

## Content and tone standards

Copy must be concise, confident, and implementation-focused.

- Use “Create task,” not “Submit.”
- Use “Mark all as read,” not “Clear.”
- Use “No tasks due today. Add a task or review your backlog,” not “Nothing here.”
- Errors must state what happened and what the user can do: “We could not save the task. Check your connection and try again.”
- Labels must use sentence case.
- Destructive actions must name the object: “Delete workspace” rather than “Delete.”

## Anti-patterns and prohibited implementations

- Components must not use hidden or low-contrast focus indicators.
- Product UI must not contain arbitrary spacing, radius, color, or typography values.
- Glass effects must not reduce text contrast.
- Animations must not block input or exceed 400ms for routine interactions.
- Hover-only information must not contain essential content.
- Disabled controls must not be used to hide permission or validation explanations.
- Cards must not become nested containers without clear hierarchy.
- Mobile layouts must not simply shrink desktop density.

## Migration notes

- New components must consume semantic tokens before being added to shared UI.
- Feature-specific components should remain inside the owning feature until reused by at least two independent features.
- Shared components must not import from a feature.
- Backend integration in Phase 2 should replace feature mock services without changing page component contracts.

## QA checklist

- [ ] All routes render and are keyboard navigable.
- [ ] Every control has default, hover, focus-visible, active, disabled, loading, and error behavior.
- [ ] Light and dark themes pass contrast checks.
- [ ] Layouts work at 320px, 768px, 1024px, and 1440px.
- [ ] Command palette opens with `Cmd/Ctrl+K` and closes with Escape.
- [ ] Dialog and panel focus is trapped and restored.
- [ ] Empty, loading, long-content, overflow, and error states are implemented.
- [ ] Reduced-motion behavior is verified.
- [ ] Automated type, lint, and production-build checks pass.
