import { ResourceType } from "@/lib/types";

/**
 * Professional Upskilling Seed Data
 * ═══════════════════════════════════════
 * Python, Data Science & ML, SQL & Databases, Web Dev, Cloud & DevOps
 * ═══════════════════════════════════════
 */

export const PROFESSIONAL_SEED_DATA = [
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // PYTHON PROGRAMMING
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  { type: ResourceType.Syllabus, vertical: "professional" as const, curriculum: "Professional", subject: "Python", grade: "Beginner", sortOrder: 1,
    title: "Python Foundations",
    content: "- Variables, data types, and type casting\n- Strings: slicing, formatting (f-strings), methods\n- Operators: arithmetic, comparison, logical, bitwise\n- Control flow: if/elif/else, for loops, while loops\n- Functions: parameters, return, *args, **kwargs\n- Scope and namespaces (LEGB rule)\n- Lists, tuples, sets, dictionaries — operations and comprehensions\n- Error handling: try/except/finally, custom exceptions\n- File I/O: reading, writing, CSV, JSON\n- Modules and packages: import, pip, virtual environments",
    tags: ["python", "beginner", "fundamentals"] },

  { type: ResourceType.Syllabus, vertical: "professional" as const, curriculum: "Professional", subject: "Python", grade: "Intermediate", sortOrder: 2,
    title: "Python Intermediate: OOP & Advanced Features",
    content: "- Object-Oriented Programming: classes, objects, __init__, self\n- Inheritance, polymorphism, encapsulation, abstraction\n- Magic/dunder methods: __str__, __repr__, __len__, __eq__\n- Decorators: function decorators, @property, @staticmethod, @classmethod\n- Generators and iterators: yield, lazy evaluation\n- Context managers: with statement, __enter__/__exit__\n- Lambda functions, map, filter, reduce\n- Regular expressions (re module)\n- Type hints and mypy\n- Unit testing: unittest, pytest, mocking",
    tags: ["python", "oop", "intermediate"] },

  { type: ResourceType.Syllabus, vertical: "professional" as const, curriculum: "Professional", subject: "Python", grade: "Advanced", sortOrder: 3,
    title: "Python Advanced: Concurrency & Production",
    content: "- Concurrency: threading, multiprocessing, asyncio\n- async/await patterns and event loops\n- Design patterns: Singleton, Factory, Observer, Strategy\n- Metaclasses and descriptors\n- Memory management and garbage collection\n- Profiling and optimisation (cProfile, line_profiler)\n- Packaging: setup.py, pyproject.toml, publishing to PyPI\n- Logging and debugging best practices\n- Working with APIs: requests, httpx, aiohttp\n- CLI tools: argparse, click, typer",
    tags: ["python", "advanced", "concurrency", "production"] },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // DATA SCIENCE & MACHINE LEARNING
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  { type: ResourceType.Syllabus, vertical: "professional" as const, curriculum: "Professional", subject: "Data Science", grade: "Beginner", sortOrder: 1,
    title: "Data Analysis with Python",
    content: "- NumPy: arrays, broadcasting, vectorised operations\n- Pandas: Series, DataFrames, indexing, slicing\n- Data cleaning: missing values, duplicates, type conversion\n- Data transformation: groupby, merge, join, pivot_table\n- Exploratory Data Analysis (EDA) workflow\n- Matplotlib: line plots, bar charts, scatter plots, histograms\n- Seaborn: statistical plots, heatmaps, pair plots\n- Plotly: interactive visualisations\n- Working with dates and time series\n- Reading data: CSV, Excel, SQL, JSON, APIs",
    tags: ["data-science", "pandas", "numpy", "beginner"] },

  { type: ResourceType.Syllabus, vertical: "professional" as const, curriculum: "Professional", subject: "Data Science", grade: "Intermediate", sortOrder: 2,
    title: "Machine Learning Fundamentals",
    content: "- Supervised vs unsupervised vs reinforcement learning\n- Train/test split, cross-validation, bias-variance tradeoff\n- Feature engineering: scaling, encoding, feature selection\n- Linear regression and polynomial regression\n- Logistic regression and classification metrics (precision, recall, F1, ROC-AUC)\n- Decision trees and random forests\n- Gradient boosting: XGBoost, LightGBM\n- Clustering: K-Means, DBSCAN, hierarchical\n- Dimensionality reduction: PCA, t-SNE\n- Scikit-learn pipeline and model persistence (joblib)",
    tags: ["machine-learning", "scikit-learn", "intermediate"] },

  { type: ResourceType.Syllabus, vertical: "professional" as const, curriculum: "Professional", subject: "Data Science", grade: "Advanced", sortOrder: 3,
    title: "Deep Learning & NLP",
    content: "- Neural network fundamentals: perceptrons, activation functions, backpropagation\n- PyTorch / TensorFlow: tensors, datasets, dataloaders, training loops\n- CNNs: convolution, pooling, architectures (ResNet, EfficientNet)\n- RNNs and LSTMs for sequential data\n- Transfer learning and fine-tuning pretrained models\n- NLP foundations: tokenisation, embeddings (Word2Vec, GloVe)\n- Transformers: attention mechanism, BERT, GPT architecture\n- Hugging Face: pipelines, model hub, fine-tuning with LoRA/QLoRA\n- MLOps: experiment tracking (MLflow, W&B), model serving\n- Responsible AI: bias, fairness, explainability (SHAP, LIME)",
    tags: ["deep-learning", "nlp", "transformers", "advanced"] },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // SQL & DATABASES
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  { type: ResourceType.Syllabus, vertical: "professional" as const, curriculum: "Professional", subject: "SQL & Databases", grade: "Beginner", sortOrder: 1,
    title: "SQL Fundamentals",
    content: "- Relational databases: tables, rows, columns, schemas\n- SQL syntax: SELECT, FROM, WHERE, ORDER BY, LIMIT\n- Filtering: AND, OR, IN, BETWEEN, LIKE, IS NULL\n- Aggregate functions: COUNT, SUM, AVG, MIN, MAX\n- GROUP BY and HAVING\n- JOINs: INNER, LEFT, RIGHT, FULL OUTER, CROSS\n- Subqueries: scalar, column, table subqueries, correlated\n- INSERT, UPDATE, DELETE operations\n- CREATE TABLE, ALTER TABLE, DROP TABLE\n- Constraints: PRIMARY KEY, FOREIGN KEY, UNIQUE, NOT NULL, CHECK",
    tags: ["sql", "databases", "beginner"] },

  { type: ResourceType.Syllabus, vertical: "professional" as const, curriculum: "Professional", subject: "SQL & Databases", grade: "Intermediate", sortOrder: 2,
    title: "Advanced SQL & Database Design",
    content: "- Window functions: ROW_NUMBER, RANK, DENSE_RANK, LAG, LEAD, SUM OVER\n- Common Table Expressions (CTEs) and recursive queries\n- Views: creating, updating, materialised views\n- Indexing: B-tree, hash, composite indexes, EXPLAIN ANALYZE\n- Database normalisation: 1NF, 2NF, 3NF, BCNF\n- Denormalisation for performance\n- Transactions: ACID properties, isolation levels\n- Stored procedures and triggers\n- PostgreSQL-specific: JSONB, arrays, full-text search\n- NoSQL overview: MongoDB, Redis, DynamoDB — when to use what",
    tags: ["sql", "database-design", "postgresql", "intermediate"] },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // WEB DEVELOPMENT
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  { type: ResourceType.Syllabus, vertical: "professional" as const, curriculum: "Professional", subject: "Web Development", grade: "Beginner", sortOrder: 1,
    title: "HTML, CSS & JavaScript Foundations",
    content: "- HTML5: semantic elements, forms, media, accessibility (ARIA)\n- CSS: selectors, box model, flexbox, grid, responsive design\n- CSS variables, transitions, animations, media queries\n- JavaScript: variables, data types, operators, control flow\n- DOM manipulation: querySelector, addEventListener, classList\n- ES6+: arrow functions, destructuring, spread, template literals\n- Promises, async/await, fetch API\n- Modules: import/export\n- Local storage and session storage\n- Git: init, add, commit, branch, merge, pull request workflow",
    tags: ["html", "css", "javascript", "beginner"] },

  { type: ResourceType.Syllabus, vertical: "professional" as const, curriculum: "Professional", subject: "Web Development", grade: "Intermediate", sortOrder: 2,
    title: "React & Next.js",
    content: "- React fundamentals: JSX, components, props, state\n- Hooks: useState, useEffect, useRef, useMemo, useCallback, useContext\n- Custom hooks and reusable logic\n- Component patterns: composition, render props, HOCs\n- State management: Context API, Zustand, Redux Toolkit\n- React Router: nested routes, dynamic routes, protected routes\n- Next.js: file-based routing, App Router, Server Components\n- Data fetching: SSR, SSG, ISR, Server Actions\n- Styling: CSS Modules, Tailwind CSS, styled-components\n- Testing: React Testing Library, Jest, Cypress\n- Performance: lazy loading, code splitting, memoisation",
    tags: ["react", "nextjs", "intermediate"] },

  { type: ResourceType.Syllabus, vertical: "professional" as const, curriculum: "Professional", subject: "Web Development", grade: "Intermediate", sortOrder: 3,
    title: "Backend & APIs with Node.js",
    content: "- Node.js runtime: event loop, non-blocking I/O, streams\n- Express.js: routing, middleware, error handling\n- RESTful API design: resources, HTTP methods, status codes\n- Authentication: JWT, OAuth 2.0, session-based auth\n- Input validation: Zod, Joi, express-validator\n- Database integration: Prisma ORM, Drizzle, Mongoose\n- File uploads: Multer, cloud storage integration\n- Rate limiting, CORS, helmet for security\n- WebSockets: real-time communication with Socket.io\n- API documentation: Swagger/OpenAPI",
    tags: ["nodejs", "api", "backend", "intermediate"] },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // CLOUD & DEVOPS
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  { type: ResourceType.Syllabus, vertical: "professional" as const, curriculum: "Professional", subject: "Cloud & DevOps", grade: "Beginner", sortOrder: 1,
    title: "Cloud Fundamentals (AWS/GCP)",
    content: "- Cloud computing: IaaS, PaaS, SaaS, serverless\n- AWS core services: EC2, S3, RDS, Lambda, IAM\n- GCP core services: Compute Engine, Cloud Storage, Cloud Run, BigQuery\n- Networking: VPCs, subnets, security groups, load balancers\n- Storage: block vs object vs file, CDN integration\n- Identity & Access Management: users, roles, policies\n- Serverless: Lambda/Cloud Functions, API Gateway\n- Cost management and billing alerts\n- Cloud CLI tools: aws-cli, gcloud\n- Deploying a web application end-to-end",
    tags: ["cloud", "aws", "gcp", "beginner"] },

  { type: ResourceType.Syllabus, vertical: "professional" as const, curriculum: "Professional", subject: "Cloud & DevOps", grade: "Intermediate", sortOrder: 2,
    title: "Docker, CI/CD & Infrastructure as Code",
    content: "- Docker: images, containers, Dockerfile, volumes, networks\n- Docker Compose: multi-container applications\n- Container registries: Docker Hub, ECR, GCR\n- CI/CD pipelines: GitHub Actions, GitLab CI, Cloud Build\n- Pipeline stages: lint, test, build, deploy, notify\n- Infrastructure as Code: Terraform basics, state management\n- Configuration management: Ansible, environment variables\n- Monitoring: Prometheus, Grafana, CloudWatch, Cloud Monitoring\n- Logging: ELK stack, Cloud Logging, structured logs\n- Kubernetes overview: pods, services, deployments, Helm charts",
    tags: ["docker", "cicd", "terraform", "kubernetes", "intermediate"] },
];
