"""
IncidentZero Level-2 Real-Time Telemetry Streamer
Broadcasts Live Topology, Predictive Anomaly Radars, Flight Recorder Frames,
and Pre-Incident Warnings to SRE War-Room Clients.
"""

import asyncio
import json
from typing import Set, AsyncGenerator
from app.chaos_engine import chaos_engine
from app.models import TopologyState, TelemetryLog


class TelemetryBroadcaster:
    def __init__(self):
        self._subscribers: Set[asyncio.Queue] = set()
        self._is_running = False
        self._loop_task: asyncio.Task = None
        self._last_warned_risk: str = "NOMINAL"

    async def subscribe(self) -> AsyncGenerator[str, None]:
        """Registers a new SSE client queue and yields JSON formatted SSE data."""
        queue = asyncio.Queue(maxsize=100)
        self._subscribers.add(queue)

        # Send initial immediate snapshot
        telemetry = chaos_engine.get_telemetry()
        initial_payload = {
            "type": "TELEMETRY_SNAPSHOT",
            "telemetry": telemetry.model_dump(),
            "logs": [log.model_dump() for log in chaos_engine.logs_history[-30:]],
            "incident": chaos_engine.current_incident.model_dump() if chaos_engine.current_incident else None,
            "hotfix_pr": chaos_engine.current_hotfix_pr.model_dump() if chaos_engine.current_hotfix_pr else None,
            "blackbox_frames": [f.model_dump() for f in chaos_engine.get_blackbox_playback()],
        }
        yield f"data: {json.dumps(initial_payload)}\n\n"

        try:
            while True:
                data = await queue.get()
                yield f"data: {json.dumps(data)}\n\n"
        except asyncio.CancelledError:
            pass
        finally:
            self._subscribers.discard(queue)

    async def broadcast_event(self, event_type: str, payload: dict) -> None:
        """Dispatches an event payload to all connected frontend clients."""
        envelope = {
            "type": event_type,
            **payload,
        }
        for queue in list(self._subscribers):
            try:
                queue.put_nowait(envelope)
            except (asyncio.QueueFull, Exception):
                pass

    async def start_background_broadcaster(self) -> None:
        """Starts the periodic background telemetry tick."""
        if self._is_running:
            return
        self._is_running = True

        async def _ticker():
            while self._is_running:
                try:
                    telemetry = chaos_engine.get_telemetry()
                    predictive = telemetry.predictive_radar

                    # Emit Level-2 PRE_INCIDENT_WARNING if risk level escalates
                    if predictive and predictive.risk_level == "CRITICAL_WARNING" and self._last_warned_risk != "CRITICAL_WARNING":
                        self._last_warned_risk = "CRITICAL_WARNING"
                        chaos_engine._add_log(
                            "WARN",
                            "PredictiveRadar",
                            f"PRE-INCIDENT WARNING: {predictive.failure_horizon_text}. {predictive.preemptive_action_recommended}",
                        )
                        await self.broadcast_event(
                            "PRE_INCIDENT_WARNING",
                            {
                                "predictive_radar": predictive.model_dump(),
                                "horizon_seconds": predictive.failure_horizon_seconds,
                            },
                        )
                    elif predictive and predictive.risk_level == "NOMINAL":
                        self._last_warned_risk = "NOMINAL"

                    await self.broadcast_event(
                        "TELEMETRY_TICK",
                        {
                            "telemetry": telemetry.model_dump(),
                            "logs": [log.model_dump() for log in chaos_engine.logs_history[-15:]],
                            "incident": chaos_engine.current_incident.model_dump() if chaos_engine.current_incident else None,
                            "hotfix_pr": chaos_engine.current_hotfix_pr.model_dump() if chaos_engine.current_hotfix_pr else None,
                            "blackbox_frames": [f.model_dump() for f in chaos_engine.get_blackbox_playback()[-15:]],
                        },
                    )
                except Exception as err:
                    print(f"[TelemetryBroadcaster Error]: {err}")
                await asyncio.sleep(1.2)

        self._loop_task = asyncio.create_task(_ticker())

    async def stop(self) -> None:
        self._is_running = False
        if self._loop_task:
            self._loop_task.cancel()


telemetry_broadcaster = TelemetryBroadcaster()
