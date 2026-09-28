# Business Requirements Document (BRD) - TrackLy

## 1. Business overview and objectives
TrackLy is a modern, web-based issue tracking system built to help high-performing teams organize, assign, and track the progress of their tasks. The primary objective is to provide a fast, intuitive, and responsive platform that reduces friction in issue management.

## 2. Scope
**In Scope:**
- User Authentication (Registration, Login, Logout)
- Issue Management (Create, Read, Update, Delete)
- Issue Assignment to registered users
- Status tracking (Open, In Progress, Closed)
- Comments on issues
- Dashboard with key metrics and visualizations
- Light and Dark modes
- Responsive web interface

**Out of Scope:**
- Third-party integrations (e.g., GitHub, Slack)
- Advanced analytics or reporting exports
- Email notifications
- Custom issue fields or workflows
- Mobile native application

## 3. User roles and personas
- **Registered User:** Any user who has created an account. They can create issues, edit issues they reported or are assigned to, and comment on any issue.
- **Admin:** (Not implemented in MVP) A user with elevated privileges to manage projects and user roles.

## 4. Functional requirements
- **FR-01 (Authentication):** Users must be able to sign up with email/password and log in to a secure dashboard.
- **FR-02 (Issue Creation):** Users must be able to create an issue with a title, description, status, and priority.
- **FR-03 (Issue Assignment):** Users must be able to assign an issue to any registered user.
- **FR-04 (Status Tracking):** Users must be able to update the status of an issue from Open to In Progress to Closed.
- **FR-05 (Comments):** Users must be able to add text comments to any issue.
- **FR-06 (Dashboard):** The system must display a dashboard summarizing the user's open, in progress, and closed issues, along with total metrics.

## 5. Non-functional requirements
- **Performance:** Page loads should be under 200ms using optimistic UI updates for mutations.
- **Security:** Row Level Security (RLS) must be enforced on the database to prevent unauthorized access to sensitive data.
- **Accessibility:** The UI must meet WCAG AA contrast standards and support keyboard navigation.
- **Responsiveness:** The layout must adapt gracefully from 360px mobile screens to 1440px desktop screens.

## 6. User stories with acceptance criteria
- **Story 1:** As a developer, I want to create a new issue so that I can track a bug.
  - *Acceptance:* I can click "New Issue", enter a title, and click "Submit". The issue appears in the list.
- **Story 2:** As a project manager, I want to see a dashboard of all issues so that I understand team velocity.
  - *Acceptance:* I can navigate to the dashboard and see a donut chart of status distributions.
- **Story 3:** As a user, I want to comment on an issue to ask for clarification.
  - *Acceptance:* I can type in the comment box on an issue detail page and press submit. The comment appears immediately.

## 7. Data model and ER description
- `profiles`: id (uuid), full_name, email, created_at.
- `issues`: id (uuid), issue_number (bigint), title, description, status, priority, reporter_id, assignee_id, created_at, updated_at, closed_at.
- `comments`: id (uuid), issue_id, author_id, body, created_at.
**Relationships:**
- `issues.reporter_id` -> `profiles.id`
- `issues.assignee_id` -> `profiles.id`
- `comments.issue_id` -> `issues.id`
- `comments.author_id` -> `profiles.id`

## 8. UI/UX overview and design system summary
- **Theme:** Dark-first SaaS aesthetic with a glassmorphism touch. Light mode available.
- **Typography:** "Plus Jakarta Sans" for UI, "JetBrains Mono" for code and IDs.
- **Colors:** Indigo/Violet primary (#7C5CFF), Cyan accent (#22D3EE).
- **Motion:** Generous use of spring animations for list staggered entrances and layout changes, respecting `prefers-reduced-motion`.

## 9. Assumptions and constraints
- Modern browser requirement (Chrome, Firefox, Safari, Edge).
- Database size will remain within reasonable limits for Supabase free tier during MVP phase.

## 10. Deployment
- **Frontend Hosting:** Vercel
- **Backend/Database:** Supabase Cloud (PostgreSQL + Auth)
- **Deployment Approach:** Git-based continuous deployment. Pushes to the `main` branch automatically trigger Vercel builds.
- **Environment Variables:** `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are required in Vercel settings.
- **Supabase Setup:**
  1. Create a new Supabase project.
  2. Run `supabase/migrations/0001_init.sql` in the SQL Editor.
  3. (Optional) Run `supabase/seed.sql` for demo data.
  4. In Auth settings, set the Site URL to your Vercel deployment URL (e.g., `https://trackly.vercel.app`).
- **Initial Deployment:** Push the repository to GitHub, link the repository in Vercel, set the environment variables, and deploy.
- **Updates:** Automatic on push. Rollbacks can be performed via the Vercel dashboard.

## 11. Risks and future enhancements
- **Risk:** High latency if Supabase region is far from the user.
- **Future Enhancements:** Full drag-and-drop Kanban board, real-time presence (who is viewing the issue), and email notifications.
