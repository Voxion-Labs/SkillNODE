# SkillNODE Operational & Contribution Protocols

SkillNODE operates under strict full-stack architectural constraints. We do not accept arbitrary UI bloat, unoptimized React renders, or unsecured backend routing. This repository is maintained as a high-performance, proprietary training infrastructure.

If you intend to submit a Pull Request, you must adhere strictly to the following institutional directives.

## 1. Architectural Standards
All code submitted to SkillNODE must meet our baseline performance and security metrics:
* **Frontend Isolation:** React components must maintain strict local-first execution. Avoid unnecessary re-renders or state bloat that compromises the zero-latency UI experience.
* **Backend Security:** Any modifications to the Express routing, AI endpoints, or Socket.IO handlers must include complete validation via Zod. Unsanitized inputs will result in immediate rejection.
* **Monorepo Integrity:** Do not mix client-side and server-side dependencies. Keep `client/` and `server/` packages strictly isolated as per the workspace topology.

## 2. Pull Request (PR) Governance
Before initiating a merge request, ensure your PR adheres to this exact structure:
1. **[METRIC] Benchmark Data:** You must provide before/after execution telemetry (e.g., frontend bundle size impact, backend endpoint latency, WebSocket broadcast efficiency).
2. **[LOGIC] State Transition:** Explicitly document the deterministic changes made to the database schema, AI prompts, or React state management.
3. **[ISOLATION] Threat Model:** Prove that your modifications do not introduce JWT vulnerabilities, bypass fair-play integrity checks, or expose sensitive `.env` variables to the client.

*Note: PRs failing to provide empirical telemetry or violating the full-stack isolation constraints will be closed immediately without review.*

## 3. Vulnerability Disclosure
**DO NOT** open public issues for JWT bypasses, WebSocket hijacking, or AI prompt injection vulnerabilities. Public disclosure of critical threats compromises the integrity of the entire training matrix.
* All security reports must be routed internally.
* Contact the Lead Architect directly for secure transmission protocols.

## 4. Code of Conduct
We evaluate algorithmic efficiency and architectural integrity, not intentions. Your submissions will be scrutinized ruthlessly based on full-stack optimization and system determinism. Keep discussions clinical, objective, and exclusively focused on system architecture.