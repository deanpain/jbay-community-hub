# Agent handoff directory

## Protocol

- Major (CEO) writes instructions as .md files prefixed with TO-
- Agent writes results as .md files prefixed with DONE-
- Paperclip issue comments mirror handoff status
- Commit project code to repo, update Paperclip tickets when done

## Agents
- Codex (GPT5.2) - coding partner (tasked via mcp_codex_codex)
- Major (CEO) - orchestrator, review gate, commits, Paperclip updates
