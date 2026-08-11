# Requirements Document

## Introduction

The Performance Evaluation Tool is a multi-tenant web application that enables managers to provide structured monthly feedback to their team members. Feedback is organized across 5 fixed parameters (ownership, communication, quality of work, teamwork, and initiative), with each parameter receiving both a numerical score and written justification. The system supports different organizational structures—from hierarchical setups with middle management to flat organizations where founders give feedback directly.

## Glossary

- **Company**: A tenant organization using the system; all data is isolated per company
- **User**: An employee within a company who can give and/or receive feedback
- **Manager**: A User who has direct reports and is responsible for giving them feedback
- **Direct_Report**: A User who reports to a Manager and receives feedback from them
- **Manager_Relationship**: A record linking a Manager to their Direct_Report within a Company
- **Feedback_Cycle**: A monthly period during which feedback is collected (e.g., "January 2025")
- **Feedback**: A single feedback submission from a Manager to a Direct_Report for a specific Feedback_Cycle
- **Feedback_Parameter**: One of the 5 fixed evaluation criteria (ownership, communication, quality_of_work, teamwork, initiative)
- **Feedback_Score**: A score and justification for a single Feedback_Parameter within a Feedback submission
- **HR_User**: A User with HR role privileges who can monitor feedback submission compliance
- **Employee_App**: The application interface for managers and employees to give/receive feedback
- **HR_App**: The application interface for HR users to monitor feedback compliance

## Requirements

### Requirement 1: Multi-Tenant Company Isolation

**User Story:** As a system administrator, I want all data to be isolated by company, so that tenants cannot access each other's data.

#### Acceptance Criteria

1. THE System SHALL associate every User with exactly one Company
2. THE System SHALL associate every Manager_Relationship with exactly one Company
3. THE System SHALL associate every Feedback_Cycle with exactly one Company
4. THE System SHALL associate every Feedback with exactly one Company
5. WHEN a User queries data, THE System SHALL return only data belonging to the User's Company
6. THE System SHALL prevent Users from accessing data belonging to other Companies

---

### Requirement 2: User Authentication

**User Story:** As a user, I want to log in with my credentials, so that I can access my company's performance evaluation system.

#### Acceptance Criteria

1. WHEN a User provides valid credentials, THE System SHALL authenticate the User and create a session
2. WHEN a User provides invalid credentials, THE System SHALL reject the login attempt and display an error message
3. THE System SHALL support seeded user accounts for demonstration purposes
4. WHEN a User is authenticated, THE System SHALL determine and store the User's role (employee, manager, HR)
5. WHEN a User logs out, THE System SHALL terminate the session and redirect to the login page

---

### Requirement 3: Manager Relationship Management

**User Story:** As a system, I want to track who reports to whom, so that managers can give feedback to their direct reports.

#### Acceptance Criteria

1. THE System SHALL store Manager_Relationships as separate records from User records
2. THE System SHALL allow a User to be both a Manager (has direct reports) and a Direct_Report (reports to someone else)
3. THE System SHALL associate each Manager_Relationship with a start_date
4. WHERE a Manager_Relationship has ended, THE System SHALL store an end_date
5. WHEN querying active direct reports, THE System SHALL return only Manager_Relationships where end_date is null or in the future
6. THE System SHALL allow a User to have zero or more direct reports
7. THE System SHALL allow a User to have zero or one active manager

---

### Requirement 4: Feedback Cycle Management

**User Story:** As an HR administrator, I want to define monthly feedback cycles, so that feedback is collected on a regular schedule.

#### Acceptance Criteria

1. THE System SHALL represent each Feedback_Cycle with a name, start_date, and end_date
2. THE System SHALL associate each Feedback_Cycle with exactly one Company
3. WHEN a new month begins, THE System SHALL allow creation of a new Feedback_Cycle for that month
4. THE System SHALL prevent creation of overlapping Feedback_Cycles within the same Company
5. WHEN querying the current Feedback_Cycle, THE System SHALL return the cycle where the current date falls between start_date and end_date

---

### Requirement 5: Feedback Parameter Definition

**User Story:** As a product owner, I want 5 fixed evaluation parameters, so that feedback is consistent across the organization.

#### Acceptance Criteria

1. THE System SHALL define exactly 5 Feedback_Parameters: ownership, communication, quality_of_work, teamwork, initiative
2. THE System SHALL store Feedback_Parameters with a name and description
3. THE System SHALL use the same Feedback_Parameters across all Companies
4. THE System SHALL store Feedback_Scores in a normalized table (one row per parameter per feedback) rather than as columns

---

### Requirement 6: Feedback Submission

**User Story:** As a manager, I want to submit monthly feedback for each of my direct reports, so that they receive structured performance evaluations.

#### Acceptance Criteria

1. WHEN a Manager submits Feedback, THE System SHALL create one Feedback record linking the Manager, Direct_Report, and Feedback_Cycle
2. WHEN a Manager submits Feedback, THE System SHALL require exactly 5 Feedback_Scores (one per Feedback_Parameter)
3. FOR EACH Feedback_Score, THE System SHALL require a numerical score between 1 and 5 (inclusive)
4. FOR EACH Feedback_Score, THE System SHALL require a written justification (non-empty text)
5. THE System SHALL prevent a Manager from submitting more than one Feedback for the same Direct_Report in the same Feedback_Cycle
6. WHEN Feedback is submitted, THE System SHALL record the submission timestamp
7. THE System SHALL allow Feedback submission only for Users who are active Direct_Reports of the submitting Manager

---

### Requirement 7: Manager Dashboard - Pending Feedback View

**User Story:** As a manager, I want to see which team members still need feedback this month, so that I can complete my evaluations.

#### Acceptance Criteria

1. WHEN a Manager views the dashboard, THE System SHALL display a list of Direct_Reports requiring feedback for the current Feedback_Cycle
2. THE System SHALL use a positive visual indicator (such as a checkmark or 'Complete' status) to indicate which Direct_Reports have already received feedback this cycle
3. THE System SHALL indicate which Direct_Reports still need feedback this cycle
4. WHEN a Manager clicks on a Direct_Report, THE System SHALL navigate to the feedback submission form for that person, regardless of whether feedback has already been submitted for that Direct_Report
5. WHEN all Direct_Reports have received feedback, THE System SHALL display a completion message

---

### Requirement 8: Employee Feedback History View

**User Story:** As an employee, I want to see my feedback scores over past months, so that I can track my performance trends.

#### Acceptance Criteria

1. WHEN an Employee views their feedback history, THE System SHALL display all Feedback received across past Feedback_Cycles
2. FOR EACH Feedback, THE System SHALL display the Feedback_Cycle name (month/year)
3. FOR EACH Feedback, THE System SHALL display scores and justifications for all 5 Feedback_Parameters
4. THE System SHALL display feedback history in reverse chronological order (most recent first)
5. THE System SHALL allow filtering feedback history by Feedback_Parameter to see trends for a specific criterion
6. THE System SHALL display the Manager who provided each Feedback (name only, not detailed information)

---

### Requirement 9: HR Compliance Monitoring

**User Story:** As an HR lead, I want to see which managers haven't submitted feedback yet this month, so that I can follow up with them.

#### Acceptance Criteria

1. WHEN an HR_User views the missing feedback report, THE System SHALL display all Managers who have at least one Direct_Report
2. FOR EACH Manager, THE System SHALL indicate the count of Direct_Reports requiring feedback
3. FOR EACH Manager, THE System SHALL indicate the count of Feedback submissions completed this cycle
4. FOR EACH Manager, THE System SHALL indicate the count of Feedback submissions pending this cycle
5. THE System SHALL highlight Managers with pending feedback submissions
6. THE System SHALL allow filtering to show only Managers with pending feedback
7. WHEN all Managers have completed feedback, THE System SHALL display a completion message

---

### Requirement 10: Role-Based Access Control

**User Story:** As a system administrator, I want users to access only features appropriate to their role, so that data remains secure.

#### Acceptance Criteria

1. THE System SHALL support three roles: employee, manager, HR
2. WHEN a User has only the employee role, THE System SHALL allow access to personal feedback history only
3. WHEN a User with the manager role explicitly attempts to access give-feedback or team views, THE System SHALL permit navigation and allow submission of feedback for the User's direct reports
4. WHEN a User with the HR role explicitly attempts to access the HR compliance dashboard, THE System SHALL permit navigation and data retrieval
5. THE System SHALL allow a User to have multiple roles (e.g., a manager who is also an employee can view their own feedback and give feedback to others)
6. WHEN a User attempts to access a feature outside their role permissions, THE System SHALL deny access and display an error message

---

### Requirement 11: Hierarchical Organization Support (Ashoka Textiles Scenario)

**User Story:** As a company with middle management, I want managers at different levels to both give and receive feedback, so that the entire management chain is evaluated.

#### Acceptance Criteria

1. THE System SHALL allow a User to be a Manager who gives feedback AND a Direct_Report who receives feedback simultaneously
2. WHEN Priya (middle manager) logs in, THE System SHALL show her direct reports for giving feedback
3. WHEN Priya (middle manager) views her feedback history, THE System SHALL show feedback received from her manager (Rohan)
4. THE System SHALL correctly track that Rohan gives feedback to Priya, and Priya gives feedback to her 6 team members
5. THE System SHALL support unlimited levels of management hierarchy

---

### Requirement 12: Flat Organization Support (Bright Path Consulting Scenario)

**User Story:** As a company with flat structure, I want the founder to give feedback directly to all employees, so that no middle management layer is required.

#### Acceptance Criteria

1. THE System SHALL allow a single Manager to have many Direct_Reports (8 or more)
2. WHEN the founder logs in, THE System SHALL show all 8 employees as direct reports requiring feedback
3. THE System SHALL not require any employee to also be a manager
4. THE System SHALL support organizations where only one person gives feedback

---

### Requirement 13: Seed Data Requirements

**User Story:** As a developer, I want pre-populated demo data, so that the system can be demonstrated immediately after deployment.

#### Acceptance Criteria

1. THE System SHALL include seed data for at least two Companies
2. FOR Ashoka Textiles (Company 1), THE System SHALL seed: Priya (manager with 6 direct reports), Rohan (manager of Priya), and 6 employees reporting to Priya
3. FOR Bright Path Consulting (Company 2), THE System SHALL seed: 1 founder and 8 employees reporting directly to the founder
4. THE System SHALL seed at least one HR_User per Company
5. THE System SHALL seed at least 2 completed Feedback_Cycles with historical Feedback data
6. THE System SHALL seed the current month as an active Feedback_Cycle with partial completion (some feedback submitted, some pending)
7. THE System SHALL seed user credentials that allow login without additional setup

---

### Requirement 14: Application Navigation Structure

**User Story:** As a user, I want clear navigation between app sections, so that I can easily access different features.

#### Acceptance Criteria

1. THE Employee_App SHALL provide navigation to: dashboard, my-feedback, give-feedback (if manager), team (if manager), history
2. THE HR_App SHALL provide navigation to: dashboard, missing-feedback
3. WHEN a non-manager User accesses give-feedback or team routes, THE System SHALL redirect to the dashboard with an access denied message
4. WHEN a non-HR User attempts to access HR routes, THE System SHALL always redirect to the employee dashboard and display an access denied message
5. THE System SHALL display the current User's name and Company in the navigation header

---

### Requirement 15: Feedback Form Validation

**User Story:** As a manager, I want the feedback form to validate my input, so that I submit complete and valid evaluations.

#### Acceptance Criteria

1. WHEN a Manager attempts to submit Feedback without scores for all 5 parameters, THE System SHALL prevent submission and highlight missing fields
2. WHEN a Manager enters a score outside the range 1-5, THE System SHALL display a validation error
3. WHEN a Manager attempts to submit Feedback without justification for any parameter, THE System SHALL prevent submission and highlight missing fields
4. WHEN a Manager submits valid Feedback, THE System SHALL display a success confirmation and SHALL NOT display any error messages
5. IF the submission fails due to a server error, THEN THE System SHALL display an error message and preserve the entered data

---

### Requirement 16: Data Model Integrity

**User Story:** As a system architect, I want the data model to enforce referential integrity, so that data remains consistent.

#### Acceptance Criteria

1. THE Database SHALL enforce foreign key constraints between Feedback and User (both manager and employee)
2. THE Database SHALL enforce foreign key constraints between Feedback and Feedback_Cycle
3. THE Database SHALL enforce foreign key constraints between Feedback_Score and Feedback
4. THE Database SHALL enforce foreign key constraints between Feedback_Score and Feedback_Parameter
5. THE Database SHALL enforce foreign key constraints between Manager_Relationship and User (both manager and direct report)
6. THE Database SHALL enforce foreign key constraints between User and Company
7. THE Database SHALL cascade deletes selectively: Feedback deletion SHALL cascade to Feedback_Score records; Feedback_Cycle deletion SHALL cascade to Feedback records; User and Company deletions SHALL be restricted when referenced by other records to prevent orphaned data
