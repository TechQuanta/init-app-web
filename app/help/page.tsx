import { ArrowLeft, ArrowUpRight, ExternalLink } from "lucide-react";
import Link from "next/link";

const sections = [
  {
    title: "Project identity",
    description: "The smallest direct-generation setup needs a project name and framework.",
    rows: [
      ["name", "Required", "Names the generated project directory.", "Always provide a clear, import-safe project name.", "billing_api"],
      ["--framework", "Required", "Selects a supported blueprint and its framework-aware defaults.", "The web builder generates the selected Init App blueprint, including dbt analytics.", "--framework dbt_analytics"],
      ["--apps", "Django only", "Creates and registers multiple Django application packages.", "Use when the project has separate domains such as catalog, billing, and users; the first name owns the primary generated routes.", "--apps catalog billing users"],
      ["--spec FILE", "Optional", "Loads a JSON project specification; direct flags override it.", "Use for repeatable team templates and automation.", "--spec project.json"],
    ],
  },
  {
    title: "Architecture and runtime",
    description: "These flags shape the generated code structure and how the project is expected to run.",
    rows: [
      ["--type", "Optional", "Selects standard, production, auto_config, or custom generation.", "Use standard for a clean start, production for operational layers, and custom for exact folder control.", "--type production"],
      ["--server", "Optional", "Selects a Django-compatible runner.", "Use gunicorn, waitress, or wsgiref for the generated Django project.", "--server gunicorn"],
      ["--db", "Optional", "Selects sqlite, postgresql, mysql, mongodb, or none.", "Use sqlite for local work, PostgreSQL for production relational workloads, or none for framework-only projects.", "--db postgresql"],
      ["--drf", "Optional", "Enables Django REST Framework integration; Django only.", "Use when Django is serving an API with serializers, routers, and REST settings.", "--drf"],
      ["--venv y|n", "Optional", "Controls whether Init App creates a project virtual environment.", "Enable isolation for most local and team projects. Package tooling remains the user's choice.", "--venv y"],
      ["--dbt-adapter", "dbt analytics only", "Selects a warehouse adapter such as Snowflake, Databricks, BigQuery, Redshift, Postgres, or DuckDB.", "Init App checks dbt-core and the selected adapter in the chosen environment before native dbt initialization; use custom for any compatible PyPI adapter.", "--dbt-adapter snowflake"],
      ["--dbt-adapter-package / --dbt-adapter-type", "dbt custom adapter only", "Defines the PyPI package and dbt adapter type for a provider outside the built-in catalog.", "Use both flags together only with --dbt-adapter custom.", "--dbt-adapter custom --dbt-adapter-package dbt-acme --dbt-adapter-type acme"],
      ["--dbt-profile / --dbt-target", "dbt analytics only", "Creates or preserves the selected profile in project .dbt/profiles.yml and ~/.dbt/profiles.yml.", "Credentials stay in environment variables, never in generated files or command output. dbt reads profiles.yml, not user.yml.", "--dbt-profile finance --dbt-target dev"],
    ],
  },
  {
    title: "What Init App runs",
    description: "The generator uses framework-native commands only after its selected environment is available and dependencies are checked.",
    rows: [
      ["Django bootstrap", "Django only", "Creates or reuses .venv, installs requirements, then runs Django's startproject and startapp commands.", "Generated manage.py reuses .venv automatically, so team commands do not accidentally use a global Django install.", "python -m django startproject billing ."],
      ["dbt bootstrap", "dbt analytics only", "Creates or reuses the selected environment, checks dbt-core and the selected adapter, then runs native dbt init without interactive profile setup.", "The generated project keeps a portable .dbt/profiles.yml and uses --profiles-dir .dbt for dbt debug, deps, and run.", "python -m dbt.cli.main init --skip-profile-setup finance_transform"],
      ["Profile verification", "dbt analytics only", "Writes credential-free environment-variable placeholders and preserves an existing named profile instead of overwriting it.", "Run dbt debug before dbt run; configure provider credentials in your environment or secret manager.", "dbt debug --profiles-dir .dbt"],
    ],
  },
  {
    title: "Folders and packages",
    description: "Custom mode gives direct control over generated directories and Python package initialization.",
    rows: [
      ["--folders", "Custom only", "Lists the folders to create.", "Use when the default architecture does not match the project boundary.", "--folders src services tests"],
      ["--packages", "Custom only", "Marks selected folders for __init__.py generation.", "Every package must also be listed in --folders; keep package initialization intentional.", "--packages src services"],
      ["--gitignore-preset", "Optional", "Chooses framework, python, django, dbt, node, cpp, or minimal ignore rules.", "Use dbt to exclude artifacts, packages, and local dbt environment files.", "--gitignore-preset dbt"],
      ["--gitignore / --ignore", "Optional", "Adds custom ignore patterns.", "Protect secrets, local data, generated assets, and machine-specific files.", "--gitignore .env.local uploads/ *.secret"],
      ["--no-rag-context", "Optional", "Disables the local safe file-inventory bundle.", "Keep the default enabled when local tooling needs project context; disable it for minimal output.", "--no-rag-context"],
    ],
  },
  {
    title: "Generated files",
    description: "Infrastructure flags accept one or more exact files, so you can keep the project focused.",
    rows: [
      ["--docker", "Optional", "Adds selected Docker files.", "Choose Dockerfile for a container image, compose files for local services, and DOCKER.md for notes.", "--docker docker/Dockerfile docker/docker-compose.yml"],
      ["--github", "Optional", "Adds selected GitHub workflow and issue-template files.", "Start with ci.yml for pull-request checks and add security.yml for dependency scanning.", "--github .github/workflows/ci.yml"],
      ["--k8s", "Optional", "Adds selected Kubernetes manifests.", "Use deployment and service first; add ingress, secrets, storage, or autoscaling as needed.", "--k8s k8s/deployment.yml k8s/service.yml"],
      ["--jenkins", "Optional", "Adds selected Jenkins pipeline files.", "Choose the Jenkinsfile and add build/deploy scripts when Jenkins owns delivery.", "--jenkins jenkins/Jenkinsfile"],
      ["--community", "Optional", "Adds contribution, conduct, security, and changelog files.", "Use for public repositories and teams that want contribution standards from day one.", "--community CONTRIBUTING.md SECURITY.md"],
      ["--package-files", "Optional", "Adds package metadata files such as setup.py, setup.cfg, and requirements.txt.", "Select only the packaging files your distribution or deployment workflow needs.", "--package-files setup.cfg requirements.txt"],
    ],
  },
  {
    title: "Paths and safety",
    description: "These flags control where generation happens and how automation behaves.",
    rows: [
      ["--output-dir PATH", "Optional", "Chooses the explicit parent directory for the generated project.", "Use when the project should not be created in the current directory; leaving it empty keeps generation local.", "--output-dir ~/Projects"],
      ["--here", "Optional", "Creates the project in the current directory.", "Use when the current directory is already the intended project root.", "--here"],
      ["--force", "Optional", "Allows generation into a non-empty project directory.", "Use carefully after reviewing existing files; the default refusal protects work.", "--force"],
      ["--dry-run", "Optional", "Prints the resolved configuration without writing files.", "Use in CI, previews, and reviews before committing to a filesystem change.", "--dry-run"],
      ["--path-behavior", "Optional", "Sets one-off documents, current, or custom path behavior.", "Use to override the saved default for one generation.", "--path-behavior current"],
      ["--show-path-config", "Utility", "Displays saved path defaults and exits.", "Use when a project is appearing in an unexpected location.", "--show-path-config"],
      ["--reset-path-config", "Utility", "Resets saved path defaults and exits.", "Use to return path resolution to its clean default state.", "--reset-path-config"],
    ],
  },
];

const recipes = [
  ["Local Django app", "init-app orders -f django -t standard --db sqlite --apps orders --venv y --server wsgiref"],
  ["Production Django service", "init-app billing -f django -t production --db postgresql --apps billing users --venv y --server gunicorn --docker docker/Dockerfile --github .github/workflows/ci.yml"],
  ["Django REST API", "init-app catalog -f django -t production --db postgresql --drf --apps catalog billing --venv y --server gunicorn"],
  ["Snowflake dbt project", "init-app finance_transform -f dbt_analytics --dbt-adapter snowflake --dbt-profile finance --env-manager uv"],
  ["Exact custom layout", "init-app worker -f django -t custom --apps worker --folders src services tests --packages src services --gitignore-preset django"],
];

export default function HelpPage() {
  return (
    <main className="help-shell">
      <header className="help-header">
        <Link className="brand" href="/" aria-label="Back to Init App home">
          <span className="brand-text">init-app</span>
        </Link>
        <Link className="help-back" href="/">
          <ArrowLeft size={15} /> Back to builder
        </Link>
      </header>

      <section className="help-hero">
        <p className="eyebrow">CLI field guide</p>
        <h1>Know exactly what each choice creates.</h1>
        <p>Use this reference to tune Init App from a quick scaffold to a deliberate production foundation. Required flags establish the project; optional flags optimize its structure, delivery, and local workflow.</p>
        <div className="help-links">
          <Link className="primary-action" href="/#builder">Open builder <ArrowUpRight size={16} /></Link>
          <a className="text-action" href="https://initapp.fastmcp.app/mcp" target="_blank" rel="noreferrer">MCP endpoint <ExternalLink size={14} /></a>
        </div>
      </section>

      <section className="configuration-note">
        <strong>General configuration</strong>
        <code>init-app NAME --framework FRAMEWORK [optional flags]</code>
        <span>For automation, use --spec with a JSON project definition. For safety, add --dry-run before writing files.</span>
      </section>

      <div className="help-sections">
        {sections.map((section) => (
          <section key={section.title} className="help-section">
            <div className="help-section-heading">
              <p className="eyebrow">Init App controls</p>
              <h2>{section.title}</h2>
              <p>{section.description}</p>
            </div>
            <div className="flag-list">
              {section.rows.map(([flag, status, purpose, optimization, example]) => (
                <article key={flag} className="flag-row">
                  <div className="flag-topline">
                    <code>{flag}</code>
                    <span className="flag-status">{status}</span>
                  </div>
                  <p><strong>Does:</strong> {purpose}</p>
                  <p><strong>Optimize with:</strong> {optimization}</p>
                  <small>Example: <code>{example}</code></small>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>

      <section className="recipes-section">
        <div className="help-section-heading">
          <p className="eyebrow">Starting points</p>
          <h2>Useful configurations</h2>
          <p>These recipes combine the controls for common project goals.</p>
        </div>
        <div className="recipe-list">
          {recipes.map(([title, command]) => (
            <article key={title} className="recipe-card">
              <h3>{title}</h3>
              <code>{command}</code>
            </article>
          ))}
        </div>
      </section>

      <footer className="help-footer">
        <span>Init App keeps the defaults sensible and the decisions visible.</span>
        <a href="https://github.com/TechQuanta/init-app" target="_blank" rel="noreferrer">View source <ExternalLink size={14} /></a>
      </footer>
    </main>
  );
}
