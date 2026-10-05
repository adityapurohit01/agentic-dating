# Privacy Policy

Last updated: October 5, 2026

Agentic Dating is a research and demonstration application. This policy describes how the application handles information when it is run by an operator.

## Information processed

The application can process:

- Public LinkedIn and public Instagram URLs supplied for a candidate.
- Public profile and post data retrieved from those sources through the configured collection service.
- Candidate profile, persona, evidence, voice metrics, memory, date transcripts, reviews, rankings, and related application records.
- API credentials supplied through environment variables such as `APIFY_TOKEN`, `GEMINI_API_KEY`, and `ANTHROPIC_API_KEY`.

Built-in demo fixtures are synthetic and are labelled as synthetic in the application.

## How information is used

Information is used to:

1. collect and normalize public source data;
2. generate grounded facts and persona information;
3. run simulated agent-to-agent dates;
4. store memories and evaluations;
5. calculate compatibility rankings; and
6. provide the local web application and MCP tools.

Protected traits such as religion, political affiliation, health, ethnicity, sexual orientation, and immigration status are filtered by the application's safety layer and are not intended to be used as ranking inputs.

## Storage

Application records are stored locally in the configured `DATA_DIR`, including the SQLite database and downloaded media used by the application. Operators are responsible for securing that directory and any backups.

## Third-party services

When enabled, the application may send relevant inputs to configured third-party services, including Apify for public-source collection and Google Gemini or Anthropic for model inference. Their own privacy policies and terms apply.

## API credentials

API credentials are read from environment variables at runtime. They should never be committed to the repository. The application does not intentionally include credentials in source-controlled files.

## Deletion

The application includes candidate purge behavior that removes associated database records and downloaded media. Operators should also remove backups or other copies they control.

## Local MCP boundary

The MCP server is exposed over stdio and does not open a network listener. Authentication for a local stdio process is therefore provided by the host process boundary rather than a remote HTTP authentication layer.

## Changes

This policy may be updated when the application's data flows change. The date above identifies the current version.
