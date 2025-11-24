#!/usr/bin/env python3
"""Fix duplicate opening braces in batch-inserted careers."""
import re

# Read the file
with open('data/careers-fi.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix pattern: "  {\n{" -> "  {"
content = re.sub(r'  \{\n\{', '  {', content)

# Also fix cases where there's a standalone { on a line after batch comment
lines = content.split('\n')
fixed_lines = []
skip_next = False

for i, line in enumerate(lines):
    if skip_next:
        skip_next = False
        continue

    # Check if this is a duplicate brace situation
    if i < len(lines) - 1:
        if line == '  {' and lines[i+1] == '{':
            # Keep first, skip second
            fixed_lines.append(line)
            skip_next = True
            continue

    fixed_lines.append(line)

# Write back
with open('data/careers-fi.ts', 'w', encoding='utf-8') as f:
    f.write('\n'.join(fixed_lines))

print("Fixed duplicate braces!")
