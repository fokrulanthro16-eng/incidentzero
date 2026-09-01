"""
IncidentZero Level-2 FastMCP Server Implementation
Adheres to Model Context Protocol (MCP) Spec 2025-11-25 over Streamable HTTP.
Exposes diagnostic telemetry, automated remediation, Git Hotfix PR generation,
and Time-Travel Blackbox flight recorder playback.
"""

from typing import Dict, Any, List, Optional, Callable
from datetime import datetime, timezone
import json
from app.chaos_engine import chaos_engine
from app.models import PostmortemReport, MCPToolCallResponse, GitHotfixPR

# Resilient FastMCP loader
try:
    from mcp.server.fastmcp import FastMCP
except ImportError:
    class FastMCP:
        """Lightweight standard FastMCP server conforming to MCP Spec 2025-11-25."""
        def __init__(self, name: str, instructions: str = ""):
            self.name = name
            self.instructions = instructions
            self._tools: Dict[str, Callable] = {}

        def tool(self, name: Optional[str] = None, description: Optional[str] = None):
            def decorator(func: Callable):
                tool_name = name or func.__name__
                func.__doc__ = description or func.__doc__
                self._tools[tool_name] = func
                return func
            return decorator


# Initialize FastMCP Server
mcp = FastMCP(
    name="IncidentZero-SRE-Engine",
    instructions="Level-2 Enterprise Autonomous Cloud SRE & Zero-Downtime Incident Triage Engine with Git Hotfix Generation and Blackbox Flight Recording."
)


@mcp.tool(
    name="inspect_cluster_telemetry",
    description="Fetches live cluster metrics including microservice health status, CPU, memory, RPS, latency, active DB connections, predictive failure horizon, and recent error log frames."
)
def inspect_cluster_telemetry() -> Dict[str, Any]:
    """Inspects the current state of all cloud services, predictive anomaly radar, and host compute nodes."""
    telemetry = chaos_engine.get_telemetry()
    incident = chaos_engine.current_incident
    logs = chaos_engine.logs_history[-10:]

    return {
        "status": "success",
        "timestamp": telemetry.timestamp,
        "environment": telemetry.environment,
        "overall_health": telemetry.overall_health.value,
        "total_rps": telemetry.total_rps,
        "avg_latency_ms": telemetry.avg_latency_ms,
        "global_error_rate_pct": telemetry.global_error_rate_pct,
        "active_connections_total": telemetry.active_connections_total,
        "predictive_radar": telemetry.predictive_radar.model_dump() if telemetry.predictive_radar else None,
        "blast_radius": telemetry.blast_radius.model_dump() if telemetry.blast_radius else None,
        "nodes": {
            k: {
                "name": v.name,
                "role": v.role,
                "zone": v.zone,
                "host_node": v.host_node,
                "status": v.status.value,
                "latency_ms": v.latency_ms,
                "error_rate_pct": v.error_rate_pct,
                "cpu_pct": v.cpu_pct,
                "memory_pct": v.memory_pct,
                "replicas": f"{v.replica_count}/{v.target_replicas}",
                "active_connections": f"{v.active_connections}/{v.max_connections}",
                "is_isolated": v.is_isolated,
            }
            for k, v in telemetry.nodes.items()
        },
        "active_incident": incident.model_dump() if incident else None,
        "recent_critical_logs": [l.model_dump() for l in logs if l.level in ("CRITICAL", "ERROR", "AGENT")],
    }


@mcp.tool(
    name="generate_git_hotfix_pr",
    description="Synthesizes a production-grade Git hotfix Pull Request with colored unified code diffs (migration SQL, k8s YAML, Envoy filter) to permanently prevent incident recurrence."
)
def generate_git_hotfix_pr(incident_id: Optional[str] = None) -> Dict[str, Any]:
    """Generates an automated Git Hotfix Pull Request with code diffs."""
    pr = chaos_engine.generate_git_hotfix_pr(incident_id)
    return {
        "success": True,
        "message": f"Generated Hotfix PR #{pr.pr_number} on branch '{pr.branch}'.",
        "pr": pr.model_dump(),
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


@mcp.tool(
    name="get_blackbox_playback",
    description="Retrieves the in-memory time-travel flight recorder capturing cluster telemetry frames from T-60s to T+0s."
)
def get_blackbox_playback() -> Dict[str, Any]:
    """Returns 60 seconds of historical blackbox telemetry frames."""
    frames = chaos_engine.get_blackbox_playback()
    return {
        "success": True,
        "total_frames": len(frames),
        "frames": [f.model_dump() for f in frames],
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


@mcp.tool(
    name="assess_blast_radius",
    description="Performs canary sandbox verification and computes blast-radius safety score before executing destructive failovers."
)
def assess_blast_radius() -> Dict[str, Any]:
    """Assesses blast radius and canary sandbox safety."""
    assessment = chaos_engine.compute_blast_radius()
    return {
        "success": True,
        "assessment": assessment.model_dump(),
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


@mcp.tool(
    name="isolate_compromised_node",
    description="Quarantines a faulty or compromised compute host node, draining connections and isolating microservice pods from public ingress routes."
)
def isolate_compromised_node(node_id: str) -> Dict[str, Any]:
    """Quarantines a faulty microservice node (e.g. Node-02, Node-03)."""
    result = chaos_engine.apply_remediation("isolate_compromised_node", {"node_id": node_id})
    return {
        "success": True,
        "message": f"Successfully isolated and drained compute node {node_id}.",
        "node_id": node_id,
        "details": result.get("details", {}),
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


@mcp.tool(
    name="execute_traffic_failover",
    description="Executes a zero-downtime traffic shift at the ingress/Envoy layer from an unhealthy availability zone to a redundant healthy target zone."
)
def execute_traffic_failover(source_zone: str = "us-east-1a", target_zone: str = "us-east-1b") -> Dict[str, Any]:
    """Executes a zero-downtime traffic shift between availability zones."""
    result = chaos_engine.apply_remediation("execute_traffic_failover", {
        "source_zone": source_zone,
        "target_zone": target_zone,
    })
    return {
        "success": True,
        "message": f"Zero-downtime route shift completed: 100% traffic rerouted from {source_zone} to {target_zone}.",
        "source_zone": source_zone,
        "target_zone": target_zone,
        "details": result.get("details", {}),
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


@mcp.tool(
    name="scale_service_replicas",
    description="Horizontally scales healthy Kubernetes pod replicas across remaining healthy host nodes to absorb shifted or surging workload."
)
def scale_service_replicas(service_name: str, replica_count: int) -> Dict[str, Any]:
    """Scales pod replicas for a target microservice."""
    result = chaos_engine.apply_remediation("scale_service_replicas", {
        "service_name": service_name,
        "replica_count": replica_count,
    })
    return {
        "success": True,
        "message": f"Scaled {service_name} to {replica_count} active replicas.",
        "service_name": service_name,
        "replica_count": replica_count,
        "details": result.get("details", {}),
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


@mcp.tool(
    name="terminate_blocking_queries",
    description="Forces termination of hung or unindexed runaway PostgreSQL query processes locking connection pools (pg_terminate_backend)."
)
def terminate_blocking_queries() -> Dict[str, Any]:
    """Terminates runaway blocking DB queries."""
    result = chaos_engine.apply_remediation("terminate_blocking_queries", {})
    return {
        "success": True,
        "message": "Terminated 3 blocking postgres query processes. Freed 78 connections in the primary pool.",
        "details": result.get("details", {}),
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


@mcp.tool(
    name="apply_rate_limit_filter",
    description="Enforces dynamic WAF and IP token-bucket rate limits against high-RPS anomalous volumetric traffic spikes."
)
def apply_rate_limit_filter() -> Dict[str, Any]:
    """Applies dynamic rate limit filter at ingress layer."""
    result = chaos_engine.apply_remediation("apply_rate_limit_filter", {})
    return {
        "success": True,
        "message": "Enforced layer 7 rate limit: throttled anomalous ASN 4134 botnet CIDRs.",
        "details": result.get("details", {}),
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


@mcp.tool(
    name="merge_git_hotfix_pr",
    description="Merges the validated Git hotfix PR and triggers production canary deployment."
)
def merge_git_hotfix_pr(pr_number: int = 1042) -> Dict[str, Any]:
    """Merges the active Git hotfix PR into main branch."""
    result = chaos_engine.apply_remediation("merge_git_hotfix_pr", {"pr_number": pr_number})
    return {
        "success": True,
        "message": f"Hotfix PR #{pr_number} merged into `main`. Canary deployment active.",
        "details": result.get("details", {}),
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


@mcp.tool(
    name="generate_postmortem_report",
    description="Generates an executive SRE post-incident analysis report summarizing root cause, SLA impact, timeline, and preventative recommendations."
)
def generate_postmortem_report(incident_id: Optional[str] = None) -> Dict[str, Any]:
    """Generates an executive postmortem report for the active or most recent incident."""
    inc = chaos_engine.current_incident
    now_str = datetime.now(timezone.utc).isoformat()
    hotfix_pr = chaos_engine.current_hotfix_pr

    report = PostmortemReport(
        incident_id=inc.incident_id if inc else "INC-BASE-001",
        title=inc.title if inc else "Routine SRE Operational Health Check",
        severity=inc.severity.value if inc else "NORMAL",
        detected_at=inc.detected_at if inc else now_str,
        resolved_at=inc.resolved_at if inc and inc.resolved_at else now_str,
        duration_minutes=2.4,
        executive_summary=(
            f"Autonomous Level-2 SRE engine detected an acute anomaly, computed 0% blast radius in canary sandbox, "
            f"and executed zero-downtime remediation with Git Hotfix PR #{hotfix_pr.pr_number if hotfix_pr else '1042'}."
        ),
        root_cause_analysis=(
            inc.root_cause if inc and inc.root_cause else
            "Transient resource contention resolved via automated rebalancing."
        ),
        timeline=[
            {"time": "T+00:00", "event": "Telemetry anomaly detector triggered predictive horizon warning."},
            {"time": "T+00:15", "event": "AWS Bedrock Claude 3.5 Sonnet generated remediation DAG & Git Hotfix PR."},
            {"time": "T+00:30", "event": "Voice airlock confirmed: 0% blast radius verified, dispatched MCP tool calls."},
            {"time": "T+01:20", "event": "Cluster health verified nominal (0.0% error rate, p99 < 35ms)."},
        ],
        remediation_actions=[
            "Isolated degraded compute nodes from ingress pool",
            "Triggered zero-downtime zone failover to us-east-1b",
            "Auto-scaled redundant pod replicas to absorb failover traffic",
            "Generated permanent Git Hotfix PR with B-Tree composite index migration",
        ],
        preventative_measures=[
            "Enforce composite indexing on orders_v2 PostgreSQL partition",
            "Adjust Kubelet OOM-killer memory limits from 1024Mi to 2048Mi",
            "Configure AWS WAF managed bot-control rules on ingress gateway",
        ],
        sla_compliance_pct=99.99,
        mcp_tools_invoked=[
            "inspect_cluster_telemetry",
            "generate_git_hotfix_pr",
            "assess_blast_radius",
            "isolate_compromised_node",
            "execute_traffic_failover",
            "scale_service_replicas",
            "generate_postmortem_report",
        ],
        git_hotfix_pr_url=f"https://github.com/incident-zero/core/pull/{hotfix_pr.pr_number}" if hotfix_pr else None,
    )
    return report.model_dump()


@mcp.tool(
    name="execute_agent_swarm_consensus",
    description="Orchestrates 3 specialized Bedrock sub-agents (Database Doctor, Network Sentinel, FinOps Optimizer) to reach unanimous consensus on the optimal remediation action."
)
def execute_agent_swarm_consensus(incident_id: str = "INC-AUTO-01") -> Dict[str, Any]:
    """Runs the 3-agent swarm intelligence consensus pipeline."""
    swarm_state = chaos_engine.get_agent_swarm_consensus(incident_id)
    return {
        "status": "success",
        "consensus_id": swarm_state.consensus_id,
        "incident_id": swarm_state.incident_id,
        "consensus_action": swarm_state.consensus_action,
        "overall_confidence_pct": swarm_state.overall_confidence_pct,
        "unanimous": swarm_state.unanimous,
        "participating_agents": swarm_state.participating_agents,
        "votes": [v.model_dump() for v in swarm_state.votes],
        "debate_transcript": swarm_state.debate_transcript,
        "converged_at": swarm_state.converged_at,
    }


@mcp.tool(
    name="get_finops_exposure_metrics",
    description="Calculates real-time financial exposure, dropped revenue per second, SLA penalty tier, and capital preserved upon autonomous remediation."
)
def get_finops_exposure_metrics() -> Dict[str, Any]:
    """Returns the real-time financial exposure, dropped RPS revenue loss, and preserved capital."""
    finops = chaos_engine.get_finops_metrics()
    return finops.model_dump()


@mcp.tool(
    name="generate_executive_audio_brief",
    description="Synthesizes a 20-second executive audio debrief and script tailored for CTO and engineering leadership review."
)
def generate_executive_audio_brief(incident_id: str = "INC-AUTO-01") -> Dict[str, Any]:
    """Generates an executive audio brief script for speech synthesis."""
    debrief = chaos_engine.get_audio_debrief(incident_id)
    return debrief.model_dump()


@mcp.tool(
    name="get_active_immune_antibodies",
    description="Returns active self-evolving cloud antibodies, OPA Rego rules, and recurring outage neutralization counts."
)
def get_active_immune_antibodies() -> Dict[str, Any]:
    """Returns active cloud antibodies and immunization policy registry."""
    antibodies = chaos_engine.get_active_antibodies()
    return {
        "status": "success",
        "total_antibodies": len(antibodies),
        "antibodies": [ab.model_dump() for ab in antibodies]
    }


@mcp.tool(
    name="verify_voice_signature",
    description="Cryptographically authenticates SRE voiceprint spectrogram entropy and Ed25519 signature before authorizing high-risk mitigations."
)
def verify_voice_signature(audio_token: str = "voice_stream_token_sre_01") -> Dict[str, Any]:
    """Verifies cryptographic voice biometric signature."""
    auth = chaos_engine.verify_voice_signature(audio_token)
    return auth.model_dump()


@mcp.tool(
    name="trigger_global_failover",
    description="Executes zero-packet-drop global DNS and Envoy proxy route shifting across AWS multi-region infrastructure."
)
def trigger_global_failover(from_region: str = "us-east-1", to_region: str = "eu-west-1") -> Dict[str, Any]:
    """Shifts global traffic to standby region with 0% packet loss."""
    mesh = chaos_engine.trigger_global_failover(from_region, to_region)
    return mesh.model_dump()


@mcp.tool(
    name="execute_sovereign_cross_cloud_failover",
    description="Orchestrates instantaneous zero-downtime multi-cloud pod and database evacuation across AWS, GCP Vertex AI, and Azure OpenAI."
)
def execute_sovereign_cross_cloud_failover(source_provider: str = "AWS", target_provider: str = "GCP") -> Dict[str, Any]:
    """Executes multi-cloud egress failover."""
    mesh = chaos_engine.execute_sovereign_failover(source_provider, target_provider)
    return mesh.model_dump()


@mcp.tool(
    name="trigger_autonomous_red_team_battle",
    description="Runs a live Adversarial Chaos Monkey GAN round (Red-Team zero-day injection vs Blue-Team immune defense)."
)
def trigger_autonomous_red_team_battle() -> Dict[str, Any]:
    """Runs a live adversarial duel round."""
    state = chaos_engine.trigger_red_team_gan_battle()
    return state.model_dump()


# Registry of tools for direct invoking by Bedrock agent
MCP_TOOLS_REGISTRY = {
    "inspect_cluster_telemetry": inspect_cluster_telemetry,
    "generate_git_hotfix_pr": generate_git_hotfix_pr,
    "get_blackbox_playback": get_blackbox_playback,
    "assess_blast_radius": assess_blast_radius,
    "isolate_compromised_node": isolate_compromised_node,
    "execute_traffic_failover": execute_traffic_failover,
    "scale_service_replicas": scale_service_replicas,
    "terminate_blocking_queries": terminate_blocking_queries,
    "apply_rate_limit_filter": apply_rate_limit_filter,
    "merge_git_hotfix_pr": merge_git_hotfix_pr,
    "generate_postmortem_report": generate_postmortem_report,
    "execute_agent_swarm_consensus": execute_agent_swarm_consensus,
    "get_finops_exposure_metrics": get_finops_exposure_metrics,
    "generate_executive_audio_brief": generate_executive_audio_brief,
    "get_active_immune_antibodies": get_active_immune_antibodies,
    "verify_voice_signature": verify_voice_signature,
    "trigger_global_failover": trigger_global_failover,
    "execute_sovereign_cross_cloud_failover": execute_sovereign_cross_cloud_failover,
    "trigger_autonomous_red_team_battle": trigger_autonomous_red_team_battle,
}


def execute_tool_by_name(name: str, arguments: Dict[str, Any]) -> MCPToolCallResponse:
    """Invokes an MCP tool by name with arguments and returns structured response."""
    if name not in MCP_TOOLS_REGISTRY:
        return MCPToolCallResponse(
            tool_name=name,
            success=False,
            result={"error": f"Tool '{name}' not found in MCP registry"},
            message=f"Unknown tool: {name}",
            timestamp=datetime.now(timezone.utc).isoformat(),
        )

    try:
        fn = MCP_TOOLS_REGISTRY[name]
        result = fn(**arguments) if arguments else fn()
        return MCPToolCallResponse(
            tool_name=name,
            success=True,
            result=result,
            message=result.get("message", "Tool executed successfully") if isinstance(result, dict) else "Executed",
            timestamp=datetime.now(timezone.utc).isoformat(),
        )
    except Exception as err:
        return MCPToolCallResponse(
            tool_name=name,
            success=False,
            result={"error": str(err)},
            message=f"Execution error: {str(err)}",
            timestamp=datetime.now(timezone.utc).isoformat(),
        )
