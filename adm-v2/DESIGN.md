---
colors:
  brand:
    pupr_blue: "#132F53"
    pupr_blue_light: "#1a3d6d"
    pupr_blue_dark: "#0c1f38"
    pupr_gold: "#D4A843"
    pupr_gold_light: "#E8C36A"
    pupr_gold_dark: "#B8902E"
  primary:
    50: "#e8edf4"
    100: "#c5d1e3"
    200: "#9eb3d0"
    300: "#7795bd"
    400: "#5a7faf"
    500: "{colors.brand.pupr_blue}"
    600: "#102949"
    700: "#0c1f38"
    800: "#081527"
    900: "#040b16"
  accent:
    50: "#fdf6e8"
    100: "#f9e9c5"
    200: "#f0d48f"
    300: "#e8c36a"
    400: "{colors.brand.pupr_gold}"
    500: "#B8902E"
    600: "#9a7724"
    700: "#7c5e1b"
    800: "#5e4613"
    900: "#3f2f0c"
  semantic:
    success: "#059669"
    success_light: "#d1fae5"
    success_dark: "#047857"
    warning: "#d97706"
    warning_light: "#fef3c7"
    warning_dark: "#b45309"
    danger: "#dc2626"
    danger_light: "#fee2e2"
    danger_dark: "#b91c1c"
    info: "#0284c7"
    info_light: "#e0f2fe"
    info_dark: "#0369a1"
  theme_light:
    bg_primary: "#f0f2f5"
    bg_secondary: "#ffffff"
    bg_tertiary: "#f8f9fb"
    bg_sidebar: "{colors.brand.pupr_blue}"
    bg_sidebar_hover: "rgba(255, 255, 255, 0.08)"
    bg_sidebar_active: "rgba(212, 168, 67, 0.15)"
    bg_card: "#ffffff"
    bg_card_hover: "#f8f9fb"
    bg_input: "#ffffff"
    bg_overlay: "rgba(0, 0, 0, 0.5)"
    bg_modal: "#ffffff"
    bg_tooltip: "{colors.brand.pupr_blue}"
    bg_badge: "#f0f2f5"
    text_primary: "#1a1a2e"
    text_secondary: "#4a5568"
    text_tertiary: "#718096"
    text_inverse: "#ffffff"
    text_sidebar: "rgba(255, 255, 255, 0.85)"
    text_sidebar_active: "{colors.brand.pupr_gold_light}"
    text_link: "{colors.brand.pupr_blue}"
    text_link_hover: "{colors.brand.pupr_blue_light}"
    border_light: "#e2e8f0"
    border_medium: "#cbd5e0"
    border_dark: "#a0aec0"
    border_focus: "{colors.brand.pupr_blue}"
  theme_dark:
    bg_primary: "#0a0e1a"
    bg_secondary: "#111827"
    bg_tertiary: "#1a1f35"
    bg_sidebar: "#0d1321"
    bg_card: "rgba(17, 24, 39, 0.8)"
    bg_card_hover: "rgba(26, 31, 53, 0.9)"
    bg_input: "#1a1f35"
    bg_overlay: "rgba(0, 0, 0, 0.7)"
    bg_modal: "#1a1f35"
    bg_badge: "#1a1f35"
    text_primary: "#f1f5f9"
    text_secondary: "#94a3b8"
    text_tertiary: "#64748b"
    text_link: "{colors.brand.pupr_gold_light}"
    text_link_hover: "{colors.brand.pupr_gold}"
    border_light: "rgba(255, 255, 255, 0.08)"
    border_medium: "rgba(255, 255, 255, 0.12)"
    border_dark: "rgba(255, 255, 255, 0.18)"
    border_focus: "{colors.brand.pupr_gold}"

typography:
  fonts:
    primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
  sizes:
    xs: "0.6875rem"
    sm: "0.75rem"
    base: "0.875rem"
    md: "1rem"
    lg: "1.125rem"
    xl: "1.25rem"
    2xl: "1.5rem"
    3xl: "1.875rem"
    4xl: "2.25rem"
  weights:
    light: 300
    normal: 400
    medium: 500
    semibold: 600
    bold: 700
    extrabold: 800
  line_heights:
    tight: 1.25
    normal: 1.5
    relaxed: 1.75

spacing:
  1: "0.25rem"
  2: "0.5rem"
  3: "0.75rem"
  4: "1rem"
  5: "1.25rem"
  6: "1.5rem"
  8: "2rem"
  10: "2.5rem"
  12: "3rem"
  16: "4rem"

border_radius:
  sm: "6px"
  md: "10px"
  lg: "16px"
  xl: "24px"
  full: "9999px"

shadows:
  light:
    xs: "0 1px 2px rgba(0, 0, 0, 0.05)"
    sm: "0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.06)"
    md: "0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.06)"
    lg: "0 10px 15px rgba(0, 0, 0, 0.08), 0 4px 6px rgba(0, 0, 0, 0.05)"
    xl: "0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04)"
    card: "0 2px 8px rgba(0, 0, 0, 0.06), 0 0 1px rgba(0, 0, 0, 0.1)"
    card_hover: "0 8px 24px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.06)"
    glow_blue: "0 0 20px rgba(19, 47, 83, 0.15)"
    glow_gold: "0 0 20px rgba(212, 168, 67, 0.2)"
  dark:
    xs: "0 1px 2px rgba(0, 0, 0, 0.3)"
    sm: "0 1px 3px rgba(0, 0, 0, 0.4)"
    md: "0 4px 6px rgba(0, 0, 0, 0.4)"
    lg: "0 10px 15px rgba(0, 0, 0, 0.4)"
    xl: "0 20px 25px rgba(0, 0, 0, 0.5)"
    card: "0 2px 8px rgba(0, 0, 0, 0.3), 0 0 1px rgba(255, 255, 255, 0.05)"
    card_hover: "0 8px 24px rgba(0, 0, 0, 0.4), 0 0 1px rgba(255, 255, 255, 0.08)"

transitions:
  fast: "150ms ease"
  base: "200ms ease"
  slow: "300ms ease"
  spring: "300ms cubic-bezier(0.34, 1.56, 0.64, 1)"

z_index:
  dropdown: 100
  sticky: 200
  overlay: 300
  modal: 400
  toast: 500
  tooltip: 600
---

# Design System: Dashboard Administrasi Cipta Karya v2

The Dashboard Administrasi Cipta Karya v2 is a premium, web-based application built for managing infrastructure project documents. The design language heavily reflects the official branding of the Kementerian Pekerjaan Umum dan Perumahan Rakyat (PUPR), striking a balance between authoritative, professional aesthetics and a modern, user-friendly interface.

## Visual Identity & Branding

The core of the visual identity relies on two primary brand colors: **PUPR Blue** and **PUPR Gold**.
- **PUPR Blue** serves as the structural foundation, establishing trust and authority. It is predominantly used for the sidebar, main navigational elements, and primary text colors.
- **PUPR Gold** acts as the dynamic accent color, providing contrast and drawing attention to critical actions, active states, and highlights. It injects a sense of premium quality and focus into the interface.

## Look & Feel

The overall visual feel is clean, structured, and modern, avoiding unnecessary clutter. It leverages a "glassmorphism" aesthetic subtly, prioritizing readability and functional clarity.

### Theming Strategy

The system is built with robust support for both Light and Dark themes, defaulting to Light Mode for a clean, paper-like feel.
- **Light Mode (Default):** Utilizes soft, off-white backgrounds (`#f0f2f5`) to contrast against crisp white cards, creating a clear sense of elevation. Text is dark and highly legible.
- **Dark Mode:** Inverts the paradigm, using deep navy/charcoal backgrounds (`#0a0e1a`) with slightly lighter, semi-transparent panels. Borders become subtle and glowing highlights (like the gold accent) stand out more vividly.

### Elevation & Depth

Depth is established through a carefully scaled shadow system rather than heavy borders.
- Cards and panels float slightly off the background using delicate shadows (`shadow-card`).
- Interactive elements elevate upon hover, increasing their shadow intensity to communicate clickability (`shadow-card-hover`).
- Deep glowing shadows (`glow_blue`, `glow_gold`) are used sparingly for hero elements or primary calls-to-action to create a premium, "illuminated" effect.

### Component Styling (Glassmorphism & Gradients)

- **Cards:** Clean, rounded rectangles (typically `border-radius-lg` or `16px`) with soft shadows.
- **Gradients:** Subtle linear and radial gradients are used, particularly in the Public Landing Page hero section and Dashboard stat cards, to add vibrancy and prevent flat color fatigue.
- **Glassmorphism:** Certain elements, such as the sticky navigation bar on the public landing page, utilize semi-transparent backgrounds with backdrop blur (`backdrop-filter: blur(12px)`) to maintain context of the content scrolling beneath while ensuring text legibility.

## Typography

The application strictly uses the **Inter** typeface. Inter was chosen for its exceptional legibility on screens, particularly in data-heavy dashboard environments.
- **Hierarchy:** Clear typographic hierarchy is maintained using distinct font sizes and weights. Headings are bold (`700`) or extrabold (`800`) and tight, while body text is normal (`400`) and appropriately spaced for reading.
- **Data Display:** Tabular data and statistics use medium (`500`) or semibold (`600`) weights to stand out against supporting text.

## Motion & Interaction

Motion is used purposefully to enhance the user experience without becoming distracting.
- **Micro-interactions:** Buttons and cards lift up (`transform: translateY(-2px)`) and increase their shadow on hover.
- **Page Transitions:** Elements stagger in using soft `fadeInUp` animations upon page load, making the application feel responsive and alive.
- **Feedback:** Modals and toast notifications slide in smoothly (`slideInRight`, `fadeInScale`), providing clear, immediate visual feedback to user actions.

## Layout & Structure

The application follows a classic, highly functional dashboard layout:
- A persistent left sidebar for primary navigation, collapsing cleanly on mobile devices.
- A wide, scrollable main content area that scales fluidly.
- Information is organized into grids and distinct visual blocks, preventing cognitive overload when dealing with complex document and project data.
