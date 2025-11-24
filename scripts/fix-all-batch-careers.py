#!/usr/bin/env python3
"""Fix formatting issues in batch-inserted careers."""
import re

# Read the file
with open('data/careers-fi.ts', 'r', encoding='utf-8') as f:
    lines = f.readlines()

fixed_lines = []
i = 0
while i < len(lines):
    line = lines[i]

    # Pattern 1: Fix lines like "}\n  },\n" after a career - remove the extra "  },"
    if i > 0 and i < len(lines) - 1:
        if (line.strip() == '}' and
            lines[i+1].strip() == '},' and
            '========== BATCH' in ''.join(lines[max(0,i-5):i+5])):
            # This is the end of a batch career with wrong formatting
            # Keep the current line as "  },"
            fixed_lines.append('  },\n')
            i += 2  # Skip the next line
            continue

    # Pattern 2: Fix duplicate opening braces like "  {\n{\n  id:"
    if i < len(lines) - 2:
        if (line.strip() == '{' and
            lines[i+1].strip() == '{' and
            'id:' in lines[i+2]):
            # Skip the duplicate brace
            fixed_lines.append(line)
            i += 1  # Skip next line
            continue

    fixed_lines.append(line)
    i += 1

# Write back
with open('data/careers-fi.ts', 'w', encoding='utf-8') as f:
    f.writelines(fixed_lines)

print(f"Fixed {len(lines) - len(fixed_lines)} lines")
