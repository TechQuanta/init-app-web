"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Check,
  Copy,
  Database,
  Github,
  HeartHandshake,
  Layers3,
  PlugZap,
  Rocket,
  ServerCog,
  Sparkles,
  Terminal,
  Wand2,
} from "lucide-react";

const MCP_URL = "https://initapp.fastmcp.app/mcp";
const MCP_INSPECTOR_COMMAND = `npx @modelcontextprotocol/inspector ${MCP_URL}`;
const frameworks = ["django"];
const strategies = ["standard", "production", "auto_config", "custom"];
const databases = ["sqlite", "postgresql", "mysql", "mongodb", "none"];
const frameworkServers: Record<string, string[]> = {
  django: ["gunicorn", "waitress", "wsgiref"],
};
const virtualEnvOptions = ["y", "n"];
const appCountOptions = Array.from({ length: 10 }, (_, index) => String(index + 1));
const fileGroups = [
  {
    key: "docker",
    label: "Docker",
    flag: "--docker",
    options: ["docker/Dockerfile", "docker/docker-compose.yml", "docker/docker-compose.prod.yml", "docker/.dockerignore", "docker/DOCKER.md"],
  },
  {
    key: "github",
    label: "GitHub",
    flag: "--github",
    options: [".github/workflows/ci.yml", ".github/workflows/security.yml", ".github/ISSUE_TEMPLATE/bug_report.md", ".github/ISSUE_TEMPLATE/feature_request.md", ".github/PULL_REQUEST_TEMPLATE.md"],
  },
  {
    key: "k8s",
    label: "Kubernetes",
    flag: "--k8s",
    options: ["k8s/deployment.yml", "k8s/service.yml", "k8s/ingress.yml", "k8s/hpa.yml", "k8s/pvc.yml", "k8s/configmap.yml", "k8s/secret.yml"],
  },
  {
    key: "jenkins",
    label: "Jenkins",
    flag: "--jenkins",
    options: ["jenkins/Jenkinsfile", "jenkins/pipelines/build.groovy", "jenkins/pipelines/deploy.groovy", "jenkins/scripts/notify.sh"],
  },
  { key: "community", label: "Community", flag: "--community", options: ["CONTRIBUTING.md", "CODE_OF_CONDUCT.md", "SECURITY.md", "CHANGELOG.md"] },
  { key: "pkg", label: "Package metadata", flag: "--package-files", options: ["MANIFEST.in", "setup.py", "setup.cfg", "requirements.txt", "package.json"] },
];

const featureCards = [
  {
    icon: Sparkles,
    title: "Framework-aware setup",
    description: "Pick the stack you want and let Init App generate a clean, opinionated starting point in seconds.",
  },
  {
    icon: ServerCog,
    title: "MCP-first workflow",
    description: "Connect directly to the hosted MCP endpoint and let tools and agents generate the same project intent.",
  },
  {
    icon: Database,
    title: "Project-ready defaults",
    description: "Shipping with environment management, database choices, and build patterns built in from day one.",
  },
];

const steps = [
  { label: "01", title: "Choose your stack", text: "Select the framework, strategy, and database that match your project needs." },
  { label: "02", title: "Generate the command", text: "Turn your decisions into a repeatable setup command you can run anywhere." },
  { label: "03", title: "Ship with confidence", text: "Start from a structured base and keep iterating without spending time on boilerplate." },
];

const stats = [
  { value: "1", label: "Django blueprint" },
  { value: "4", label: "strategies" },
  { value: "1", label: "command flow" },
  { value: "∞", label: "ideas" },
];

export default function Page() {
  const [projectName, setProjectName] = useState("my-project");
  const [framework, setFramework] = useState("django");
  const [strategy, setStrategy] = useState("standard");
  const [database, setDatabase] = useState("sqlite");
  const [server, setServer] = useState("uvicorn");
  const [virtualEnv, setVirtualEnv] = useState("y");
  const [drf, setDrf] = useState(false);
  const [appNames, setAppNames] = useState(["core_app"]);
  const [folders, setFolders] = useState("");
  const [packages, setPackages] = useState("");
  const [gitignorePreset, setGitignorePreset] = useState("framework");
  const [createRagContext, setCreateRagContext] = useState(true);
  const [createHere, setCreateHere] = useState(false);
  const [outputDir, setOutputDir] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<Record<string, string[]>>({});
  const [copied, setCopied] = useState(false);
  const [copiedInspector, setCopiedInspector] = useState(false);
  const serverOptions = frameworkServers[framework] ?? ["na"];
  const selectedServer = serverOptions.includes(server) ? server : serverOptions[0];
  const primaryAppName = appNames[0] || "core_app";
  const drfFlag = drf ? " --drf" : "";
  const gitignoreOptions = ["framework", "python", "django", "minimal"];
  const selectedGitignorePreset = gitignoreOptions.includes(gitignorePreset) ? gitignorePreset : "framework";

  const command = useMemo(
    () => {
      const parts = [
        "init-app",
        projectName || "project-name",
        "--framework", framework,
        "--type", strategy,
        "--db", database,
        "--server", selectedServer,
        "--venv", virtualEnv,
        "--app-name", primaryAppName,
        "--gitignore-preset", selectedGitignorePreset,
      ];
      if (drfFlag) parts.push(drfFlag.trim());
      parts.push("--apps", ...appNames);
      if (strategy === "custom" && folders.trim()) parts.push("--folders", ...folders.split(",").map((folder) => folder.trim()).filter(Boolean));
      if (strategy === "custom" && packages.trim()) parts.push("--packages", ...packages.split(",").map((folder) => folder.trim()).filter(Boolean));
      if (!createRagContext) parts.push("--no-rag-context");
      if (createHere) parts.push("--here");
      else if (outputDir.trim()) parts.push("--output-dir", outputDir.trim());
      fileGroups.forEach(({ key, flag }) => {
        const files = selectedFiles[key] ?? [];
        if (files.length) parts.push(flag, ...files);
      });
      return parts.join(" ");
    },
    [projectName, framework, strategy, database, selectedServer, virtualEnv, appNames, primaryAppName, selectedGitignorePreset, drfFlag, folders, packages, createRagContext, createHere, outputDir, selectedFiles],
  );

  const copyCommand = async () => {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };

  const copyInspectorCommand = async () => {
    await navigator.clipboard.writeText(MCP_INSPECTOR_COMMAND);
    setCopiedInspector(true);
    window.setTimeout(() => setCopiedInspector(false), 1400);
  };

  return (
    <main className="page-shell">
      <div className="bg-orb orb-one" />
      <div className="bg-orb orb-two" />

      <header className="site-header">
        <a className="brand" href="/" aria-label="Init App home">
          <span className="brand-text">init-app</span>
        </a>

        <nav className="header-actions" aria-label="Primary navigation">
          <a href="#features">Features</a>
          <a href="#builder">Builder</a>
          <a href="#contribute">Contribute</a>
          <Link href="/help">CLI help</Link>
          <a className="mcp-link" href={MCP_URL} target="_blank" rel="noreferrer">
            MCP URL <ArrowUpRight size={15} />
          </a>
          <a className="github-link" href="https://github.com/TechQuanta/init-app" target="_blank" rel="noreferrer">
            <Github size={15} /> Source
          </a>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Python project scaffolding</p>
          <h1>Start your next project with clarity, not chaos.</h1>
          <p className="hero-lede">
            Init App helps developers and teams shape a sensible Python project foundation with less friction, better defaults, and a path that feels intentionally built.
          </p>

          <div className="hero-actions">
            <a className="primary-action" href="#builder">
              Build a project <ArrowUpRight size={16} />
            </a>
            <a className="text-action" href={MCP_URL} target="_blank" rel="noreferrer">
              Open MCP endpoint
            </a>
          </div>

          <ul className="trust-list" aria-label="Key product qualities">
            <li>Fast setup</li>
            <li>Tool-ready</li>
            <li>Open source friendly</li>
          </ul>

        </div>

        <div className="hero-visual">
          <div className="downloads-proof">
            <div className="downloads-proof-heading">
              <span className="downloads-mark" aria-hidden="true">↓</span>
              <div>
                <p className="downloads-kicker">PyPI package</p>
                <p className="downloads-title">Built in public, downloaded by builders.</p>
              </div>
            </div>
            <a
              className="downloads-badge"
              href="https://pepy.tech/projects/init-app"
              target="_blank"
              rel="noreferrer"
              aria-label="View Init App download history on Pepy"
            >
              <img
                src="https://static.pepy.tech/personalized-badge/init-app?period=total&units=NONE&left_color=YELLOW&right_color=ORANGE&left_text=downloads"
                alt="Init App total PyPI downloads"
              />
              <span>View download history <ArrowUpRight size={13} /></span>
            </a>
          </div>
          <DemoWindow variant="init" label="01 / initialize" />
          <div className="floating-card floating-one">
            <Wand2 size={16} />
            <span>Scaffold smarter</span>
          </div>
          <div className="floating-card floating-two">
            <PlugZap size={16} />
            <span>MCP ready</span>
          </div>
        </div>
      </section>

      <section className="stats-grid" aria-label="Init App highlights">
        {stats.map((stat) => (
          <div key={stat.label} className="stat-card">
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </div>
        ))}
      </section>

      <section id="features" className="features-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Why people use it</p>
            <h2>Built to get projects moving without the setup tax.</h2>
          </div>
        </div>

        <div className="feature-grid">
          {featureCards.map(({ icon: Icon, title, description }) => (
            <article key={title} className="feature-card">
              <div className="feature-icon">
                <Icon size={18} />
              </div>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="journey" aria-label="Trip through the Init App flow">
        <div className="journey-heading">
          <div>
            <p className="eyebrow">The flow</p>
            <h2>From blank page to a working project plan.</h2>
          </div>
        </div>

        <div className="steps-grid">
          {steps.map((step) => (
            <div key={step.label} className="step-card">
              <span className="step-number">{step.label}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="builder" className="builder-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Project brief</p>
            <h2>Tailor the first command to your idea.</h2>
          </div>
          <span className="step-count">01 / 03</span>
        </div>

        <div className="builder-grid">
          <div className="form-panel">
            <label className="field field-wide">
              <span>Project name</span>
              <input value={projectName} onChange={(event) => setProjectName(event.target.value)} placeholder="my-project" />
            </label>
            <SelectField label="Framework (--framework)" value={framework} options={frameworks} onChange={setFramework} />
            <SelectField label="Build strategy (--type)" value={strategy} options={strategies} onChange={setStrategy} />
            <SelectField label="Database (--db)" value={database} options={databases} onChange={setDatabase} />
            <SelectField label="Server (--server)" value={selectedServer} options={serverOptions} onChange={setServer} />
            <SelectField label="Create virtual env (--venv)" value={virtualEnv} options={virtualEnvOptions} onChange={setVirtualEnv} />
            <SelectField label="Gitignore preset (--gitignore-preset)" value={selectedGitignorePreset} options={gitignoreOptions} onChange={setGitignorePreset} />
            <div className="django-apps field-wide">
              <SelectField
                label="Number of Django apps (--apps)"
                value={String(appNames.length)}
                options={appCountOptions}
                onChange={(value) => {
                  const count = Number(value);
                  setAppNames((current) => Array.from({ length: count }, (_, index) => current[index] || `app_${index + 1}`));
                }}
              />
              <div className="django-app-list">
                {appNames.map((name, index) => (
                  <label key={`${index}-${name}`} className="field">
                    <span>App {index + 1} name (--apps)</span>
                    <input
                      value={name}
                      onChange={(event) => setAppNames((current) => current.map((item, itemIndex) => itemIndex === index ? event.target.value : item))}
                      placeholder={`app_${index + 1}`}
                    />
                  </label>
                ))}
              </div>
            </div>
            <label className="field">
              <span>Output directory (--output-dir)</span>
              <input value={outputDir} onChange={(event) => setOutputDir(event.target.value)} placeholder="Current directory by default" disabled={createHere} />
            </label>
            <label className="toggle-field">
              <input type="checkbox" checked={drf} onChange={(event) => setDrf(event.target.checked)} />
              <span>Enable Django REST Framework (--drf)</span>
            </label>
            <div className="capability-panel field-wide">
              <div className="capability-heading">
                <span>Generation capabilities</span>
                <small>Optional project layers</small>
              </div>
              {strategy === "custom" && (
                <div className="custom-fields">
                  <label className="field">
                    <span>Folders (--folders)</span>
                    <input value={folders} onChange={(event) => setFolders(event.target.value)} placeholder="src, services, tests" />
                  </label>
                  <label className="field">
                    <span>Python packages (--packages, adds __init__.py)</span>
                    <input value={packages} onChange={(event) => setPackages(event.target.value)} placeholder="src, services" />
                  </label>
                </div>
              )}
              <div className="file-groups">
                {fileGroups.map(({ key, label, options }) => (
                  <details key={key} className="file-group">
                    <summary>{label} ({fileGroups.find((group) => group.key === key)?.flag})<span>{(selectedFiles[key] ?? []).length} selected</span></summary>
                    <div className="file-options">
                      {options.map((file) => (
                        <label key={file} className="capability-toggle">
                          <input
                            type="checkbox"
                            checked={(selectedFiles[key] ?? []).includes(file)}
                            onChange={() => setSelectedFiles((current) => {
                              const selected = current[key] ?? [];
                              const next = selected.includes(file) ? selected.filter((item) => item !== file) : [...selected, file];
                              return { ...current, [key]: next };
                            })}
                          />
                          <span>{file}</span>
                        </label>
                      ))}
                    </div>
                  </details>
                ))}
              </div>
              <div className="capability-grid">
                <label className="capability-toggle">
                  <input type="checkbox" checked={createRagContext} onChange={(event) => setCreateRagContext(event.target.checked)} />
                  <span>Local RAG context (default)</span>
                </label>
                <label className="capability-toggle">
                  <input type="checkbox" checked={createHere} onChange={(event) => setCreateHere(event.target.checked)} />
                  <span>Create in current directory (--here)</span>
                </label>
              </div>
            </div>
          </div>

          <div className="command-panel">
            <div className="command-heading">
              <div>
                <p className="eyebrow">Command preview</p>
                <h3>Ready to run</h3>
              </div>
              <Terminal size={18} />
            </div>

            <pre>
              <span className="prompt-symbol">$</span> {command}
            </pre>

            <button className="copy-action" onClick={copyCommand}>
              {copied ? <Check size={15} /> : <Copy size={15} />}
              {copied ? "Copied" : "Copy command"}
            </button>

            <p className="command-note">Choose whether Init App creates the virtual environment. Select the package workflow yourself after the project is generated.</p>
          </div>
        </div>
      </section>

      <section id="contribute" className="contribute-section">
        <div className="contribute-card">
          <div className="contribute-copy">
            <p className="eyebrow">Contribute</p>
            <h2>Make the project better with every idea, PR, and improvement.</h2>
            <p>
              Init App is built for people who want a simpler starting point and a more collaborative community around Python tooling.
            </p>
            <div className="contribute-actions">
              <a className="primary-action" href="https://github.com/TechQuanta/init-app" target="_blank" rel="noreferrer">
                View GitHub <ArrowUpRight size={16} />
              </a>
              <a className="text-action" href={MCP_URL} target="_blank" rel="noreferrer">
                Connect MCP
              </a>
            </div>
          </div>

          <div className="contribute-badges" aria-label="Contribution themes">
            <div className="mini-card">
              <HeartHandshake size={18} />
              <span>Community-driven</span>
            </div>
            <div className="mini-card">
              <Layers3 size={18} />
              <span>Better templates</span>
            </div>
            <div className="mini-card">
              <Rocket size={18} />
              <span>Faster launches</span>
            </div>
          </div>
        </div>
      </section>

      <section className="mcp-inspector-section" aria-label="Inspect the Init App MCP server">
        <div className="mcp-inspector-copy">
          <p className="eyebrow">MCP toolbox</p>
          <h2>See the tools behind the connection.</h2>
          <p>Run the official Inspector locally, connect it to the hosted endpoint, and explore the tools and responses Init App exposes.</p>
          <a className="text-action" href={MCP_URL} target="_blank" rel="noreferrer">
            Open MCP URL <ArrowUpRight size={15} />
          </a>
        </div>
        <div className="inspector-command-card">
          <span className="command-label">Run locally</span>
          <code>{MCP_INSPECTOR_COMMAND}</code>
          <button className="copy-action" onClick={copyInspectorCommand}>
            {copiedInspector ? <Check size={15} /> : <Copy size={15} />}
            {copiedInspector ? "Copied" : "Copy command"}
          </button>
          <span className="inspector-endpoint">Endpoint: {MCP_URL}</span>
        </div>
      </section>

      <footer>
        <span>Built for deliberate beginnings.</span>
        <a href={MCP_URL} target="_blank" rel="noreferrer">
          Use Init App with MCP <ArrowUpRight size={14} />
        </a>
      </footer>
    </main>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option} value={option}>{formatOptionLabel(option)}</option>
        ))}
      </select>
    </label>
  );
}

function formatOptionLabel(option: string) {
  const friendlyNames: Record<string, string> = {
    na: "not applicable",
    none: "no database",
    y: "yes",
    n: "no",
  };
  return friendlyNames[option] ?? option.replaceAll("_", " ");
}

function DemoWindow({ variant, label }: { variant: "init" | "choose" | "ship"; label: string }) {
  const content =
    variant === "init" ? (
      <>
        <span className="demo-command">$ init-app my-project</span>
        <span className="demo-line">
          checking blueprint <b>django</b>
        </span>
        <span className="demo-line">
          preparing environment <b>uv</b>
        </span>
      </>
    ) : variant === "choose" ? (
      <>
        <span className="demo-command">project brief</span>
        <span className="demo-chip">django</span>
        <span className="demo-chip">production</span>
        <span className="demo-chip">postgresql</span>
      </>
    ) : (
      <>
        <span className="demo-command">mcp response</span>
        <span className="demo-line">command preview ready</span>
        <span className="demo-line demo-success">✓ ready to build</span>
      </>
    );

  return (
    <div className={`demo-window demo-${variant}`} aria-label={`${label} animated product preview`}>
      <div className="demo-chrome">
        <span />
        <span />
        <span />
        <em>{label}</em>
      </div>
      <div className="demo-body">{content}</div>
    </div>
  );
}
