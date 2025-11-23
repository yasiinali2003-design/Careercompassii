/**
 * Spacing Design Tokens
 *
 * Professional spacing system based on 8px grid
 * Ensures consistent vertical and horizontal rhythm
 */

/**
 * Core spacing scale - 8px baseline grid
 * Usage: Margins, padding, gaps between elements
 */
export const spacing = {
  /** 0px - No space */
  none: '0',

  /** 2px - Minimal spacing (for tight layouts) */
  xs: '0.5',      // 2px

  /** 4px - Extra small spacing */
  sm: '1',        // 4px

  /** 8px - Small spacing (baseline unit) */
  md: '2',        // 8px

  /** 12px - Medium spacing */
  lg: '3',        // 12px

  /** 16px - Large spacing */
  xl: '4',        // 16px

  /** 24px - Extra large spacing */
  '2xl': '6',     // 24px

  /** 32px - 2X large spacing */
  '3xl': '8',     // 32px

  /** 40px - 3X large spacing */
  '4xl': '10',    // 40px

  /** 48px - 4X large spacing */
  '5xl': '12',    // 48px

  /** 64px - 5X large spacing */
  '6xl': '16',    // 64px

  /** 80px - 6X large spacing */
  '7xl': '20',    // 80px

  /** 96px - 7X large spacing */
  '8xl': '24',    // 96px
}

/**
 * Section spacing - For major page sections
 * Usage: py-{section.sm} for section padding
 */
export const section = {
  /** 48px vertical - Mobile sections */
  sm: 'py-12',    // 3rem = 48px

  /** 64px vertical - Tablet sections */
  md: 'py-16',    // 4rem = 64px

  /** 96px vertical - Desktop sections */
  lg: 'py-24',    // 6rem = 96px

  /** 128px vertical - Hero sections */
  xl: 'py-32',    // 8rem = 128px
}

/**
 * Container spacing - For page containers
 * Usage: px-{container.sm} for horizontal padding
 */
export const container = {
  /** 16px horizontal - Mobile */
  sm: 'px-4',     // 1rem = 16px

  /** 24px horizontal - Tablet */
  md: 'px-6',     // 1.5rem = 24px

  /** 32px horizontal - Desktop */
  lg: 'px-8',     // 2rem = 32px

  /** 48px horizontal - Wide desktop */
  xl: 'px-12',    // 3rem = 48px
}

/**
 * Gap spacing - For flexbox/grid gaps
 * Usage: gap-{gap.md} for consistent spacing between items
 */
export const gap = {
  /** 4px - Tight gap */
  xs: 'gap-1',    // 0.25rem = 4px

  /** 8px - Small gap */
  sm: 'gap-2',    // 0.5rem = 8px

  /** 12px - Medium gap */
  md: 'gap-3',    // 0.75rem = 12px

  /** 16px - Large gap */
  lg: 'gap-4',    // 1rem = 16px

  /** 24px - XL gap */
  xl: 'gap-6',    // 1.5rem = 24px

  /** 32px - 2XL gap */
  '2xl': 'gap-8', // 2rem = 32px
}

/**
 * Stack spacing - For vertical stacks of content
 * Usage: space-y-{stack.md} for consistent vertical rhythm
 */
export const stack = {
  /** 8px - Tight stack */
  xs: 'space-y-2',   // 0.5rem = 8px

  /** 12px - Small stack */
  sm: 'space-y-3',   // 0.75rem = 12px

  /** 16px - Medium stack */
  md: 'space-y-4',   // 1rem = 16px

  /** 24px - Large stack */
  lg: 'space-y-6',   // 1.5rem = 24px

  /** 32px - XL stack */
  xl: 'space-y-8',   // 2rem = 32px

  /** 48px - 2XL stack */
  '2xl': 'space-y-12', // 3rem = 48px
}

/**
 * Responsive spacing utilities
 * Usage: For spacing that changes based on screen size
 */
export const responsive = {
  /** Section padding: 48px mobile → 96px desktop */
  sectionY: 'py-12 md:py-24',

  /** Container padding: 16px mobile → 24px desktop */
  containerX: 'px-4 md:px-6',

  /** Hero padding: 80px mobile → 128px desktop */
  heroY: 'py-20 md:py-32',

  /** Card padding: 16px mobile → 24px desktop */
  cardPadding: 'p-4 md:p-6',

  /** Section gap: 48px mobile → 64px desktop */
  sectionGap: 'space-y-12 md:space-y-16',
}

/**
 * Usage examples:
 *
 * <section className={section.lg}>Section content</section>
 * <div className={container.md}>Container content</div>
 * <div className={gap.md}>Flex items</div>
 * <div className={stack.lg}>Stacked content</div>
 * <section className={responsive.sectionY}>Responsive section</section>
 *
 * Or with custom combinations:
 * <div className="px-4 py-12 md:px-6 md:py-24">...</div>
 */
