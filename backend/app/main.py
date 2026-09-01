"""
IncidentZero Level-2 FastAPI Main Application
Exposes Streamable HTTP & SSE Endpoints for MCP Spec 2025-11-25,
Predictive Anomaly Streamers, Git Hotfix PR Synthesizer,
and Time-Travel Blackbox Flight Recorder Playback.
"""

import os
import asyncio
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from sse_starlette.sse import EventSourceResponse

from app.models import (
    TriggerScenarioRequest,
    VoiceCommandRequest,
    VoiceCommandResponse,
    ConfirmDAGRequest,
    MCPToolCallRequest,
    MCPToolCallResponse,
    ScenarioType,
)
from app.chaos_engine import chaos_engine
from app.telemetry import telemetry_broadcaster
from app.mcp_server import mcp, MCP_TOOLS_REGISTRY, execute_tool_by_name
from app.bedrock_agent import bedrock_agent


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Start background telemetry ticker
    await telemetry_broadcaster.start_background_broadcaster()
    print("[IncidentZero Level-2] Telemetry & Predictive Radar broadcaster started.")
    yield
    # Shutdown
    await telemetry_broadcaster.stop()
    print("[IncidentZero] Shutting down background tasks.")


app = FastAPI(
    title="IncidentZero: Level-2 Autonomous Cloud SRE Engine",
    description="MCP Spec 2025-11-25 Streamable HTTP backend with AWS Bedrock AI Agent orchestration, Git Hotfix PR Generation, and Time-Travel Blackbox Flight Recorder.",
    version="2.0.0",
    lifespan=lifespan,
)

# CORS Configuration
origins = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    return {
        "status": "online",
        "service": "IncidentZero-Level2-SRE-Engine",
        "mcp_spec": "2025-11-25",
        "transport": "Streamable HTTP / SSE",
        "cloud_environment": "production-aws-east",
        "capabilities": [
            "Predictive Anomaly Radar",
            "Git Hotfix PR Synthesizer",
            "Time-Travel Blackbox Flight Recorder",
            "Canary Blast Radius Assessment",
            "AWS Bedrock Claude 3.5 Sonnet Tool Calling",
        ],
    }


# =====================================================================
# Real-Time Telemetry & SSE Streamable HTTP Endpoints
# =====================================================================

@app.get("/api/telemetry/stream")
async def stream_telemetry():
    """Streamable HTTP SSE endpoint broadcasting live cluster metrics, predictive radar, and logs."""
    return StreamingResponse(
        telemetry_broadcaster.subscribe(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        }
    )


@app.get("/api/telemetry")
def get_telemetry_snapshot():
    """Returns an instantaneous telemetry snapshot."""
    return {
        "telemetry": chaos_engine.get_telemetry().model_dump(),
        "incident": chaos_engine.current_incident.model_dump() if chaos_engine.current_incident else None,
        "active_dag": bedrock_agent.active_dag.model_dump() if bedrock_agent.active_dag else None,
        "hotfix_pr": chaos_engine.current_hotfix_pr.model_dump() if chaos_engine.current_hotfix_pr else None,
    }


# =====================================================================
# Level-2 Time-Travel Blackbox Flight Recorder Endpoints
# =====================================================================

@app.get("/api/blackbox/playback")
def get_blackbox_playback():
    """Returns historical 60-second telemetry frames from the flight recorder ring buffer."""
    return {
        "frames": [f.model_dump() for f in chaos_engine.get_blackbox_playback()],
        "total_frames": len(chaos_engine.blackbox_ring_buffer),
    }


# =====================================================================
# Level-2 Automated Git Hotfix PR Endpoints
# =====================================================================

@app.post("/api/git/hotfix")
def generate_git_hotfix(incident_id: str = None):
    """Generates an automated Git Hotfix Pull Request with unified code diffs."""
    pr = chaos_engine.generate_git_hotfix_pr(incident_id)
    return {"success": True, "pr": pr.model_dump()}


@app.post("/api/git/merge")
async def merge_git_hotfix(pr_number: int = 1042):
    """Merges the active Git hotfix PR and triggers canary rollout."""
    res = chaos_engine.apply_remediation("merge_git_hotfix_pr", {"pr_number": pr_number})
    await telemetry_broadcaster.broadcast_event(
        "HOTFIX_PR_MERGED",
        {"pr": chaos_engine.current_hotfix_pr.model_dump() if chaos_engine.current_hotfix_pr else None}
    )
    return {"success": True, "details": res}


@app.get("/api/blast-radius")
def get_blast_radius():
    """Computes canary sandbox verification and isolated blast-radius safety score."""
    return {"assessment": chaos_engine.compute_blast_radius().model_dump()}


# =====================================================================
# Level-3 Multi-Agent Swarm, FinOps & Audio Debrief Endpoints
# =====================================================================

@app.post("/api/swarm/consensus")
def execute_swarm_consensus(incident_id: str = "INC-AUTO-01"):
    """Executes the 3-agent Bedrock multi-agent consensus pipeline."""
    swarm = chaos_engine.get_agent_swarm_consensus(incident_id)
    return {"success": True, "swarm": swarm.model_dump()}


@app.get("/api/finops/metrics")
def get_finops_metrics():
    """Returns real-time financial exposure, dropped revenue per second, and saved capital."""
    metrics = chaos_engine.get_finops_metrics()
    return {"metrics": metrics.model_dump()}


@app.post("/api/debrief/audio")
def generate_audio_debrief(incident_id: str = "INC-AUTO-01"):
    """Synthesizes an executive 20-second incident audio debrief script."""
    debrief = chaos_engine.get_audio_debrief(incident_id)
    return {"success": True, "debrief": debrief.model_dump()}


# =====================================================================
# Level-4 Immune System, Voiceprint Airlock & Global Mesh Endpoints
# =====================================================================

@app.get("/api/immune/antibodies")
def get_immune_antibodies():
    """Returns all active cloud antibodies and OPA immunization rules."""
    abs_list = chaos_engine.get_active_antibodies()
    return {"antibodies": [ab.model_dump() for ab in abs_list], "count": len(abs_list)}


@app.post("/api/airlock/voice-verify")
def verify_voice_airlock(audio_token: str = "voice_stream_token_sre_01"):
    """Performs zero-trust voiceprint biometric signature verification."""
    auth = chaos_engine.verify_voice_signature(audio_token)
    return {"verified": auth.verified, "auth": auth.model_dump()}


@app.post("/api/mesh/failover")
async def trigger_mesh_failover(from_region: str = "us-east-1", to_region: str = "eu-west-1"):
    """Triggers zero-packet-drop global failover across AWS regions."""
    mesh = chaos_engine.trigger_global_failover(from_region, to_region)
    await telemetry_broadcaster.broadcast_event(
        "GLOBAL_FAILOVER_EXECUTED",
        {"mesh": mesh.model_dump()}
    )
    return {"success": True, "mesh": mesh.model_dump()}


# =====================================================================
# Level-5 Sovereign Singularity & Multi-Cloud Arbitrage Endpoints
# =====================================================================

@app.post("/api/sovereign/evacuate")
async def execute_sovereign_evacuation(source_provider: str = "AWS", target_provider: str = "GCP"):
    """Executes multi-cloud egress evacuation across AWS, GCP, and Azure."""
    state = chaos_engine.execute_sovereign_failover(source_provider, target_provider)
    await telemetry_broadcaster.broadcast_event(
        "SOVEREIGN_EVACUATION_EXECUTED",
        {"sovereign_mesh": state.model_dump()}
    )
    return {"success": True, "sovereign_mesh": state.model_dump()}


@app.post("/api/redteam/battle")
async def trigger_red_team_battle():
    """Triggers an autonomous Red-Team GAN adversarial zero-day attack vs Blue-Team defense battle."""
    gan_state = chaos_engine.trigger_red_team_gan_battle()
    await telemetry_broadcaster.broadcast_event(
        "RED_TEAM_BATTLE_ROUND",
        {"red_team_gan": gan_state.model_dump()}
    )
    return {"success": True, "red_team_gan": gan_state.model_dump()}


# =====================================================================
# Cloud Chaos Simulator Endpoints
# =====================================================================

@app.post("/api/chaos/trigger")
async def trigger_chaos_scenario(payload: TriggerScenarioRequest):
    """Triggers an in-memory cloud outage scenario (DB Pool Starvation, OOM, DDoS)."""
    incident = chaos_engine.trigger_outage(payload.scenario_id)
    dag = bedrock_agent.plan_remediation_dag(payload.scenario_id)

    await telemetry_broadcaster.broadcast_event(
        "CHAOS_TRIGGERED",
        {
            "incident": incident.model_dump(),
            "dag": dag.model_dump(),
            "telemetry": chaos_engine.get_telemetry().model_dump(),
            "hotfix_pr": chaos_engine.current_hotfix_pr.model_dump() if chaos_engine.current_hotfix_pr else None,
        }
    )

    return {
        "success": True,
        "incident": incident.model_dump(),
        "dag": dag.model_dump(),
        "hotfix_pr": chaos_engine.current_hotfix_pr.model_dump() if chaos_engine.current_hotfix_pr else None,
    }


@app.post("/api/chaos/reset")
async def reset_chaos():
    """Restores baseline healthy topology."""
    result = chaos_engine.apply_remediation("verify_and_restore_healthy", {})
    bedrock_agent.active_dag = None

    await telemetry_broadcaster.broadcast_event(
        "CHAOS_RESET",
        {
            "telemetry": chaos_engine.get_telemetry().model_dump(),
            "message": "Topology restored to healthy baseline.",
        }
    )

    return {"success": True, "details": result}


# =====================================================================
# Voice-First & Bedrock AI Agent Endpoints
# =====================================================================

@app.post("/api/voice/command", response_model=VoiceCommandResponse)
async def process_voice_command(payload: VoiceCommandRequest, background_tasks: BackgroundTasks):
    """Processes spoken utterances from Web Speech API / Amazon Alexa+."""
    response = bedrock_agent.process_voice_intent(payload.transcript)

    if response.understood_intent == "CONFIRM_EXECUTION" and response.dag_generated:
        async def _run_and_broadcast():
            updated_dag = await bedrock_agent.execute_dag()
            await telemetry_broadcaster.broadcast_event(
                "DAG_COMPLETED",
                {
                    "dag": updated_dag.model_dump(),
                    "telemetry": chaos_engine.get_telemetry().model_dump(),
                    "hotfix_pr": chaos_engine.current_hotfix_pr.model_dump() if chaos_engine.current_hotfix_pr else None,
                }
            )

        background_tasks.add_task(_run_and_broadcast)

    await telemetry_broadcaster.broadcast_event(
        "VOICE_COMMAND_PROCESSED",
        {
            "transcript": payload.transcript,
            "response": response.model_dump(),
        }
    )

    return response


@app.post("/api/dag/plan")
def plan_dag(scenario_id: ScenarioType = ScenarioType.SCENARIO_DB_POOL_EXHAUSTED):
    """Explicitly requests AWS Bedrock to plan a Remediation DAG."""
    dag = bedrock_agent.plan_remediation_dag(scenario_id)
    return {"dag": dag.model_dump()}


@app.post("/api/dag/confirm")
async def confirm_and_execute_dag(payload: ConfirmDAGRequest, background_tasks: BackgroundTasks):
    """Airlock confirmation gate: authorizes and executes the pending DAG."""
    if not bedrock_agent.active_dag:
        bedrock_agent.plan_remediation_dag()

    dag = bedrock_agent.active_dag
    dag.confirmed_by_voice = (payload.confirmation_method == "voice")

    async def _execute_steps():
        updated_dag = await bedrock_agent.execute_dag()
        await telemetry_broadcaster.broadcast_event(
            "DAG_COMPLETED",
            {
                "dag": updated_dag.model_dump(),
                "telemetry": chaos_engine.get_telemetry().model_dump(),
                "hotfix_pr": chaos_engine.current_hotfix_pr.model_dump() if chaos_engine.current_hotfix_pr else None,
            }
        )

    background_tasks.add_task(_execute_steps)

    return {
        "success": True,
        "message": f"Remediation DAG {dag.dag_id} authorized via {payload.confirmation_method}. Dispatched execution.",
        "dag": dag.model_dump(),
    }


# =====================================================================
# MCP Tool Invocation Endpoints (Spec 2025-11-25)
# =====================================================================

@app.get("/api/mcp/tools")
def list_mcp_tools():
    """Lists all registered MCP tools for SRE diagnostics and remediation."""
    return {
        "mcp_version": "2025-11-25",
        "server": "IncidentZero-Level2-SRE-Engine",
        "tools": [
            {
                "name": name,
                "description": fn.__doc__.strip() if fn.__doc__ else "Level-2 SRE Tool",
            }
            for name, fn in MCP_TOOLS_REGISTRY.items()
        ]
    }


@app.post("/api/mcp/tool", response_model=MCPToolCallResponse)
def call_mcp_tool(payload: MCPToolCallRequest):
    """Directly invokes an MCP tool over Streamable HTTP."""
    return execute_tool_by_name(payload.tool_name, payload.arguments)


@app.get("/api/postmortem")
def get_postmortem(incident_id: str = None):
    """Retrieves executive postmortem analysis report."""
    return execute_tool_by_name("generate_postmortem_report", {"incident_id": incident_id}).result
