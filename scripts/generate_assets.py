"""
IncidentZero Asset Generator
Generates high-resolution production-grade Obsidian & Electric Cyan diagrams and UI graphics.
"""

import os
from PIL import Image, ImageDraw, ImageFont

def ensure_dir(path):
    os.makedirs(path, exist_ok=True)

def draw_glass_card(draw, box, bg_color=(11, 16, 27, 230), border_color=(6, 182, 212, 60), radius=16):
    x0, y0, x1, y1 = box
    draw.rounded_rectangle([x0, y0, x1, y1], radius=radius, fill=bg_color, outline=border_color, width=2)

def generate_command_deck(output_path):
    width, height = 1920, 1080
    img = Image.new("RGBA", (width, height), (5, 7, 14, 255))
    draw = ImageDraw.Draw(img)

    # Ambient radial glow
    for r in range(400, 0, -20):
        alpha = int(12 * (1 - r / 400))
        draw.ellipse([width//2 - r*2, -100 - r, width//2 + r*2, 300 + r], fill=(6, 182, 212, alpha))

    # Top Command Bar
    draw_glass_card(draw, [40, 30, width - 40, 100], bg_color=(11, 16, 27, 240), border_color=(6, 182, 212, 80), radius=14)
    draw.text((60, 52), "⚡ INCIDENTZERO  |  LEVEL-5 SOVEREIGN SINGULARITY", fill=(248, 250, 252), font_size=22)
    draw.text((800, 54), "🎙️ Voice Ready  •  FastMCP Spec 2025-11-25  •  eBPF Sentinel Active", fill=(6, 182, 212), font_size=16)
    draw.text((1500, 54), "🛡️ 3 Active Antibodies  |  Sovereign: AWS Bedrock", fill=(0, 245, 155), font_size=16)

    # Left Panel - Microservices 2x2 Grid
    draw_glass_card(draw, [40, 120, 1140, 780], bg_color=(11, 16, 27, 220), border_color=(6, 182, 212, 40), radius=18)
    draw.text((65, 145), "MICROSERVICE TOPOLOGY & POD REPLICAS (4 Nodes)", fill=(248, 250, 252), font_size=20)
    
    # 4 Cards inside Topology
    cards = [
        ("API Ingress Gateway", "12.4ms", "0.0%", "2,480 RPS", "4 Replicas", (6, 182, 212)),
        ("Authentication Service", "14.8ms", "0.0%", "1,850 RPS", "3 Replicas", (99, 102, 241)),
        ("Payment Processing Engine", "19.2ms", "0.0%", "940 RPS", "3 Replicas", (6, 182, 212)),
        ("PostgreSQL Primary Cluster", "18.2ms", "0.0%", "1,450 RPS", "2 Replicas", (0, 245, 155))
    ]
    
    positions = [
        (65, 190, 570, 440),
        (610, 190, 1115, 440),
        (65, 470, 570, 720),
        (610, 470, 1115, 720)
    ]

    for (name, lat, err, rps, reps, color), (x0, y0, x1, y1) in zip(cards, positions):
        draw_glass_card(draw, [x0, y0, x1, y1], bg_color=(6, 10, 18, 240), border_color=(color[0], color[1], color[2], 80), radius=12)
        draw.text((x0 + 20, y0 + 20), name, fill=(248, 250, 252), font_size=18)
        draw.text((x0 + 20, y0 + 60), f"P99 Latency: {lat}", fill=color, font_size=16)
        draw.text((x0 + 20, y0 + 90), f"Throughput: {rps}", fill=(200, 220, 240), font_size=15)
        draw.text((x0 + 20, y0 + 120), f"Error Rate: {err}", fill=(0, 245, 155), font_size=15)
        draw.text((x0 + 20, y0 + 180), f"Status: NOMINAL • {reps}", fill=(148, 163, 184), font_size=14)

    # Right Panel - Autonomous Remediation DAG & Multi-Agent Swarm
    draw_glass_card(draw, [1170, 120, 1880, 780], bg_color=(11, 16, 27, 220), border_color=(6, 182, 212, 40), radius=18)
    draw.text((1195, 145), "AUTONOMOUS REMEDIATION DAG (Bedrock Planner)", fill=(248, 250, 252), font_size=20)
    draw.text((1195, 175), "Formal Verification: PROVED (0 Hallucination Risk / SMT Verified)", fill=(0, 245, 155), font_size=14)

    # Swarm Box inside DAG
    draw_glass_card(draw, [1195, 210, 1855, 340], bg_color=(6, 10, 18, 240), border_color=(6, 182, 212, 60), radius=12)
    draw.text((1215, 225), "🧠 3-Agent Swarm Consensus: 99.4% Converged (3/3 Unanimous)", fill=(6, 182, 212), font_size=16)
    draw.text((1215, 260), "🏥 DB Doctor: ISOLATE (99.6%)  |  🛡️ Net Sentinel: REROUTE (99.1%)", fill=(200, 220, 240), font_size=14)
    draw.text((1215, 290), "💰 FinOps Auditor: ZERO CAPEX PENALTY ($12,650 Preserved)", fill=(245, 158, 11), font_size=14)

    # DAG Steps
    steps = [
        ("1. Quarantine Degrading PostgreSQL Node-03", "MCP: isolate_compromised_node() • Duration: 240ms", (0, 245, 155)),
        ("2. Shift Connection Pool to Standby Read Replica", "MCP: execute_traffic_failover() • Duration: 310ms", (0, 245, 155)),
        ("3. Synthesize and Commit Hotfix PR #1042", "MCP: generate_git_hotfix_pr() • Unified Diff Ready", (6, 182, 212)),
        ("4. SRE Verification & SLA Metric Validation", "MCP: verify_and_restore_healthy() • 100% Nominal", (0, 245, 155))
    ]
    
    y_step = 360
    for title, sub, color in steps:
        draw_glass_card(draw, [1195, y_step, 1855, y_step + 85], bg_color=(6, 10, 18, 200), border_color=(color[0], color[1], color[2], 60), radius=10)
        draw.text((1215, y_step + 15), title, fill=(248, 250, 252), font_size=16)
        draw.text((1215, y_step + 45), sub, fill=(148, 163, 184), font_size=13)
        y_step += 95

    # Bottom Terminal Stream Dock
    draw_glass_card(draw, [40, 810, width - 40, 1040], bg_color=(11, 16, 27, 240), border_color=(6, 182, 212, 50), radius=16)
    draw.text((65, 830), "LIVE TELEMETRY STREAM & ADVERSARIAL EVENT LOG", fill=(6, 182, 212), font_size=16)
    
    logs = [
        ("[00:54:12] [INFO] [FastMCP] Streamable HTTP channel established with AWS Bedrock Claude 3.5 Sonnet.", (148, 163, 184)),
        ("[00:54:15] [INFO] [SovereignMesh] 3-Provider Multi-Cloud mesh active: AWS (Active), GCP (Standby), Azure (Standby).", (6, 182, 212)),
        ("[00:54:18] [AGENT] [ImmuneSystem] Cloud Antibody ANTIBODY-01 verified in eBPF kernel (0s downtime guaranteed).", (0, 245, 155)),
        ("[00:54:20] [AGENT] [RedTeamGAN] Adversarial Duel #143: Neutralized zero-day memory leak in 3.2ms.", (99, 102, 241)),
        ("[00:54:22] [INFO] [FinOpsEngine] SLA Budget nominal ($0.00 at risk, $12,650 capital preserved).", (0, 245, 155))
    ]
    
    y_log = 865
    for text, col in logs:
        draw.text((65, y_log), text, fill=col, font_size=14)
        y_log += 30

    img.save(output_path, "PNG")
    print(f"[+] Generated: {output_path}")

def generate_consensus_swarm(output_path):
    width, height = 1200, 800
    img = Image.new("RGBA", (width, height), (5, 7, 14, 255))
    draw = ImageDraw.Draw(img)

    draw_glass_card(draw, [40, 40, width - 40, height - 40], bg_color=(11, 16, 27, 240), border_color=(6, 182, 212, 70), radius=20)
    draw.text((70, 70), "🤖 BEDROCK MULTI-AGENT CONSENSUS SWARM (BFT TRIPLE VOTE)", fill=(248, 250, 252), font_size=24)
    draw.text((70, 105), "Decentralized tri-party deliberation preventing single-model hallucinations and CapEx violations", fill=(148, 163, 184), font_size=15)

    agents = [
        ("🏥 DB Doctor Agent", "Database Reliability", "ISOLATE", "99.6%", (6, 182, 212), "Identified 100/100 connection pool starvation on orders_v2. Proposes instantaneous read-replica traffic failover."),
        ("🛡️ Network Sentinel", "Edge Mesh & WAF", "REROUTE", "99.1%", (99, 102, 241), "Detected ingress SYN flood spike exceeding 14,500 RPS. Proposes Envoy adaptive rate limiter filter."),
        ("💰 FinOps Auditor", "Cloud Economics Guard", "VOTE: APPROVE", "99.5%", (245, 158, 11), "Downtime loss rate: $1,420/min. Remediation compute cost: $0.08. Action is economically optimal.")
    ]

    y_pos = 160
    for name, role, vote, conf, color, rationale in agents:
        draw_glass_card(draw, [70, y_pos, width - 70, y_pos + 160], bg_color=(6, 10, 18, 240), border_color=(color[0], color[1], color[2], 80), radius=14)
        draw.text((95, y_pos + 20), name, fill=(248, 250, 252), font_size=20)
        draw.text((95, y_pos + 50), f"Role: {role}  •  Confidence: {conf}", fill=color, font_size=15)
        draw.text((95, y_pos + 85), f"Diagnostic Assessment: {rationale}", fill=(200, 220, 240), font_size=14)
        draw_glass_card(draw, [width - 240, y_pos + 20, width - 95, y_pos + 70], bg_color=(color[0], color[1], color[2], 40), border_color=color, radius=8)
        draw.text((width - 220, y_pos + 35), vote, fill=(255, 255, 255), font_size=15)
        y_pos += 180

    # Convergence Bar
    draw_glass_card(draw, [70, 680, width - 70, 740], bg_color=(0, 245, 155, 30), border_color=(0, 245, 155, 120), radius=10)
    draw.text((95, 698), "✅ UNANIMOUS CONSENSUS CONVERGED IN 3.4s  •  ACTION: CANARY_FAILOVER_AND_AUTO_HEAL", fill=(0, 245, 155), font_size=16)

    img.save(output_path, "PNG")
    print(f"[+] Generated: {output_path}")

def generate_opa_antibody(output_path):
    width, height = 1200, 800
    img = Image.new("RGBA", (width, height), (5, 7, 14, 255))
    draw = ImageDraw.Draw(img)

    draw_glass_card(draw, [40, 40, width - 40, height - 40], bg_color=(11, 16, 27, 240), border_color=(6, 182, 212, 70), radius=20)
    draw.text((70, 70), "🧬 SYNTHESIZED CLOUD ANTIBODY (OPEN POLICY AGENT / REGO)", fill=(248, 250, 252), font_size=24)
    draw.text((70, 105), "Automated post-incident immunity compiler generating immutable eBPF & Rego security policies", fill=(148, 163, 184), font_size=15)

    # Code Editor Card
    draw_glass_card(draw, [70, 150, width - 70, 640], bg_color=(4, 6, 10, 255), border_color=(6, 182, 212, 50), radius=14)
    
    # macOS window dots
    draw.ellipse([95, 175, 107, 187], fill=(255, 95, 87))
    draw.ellipse([115, 175, 127, 187], fill=(254, 188, 46))
    draw.ellipse([135, 175, 147, 187], fill=(40, 200, 64))
    draw.text((165, 172), "policy/immunity/antibody_01_postgres_governor.rego", fill=(148, 163, 184), font_size=14)

    rego_lines = [
        "package cloud.immune.postgres.lockout_prevention",
        "",
        "default allow = false",
        "",
        "# Dynamically synthesized antibody for PostgreSQL Connection Saturation",
        "allow {",
        "    input.method == \"POST\"",
        "    input.path == \"/api/v2/orders\"",
        "    input.db_pool_utilization < 0.85",
        "    input.caller_tier == \"critical\"",
        "}",
        "",
        "# Sub-10ms eBPF Kernel auto-quarantine for rogue transaction threads",
        "quarantine_action {",
        "    input.query_duration_ms > 1200",
        "    action := \"SHED_WORKER_THREAD\"",
        "    status := \"0S_DOWNTIME_PRESERVED\"",
        "}"
    ]

    y_code = 215
    for line in rego_lines:
        if line.startswith("package") or line.startswith("default"):
            color = (99, 102, 241)
        elif line.startswith("#"):
            color = (100, 116, 139)
        elif "allow" in line or "quarantine_action" in line:
            color = (6, 182, 212)
        elif '"' in line:
            color = (0, 245, 155)
        else:
            color = (248, 250, 252)
        draw.text((95, y_code), line, fill=color, font_size=15)
        y_code += 24

    # Bottom Verification Badge
    draw_glass_card(draw, [70, 665, width - 70, 735], bg_color=(0, 245, 155, 30), border_color=(0, 245, 155, 120), radius=10)
    draw.text((95, 688), "🛡️ FORMAL PROOF: 0% BLAST RADIUS  •  RECURRING FAULTS NEUTRALIZED: 13  •  0ms DOWNTIME", fill=(0, 245, 155), font_size=16)

    img.save(output_path, "PNG")
    print(f"[+] Generated: {output_path}")

def generate_system_architecture(output_path):
    width, height = 1600, 900
    img = Image.new("RGBA", (width, height), (5, 7, 14, 255))
    draw = ImageDraw.Draw(img)

    draw_glass_card(draw, [40, 40, width - 40, height - 40], bg_color=(11, 16, 27, 240), border_color=(6, 182, 212, 70), radius=20)
    draw.text((70, 70), "🏛️ INCIDENTZERO LEVEL-5 SOVEREIGN ARCHITECTURE PIPELINE", fill=(248, 250, 252), font_size=26)
    draw.text((70, 110), "End-to-end autonomous triage, multi-agent consensus, formal verification, and GitOps loop", fill=(148, 163, 184), font_size=16)

    # 4 Architecture Columns
    columns = [
        ("1. Ingestion & Edge", "FastMCP Streamable HTTP", ["• Real-Time Telemetry SSE", "• eBPF Kernel Traces", "• Predictive Anomaly Radar", "• 60s Blackbox Buffer"], (6, 182, 212)),
        ("2. Reasoning Engine", "AWS Bedrock Claude 3.5", ["• Multi-Agent Swarm", "• DB Doctor (Alpha)", "• Net Sentinel (Beta)", "• FinOps Auditor (Gamma)"], (99, 102, 241)),
        ("3. Safety Verification", "Formal SMT & Sandbox", ["• 0% Blast-Radius Guard", "• Monotonic Cost Cap", "• Voiceprint Ed25519 Airlock", "• Reversibility Proofs"], (0, 245, 155)),
        ("4. Autonomous GitOps", "Immunity & Evacuation", ["• Automated Git Hotfix PR", "• Synthesized OPA Rego", "• Sovereign Multi-Cloud Bridge", "• Zero-Day Red-Team GAN"], (245, 158, 11))
    ]

    col_w = 330
    x_start = 70
    for title, sub, bullets, col in columns:
        draw_glass_card(draw, [x_start, 170, x_start + col_w, 730], bg_color=(6, 10, 18, 240), border_color=(col[0], col[1], col[2], 80), radius=16)
        draw.text((x_start + 20, 200), title, fill=(248, 250, 252), font_size=19)
        draw.text((x_start + 20, 235), sub, fill=col, font_size=15)
        
        y_b = 290
        for b in bullets:
            draw.text((x_start + 20, y_b), b, fill=(200, 220, 240), font_size=15)
            y_b += 45

        # Small bottom indicator
        draw_glass_card(draw, [x_start + 20, 650, x_start + col_w - 20, 700], bg_color=(col[0], col[1], col[2], 30), border_color=col, radius=8)
        draw.text((x_start + 35, 668), "VERIFIED ACTIVE", fill=(255, 255, 255), font_size=13)

        x_start += 360

    # Bottom Protocol Strip
    draw_glass_card(draw, [70, 760, width - 70, 830], bg_color=(6, 10, 18, 220), border_color=(6, 182, 212, 40), radius=12)
    draw.text((95, 785), "PROTOCOL INTEROP: FastMCP (2025-11-25)  •  Open Policy Agent (v0.68)  •  AWS Bedrock SDK (v1.35)  •  Next.js 14 App Router", fill=(148, 163, 184), font_size=14)

    img.save(output_path, "PNG")
    print(f"[+] Generated: {output_path}")

if __name__ == "__main__":
    assets_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "docs", "assets")
    ensure_dir(assets_dir)
    print("=== GENERATING HIGH-RESOLUTION INCIDENTZERO ASSETS ===")
    generate_command_deck(os.path.join(assets_dir, "command-deck.png"))
    generate_consensus_swarm(os.path.join(assets_dir, "consensus-swarm.png"))
    generate_opa_antibody(os.path.join(assets_dir, "opa-antibody.png"))
    generate_system_architecture(os.path.join(assets_dir, "system-architecture.png"))
    print("=== ALL ASSETS GENERATED SUCCESSFULLY IN docs/assets/ ===")
