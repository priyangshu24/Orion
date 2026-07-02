# OrionOS AI Connectors - Phase 1 Contract

Phase 1 implements connector-ready UI only. No external OAuth, API calls, secrets, or user data sync are active yet.

## Supported mock connectors

- Slack
- Jira
- GitHub
- Google Calendar
- Google Meet
- Gmail
- Notion
- Salesforce
- HubSpot
- Google Drive
- Linear
- Microsoft Teams

## Phase 2 integration shape

Each connector should eventually expose:

- OAuth connection status
- Workspace/account identity
- Permission scopes
- Last sync status
- Sync objects, such as messages, issues, PRs, events, transcripts, docs, or CRM records
- Webhook health
- Background sync job state
- AI-safe context retrieval APIs

## AI routing expectations

The AI layer should query only connectors that are connected, permissioned, and relevant to the user prompt. Responses should show source provenance, stale-data warnings, and actions that require confirmation before mutating external systems.

## Safety requirements

- Do not store raw OAuth secrets in the frontend.
- Do not perform external writes without explicit user confirmation.
- Do not send connector data to an AI model without authorization and tenant checks.
- Keep audit logs for sync, retrieval, and action execution.