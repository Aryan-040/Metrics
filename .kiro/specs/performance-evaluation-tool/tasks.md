# Implementation Plan: Performance Evaluation Tool

## Overview

This implementation plan creates a multi-tenant performance evaluation web application using Next.js 14+ App Router with TypeScript, PostgreSQL with Prisma ORM, Tailwind CSS + shadcn/ui for styling, and custom session-based authentication. The tasks are ordered to support the priority demo flow (end of day deadline):

1. Login as Priya → See 6 people requiring feedback → Submit feedback for one person
2. Login as that employee → See their historical scores
3. Login as HR → See who hasn't submitted this month's feedback
4. Switch company / demonstrate Bright Path's different hierarchy

## Tasks

- [x] 1. Set up project foundation and database schema
  - [x] 1.1 Initialize Next.js 14+ project with TypeScript and Tailwind CSS
    - Create Next.js app with App Router
    - Install dependencies: prisma, @prisma/client, bcrypt, zod
    - Install shadcn/ui and configure components
    - Set up project structure (lib/, components/, app/)
    - _Requirements: Tech stack specification from design_

  - [x] 1.2 Create Prisma schema with all 7 models
    - Define Company, User, ManagerRelationship, FeedbackCycle, FeedbackParameter, Feedback, FeedbackScore models
    - Set up all foreign key relationships with cascade deletes
    - Add unique constraints for data integrity
    - Create database indexes for performance
    - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5, 16.6, 16.7_

  - [x] 1.3 Create seed data script for demo scenarios
    - Seed Ashoka Textiles: Rohan (manager of Priya), Priya (manager of 6), HR user, 6 employees
    - Seed Bright Path Consulting: 1 founder, 8 employees, HR user
    - Seed 5 FeedbackParameters (ownership, communication, quality_of_work, teamwork, initiative)
    - Seed 2 completed FeedbackCycles with historical feedback
    - Seed current month as active cycle with partial completion
    - Create credentials for all seeded users
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 13.6, 13.7, 5.1, 5.2, 5.3_

  - [ ]* 1.4 Write property test for tenant-scoped entity association
    - **Property 2: Tenant-Scoped Entity Association**
    - Verify all entities have exactly one non-null company_id
    - **Validates: Requirements 1.1, 1.2, 1.3, 1.4**

- [x] 2. Implement authentication module
  - [x] 2.1 Create authentication types and session management
    - Define User, Session, AuthResult interfaces in lib/auth/types.ts
    - Implement session storage using HTTP-only cookies
    - Create session validation and expiry logic
    - _Requirements: 2.1, 2.4_

  - [x] 2.2 Implement login and logout server actions
    - Create login action with email/password validation
    - Hash password comparison using bcrypt
    - Create session on successful login with user roles
    - Implement logout action to terminate session
    - _Requirements: 2.1, 2.2, 2.3, 2.5_

  - [x] 2.3 Create authentication middleware
    - Implement requireAuth function for protected routes
    - Add role-based access control checks
    - Redirect unauthenticated users to login
    - _Requirements: 2.1, 10.1, 10.6_

  - [x] 2.4 Build login page UI
    - Create /login route with email/password form
    - Display validation errors for invalid credentials
    - Show company selection or auto-detect from email domain
    - Redirect to appropriate dashboard on success
    - _Requirements: 2.1, 2.2_

  - [ ]* 2.5 Write property test for authentication session validity
    - **Property 11: Authentication Session Validity**
    - Test session creation for valid credentials only
    - Test session termination on logout
    - **Validates: Requirements 2.1, 2.2, 2.5**

- [x] 3. Checkpoint - Verify database and auth foundation
  - Ensure Prisma migrations run successfully
  - Ensure seed data loads correctly
  - Ensure login/logout flow works
  - Ask the user if questions arise

- [x] 4. Implement manager relationship and feedback cycle modules
  - [x] 4.1 Create manager relationship queries
    - Implement getDirectReports(managerId) with active relationship filter
    - Implement getManager(employeeId) returning single active manager
    - Implement isActiveDirectReport(managerId, employeeId) validation
    - Add company_id filtering to all queries
    - _Requirements: 3.1, 3.2, 3.5, 3.6, 3.7_

  - [x] 4.2 Create feedback cycle queries
    - Implement getCurrentCycle(companyId) returning current active cycle
    - Implement getCyclesByCompany(companyId) for historical cycles
    - Add date range validation for cycle queries
    - _Requirements: 4.1, 4.2, 4.5_

  - [ ]* 4.3 Write property tests for relationship constraints
    - **Property 9: Single Active Manager Constraint**
    - Verify user has at most one active manager
    - **Property 12: Manager Relationship Bidirectionality**
    - Verify user can be both manager and direct report
    - **Property 13: Active Direct Reports Query Correctness**
    - Verify only active relationships returned
    - **Validates: Requirements 3.2, 3.5, 3.7, 11.1**

  - [ ]* 4.4 Write property test for current feedback cycle query
    - **Property 14: Current Feedback Cycle Query Correctness**
    - Verify returned cycle contains current date
    - **Validates: Requirements 4.5**

- [x] 5. Implement feedback submission module
  - [x] 5.1 Create feedback types and validation schema
    - Define FeedbackParameter, FeedbackScore, Feedback, FeedbackSubmission types
    - Create Zod schema for feedback form validation
    - Validate score range (1-5) and non-empty justification
    - _Requirements: 6.2, 6.3, 6.4, 15.1, 15.2, 15.3_

  - [x] 5.2 Implement feedback submission server action
    - Validate manager has active relationship with employee
    - Check for duplicate feedback in same cycle
    - Create Feedback record with exactly 5 FeedbackScores
    - Record submission timestamp
    - Return success/error result
    - _Requirements: 6.1, 6.2, 6.5, 6.6, 6.7_

  - [x] 5.3 Build feedback form UI component
    - Create FeedbackForm component with 5 parameter sections
    - Add score input (1-5 radio/slider) per parameter
    - Add justification textarea per parameter
    - Display validation errors on submission
    - Show success confirmation on submit
    - Preserve data on server error
    - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5_

  - [ ]* 5.4 Write property tests for feedback validation
    - **Property 3: Feedback Score Completeness**
    - Verify exactly 5 scores created per feedback
    - **Property 4: Score Range Validation**
    - Verify only scores 1-5 accepted
    - **Property 5: Justification Non-Empty Constraint**
    - Verify empty justifications rejected
    - **Validates: Requirements 6.2, 6.3, 6.4, 15.1, 15.2, 15.3**

  - [ ]* 5.5 Write property tests for feedback constraints
    - **Property 6: Feedback Uniqueness Per Cycle**
    - Verify duplicate feedback rejected
    - **Property 7: Active Manager Relationship Constraint**
    - Verify feedback only to active direct reports
    - **Validates: Requirements 6.5, 6.7**

- [x] 6. Checkpoint - Verify feedback submission flow
  - Ensure feedback form validates correctly
  - Ensure feedback can be submitted successfully
  - Ensure duplicate submissions are prevented
  - Ask the user if questions arise

- [x] 7. Build Manager Dashboard (Priority Demo Flow Step 1)
  - [x] 7.1 Create manager dashboard page
    - Create /app/dashboard route
    - Query pending feedback for current cycle
    - Display DirectReportList component with status
    - Show completion message when all feedback submitted
    - _Requirements: 7.1, 7.2, 7.3, 7.5_

  - [x] 7.2 Create DirectReportList component
    - Display each direct report with name
    - Indicate feedback status (completed/pending)
    - Make each row clickable to navigate to feedback form
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

  - [x] 7.3 Create give-feedback page
    - Create /app/give-feedback/[employeeId] route
    - Verify manager relationship before rendering
    - Load employee info and current cycle
    - Integrate FeedbackForm component
    - Redirect to dashboard on success
    - _Requirements: 6.1, 6.7, 7.4_

- [x] 8. Build Employee Feedback History View (Priority Demo Flow Step 2)
  - [x] 8.1 Create my-feedback page
    - Create /app/my-feedback route
    - Query all feedback received by logged-in user
    - Display feedback in reverse chronological order
    - Show manager name for each feedback
    - _Requirements: 8.1, 8.4, 8.6_

  - [x] 8.2 Create FeedbackCard component
    - Display cycle name (month/year)
    - Display all 5 parameter scores with justifications
    - Show score visually (badges/stars)
    - _Requirements: 8.2, 8.3_

  - [x] 8.3 Add parameter filtering to feedback history
    - Add filter dropdown for 5 parameters
    - Filter displayed feedback by selected parameter
    - Show trends for selected criterion
    - _Requirements: 8.5_

  - [ ]* 8.4 Write property test for feedback history ordering
    - **Property 16: Feedback History Ordering**
    - Verify reverse chronological order
    - **Validates: Requirements 8.4**

- [x] 9. Checkpoint - Verify employee feedback view
  - Ensure feedback history displays correctly
  - Ensure filtering by parameter works
  - Ensure chronological ordering is correct
  - Ask the user if questions arise

- [x] 10. Build HR Compliance Dashboard (Priority Demo Flow Step 3)
  - [x] 10.1 Create HR compliance queries
    - Implement getComplianceReport(companyId, cycleId)
    - Calculate direct report counts per manager
    - Calculate completed vs pending counts
    - Implement getManagersWithPendingFeedback filter
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.6_

  - [x] 10.2 Create HR missing-feedback page
    - Create /hr/missing-feedback route
    - Verify HR role before rendering
    - Display ComplianceTable with all managers
    - Highlight managers with pending feedback
    - Show completion message when all complete
    - _Requirements: 9.1, 9.5, 9.7_

  - [x] 10.3 Create ComplianceTable component
    - Display manager name, total direct reports, completed, pending columns
    - Highlight rows with pending > 0
    - Add filter toggle for pending only
    - _Requirements: 9.2, 9.3, 9.4, 9.5, 9.6_

  - [ ]* 10.4 Write property test for HR compliance report accuracy
    - **Property 15: HR Compliance Report Accuracy**
    - Verify all managers with direct reports listed
    - Verify counts are accurate
    - **Validates: Requirements 9.1, 9.2, 9.3, 9.4**

- [x] 11. Implement multi-tenant isolation (Priority Demo Flow Step 4)
  - [x] 11.1 Add company filtering to all data queries
    - Ensure all Prisma queries include company_id filter
    - Verify user's company_id matches queried data
    - Implement query interceptor/wrapper for company scoping
    - _Requirements: 1.5, 1.6_

  - [x] 11.2 Implement company switching for demo
    - Add company indicator in navigation header
    - Support logout and login to different company
    - Verify data isolation between companies
    - _Requirements: 14.5, 1.6_

  - [ ]* 11.3 Write property tests for company isolation
    - **Property 1: Company Data Isolation**
    - Verify queries return only user's company data
    - Verify access to other company data denied
    - **Validates: Requirements 1.5, 1.6**

- [x] 12. Checkpoint - Verify multi-tenant isolation
  - Test data isolation between Ashoka Textiles and Bright Path
  - Ensure no cross-company data leakage
  - Test company switching flow
  - Ask the user if questions arise

- [x] 13. Build application navigation and access control
  - [x] 13.1 Create AppNavigation component
    - Display current user name and company
    - Show navigation links based on user roles
    - Implement dashboard, my-feedback, give-feedback, team, history routes
    - _Requirements: 14.1, 14.5_

  - [x] 13.2 Create HR navigation component
    - Display HR-specific navigation
    - Show dashboard and missing-feedback routes
    - _Requirements: 14.2_

  - [x] 13.3 Implement role-based route protection
    - Redirect non-managers from give-feedback and team routes
    - Redirect non-HR users from HR routes
    - Display access denied message on redirect
    - _Requirements: 10.2, 10.3, 10.4, 14.3, 14.4_

  - [ ]* 13.4 Write property test for role-based route access
    - **Property 10: Role-Based Route Access**
    - Verify route access matches user roles
    - Verify unauthorized access denied
    - **Validates: Requirements 10.2, 10.3, 10.4, 10.6, 14.3, 14.4**

- [x] 14. Build remaining pages and polish
  - [x] 14.1 Create team overview page
    - Create /app/team route for managers
    - Display team members with status summary
    - Link to individual feedback forms
    - _Requirements: 10.3_

  - [x] 14.2 Create HR dashboard page
    - Create /hr/dashboard route
    - Display summary statistics
    - Link to missing feedback report
    - _Requirements: 10.4_

  - [x] 14.3 Create feedback history page
    - Create /app/history route
    - Display extended feedback history with filters
    - Support date range and parameter filtering
    - _Requirements: 8.1, 8.5_

  - [x] 14.4 Add error boundaries and loading states
    - Create error.tsx files for error handling
    - Add loading.tsx files for suspense boundaries
    - Implement user-friendly error messages
    - _Requirements: 15.5_

- [x] 15. Verify hierarchical organization support
  - [x] 15.1 Test Ashoka Textiles scenario
    - Verify Priya sees 6 direct reports
    - Verify Priya can view her own feedback from Rohan
    - Verify Rohan can give feedback to Priya
    - Verify multi-level hierarchy works
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

  - [x] 15.2 Test Bright Path flat organization scenario
    - Verify founder sees all 8 employees as direct reports
    - Verify employees don't need to be managers
    - Verify single manager giving feedback to all works
    - _Requirements: 12.1, 12.2, 12.3, 12.4_

- [x] 16. Final checkpoint - Complete demo flow testing
  - Test full demo flow: Priya login → submit feedback → employee view → HR view → company switch
  - Verify all 16 requirements are satisfied
  - Run all property tests
  - Ask the user if questions arise

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties (16 total)
- Priority is given to the demo flow requirements (end of day deadline)
- All code uses TypeScript throughout as specified in the design

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2"] },
    { "id": 2, "tasks": ["1.3", "2.1"] },
    { "id": 3, "tasks": ["1.4", "2.2"] },
    { "id": 4, "tasks": ["2.3", "2.4"] },
    { "id": 5, "tasks": ["2.5", "4.1", "4.2"] },
    { "id": 6, "tasks": ["4.3", "4.4", "5.1"] },
    { "id": 7, "tasks": ["5.2"] },
    { "id": 8, "tasks": ["5.3"] },
    { "id": 9, "tasks": ["5.4", "5.5", "7.1"] },
    { "id": 10, "tasks": ["7.2", "7.3"] },
    { "id": 11, "tasks": ["8.1"] },
    { "id": 12, "tasks": ["8.2", "8.3"] },
    { "id": 13, "tasks": ["8.4", "10.1"] },
    { "id": 14, "tasks": ["10.2", "10.3"] },
    { "id": 15, "tasks": ["10.4", "11.1"] },
    { "id": 16, "tasks": ["11.2"] },
    { "id": 17, "tasks": ["11.3", "13.1", "13.2"] },
    { "id": 18, "tasks": ["13.3"] },
    { "id": 19, "tasks": ["13.4", "14.1", "14.2"] },
    { "id": 20, "tasks": ["14.3", "14.4"] },
    { "id": 21, "tasks": ["15.1", "15.2"] }
  ]
}
```
