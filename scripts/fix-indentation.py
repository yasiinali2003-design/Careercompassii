#!/usr/bin/env python3
import re

# Read the file
with open('/Users/yasiinali/careercompassi/data/careers-fi.ts', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Fix indentation issues
fixed_lines = []
in_batch_career = False
after_opening_brace = False

for i, line in enumerate(lines):
    # Check if we're starting a career object
    if line.strip() == '{' and i > 0 and lines[i-1].strip().startswith('//'):
        in_batch_career = True
        after_opening_brace = True
        fixed_lines.append(line)
        continue

    # If we're right after an opening brace in a batch career
    if after_opening_brace and in_batch_career:
        after_opening_brace = False
        if line.startswith('  id:'):
            # This line is correct, keep it
            fixed_lines.append(line)
            continue

    # If we're in a batch career and line starts with 2 spaces but not 4
    if in_batch_career and line.startswith('  ') and not line.startswith('    ') and not line.strip() == '':
        # Check if it's a property at root level (not in an array)
        if re.match(r'^  [a-z_]+:', line):
            # Add 2 more spaces
            fixed_lines.append('  ' + line)
            continue

    # Check if we're ending a career object
    if line.strip() == '},':
        in_batch_career = False

    fixed_lines.append(line)

# Write the fixed file
with open('/Users/yasiinali/careercompassi/data/careers-fi.ts', 'w', encoding='utf-8') as f:
    f.writelines(fixed_lines)

print("Indentation fixed!")
