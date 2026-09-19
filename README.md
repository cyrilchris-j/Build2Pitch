# BUILD2PITCH

> **Build. Brand. Launch. Pitch.**

**BUILD2PITCH** is a one-day entrepreneurship challenge platform designed for 3rd-year students to experience the complete journey of building a startup.

Instead of conducting a traditional presentation-based event, BUILD2PITCH puts students into startup teams and gives them a practical challenge:

**Form a Team → Get a Unique Startup Idea → Build the Brand → Build the Product → Submit Proof → Pitch Like an Entrepreneur**

The platform manages team registration, authentication, team members, unique startup idea allocation, challenge instructions, countdown experience, deliverables, submissions and administrator monitoring.

---

## 1. Vision

The objective of BUILD2PITCH is not simply to make students build a website.

The objective is to develop:

* Entrepreneurial thinking
* Product thinking
* Problem-solving
* Creativity
* Branding skills
* Technical execution
* Teamwork
* Business thinking
* Communication
* Pitching skills
* Ownership and decision-making

The platform should therefore feel like a **startup command center**, not a normal college registration portal.

### Core Experience

```text
PROBLEM
   ↓
STARTUP IDEA
   ↓
TEAM
   ↓
BRAND
   ↓
PRODUCT
   ↓
BUSINESS
   ↓
SUBMISSION
   ↓
PITCH
```

---

# 2. Event Structure

Each team consists of **6 students**:

```text
1 Team Lead
+
5 Team Members
=
6 Students
```

### Team Rule

Every team must contain:

* At least **1 boy**
* At least **1 girl**
* Maximum/total team size: **6**
* Exactly **1 Team Lead**

The Team Lead is responsible for managing the team's BUILD2PITCH submission.

---

# 3. User Roles

The application has two major roles.

## Team Lead

The Team Lead can:

* Register a team
* Add 5 team members
* Set passwords for team members
* View team information
* Select the startup idea
* View challenge instructions
* View countdown
* Submit startup deliverables
* Update submission links
* Submit GitHub repository
* Submit deployed website
* Submit branding assets
* Submit startup video
* Track submission status

## Team Member

Team members can:

* Login using their registered email
* Use the password created by the Team Lead
* View their own profile
* View basic event information
* View the allocated startup idea
* View challenge instructions

Team members **cannot**:

* Modify the team
* Add/remove members
* Change Team Lead
* Change startup idea
* Submit/edit team deliverables
* Access admin features

## Admin

Admin access is completely separate from public/team registration.

The Admin can:

* View all registered teams
* View Team Leads
* View team members
* View participant details
* Manage startup ideas
* View assigned ideas
* View submissions
* Review GitHub links
* Review deployed website links
* View uploaded branding assets
* View startup videos
* Track submission status
* Monitor teams during the event

---

# 4. Authentication Architecture

Authentication should be implemented using:

```text
React
   ↓
Express API
   ↓
JWT Authentication
   ↓
MongoDB
```

### Registration Flow

Only the **Team Lead** performs registration.

```text
Team Lead
   ↓
Signup
   ↓
Account Created
   ↓
Automatic Login
   ↓
Team Setup
   ↓
Add 5 Members
   ↓
Set Member Passwords
   ↓
Team Created
```

After successful Team Lead signup:

> **Do not force the user to login again.**

The backend should immediately generate a JWT and the frontend should redirect the user to the Team Lead dashboard.

---

# 5. Team Member Login Flow

The Team Lead enters:

* Student Name
* Register Number
* Gmail
* Mobile Number
* Gender
* Section
* Password

for each of the 5 members.

Example:

```text
Team Lead
    │
    ├── Member 01
    ├── Member 02
    ├── Member 03
    ├── Member 04
    └── Member 05
```

The member does **not** create another account.

Instead:

```text
Registered Gmail
+
Password created by Team Lead
        ↓
Member Login
        ↓
Member Dashboard
```

---

# 6. Authentication Requirements

### Team Lead

```text
POST /api/auth/register
POST /api/auth/login
```

### Team Member

```text
POST /api/auth/member-login
```

### Current User

```text
GET /api/auth/me
```

### Security

Passwords must never be stored as plain text.

Use:

```text
bcrypt / bcryptjs
```

Store:

```text
passwordHash
```

instead of:

```text
password
```

JWT should contain:

```json
{
  "userId": "...",
  "role": "TEAM_LEAD"
}
```

or:

```json
{
  "userId": "...",
  "role": "TEAM_MEMBER"
}
```

Admin JWT:

```json
{
  "userId": "...",
  "role": "ADMIN"
}
```

---

# 7. Admin Authentication

There should be **NO Admin Registration page**.

Admin accounts are manually inserted into MongoDB.

Example:

```text
MongoDB
   ↓
users collection
   ↓
role = ADMIN
```

The public UI should never contain:

```text
Create Admin Account
```

or:

```text
Admin Signup
```

Admin login should be available through a separate protected route such as:

```text
/admin/login
```

Only the manually created administrator should have access.

### Important

Admin authorization must be enforced by the backend.

Hiding the Admin button in React is **not sufficient security**.

---

# 8. Registration Form

The Team Lead registration form should collect:

### Team Lead Details

* Student Name
* Register Number
* Gmail
* Mobile Number
* Gender
* Section
* Password
* Confirm Password

### Team Details

* Team Name
* Team Code / generated Team ID

The Team ID can be automatically generated.

Example:

```text
B2P-2026-001
B2P-2026-002
B2P-2026-003
```

---

# 9. Team Member Form

The Team Lead adds five members.

Each member requires:

| Field           | Required |
| --------------- | -------- |
| Student Name    | Yes      |
| Register Number | Yes      |
| Gmail           | Yes      |
| Mobile Number   | Yes      |
| Gender          | Yes      |
| Section         | Yes      |
| Password        | Yes      |

The system should validate:

* Duplicate register number
* Duplicate email
* Invalid Gmail
* Invalid mobile number
* Missing fields
* Team size
* Gender requirement

---

# 10. MongoDB Database Design

Recommended collections:

```text
users
teams
teamMembers
startupIdeas
ideaAssignments
submissions
eventSettings
activityLogs
```

---

# 11. User Schema

```js
{
  _id: ObjectId,

  name: String,

  registerNumber: {
    type: String,
    unique: true
  },

  email: {
    type: String,
    unique: true
  },

  mobile: String,

  gender: {
    type: String,
    enum: ["MALE", "FEMALE", "OTHER"]
  },

  section: String,

  passwordHash: String,

  role: {
    type: String,
    enum: ["TEAM_LEAD", "TEAM_MEMBER", "ADMIN"]
  },

  teamId: {
    type: ObjectId,
    ref: "Team"
  },

  isActive: {
    type: Boolean,
    default: true
  },

  createdAt: Date,
  updatedAt: Date
}
```

---

# 12. Team Schema

```js
{
  _id: ObjectId,

  teamId: String,

  teamName: String,

  teamLeadId: {
    type: ObjectId,
    ref: "User"
  },

  members: [
    {
      type: ObjectId,
      ref: "User"
    }
  ],

  startupIdeaId: {
    type: ObjectId,
    ref: "StartupIdea"
  },

  ideaSelectionStatus: {
    type: String,
    enum: [
      "NOT_STARTED",
      "ROLLING",
      "SELECTED"
    ]
  },

  registrationStatus: {
    type: String,
    enum: [
      "INCOMPLETE",
      "COMPLETED"
    ]
  },

  createdAt: Date,
  updatedAt: Date
}
```

---

# 13. Startup Idea Schema

Admin controls the complete list of 30 startup ideas.

```js
{
  _id: ObjectId,

  title: String,

  shortDescription: String,

  problemStatement: String,

  targetUsers: String,

  category: String,

  difficulty: String,

  isActive: Boolean,

  isAssigned: Boolean,

  assignedTeamId: ObjectId,

  createdAt: Date
}
```

Example:

```text
Idea #01
Smart Waste Pickup

Idea #02
Campus Food Rescue

Idea #03
Local Service Marketplace

...

Idea #30
AI Career Navigator
```

---

# 14. Idea Assignment System

This is one of the main features of BUILD2PITCH.

The event should create a **game-like idea selection experience**.

Students should not simply see:

```text
Select Idea
[Dropdown]
```

Instead, the experience should feel like a startup challenge.

### UI Concept

```text
        BUILD2PITCH

     YOUR STARTUP AWAITS

        ┌─────────┐
        │  DICE   │
        │    ?    │
        └─────────┘

       ROLL TO DISCOVER

       [ ROLL IDEA ]
```

Use an animated dice/3D card mechanism inspired by the **Avengers: Doomsday cinematic atmosphere**.

Do not directly copy copyrighted movie assets, logos or footage.

Instead use an original:

* Dark cinematic UI
* Metallic surfaces
* Red/black atmospheric lighting
* Particle effects
* Glitch transitions
* Energy effects
* Countdown typography
* 3D dice/card animation
* Dramatic motion
* Cinematic sound cues if appropriate

---

# 15. Two-Chance Idea Selection

Each team receives:

```text
2 CHANCES
```

The team can roll the idea selector twice.

Example:

```text
Chance 1
   ↓
Idea #17
   ↓
Keep / Roll Again
```

If they roll again:

```text
Chance 2
   ↓
Idea #04
   ↓
LOCK IDEA
```

Once the idea is selected:

```text
Idea #04
        ↓
LOCKED
        ↓
Cannot change
```

---

# 16. Unique Idea Allocation

The same startup idea must **not be assigned to two teams**.

For example:

```text
Team A → Idea #07

Team B → Idea #19

Team C → Idea #02
```

Never:

```text
Team A → Idea #07
Team B → Idea #07
```

The uniqueness check must happen on the **backend**, not only in React.

### Recommended Logic

When a team requests an idea:

```text
START
  ↓
Get active unassigned ideas
  ↓
Select random idea
  ↓
Atomic database update
  ↓
Assign teamId
  ↓
Save assignment
  ↓
Return idea
```

Use a transaction or atomic update to avoid two teams receiving the same idea simultaneously.

---

# 17. Idea Assignment Schema

```js
{
  _id: ObjectId,

  teamId: {
    type: ObjectId,
    ref: "Team",
    unique: true
  },

  ideaId: {
    type: ObjectId,
    ref: "StartupIdea",
    unique: true
  },

  selectedAt: Date,

  attemptsUsed: {
    type: Number,
    default: 0
  },

  status: {
    type: String,
    enum: ["ACTIVE", "LOCKED"]
  }
}
```

The unique indexes on:

```text
teamId
ideaId
```

help prevent duplicate assignments.

---

# 18. Idea Selection API

```text
GET  /api/ideas/available
POST /api/ideas/roll
POST /api/ideas/lock
GET  /api/ideas/my-idea
```

### Roll

```text
POST /api/ideas/roll
```

Backend checks:

```text
Is Team Lead?
        ↓
Does team already have an idea?
        ↓
How many attempts?
        ↓
Are ideas available?
        ↓
Select random unassigned idea
        ↓
Increment attempt
        ↓
Return idea
```

Maximum:

```text
2 attempts
```

---

# 19. Team Dashboard

After login, Team Lead should see a startup-focused dashboard.

### Dashboard Sections

```text
┌─────────────────────────────────────┐
│ BUILD2PITCH                         │
│ Team: NovaLabs       B2P-2026-021   │
└─────────────────────────────────────┘

STARTUP STATUS

Idea
[ LOCKED ]

Brand
[ IN PROGRESS ]

Website
[ IN PROGRESS ]

Submission
[ NOT SUBMITTED ]

---------------------------------------

YOUR STARTUP IDEA

Smart Local Commerce
Problem...
Target Users...

---------------------------------------

TEAM

Lead
Member 01
Member 02
Member 03
Member 04
Member 05

---------------------------------------

CHALLENGE DEADLINE

01 : 42 : 38 : 17

---------------------------------------

SUBMIT YOUR WORK
```

---

# 20. Challenge Instructions Page

After team registration, show a dedicated instruction page.

It should explain:

### What You Have To Build

```text
1. Logo
2. Visiting Card
3. Poster / Show Banner
4. LinkedIn Banner
5. Working Website
6. 5-Minute Video
7. Final Pitch
```

### Pitch Requirements

```text
Problem
Target Users
Solution
Workflow
Uniqueness
Business Model
Future Scope
```

The page should also explain:

* Team rules
* Time limit
* Idea selection rules
* Submission rules
* Website requirements
* Video requirements
* Final pitch requirements

---

# 21. Countdown Experience

The countdown is a major visual element.

Example:

```text
THE CLOCK IS RUNNING

08 : 42 : 17 : 39

DAYS   HOURS   MINUTES   SECONDS
```

For the event day:

```text
BUILD
BRAND
LAUNCH
PITCH
```

The countdown should have a cinematic, high-energy interface inspired by superhero/cinematic aesthetics without copying protected assets.

### Visual Direction

* Dark background
* Large condensed typography
* Animated particles
* Subtle smoke
* Red/white highlights
* Metallic cards
* Glowing borders
* Motion blur
* Scroll animations
* Number transitions
* Cinematic transitions

---

# 22. Deliverables

Only the **Team Lead** can submit/edit deliverables.

### Required Deliverables

#### Branding

```text
Logo Design
Visiting Card
Poster / Show Banner
LinkedIn Banner
```

#### Product

```text
GitHub Repository
Deployed Website
```

#### Media

```text
5-Minute Startup Video
```

#### Optional

```text
Pitch Deck
Business Model Canvas
Additional Prototype
```

---

# 23. Submission Schema

```js
{
  _id: ObjectId,

  teamId: {
    type: ObjectId,
    ref: "Team",
    unique: true
  },

  logoUrl: String,

  visitingCardUrl: String,

  posterUrl: String,

  linkedinBannerUrl: String,

  githubUrl: String,

  deployedUrl: String,

  videoUrl: String,

  pitchDeckUrl: String,

  businessModel: String,

  finalPitchNotes: String,

  submissionStatus: {
    type: String,
    enum: [
      "NOT_STARTED",
      "IN_PROGRESS",
      "SUBMITTED",
      "LOCKED"
    ]
  },

  submittedAt: Date,

  updatedAt: Date
}
```

---

# 24. Submission Workflow

```text
Team Lead Login
      ↓
Dashboard
      ↓
Startup Idea
      ↓
Instructions
      ↓
Build Startup
      ↓
Upload Branding
      ↓
Add GitHub URL
      ↓
Add Deployed URL
      ↓
Add Video URL
      ↓
Review Submission
      ↓
FINAL SUBMIT
      ↓
Submission Locked
```

After final submission:

```text
SUBMISSION STATUS
        ↓
     SUBMITTED
```

The Team Lead should receive a confirmation screen.

---

# 25. Admin Dashboard

The Admin Dashboard is the command center of the event.

### Overview

```text
TOTAL TEAMS
24

TOTAL STUDENTS
144

IDEAS ASSIGNED
24 / 30

SUBMITTED
17

IN PROGRESS
7
```

---

# 26. Admin Team View

Admin should be able to open a team and see:

```text
TEAM INFORMATION

Team ID
Team Name
Team Lead

MEMBERS

Name
Register Number
Email
Mobile
Gender
Section
Role

STARTUP IDEA

Idea Title
Category
Assigned Time

SUBMISSION

Logo
Visiting Card
Poster
LinkedIn Banner
GitHub
Deployed Website
Video
Pitch Deck
```

---

# 27. Admin Idea Management

Admin manually adds the 30 startup ideas.

Admin interface:

```text
STARTUP IDEAS

+ Add New Idea

#01  Smart Waste Pickup
#02  Campus Food Rescue
#03  Local Service Marketplace
...
#30  AI Career Navigator
```

Admin can:

* Add idea
* Edit idea
* Activate/deactivate idea
* View assignment
* See which team received the idea
* See remaining ideas

---

# 28. Admin Submission Monitoring

Admin should have filters:

```text
All
Registered
Idea Selected
In Progress
Submitted
Incomplete
```

And search:

```text
Search Team
Search Student
Search Register Number
Search Team ID
```

---

# 29. Recommended API Structure

```text
/api
│
├── /auth
│   ├── POST /register
│   ├── POST /login
│   ├── POST /member-login
│   └── GET  /me
│
├── /teams
│   ├── GET  /me
│   ├── POST /members
│   ├── PUT  /members/:id
│   └── DELETE /members/:id
│
├── /ideas
│   ├── GET  /available
│   ├── POST /roll
│   ├── POST /lock
│   └── GET  /my-idea
│
├── /submissions
│   ├── GET  /me
│   ├── PUT  /me
│   └── POST /final-submit
│
└── /admin
    ├── /teams
    ├── /students
    ├── /ideas
    ├── /submissions
    └── /analytics
```

---

# 30. Recommended Folder Structure

```text
build2pitch/
│
├── client/
│   │
│   ├── public/
│   │   ├── favicon.svg
│   │   └── assets/
│   │
│   └── src/
│       │
│       ├── assets/
│       │
│       ├── components/
│       │   ├── ui/
│       │   ├── layout/
│       │   ├── dashboard/
│       │   ├── team/
│       │   ├── ideas/
│       │   ├── submissions/
│       │   ├── countdown/
│       │   └── animations/
│       │
│       ├── pages/
│       │   ├── Landing/
│       │   ├── Auth/
│       │   │   ├── Login/
│       │   │   ├── Register/
│       │   │   └── MemberLogin/
│       │   │
│       │   ├── Team/
│       │   │   ├── Dashboard/
│       │   │   ├── TeamMembers/
│       │   │   ├── IdeaSelection/
│       │   │   ├── Instructions/
│       │   │   └── Submission/
│       │   │
│       │   └── Admin/
│       │       ├── Login/
│       │       ├── Dashboard/
│       │       ├── Teams/
│       │       ├── Students/
│       │       ├── Ideas/
│       │       └── Submissions/
│       │
│       ├── hooks/
│       ├── context/
│       ├── services/
│       │   ├── api.ts
│       │   ├── auth.service.ts
│       │   ├── team.service.ts
│       │   ├── idea.service.ts
│       │   └── submission.service.ts
│       │
│       ├── utils/
│       ├── types/
│       ├── routes/
│       ├── App.tsx
│       └── main.tsx
│
├── server/
│   │
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js
│   │   │   └── env.js
│   │   │
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Team.js
│   │   │   ├── StartupIdea.js
│   │   │   ├── IdeaAssignment.js
│   │   │   ├── Submission.js
│   │   │   └── ActivityLog.js
│   │   │
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   ├── role.js
│   │   │   └── errorHandler.js
│   │   │
│   │   ├── services/
│   │   │   ├── auth.service.js
│   │   │   ├── idea.service.js
│   │   │   └── team.service.js
│   │   │
│   │   ├── utils/
│   │   └── app.js
│   │
│   └── package.json
│
├── .env.example
├── .gitignore
├── README.md
└── package.json
```

---

# 31. Frontend Technology

Recommended stack:

```text
React
TypeScript
Vite
Tailwind CSS
React Router
Axios
Framer Motion
Lucide React
```

### UI Libraries / Inspiration

Use modern components and animation patterns inspired by:

* React Bits
* Scanning/cinematic UI references
* Modern SaaS dashboards
* Premium startup websites
* Cinematic interfaces

The implementation should remain **original** rather than copying another website's exact design.

---

# 32. Design Language

BUILD2PITCH should look like a **premium startup accelerator platform**.

### Visual Personality

```text
Cinematic
Modern
Technical
Entrepreneurial
Premium
Energetic
Minimal but dramatic
```

### Avoid

```text
Generic Bootstrap dashboard
Plain college website
Excessive gradients
Overloaded cards
Slow animations
Huge image assets
Unnecessary loaders
```

---

# 33. Typography

Recommended typography system:

### Primary

```text
Inter
```

For:

* Body
* Forms
* Dashboard
* Tables

### Display

Use a bold condensed/display font for:

* Hero
* Countdown
* Section titles
* Idea reveal
* Event branding

Typography should create a cinematic startup atmosphere while remaining highly readable on mobile.

---

# 34. Mobile-First Requirement

The entire application must be responsive.

Required breakpoints:

```text
Mobile
Tablet
Laptop
Desktop
Large Desktop
```

The Team Lead should be able to complete the entire workflow from a mobile phone.

Especially optimize:

* Registration
* Member creation
* Idea selection
* Countdown
* Submission
* Admin monitoring

---

# 35. Performance Requirements

The site should feel fast and responsive.

### Requirements

* Lazy-load heavy components
* Optimize images
* Compress uploaded assets
* Avoid unnecessary API calls
* Use React memoization where useful
* Avoid excessive animation loops
* Use CSS transforms for animations
* Avoid huge background videos
* Use pagination in Admin tables
* Debounce search
* Cache stable event data
* Use skeleton loaders instead of blocking spinners

### Target

```text
Fast initial load
Smooth 60fps animations
Minimal layout shift
Mobile-friendly
Low network usage
```

---

# 36. Route Protection

Example:

```text
/public
    /
    /login
    /register

/team
    /dashboard
    /members
    /idea
    /instructions
    /submission

/member
    /dashboard

/admin
    /login
    /dashboard
    /teams
    /students
    /ideas
    /submissions
```

### Access Rules

```text
TEAM_LEAD
    ↓
/team/*

TEAM_MEMBER
    ↓
/member/*

ADMIN
    ↓
/admin/*
```

A Team Member attempting:

```text
/team/members
```

must receive:

```text
403 Forbidden
```

and should not be allowed to modify data.

---

# 37. Important Security Rules

Backend authorization is mandatory.

Never trust:

```text
role
teamId
userId
```

sent from the frontend.

The server should derive identity from the authenticated JWT.

Example:

```text
JWT
 ↓
Middleware
 ↓
User ID
 ↓
MongoDB
 ↓
Team ownership check
 ↓
Allow / Reject
```

A Team Lead should only be able to modify **their own team**.

---

# 38. Event Settings

Create an `eventSettings` collection.

Example:

```js
{
  eventName: "BUILD2PITCH",

  startTime: Date,

  endTime: Date,

  registrationOpen: Boolean,

  challengeOpen: Boolean,

  submissionOpen: Boolean,

  maxTeamSize: 6,

  maxIdeaAttempts: 2
}
```

This allows the Admin to control the event without changing frontend code.

---

# 39. Activity Tracking

Optional but highly useful.

Track important actions:

```text
Team Registered
Member Added
Idea Roll 1
Idea Roll 2
Idea Locked
Submission Updated
Submission Submitted
Admin Viewed Team
```

Example:

```js
{
  userId: ObjectId,
  teamId: ObjectId,
  action: "IDEA_LOCKED",
  metadata: {},
  timestamp: Date
}
```

This creates an audit trail.

---

# 40. Complete User Journey

## Phase 01 — Registration

```text
Landing Page
      ↓
Register as Team Lead
      ↓
Create Account
      ↓
Automatic Login
      ↓
Create Team
```

## Phase 02 — Build Team

```text
Add Member 01
Add Member 02
Add Member 03
Add Member 04
Add Member 05
      ↓
Team Completed
```

## Phase 03 — Enter Challenge

```text
Challenge Instructions
      ↓
Event Countdown
      ↓
Startup Idea Selection
```

## Phase 04 — Idea Reveal

```text
ROLL
 ↓
Animation
 ↓
Idea Revealed
 ↓
Keep OR Roll Again
 ↓
Maximum 2 Chances
 ↓
LOCK IDEA
```

## Phase 05 — Startup Building

```text
Brand
 ↓
Logo
 ↓
Visiting Card
 ↓
Poster
 ↓
LinkedIn Banner
 ↓
Website
 ↓
Video
```

## Phase 06 — Submission

```text
Upload / Add Links
       ↓
Review
       ↓
Final Submit
       ↓
Locked
```

## Phase 07 — Review

```text
Admin
 ↓
Team
 ↓
Startup Idea
 ↓
Deliverables
 ↓
Website
 ↓
GitHub
 ↓
Video
 ↓
Final Pitch
```

---

# 41. Landing Page

The landing page should immediately communicate:

> **BUILD2PITCH**

> **Don't just build a project. Build a startup.**

Primary CTA:

```text
JOIN THE CHALLENGE
```

Secondary CTA:

```text
HOW IT WORKS
```

Sections:

```text
Hero
↓
What is Build2Pitch?
↓
The Challenge
↓
How It Works
↓
What You'll Build
↓
The Startup Journey
↓
Event Countdown
↓
Rules
↓
FAQ
↓
Register
```

---

# 42. Core Product Philosophy

Every major screen should reinforce one idea:

> **You are not participating in a college assignment. You are running a startup for one day.**

Instead of saying:

```text
Upload Logo
```

the interface can communicate:

```text
BUILD YOUR BRAND
Your startup needs an identity.
```

Instead of:

```text
Add GitHub Link
```

use:

```text
SHIP YOUR PRODUCT
Show us the product you built.
```

Instead of:

```text
Submit
```

use:

```text
LAUNCH FOR REVIEW
```

This keeps the entrepreneurial mindset throughout the experience.

---

# 43. Suggested Dashboard Navigation

```text
BUILD2PITCH
│
├── Dashboard
├── My Startup
├── Team
├── Idea
├── Challenge
├── Countdown
├── Deliverables
├── Submission
└── Profile
```

Team Members should have a restricted navigation:

```text
BUILD2PITCH
│
├── Dashboard
├── My Profile
├── Startup Idea
└── Challenge
```

---

# 44. Admin Navigation

```text
ADMIN
│
├── Overview
├── Teams
├── Students
├── Startup Ideas
├── Idea Assignments
├── Submissions
├── Event Settings
└── Activity Logs
```

---

# 45. MVP Scope

For the first version, prioritize:

### Authentication

* Team Lead signup
* Automatic login
* Team Member login
* Admin login
* Role-based access

### Team

* Create team
* Add 5 members
* Validate team
* View team

### Startup Ideas

* Admin adds 30 ideas
* Unique random assignment
* Two attempts
* Lock selected idea

### Challenge

* Instructions
* Countdown
* Startup dashboard

### Deliverables

* Logo
* Visiting Card
* Poster
* LinkedIn Banner
* GitHub
* Deployed Website
* Video

### Admin

* Teams
* Members
* Ideas
* Assignments
* Submissions

---

# 46. Definition of Done

BUILD2PITCH MVP is considered complete when:

```text
✓ Team Lead can register
✓ Team Lead is automatically logged in
✓ Team Lead can create a 6-member team
✓ Team must contain at least one boy and one girl
✓ Five members can be added
✓ Team Lead can create member passwords
✓ Members can login using registered Gmail + password
✓ Members cannot modify the team
✓ Admin cannot be registered publicly
✓ Admin can be manually created in MongoDB
✓ Admin can manage 30 startup ideas
✓ Team can roll for an idea
✓ Team receives maximum two chances
✓ Same idea cannot be assigned to two teams
✓ Selected idea becomes locked
✓ Idea appears on team dashboard
✓ Instructions are accessible
✓ Countdown works
✓ Team Lead can submit deliverables
✓ GitHub URL can be submitted
✓ Deployed URL can be submitted
✓ Video can be submitted
✓ Admin can view all submissions
✓ Role-based authorization works
✓ Website works on mobile
✓ Production build is optimized
```

---

# 47. Final Concept

BUILD2PITCH is designed around one simple transformation:

```text
STUDENT
   ↓
TEAM MEMBER
   ↓
FOUNDER
   ↓
STARTUP TEAM
   ↓
PRODUCT BUILDER
   ↓
ENTREPRENEUR
   ↓
PITCHER
```

### BUILD2PITCH

**Build the idea.
Build the brand.
Build the product.
Build the business.
Pitch it like it's real.**

---

## Tech Stack

```text
Frontend      → React + TypeScript + Vite
Styling       → Tailwind CSS
Animations    → Framer Motion + CSS
UI Inspiration→ React Bits + modern cinematic UI patterns
Backend       → Node.js + Express
Database      → MongoDB
Authentication→ JWT + bcrypt
API           → REST
Deployment    → Vercel / Render / Railway
```

---

## 📁 Repository Architecture

```text
build2pitch/
├── client/
│   ├── public/                   # Static public assets (favicon.svg, etc.)
│   ├── src/
│   │   ├── assets/               # Local media and brand vectors
│   │   ├── components/
│   │   │   ├── ui/               # Atomic primitives (Button, Card, Badge, Input)
│   │   │   ├── layout/           # Navbar, Sidebar, PageContainer, ProtectedRoute, LoadingScreen
│   │   │   └── shared/           # Route PlaceholderView, Shared widgets
│   │   ├── pages/
│   │   │   ├── Landing/          # / (Public Landing & Event Playbook)
│   │   │   ├── Auth/             # /login, /register, /member-login
│   │   │   ├── Team/             # /team/dashboard, /team/members, /team/idea, /team/instructions, /team/submission
│   │   │   ├── Member/           # /member/dashboard
│   │   │   └── Admin/            # /admin/login, /admin/dashboard, /admin/teams, /admin/students, /admin/ideas, /admin/submissions
│   │   ├── routes/               # Centralized React Router DOM definition
│   │   ├── services/             # Axios API client (api.ts) with domain service wrappers
│   │   ├── hooks/                # Custom hooks (useAuth)
│   │   ├── context/              # React Context (AuthContext)
│   │   ├── types/                # Shared TypeScript models (User, Team, Idea, Submission, etc.)
│   │   ├── utils/                # Utility functions (cn styling helper)
│   │   ├── lib/                  # Design tokens and theme values (tokens.ts)
│   │   ├── App.tsx               # App root provider assembly
│   │   └── main.tsx              # React DOM entrypoint
│   ├── index.html
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── config/               # Database (db.js) & environment variables (env.js)
│   │   ├── controllers/          # Business logic handlers (auth, team, idea, submission, admin)
│   │   ├── middleware/           # auth, errorHandler, validate
│   │   ├── models/               # Mongoose ODM schemas (User, Team, StartupIdea, Submission, EventSettings)
│   │   ├── routes/               # Modular Express routers & index.js
│   │   ├── services/             # Background logic & helper services
│   │   ├── utils/                # Standardized API response formatters & logger
│   │   ├── types/                # Domain models index & documentation
│   │   └── app.js                # Express app configuration & server listener
│   └── package.json
│
├── README.md
├── .gitignore
├── .env.example
└── package.json
```

---

## 🎨 Design System & Tokens

The platform implements a **premium cinematic entrepreneurship aesthetic** (deep obsidian dark mode, glowing cyan and warm amber accents, subtle glassmorphism).

Defined in [`client/src/lib/tokens.ts`](client/src/lib/tokens.ts) and configured in [`client/tailwind.config.js`](client/tailwind.config.js):

| Token | Semantic Role | Value / Hex | Preview / Usage |
| :--- | :--- | :--- | :--- |
| `background` | Pitch Dark Canvas | `#090D16` | Main app background canvas |
| `foreground` | Crisp Text | `#F8FAFC` | Primary readable typography |
| `card` | Glassmorphic Slate | `#0F172A` | Elevated containers & dashboard tiles |
| `border` | Luminescent Border | `#1E293B` | Subtle card & layout separators |
| `primary` | Electric Cyan | `#06B6D4` | Primary brand accent & call-to-actions |
| `accent` | Pitch Gold / Amber | `#F59E0B` | Badges, countdowns & milestones |
| `danger` | Crimson Alert | `#EF4444` | Deadlines, errors, destructive alerts |
| `success` | Launch Mint | `#10B981` | Verification, active status, completion |

---

## 🗺 Application Routes

All 16 required route placeholders are fully configured and routed in [`client/src/routes/index.tsx`](client/src/routes/index.tsx):

| Route | Module | Purpose |
| :--- | :--- | :--- |
| `/` | `Landing` | Event introduction, schedule, and team quick-start actions |
| `/login` | `Auth` | Team Leader & User authentication |
| `/register` | `Auth` | Team Leader sign up and new squad registration |
| `/member-login` | `Auth` | Quick-pass login for 6-member team participants |
| `/team/dashboard` | `Team` | Main command center for 6-member team |
| `/team/members` | `Team` | 6-member roster management & role assignments |
| `/team/idea` | `Team` | Reveal & view assigned startup idea and problem statement |
| `/team/instructions` | `Team` | Event rules, judging rubric, and milestones |
| `/team/submission` | `Team` | Final deliverable lock-in (live demo URL, pitch deck, GitHub) |
| `/member/dashboard` | `Member` | Individual student participant workspace & tasks |
| `/admin/login` | `Admin` | Restricted administrator authentication |
| `/admin/dashboard` | `Admin` | Executive dashboard with event-wide analytics & controls |
| `/admin/teams` | `Admin` | Directory of all competing teams & table assignments |
| `/admin/students` | `Admin` | Roster of all student participants and skills |
| `/admin/ideas` | `Admin` | Startup idea bank & auto-distribution controls |
| `/admin/submissions` | `Admin` | Submissions pipeline, review console, and judging rubric |

---

## 📦 Shared TypeScript Data Models

Defined in [`client/src/types/index.ts`](client/src/types/index.ts) and mirrored in [`server/src/models/`](server/src/models/):

- `User`: Accounts (roles: `admin`, `team_lead`, `member`).
- `Team`: 6-member squads, unique team codes, table numbers, submission and idea linkages.
- `TeamMember`: Specific role allocations (`leader`, `developer`, `designer`, `pitcher`, `researcher`, `marketer`).
- `StartupIdea`: Structured startup briefs (Problem, target demographic, feature set, revenue model).
- `IdeaAssignment`: Team allocation tracking with reveal state controls.
- `Submission`: Deliverable packages (Pitch deck, Live demo, GitHub repository, tech stack).
- `EventSettings`: Global hackathon state, deadlines, team constraints, and event phases.

---

## ⚡ Getting Started

### 1. Prerequisites
- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **MongoDB** (Local or MongoDB Atlas connection string)

### 2. Installation
Install all dependencies across the monorepo root, client, and server with one command:
```bash
npm run install:all
```

### 3. Environment Setup
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
*(Server and client default to port 5000 and 5173 respectively).*

### 4. Running Locally
Start both backend API and frontend Vite dev server concurrently:
```bash
npm run dev
```

Or run each independently:
```bash
# Terminal 1: Backend Express Server
npm run dev:server

# Terminal 2: Frontend Vite Client
npm run dev:client
```

- **Frontend Client**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000](http://localhost:5000)
- **Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🤝 Developer Contribution Guide

1. **Modular Scope**: Keep components focused and under 250 lines.
2. **Type Safety**: Always import types from `@/types`. Do not use `any`.
3. **Design Tokens**: Always use predefined Tailwind tokens (`text-primary`, `bg-card`, `border-border`) rather than arbitrary colors.
4. **API Calls**: Add endpoints to `client/src/services/api.ts` through `apiClient`.
5. **Route Registration**: Connect new pages into `client/src/routes/index.tsx`.

---

## License

This project is created for the **BUILD2PITCH entrepreneurship event** and may be adapted for future student entrepreneurship challenges.

