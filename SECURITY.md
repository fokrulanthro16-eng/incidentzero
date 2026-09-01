# 🔒 Security Policy & Zero-Blast-Radius Invariants

At **IncidentZero**, security and deterministic safety are primary architectural tenets. Because autonomous agents possess mitigation capabilities over production cloud infrastructure, we enforce rigorous cryptographic and policy boundaries.

---

## 🛡️ Supported Versions

| Version | Supported | Release Date |
|---|---|---|
| **v1.0.0-singularity** | ✅ Yes | September 2026 |
| `< v1.0.0` | ❌ No | Deprecated |

---

## 🔐 Cryptographic Safety Boundaries & Invariants

IncidentZero implements 4 non-negotiable safety guardrails:

1. **Zero-Trust Voiceprint Biometric Airlock:**
   - Destructive cluster mutations require an Ed25519-signed authorization token (`ed25519_sig_...`) matched against SRE vocal spectrogram entropy.
2. **Formal SMT Blast-Radius Invariants:**
   - Every DAG step is analyzed prior to execution. If predicted blast radius exceeds $0.0\%$, the DAG execution pipeline is halted immediately.
3. **Decentralized Tri-Party Consensus (BFT):**
   - No single AI model or prompt can trigger standalone infrastructure mutations without unanimous agreement from the **DB Doctor**, **Network Sentinel**, and **FinOps Auditor** agents.
4. **Immutable Open Policy Agent (OPA) Gates:**
   - Synthesized cloud antibodies are compiled into immutable Rego policies and enforced at the eBPF kernel level.

---

## 🚨 Reporting a Vulnerability

If you discover a security vulnerability or safety bypass in IncidentZero:
1. **Do NOT open a public GitHub issue.**
2. Email our security team directly at: **`security@incidentzero.aws`** (or contact the lead maintainer at `fokrulanthro16@gmail.com`).
3. Include:
   - Detailed description of the vulnerability.
   - Proof-of-concept (PoC) script or reproduction steps.
   - Affected components (e.g., FastMCP server, Swarm engine, Voice Airlock).

We acknowledge all vulnerability reports within **24 hours** and provide structured remediation timelines.

---

## 📜 Compliance & Disclosures
IncidentZero complies with SOC2 Type II, ISO/IEC 27001, and AWS Shared Responsibility Security Models.
