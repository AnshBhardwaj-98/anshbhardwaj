# Design System Document

## 1. Overview & Creative North Star: "The Aerodynamic Edge"
This design system is engineered to capture the high-velocity, precision-focused spirit of Formula 1 racing, translated into a sophisticated professional portfolio. We move away from the static, boxed layouts of traditional tech resumes toward a "Kinetic Editorial" style.

The **Creative North Star** is **"The Aerodynamic Edge."** Much like an F1 chassis, every element must serve a purpose and feel like it is slicing through the air. We achieve this through intentional asymmetry (mimicking the flow of a race track), overlapping "wing" elements, and high-tech typography. We reject the "template" look by using tonal layering and telemetry-inspired data visualizations to showcase technical skill as a high-performance craft.

---

## 2. Colors: The Paddock Palette
The color strategy utilizes a clean, professional base to allow the vibrant racing accents to pop with intentionality.

*   **Primary (`#000827`):** The Navy Blue. This represents the "Chassis"—the foundational strength and professional authority of the developer.
*   **Secondary (`#bb0016`):** The Racing Red. Used exclusively for "Ignition" points—primary actions, critical highlights, and kinetic energy.
*   **Tertiary (`#745b00` / `#f1c100`):** The Warning Yellow. Reserved for "Telemetry"—data points, status indicators, and subtle technical callouts.
*   **Surface Hierarchy (`#f9f9f9` to `#e2e2e2`):** Our "Track Surface." We build depth using the `surface-container` tiers.

### The "No-Line" Rule
To maintain a high-end editorial feel, **1px solid borders are strictly prohibited** for defining sections. Boundaries must be defined solely through background color shifts. For example, a project showcase in `surface_container_low` should sit directly against a `surface` background. The shift in tone creates a "seam" rather than a "fence."

### The "Glass & Gradient" Rule
For floating navigational elements or "Head-Up Display" (HUD) components, use Glassmorphism. Apply `surface_container_lowest` with a 70% opacity and a `backdrop-blur` of 12px. To add "soul," primary CTAs should utilize a subtle linear gradient from `primary` to `primary_container` at a 135-degree angle, mimicking the shimmer of polished carbon fiber.

---

## 3. Typography: The Engineering Specs
Typography conveys a "Modern Tech" aesthetic, balancing the raw speed of a monospaced-adjacent display face with the high-legibility of a geometric sans-serif.

*   **Display & Headlines (Space Grotesk):** This is our "Telemetry" font. Its quirky, technical apertures feel high-tech and precise. Use `display-lg` for hero statements to create massive impact, often overlapping with background elements to break the grid.
*   **Body & Titles (Manrope):** This is our "Technical Documentation" font. Manrope’s clean, open curves ensure that even long-form technical descriptions remain readable and professional.
*   **Labels (Space Grotesk):** All micro-copy, tags, and data points must use `label-md` in all-caps with a `letter-spacing` of 0.05rem to mimic racing HUDs.

---

## 4. Elevation & Depth: Tonal Layering
In this design system, we do not use "Drop Shadows" in the traditional sense. We use the **Layering Principle.**

*   **The Layering Principle:** Depth is achieved by stacking `surface-container` tiers. A code snippet card (`surface_container_lowest`) sits on a section background (`surface_container_low`), which sits on the global background (`surface`). This creates a soft, natural lift reminiscent of layered composite materials.
*   **Ambient Shadows:** If a floating element (like a modal or a floating action button) requires a shadow, it must be an "Ambient Glow." Use the `on_surface` color at 5% opacity with a blur radius of 40px and 0 offset.
*   **The Ghost Border:** If a boundary is required for accessibility, use a "Ghost Border." Apply the `outline_variant` token at 15% opacity. This provides a hint of structure without interrupting the aerodynamic flow of the page.

---

## 5. Components

### Buttons
*   **Primary:** `secondary` (Red) background with `on_secondary` text. Use `rounded-sm` (0.125rem) for a sharp, aggressive look.
*   **Secondary:** `primary` (Navy) background with a 135-degree gradient to `primary_container`. 
*   **Tertiary:** No background. Use `label-md` (Space Grotesk, All-Caps) with a `secondary` underline that expands on hover.

### Chips (Skill Tags)
*   Styled as "Telemetry Tags." Use `surface_container_highest` backgrounds with `primary` text. Use `rounded-none` for a brutalist, industrial feel. Add a 2px left-border of `tertiary` (Yellow) to indicate "active" status or high proficiency.

### Cards (Project Showcase)
*   **Structure:** No borders. Use `surface_container_low`. 
*   **Hover State:** Transition the background to `surface_container_high` and apply a 2px `secondary` stripe at the very top of the card to simulate a "racing stripe."
*   **Imagery:** Use a subtle "Carbon Fiber" SVG pattern overlay (opacity 3%) on top of image containers to reinforce the F1 theme.

### Telemetry Data (Stats)
*   For years of experience or GitHub stars, use `display-sm` (Space Grotesk). Pair these with small, high-density line charts (sparklines) using the `tertiary` (Yellow) color to mimic engine performance graphs.

### Input Fields
*   **Text Inputs:** `surface_container_lowest` background with a `ghost-border`. On focus, the bottom border becomes 2px solid `secondary` (Red), creating a "starting line" effect.

---

## 6. Do's and Don'ts

### Do:
*   **Do** use asymmetrical margins. A 12-column grid is a suggestion; feel free to push a heading into the first 2 columns while the body text starts at column 4.
*   **Do** use "Motion Blur" transitions (0.3s ease-out) for hover states to simulate speed.
*   **Do** incorporate "Checkered" patterns as very subtle background watermarks (opacity 2%) in the footer or transition sections.

### Don't:
*   **Don't** use standard `rounded-lg` or `rounded-xl`. We want "Fast and Sharp," not "Soft and Bubbling." Stick to `sm` or `none`.
*   **Don't** use generic icons. Use thin-stroke technical icons that look like engineering schematics.
*   **Don't** use pure black. Always use `primary` (`#000827`) for dark tones to maintain the Red Bull Racing brand sophistication.
*   **Don't** use divider lines between list items. Use vertical white space from the spacing scale to let the content breathe.

---

## 7. Signature Texture: The "Aero" Gradient
To differentiate from flat, generic portfolios, apply a "Radial Aero Glow" to the hero section. A large, soft radial gradient of `secondary_container` at 10% opacity should sit behind the primary headline, giving the impression of a car's brake lights or a glowing exhaust at high speeds.