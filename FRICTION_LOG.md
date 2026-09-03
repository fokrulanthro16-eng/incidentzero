# IncidentZero — Developer Friction Log (AWS Bedrock & FastMCP)

### 1. Specific Task Attempted
Integrating Amazon Bedrock Claude 3.5 Sonnet streaming runtime with FastMCP (Model Context Protocol) tool execution within an asynchronous FastAPI SSE (Server-Sent Events) pipeline.

### 2. Steps Taken
1. Configured `boto3` Bedrock Runtime client (`invoke_model_with_response_stream`).
2. Defined remediation tools (node isolation, traffic shifting) using FastMCP `@mcp.tool()` decorators.
3. Created an event loop to parse Bedrock streaming chunks, trigger multi-agent consensus, and yield real-time DAG state updates over SSE to the Next.js frontend.

### 3. Expected vs. Actual Result
* **Expected Result:** Native async streaming iterator from the AWS Bedrock SDK that seamlessly handles concurrent tool-use invocations and non-blocking I/O.
* **Actual Result:** The default `boto3` Bedrock client operates synchronously, blocking the main thread during high-concurrency swarm consensus simulations. Additionally, Bedrock tool-calling schemas required custom mapping to conform to FastMCP typed parameters.

### 4. Severity Rating
**Medium / Moderate** (Did not block development, but required an architectural workaround to prevent latency spikes in the live Mission Control UI).

### 5. Workaround Used
Wrapped synchronous Bedrock client invocations inside `asyncio.get_running_loop().run_in_executor(None, ...)` and engineered a lightweight bidirectional schema adapter between Bedrock tool specifications and FastMCP input schemas.

### 6. Actionable Suggestions for the AWS / Devpost Team
1. **First-Party Async SDK:** Provide native `async/await` support in official AWS Bedrock Python SDKs to avoid thread executor overhead in high-throughput FastAPI/Tornado applications.
2. **Native MCP Support:** Introduce native Model Context Protocol (MCP) spec adapters directly into AWS Bedrock AgentCore, allowing developers to hot-plug MCP tool servers without manual schema bridges.
