#!/bin/bash
# Copies migration_036_enable_rls.sql to Desktop + clipboard, opens Supabase SQL Editor
set -e
cd "$(dirname "$0")"

SQL="migration_036_enable_rls.sql"
[ -f "$SQL" ] || { echo "[!] $SQL not found"; exit 1; }

DEST="$HOME/Desktop/${SQL}"
cp "$SQL" "$DEST"
echo "Copied to: $DEST"

# Copy contents to clipboard
cat "$SQL" | pbcopy
echo "SQL is now on your clipboard — ready to paste."
echo ""

# Open Supabase SQL editor for the ExamGrind project
open "https://supabase.com/dashboard/project/rjhewprjimhplrugmifw/sql/new"

echo "1) Supabase SQL editor should open in your browser."
echo "2) Cmd+V to paste."
echo "3) Click RUN (or Cmd+Enter)."
echo "4) After success, run the sanity query at the bottom of the file to verify RLS is on."

read -n 1 -s -r -p "Press any key to close..."
