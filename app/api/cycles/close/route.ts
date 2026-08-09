import { getChatGPTUser } from "@/app/chatgpt-auth";
import { closeCycleInGitHub, listClosableCyclesInGitHub } from "@/lib/close-cycle.mjs";

export const dynamic = "force-dynamic";
type RuntimeEnv = { EP_GITHUB_TOKEN?: string; EP_OPERATOR_EMAIL?: string };
const json = (body: unknown, status = 200) => Response.json(body, { status, headers: { "cache-control": "no-store" } });

async function authorizedRuntime() {
  const user = await getChatGPTUser();
  if (!user) return { response: json({ error: "AUTH_REQUIRED", signIn: "/signin-with-chatgpt?return_to=%2F" }, 401) };
  const runtime = process.env as RuntimeEnv;
  if (!runtime.EP_OPERATOR_EMAIL || user.email.toLowerCase() !== runtime.EP_OPERATOR_EMAIL.toLowerCase()) return { response: json({ error: "FORBIDDEN" }, 403) };
  if (!runtime.EP_GITHUB_TOKEN) return { response: json({ error: "INTEGRATION_NOT_CONFIGURED" }, 503) };
  return { user, runtime };
}

export async function GET() {
  const auth = await authorizedRuntime();
  if (auth.response) return auth.response;
  try {
    const cycles = await listClosableCyclesInGitHub({ owner: "valerol", repo: "ep_dashboard", branch: "main", token: auth.runtime.EP_GITHUB_TOKEN });
    return json({ cycles });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "UNKNOWN_ERROR" }, 502);
  }
}

export async function POST(request: Request) {
  const auth = await authorizedRuntime();
  if (auth.response) return auth.response;
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) return json({ error: "INVALID_ORIGIN" }, 403);
  let input: unknown;
  try { input = await request.json(); } catch { return json({ error: "INVALID_JSON" }, 400); }
  try {
    return json({ ok: true, ...await closeCycleInGitHub({ owner: "valerol", repo: "ep_dashboard", branch: "main", token: auth.runtime.EP_GITHUB_TOKEN, input, actor: auth.user.email }) });
  } catch (error) {
    const code = error instanceof Error ? error.message : "UNKNOWN_ERROR";
    const conflict = ["CYCLE_NOT_OPEN", "OPEN_CHILD_CYCLES", "INDEX_STATE_CONFLICT", "CYCLE_MISSING_FROM_INDEX", "GITHUB_409", "GITHUB_422"].includes(code);
    const badInput = ["INVALID_CYCLE_ID", "INVALID_OUTCOME", "INVALID_COMMENT"].includes(code);
    return json({ error: code }, badInput ? 400 : conflict ? 409 : code === "EVIDENCE_REQUIRED" ? 403 : 502);
  }
}
