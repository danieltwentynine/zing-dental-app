#!/usr/bin/env bash
# PostToolUse hook: typecheck after an edit to a TypeScript file.
# Exit 2 feeds the compiler output back to the agent; silent when clean or when deps aren't installed.
set -u
cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0
file=$(cat | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{try{console.log(JSON.parse(s).tool_input.file_path||"")}catch{console.log("")}})')
case "$file" in *.ts|*.tsx) ;; *) exit 0 ;; esac
[ -d node_modules ] || exit 0
out=$(npx tsc --noEmit 2>&1) || { echo "$out" | head -40 >&2; exit 2; }
