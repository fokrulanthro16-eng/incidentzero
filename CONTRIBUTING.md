# 🤝 Contributing to IncidentZero

Thank you for your interest in contributing to **IncidentZero**! We welcome contributions from autonomous systems engineers, SREs, AI researchers, and open-source developers.

---

## 🧭 Code of Conduct
We are committed to providing a welcoming, inclusive, and professional environment. Please treat all contributors with respect and adhere to industry-standard open-source etiquette.

---

## 🌿 Branch Naming Conventions

We follow a structured branch naming system:
- `feat/<feature-name>`: New capabilities (e.g., `feat/ebpf-tracing`, `feat/azure-ai-bridge`)
- `fix/<bug-description>`: Bug fixes and regressions (e.g., `fix/sse-reconnect-jitter`)
- `agent/<agent-model>`: Multi-agent heuristic upgrades (e.g., `agent/finops-arbitrage-v2`)
- `docs/<doc-topic>`: Documentation and asset updates (e.g., `docs/architecture-diagrams`)

---

## 🛠️ Local Development Setup

### 1. Fork & Clone
```bash
git clone https://github.com/fokrulanthro16-eng/incidentzero.git
cd incidentzero
```

### 2. Backend Environment (Python 3.11+)
```bash
cd backend
python -m venv venv

# Windows:
venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
pip install pytest flake8

# Run test suite:
python test_backend.py
```

### 3. Frontend Environment (Node.js 20+)
```bash
cd ../frontend
npm install

# Run type checks:
npx tsc --noEmit

# Run local development server:
npm run dev
```

---

## 🧪 Testing & Verification Standards

Before submitting a Pull Request, ensure:
1. **Backend Tests Pass:** `python backend/test_backend.py` exits with code 0.
2. **TypeScript Passes:** `npx tsc --noEmit` produces zero compiler errors.
3. **No Large Binaries:** Verify that `node_modules/` or local `.venv` files are not accidentally tracked in git.
4. **Formal Safety Invariants:** Any new remediation tools exposed via FastMCP must include non-destructive simulation modes.

---

## 📋 Pull Request Template

When opening a PR, include:
- **Description:** Summary of changes and motivation.
- **Affected Components:** (Backend FastMCP, Multi-Agent Swarm, Frontend UI, etc.)
- **Test Evidence:** Terminal output or screenshots demonstrating verification.
- **Safety Proof:** Confirmation of 0% blast-radius violation.

---

## 📄 License
By contributing to IncidentZero, you agree that your contributions will be licensed under the project's [MIT License](LICENSE).
