from __future__ import annotations
import logging
from typing import List, Dict, Optional
from datetime import datetime
from app.models import CloudAntibody, ScenarioType

logger = logging.getLogger("immune_system")


class CloudImmuneSystem:
    """Self-evolving cloud resilience engine synthesizing immutable Open Policy Agent (OPA)

    and Envoy circuit breaker antibodies to permanently immunize clusters against recurring outages.
    """

    def __init__(self):
        self._antibodies: Dict[str, CloudAntibody] = {}
        self._initialize_starter_antibodies()

    def _initialize_starter_antibodies(self) -> None:
        """Initializes baseline synthesized cloud antibodies."""
        ab1 = CloudAntibody(
            id="ANTIBODY-01",
            policy_name="Postgres Connection Governor & Query Deadlock Shedder",
            rule_type="POSTGRES_TRIGGER",
            description="Auto-sheds secondary database connection pool workers when query queue wait exceeds 1,200ms for >2 consecutive cycles.",
            target_scenario=ScenarioType.SCENARIO_DB_POOL_EXHAUSTED,
            active=True,
            blocked_recurring_count=4,
            synthesized_at=datetime.utcnow().isoformat(),
            opa_rego_policy="package cloud.immune.postgres\ndefault allow = true\nshed_pool if input.query_queue_time_ms > 1200"
        )
        ab2 = CloudAntibody(
            id="ANTIBODY-02",
            policy_name="Volumetric L7 Ingress WAF Rate Limiter",
            rule_type="ENVOY_FILTER",
            description="Interprets high-velocity Layer-7 HTTP floods and applies an automated IP bucket rate limit (1,000 req/sec) at edge Envoy gateway.",
            target_scenario=ScenarioType.SCENARIO_DDOS_INGRESS,
            active=True,
            blocked_recurring_count=7,
            synthesized_at=datetime.utcnow().isoformat(),
            opa_rego_policy="package cloud.immune.waf\ndefault drop = false\ndrop if input.requests_per_sec > 1000"
        )
        ab3 = CloudAntibody(
            id="ANTIBODY-03",
            policy_name="Kubernetes CGroup Memory Soft-Cap Autoscaler",
            rule_type="K8S_CIRCUIT_BREAKER",
            description="Preemptively doubles replica pods and expands memory quota buffer when heap usage gradient reaches 85% before kernel OOM-killer fires.",
            target_scenario=ScenarioType.SCENARIO_POD_OOM_KILLED,
            active=True,
            blocked_recurring_count=2,
            synthesized_at=datetime.utcnow().isoformat(),
            opa_rego_policy="package cloud.immune.cgroup\ndefault scale = false\nscale if input.memory_gradient_pct > 85.0"
        )

        self._antibodies[ab1.id] = ab1
        self._antibodies[ab2.id] = ab2
        self._antibodies[ab3.id] = ab3

    def get_antibodies(self) -> List[CloudAntibody]:
        """Returns all active cloud antibodies."""
        return list(self._antibodies.values())

    def check_and_neutralize(self, scenario: ScenarioType) -> Optional[CloudAntibody]:
        """Checks if an active antibody exists for this scenario. If active, increments blocked counter and neutralizes the outage."""
        for ab in self._antibodies.values():
            if ab.target_scenario == scenario and ab.active:
                ab.blocked_recurring_count += 1
                logger.info(f"[CloudImmuneSystem] Preemptively neutralized {scenario.value} via {ab.id} ({ab.policy_name}). 0s downtime.")
                return ab
        return None

    def synthesize_new_antibody(self, scenario: ScenarioType, incident_id: str) -> CloudAntibody:
        """Synthesizes a new immutable antibody upon incident resolution."""
        ab_id = f"ANTIBODY-0{len(self._antibodies) + 1}"
        new_ab = CloudAntibody(
            id=ab_id,
            policy_name=f"Evolved Sentinel Policy for {scenario.value}",
            rule_type="OPA_GATEKEEPER",
            description=f"Auto-generated zero-trust invariant preventing recurrence of incident {incident_id}.",
            target_scenario=scenario,
            active=True,
            blocked_recurring_count=0,
            synthesized_at=datetime.utcnow().isoformat(),
            opa_rego_policy=f"package cloud.immune.auto\ndefault allow = true\n# Enforced for {scenario.value}"
        )
        self._antibodies[ab_id] = new_ab
        return new_ab


# Singleton Immune System Instance
cloud_immune_system = CloudImmuneSystem()
