/**
 * Typography Design Tokens
 *
 * Professional, Scandinavian-inspired typography system
 * Based on 8px baseline grid for vertical rhythm
 */

export const typography = {
  /**
   * Display styles - For hero sections and major page headings
   * Usage: Landing page heroes, major section titles
   */
  display: {
    lg: 'text-6xl md:text-7xl font-bold tracking-tight leading-[1.1]',
    md: 'text-5xl md:text-6xl font-bold tracking-tight leading-[1.1]',
    sm: 'text-4xl md:text-5xl font-bold tracking-tight leading-[1.1]',
  },

  /**
   * Heading styles - For section titles and content structure
   * Usage: Page titles, section headings, card titles
   */
  h1: 'text-4xl font-bold tracking-tight leading-tight',
  h2: 'text-3xl font-bold tracking-tight leading-tight',
  h3: 'text-2xl font-semibold leading-tight',
  h4: 'text-xl font-semibold leading-snug',
  h5: 'text-lg font-semibold leading-snug',
  h6: 'text-base font-semibold leading-normal',

  /**
   * Body text styles - For content and descriptions
   * Usage: Paragraphs, descriptions, longer content blocks
   */
  body: {
    lg: 'text-lg leading-relaxed',
    md: 'text-base leading-relaxed',
    sm: 'text-sm leading-relaxed',
  },

  /**
   * UI text styles - For interface elements
   * Usage: Buttons, labels, form inputs, navigation
   */
  ui: {
    lg: 'text-base font-medium',
    md: 'text-sm font-medium',
    sm: 'text-xs font-medium',
  },

  /**
   * Caption styles - For secondary information
   * Usage: Metadata, timestamps, helper text, footnotes
   */
  caption: {
    lg: 'text-sm text-neutral-400',
    md: 'text-xs text-neutral-400',
    sm: 'text-xs text-neutral-500',
  },

  /**
   * Code/monospace styles - For technical content
   * Usage: Code snippets, data values, technical labels
   */
  code: {
    inline: 'font-mono text-sm bg-white/5 px-1.5 py-0.5 rounded',
    block: 'font-mono text-sm bg-white/5 p-4 rounded-lg',
  },
}

/**
 * Font weight tokens
 */
export const fontWeight = {
  light: 'font-light',      // 300
  normal: 'font-normal',    // 400
  medium: 'font-medium',    // 500
  semibold: 'font-semibold', // 600
  bold: 'font-bold',        // 700
}

/**
 * Line height tokens
 */
export const lineHeight = {
  tight: 'leading-tight',       // 1.25
  snug: 'leading-snug',         // 1.375
  normal: 'leading-normal',     // 1.5
  relaxed: 'leading-relaxed',   // 1.625
  loose: 'leading-loose',       // 2
}

/**
 * Letter spacing tokens
 */
export const letterSpacing = {
  tighter: 'tracking-tighter', // -0.05em
  tight: 'tracking-tight',     // -0.025em
  normal: 'tracking-normal',   // 0
  wide: 'tracking-wide',       // 0.025em
  wider: 'tracking-wider',     // 0.05em
  widest: 'tracking-widest',   // 0.1em
}

/**
 * Usage examples:
 *
 * <h1 className={typography.display.lg}>Hero Heading</h1>
 * <h2 className={typography.h2}>Section Title</h2>
 * <p className={typography.body.md}>Body text content</p>
 * <span className={typography.caption.md}>Helper text</span>
 * <button className={typography.ui.md}>Button Text</button>
 */
