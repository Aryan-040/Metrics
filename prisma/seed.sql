-- Performance Evaluation Tool - Seed Data
-- Run this in Neon's SQL Editor (console.neon.tech)

-- Clear existing data
DELETE FROM "feedback_scores";
DELETE FROM "feedback";
DELETE FROM "feedback_cycles";
DELETE FROM "manager_relationships";
DELETE FROM "feedback_parameters";
DELETE FROM "users";
DELETE FROM "companies";

-- Create feedback parameters
INSERT INTO "feedback_parameters" (id, name, description, display_order) VALUES
  (gen_random_uuid(), 'ownership', 'Takes responsibility for work and outcomes', 1),
  (gen_random_uuid(), 'communication', 'Clearly expresses ideas and keeps stakeholders informed', 2),
  (gen_random_uuid(), 'quality_of_work', 'Delivers accurate, thorough, high-quality work', 3),
  (gen_random_uuid(), 'teamwork', 'Collaborates effectively and supports team members', 4),
  (gen_random_uuid(), 'initiative', 'Proactively seeks opportunities for improvement', 5);

-- Password hash for 'password123'
-- $2b$10$dJivzo9Ttf1YarA9iuPX8u49P74y9q1riStcJN9n90MnoxG1l.bB6

DO $$
DECLARE
  pwd TEXT := '$2b$10$dJivzo9Ttf1YarA9iuPX8u49P74y9q1riStcJN9n90MnoxG1l.bB6';
  ashoka_id UUID;
  bp_id UUID;
  rohan_id UUID;
  priya_id UUID;
  founder_id UUID;
  emp1_id UUID; emp2_id UUID; emp3_id UUID; emp4_id UUID; emp5_id UUID; emp6_id UUID;
  bp1_id UUID; bp2_id UUID; bp3_id UUID; bp4_id UUID; bp5_id UUID; bp6_id UUID; bp7_id UUID; bp8_id UUID;
  c1_id UUID; c2_id UUID; c3_id UUID;
  bc1_id UUID; bc2_id UUID; bc3_id UUID;
  p1_id UUID; p2_id UUID; p3_id UUID; p4_id UUID; p5_id UUID;
  fb_id UUID;
BEGIN
  -- Get parameter IDs
  SELECT id INTO p1_id FROM feedback_parameters WHERE name = 'ownership';
  SELECT id INTO p2_id FROM feedback_parameters WHERE name = 'communication';
  SELECT id INTO p3_id FROM feedback_parameters WHERE name = 'quality_of_work';
  SELECT id INTO p4_id FROM feedback_parameters WHERE name = 'teamwork';
  SELECT id INTO p5_id FROM feedback_parameters WHERE name = 'initiative';

  -- Create companies
  INSERT INTO companies (id, name, created_at, updated_at) VALUES (gen_random_uuid(), 'Ashoka Textiles', NOW(), NOW()) RETURNING id INTO ashoka_id;
  INSERT INTO companies (id, name, created_at, updated_at) VALUES (gen_random_uuid(), 'Bright Path Consulting', NOW(), NOW()) RETURNING id INTO bp_id;

  -- Ashoka Textiles users
  INSERT INTO users (id, company_id, email, password_hash, name, roles, created_at, updated_at)
  VALUES (gen_random_uuid(), ashoka_id, 'rohan@ashoka.com', pwd, 'Rohan Sharma', ARRAY['employee','manager'], NOW(), NOW())
  RETURNING id INTO rohan_id;
  
  INSERT INTO users (id, company_id, email, password_hash, name, roles, created_at, updated_at)
  VALUES (gen_random_uuid(), ashoka_id, 'priya@ashoka.com', pwd, 'Priya Patel', ARRAY['employee','manager'], NOW(), NOW())
  RETURNING id INTO priya_id;
  
  INSERT INTO users (id, company_id, email, password_hash, name, roles, created_at, updated_at)
  VALUES (gen_random_uuid(), ashoka_id, 'hr@ashoka.com', pwd, 'Meera Singh', ARRAY['employee','hr'], NOW(), NOW());

  -- Ashoka employees
  INSERT INTO users (id, company_id, email, password_hash, name, roles, created_at, updated_at)
  VALUES (gen_random_uuid(), ashoka_id, 'amit@ashoka.com', pwd, 'Amit Kumar', ARRAY['employee'], NOW(), NOW()) RETURNING id INTO emp1_id;
  INSERT INTO users (id, company_id, email, password_hash, name, roles, created_at, updated_at)
  VALUES (gen_random_uuid(), ashoka_id, 'neha@ashoka.com', pwd, 'Neha Gupta', ARRAY['employee'], NOW(), NOW()) RETURNING id INTO emp2_id;
  INSERT INTO users (id, company_id, email, password_hash, name, roles, created_at, updated_at)
  VALUES (gen_random_uuid(), ashoka_id, 'vikram@ashoka.com', pwd, 'Vikram Reddy', ARRAY['employee'], NOW(), NOW()) RETURNING id INTO emp3_id;
  INSERT INTO users (id, company_id, email, password_hash, name, roles, created_at, updated_at)
  VALUES (gen_random_uuid(), ashoka_id, 'ananya@ashoka.com', pwd, 'Ananya Iyer', ARRAY['employee'], NOW(), NOW()) RETURNING id INTO emp4_id;
  INSERT INTO users (id, company_id, email, password_hash, name, roles, created_at, updated_at)
  VALUES (gen_random_uuid(), ashoka_id, 'rahul@ashoka.com', pwd, 'Rahul Verma', ARRAY['employee'], NOW(), NOW()) RETURNING id INTO emp5_id;
  INSERT INTO users (id, company_id, email, password_hash, name, roles, created_at, updated_at)
  VALUES (gen_random_uuid(), ashoka_id, 'pooja@ashoka.com', pwd, 'Pooja Desai', ARRAY['employee'], NOW(), NOW()) RETURNING id INTO emp6_id;

  -- Bright Path users
  INSERT INTO users (id, company_id, email, password_hash, name, roles, created_at, updated_at)
  VALUES (gen_random_uuid(), bp_id, 'sarah@brightpath.com', pwd, 'Sarah Johnson', ARRAY['employee','manager'], NOW(), NOW())
  RETURNING id INTO founder_id;
  
  INSERT INTO users (id, company_id, email, password_hash, name, roles, created_at, updated_at)
  VALUES (gen_random_uuid(), bp_id, 'hr@brightpath.com', pwd, 'David Chen', ARRAY['employee','hr'], NOW(), NOW());

  -- Bright Path employees
  INSERT INTO users (id, company_id, email, password_hash, name, roles, created_at, updated_at)
  VALUES (gen_random_uuid(), bp_id, 'michael@brightpath.com', pwd, 'Michael Brown', ARRAY['employee'], NOW(), NOW()) RETURNING id INTO bp1_id;
  INSERT INTO users (id, company_id, email, password_hash, name, roles, created_at, updated_at)
  VALUES (gen_random_uuid(), bp_id, 'emily@brightpath.com', pwd, 'Emily Davis', ARRAY['employee'], NOW(), NOW()) RETURNING id INTO bp2_id;
  INSERT INTO users (id, company_id, email, password_hash, name, roles, created_at, updated_at)
  VALUES (gen_random_uuid(), bp_id, 'james@brightpath.com', pwd, 'James Wilson', ARRAY['employee'], NOW(), NOW()) RETURNING id INTO bp3_id;
  INSERT INTO users (id, company_id, email, password_hash, name, roles, created_at, updated_at)
  VALUES (gen_random_uuid(), bp_id, 'lisa@brightpath.com', pwd, 'Lisa Anderson', ARRAY['employee'], NOW(), NOW()) RETURNING id INTO bp4_id;
  INSERT INTO users (id, company_id, email, password_hash, name, roles, created_at, updated_at)
  VALUES (gen_random_uuid(), bp_id, 'robert@brightpath.com', pwd, 'Robert Martinez', ARRAY['employee'], NOW(), NOW()) RETURNING id INTO bp5_id;
  INSERT INTO users (id, company_id, email, password_hash, name, roles, created_at, updated_at)
  VALUES (gen_random_uuid(), bp_id, 'jennifer@brightpath.com', pwd, 'Jennifer Taylor', ARRAY['employee'], NOW(), NOW()) RETURNING id INTO bp6_id;
  INSERT INTO users (id, company_id, email, password_hash, name, roles, created_at, updated_at)
  VALUES (gen_random_uuid(), bp_id, 'william@brightpath.com', pwd, 'William Thomas', ARRAY['employee'], NOW(), NOW()) RETURNING id INTO bp7_id;
  INSERT INTO users (id, company_id, email, password_hash, name, roles, created_at, updated_at)
  VALUES (gen_random_uuid(), bp_id, 'amanda@brightpath.com', pwd, 'Amanda Garcia', ARRAY['employee'], NOW(), NOW()) RETURNING id INTO bp8_id;

  -- Manager relationships - Ashoka
  INSERT INTO manager_relationships (id, company_id, manager_id, direct_report_id, start_date, created_at)
  VALUES (gen_random_uuid(), ashoka_id, rohan_id, priya_id, '2024-01-01', NOW());
  INSERT INTO manager_relationships (id, company_id, manager_id, direct_report_id, start_date, created_at)
  VALUES (gen_random_uuid(), ashoka_id, priya_id, emp1_id, '2024-01-01', NOW());
  INSERT INTO manager_relationships (id, company_id, manager_id, direct_report_id, start_date, created_at)
  VALUES (gen_random_uuid(), ashoka_id, priya_id, emp2_id, '2024-01-01', NOW());
  INSERT INTO manager_relationships (id, company_id, manager_id, direct_report_id, start_date, created_at)
  VALUES (gen_random_uuid(), ashoka_id, priya_id, emp3_id, '2024-01-01', NOW());
  INSERT INTO manager_relationships (id, company_id, manager_id, direct_report_id, start_date, created_at)
  VALUES (gen_random_uuid(), ashoka_id, priya_id, emp4_id, '2024-01-01', NOW());
  INSERT INTO manager_relationships (id, company_id, manager_id, direct_report_id, start_date, created_at)
  VALUES (gen_random_uuid(), ashoka_id, priya_id, emp5_id, '2024-01-01', NOW());
  INSERT INTO manager_relationships (id, company_id, manager_id, direct_report_id, start_date, created_at)
  VALUES (gen_random_uuid(), ashoka_id, priya_id, emp6_id, '2024-01-01', NOW());

  -- Manager relationships - Bright Path
  INSERT INTO manager_relationships (id, company_id, manager_id, direct_report_id, start_date, created_at)
  VALUES (gen_random_uuid(), bp_id, founder_id, bp1_id, '2024-01-01', NOW());
  INSERT INTO manager_relationships (id, company_id, manager_id, direct_report_id, start_date, created_at)
  VALUES (gen_random_uuid(), bp_id, founder_id, bp2_id, '2024-01-01', NOW());
  INSERT INTO manager_relationships (id, company_id, manager_id, direct_report_id, start_date, created_at)
  VALUES (gen_random_uuid(), bp_id, founder_id, bp3_id, '2024-01-01', NOW());
  INSERT INTO manager_relationships (id, company_id, manager_id, direct_report_id, start_date, created_at)
  VALUES (gen_random_uuid(), bp_id, founder_id, bp4_id, '2024-01-01', NOW());
  INSERT INTO manager_relationships (id, company_id, manager_id, direct_report_id, start_date, created_at)
  VALUES (gen_random_uuid(), bp_id, founder_id, bp5_id, '2024-01-01', NOW());
  INSERT INTO manager_relationships (id, company_id, manager_id, direct_report_id, start_date, created_at)
  VALUES (gen_random_uuid(), bp_id, founder_id, bp6_id, '2024-01-01', NOW());
  INSERT INTO manager_relationships (id, company_id, manager_id, direct_report_id, start_date, created_at)
  VALUES (gen_random_uuid(), bp_id, founder_id, bp7_id, '2024-01-01', NOW());
  INSERT INTO manager_relationships (id, company_id, manager_id, direct_report_id, start_date, created_at)
  VALUES (gen_random_uuid(), bp_id, founder_id, bp8_id, '2024-01-01', NOW());

  -- Feedback cycles - Ashoka
  INSERT INTO feedback_cycles (id, company_id, name, start_date, end_date, created_at)
  VALUES (gen_random_uuid(), ashoka_id, 'June 2026', '2026-06-01', '2026-06-30', NOW()) RETURNING id INTO c1_id;
  INSERT INTO feedback_cycles (id, company_id, name, start_date, end_date, created_at)
  VALUES (gen_random_uuid(), ashoka_id, 'July 2026', '2026-07-01', '2026-07-31', NOW()) RETURNING id INTO c2_id;
  INSERT INTO feedback_cycles (id, company_id, name, start_date, end_date, created_at)
  VALUES (gen_random_uuid(), ashoka_id, 'August 2026', '2026-08-01', '2026-08-31', NOW()) RETURNING id INTO c3_id;

  -- Feedback cycles - Bright Path
  INSERT INTO feedback_cycles (id, company_id, name, start_date, end_date, created_at)
  VALUES (gen_random_uuid(), bp_id, 'June 2026', '2026-06-01', '2026-06-30', NOW()) RETURNING id INTO bc1_id;
  INSERT INTO feedback_cycles (id, company_id, name, start_date, end_date, created_at)
  VALUES (gen_random_uuid(), bp_id, 'July 2026', '2026-07-01', '2026-07-31', NOW()) RETURNING id INTO bc2_id;
  INSERT INTO feedback_cycles (id, company_id, name, start_date, end_date, created_at)
  VALUES (gen_random_uuid(), bp_id, 'August 2026', '2026-08-01', '2026-08-31', NOW()) RETURNING id INTO bc3_id;

  -- HISTORICAL FEEDBACK: Rohan -> Priya (cycles 1 & 2)
  INSERT INTO feedback (id, company_id, manager_id, employee_id, feedback_cycle_id, submitted_at)
  VALUES (gen_random_uuid(), ashoka_id, rohan_id, priya_id, c1_id, '2026-06-28') RETURNING id INTO fb_id;
  INSERT INTO feedback_scores (id, feedback_id, parameter_id, score, justification) VALUES
    (gen_random_uuid(), fb_id, p1_id, 4, 'Strong ownership of projects'),
    (gen_random_uuid(), fb_id, p2_id, 5, 'Excellent communication skills'),
    (gen_random_uuid(), fb_id, p3_id, 4, 'High quality deliverables'),
    (gen_random_uuid(), fb_id, p4_id, 5, 'Great team player'),
    (gen_random_uuid(), fb_id, p5_id, 4, 'Shows good initiative');

  INSERT INTO feedback (id, company_id, manager_id, employee_id, feedback_cycle_id, submitted_at)
  VALUES (gen_random_uuid(), ashoka_id, rohan_id, priya_id, c2_id, '2026-07-28') RETURNING id INTO fb_id;
  INSERT INTO feedback_scores (id, feedback_id, parameter_id, score, justification) VALUES
    (gen_random_uuid(), fb_id, p1_id, 5, 'Exceptional ownership'),
    (gen_random_uuid(), fb_id, p2_id, 4, 'Clear communication'),
    (gen_random_uuid(), fb_id, p3_id, 5, 'Outstanding quality'),
    (gen_random_uuid(), fb_id, p4_id, 4, 'Collaborative spirit'),
    (gen_random_uuid(), fb_id, p5_id, 5, 'Proactive approach');

  -- HISTORICAL FEEDBACK: Priya -> employees (cycles 1 & 2)
  -- Employee 1 (Amit)
  INSERT INTO feedback (id, company_id, manager_id, employee_id, feedback_cycle_id, submitted_at)
  VALUES (gen_random_uuid(), ashoka_id, priya_id, emp1_id, c1_id, '2026-06-28') RETURNING id INTO fb_id;
  INSERT INTO feedback_scores (id, feedback_id, parameter_id, score, justification) VALUES
    (gen_random_uuid(), fb_id, p1_id, 4, 'Good ownership'), (gen_random_uuid(), fb_id, p2_id, 3, 'Adequate communication'),
    (gen_random_uuid(), fb_id, p3_id, 4, 'Quality work'), (gen_random_uuid(), fb_id, p4_id, 5, 'Team player'), (gen_random_uuid(), fb_id, p5_id, 3, 'Room for more initiative');
  INSERT INTO feedback (id, company_id, manager_id, employee_id, feedback_cycle_id, submitted_at)
  VALUES (gen_random_uuid(), ashoka_id, priya_id, emp1_id, c2_id, '2026-07-28') RETURNING id INTO fb_id;
  INSERT INTO feedback_scores (id, feedback_id, parameter_id, score, justification) VALUES
    (gen_random_uuid(), fb_id, p1_id, 4, 'Consistent ownership'), (gen_random_uuid(), fb_id, p2_id, 4, 'Improved communication'),
    (gen_random_uuid(), fb_id, p3_id, 4, 'Solid quality'), (gen_random_uuid(), fb_id, p4_id, 5, 'Excellent teamwork'), (gen_random_uuid(), fb_id, p5_id, 4, 'More proactive');

  -- Employee 2 (Neha)
  INSERT INTO feedback (id, company_id, manager_id, employee_id, feedback_cycle_id, submitted_at)
  VALUES (gen_random_uuid(), ashoka_id, priya_id, emp2_id, c1_id, '2026-06-28') RETURNING id INTO fb_id;
  INSERT INTO feedback_scores (id, feedback_id, parameter_id, score, justification) VALUES
    (gen_random_uuid(), fb_id, p1_id, 5, 'Strong ownership'), (gen_random_uuid(), fb_id, p2_id, 4, 'Good communication'),
    (gen_random_uuid(), fb_id, p3_id, 5, 'Excellent quality'), (gen_random_uuid(), fb_id, p4_id, 4, 'Collaborative'), (gen_random_uuid(), fb_id, p5_id, 4, 'Shows initiative');
  INSERT INTO feedback (id, company_id, manager_id, employee_id, feedback_cycle_id, submitted_at)
  VALUES (gen_random_uuid(), ashoka_id, priya_id, emp2_id, c2_id, '2026-07-28') RETURNING id INTO fb_id;
  INSERT INTO feedback_scores (id, feedback_id, parameter_id, score, justification) VALUES
    (gen_random_uuid(), fb_id, p1_id, 5, 'Excellent ownership'), (gen_random_uuid(), fb_id, p2_id, 5, 'Great communication'),
    (gen_random_uuid(), fb_id, p3_id, 5, 'Top quality'), (gen_random_uuid(), fb_id, p4_id, 5, 'Team leader'), (gen_random_uuid(), fb_id, p5_id, 5, 'Highly proactive');

  -- Employee 3 (Vikram)
  INSERT INTO feedback (id, company_id, manager_id, employee_id, feedback_cycle_id, submitted_at)
  VALUES (gen_random_uuid(), ashoka_id, priya_id, emp3_id, c1_id, '2026-06-28') RETURNING id INTO fb_id;
  INSERT INTO feedback_scores (id, feedback_id, parameter_id, score, justification) VALUES
    (gen_random_uuid(), fb_id, p1_id, 3, 'Developing ownership'), (gen_random_uuid(), fb_id, p2_id, 4, 'Clear communicator'),
    (gen_random_uuid(), fb_id, p3_id, 4, 'Good quality'), (gen_random_uuid(), fb_id, p4_id, 4, 'Works well with others'), (gen_random_uuid(), fb_id, p5_id, 3, 'Needs more initiative');
  INSERT INTO feedback (id, company_id, manager_id, employee_id, feedback_cycle_id, submitted_at)
  VALUES (gen_random_uuid(), ashoka_id, priya_id, emp3_id, c2_id, '2026-07-28') RETURNING id INTO fb_id;
  INSERT INTO feedback_scores (id, feedback_id, parameter_id, score, justification) VALUES
    (gen_random_uuid(), fb_id, p1_id, 4, 'Improved ownership'), (gen_random_uuid(), fb_id, p2_id, 4, 'Consistent communication'),
    (gen_random_uuid(), fb_id, p3_id, 4, 'Quality work'), (gen_random_uuid(), fb_id, p4_id, 5, 'Great team member'), (gen_random_uuid(), fb_id, p5_id, 4, 'Taking more initiative');

  -- Employee 4 (Ananya)
  INSERT INTO feedback (id, company_id, manager_id, employee_id, feedback_cycle_id, submitted_at)
  VALUES (gen_random_uuid(), ashoka_id, priya_id, emp4_id, c1_id, '2026-06-28') RETURNING id INTO fb_id;
  INSERT INTO feedback_scores (id, feedback_id, parameter_id, score, justification) VALUES
    (gen_random_uuid(), fb_id, p1_id, 4, 'Takes responsibility'), (gen_random_uuid(), fb_id, p2_id, 5, 'Excellent communicator'),
    (gen_random_uuid(), fb_id, p3_id, 4, 'High quality'), (gen_random_uuid(), fb_id, p4_id, 4, 'Team player'), (gen_random_uuid(), fb_id, p5_id, 4, 'Good initiative');
  INSERT INTO feedback (id, company_id, manager_id, employee_id, feedback_cycle_id, submitted_at)
  VALUES (gen_random_uuid(), ashoka_id, priya_id, emp4_id, c2_id, '2026-07-28') RETURNING id INTO fb_id;
  INSERT INTO feedback_scores (id, feedback_id, parameter_id, score, justification) VALUES
    (gen_random_uuid(), fb_id, p1_id, 5, 'Strong ownership'), (gen_random_uuid(), fb_id, p2_id, 5, 'Outstanding communication'),
    (gen_random_uuid(), fb_id, p3_id, 5, 'Excellent quality'), (gen_random_uuid(), fb_id, p4_id, 4, 'Collaborative'), (gen_random_uuid(), fb_id, p5_id, 5, 'Highly proactive');

  -- Employee 5 (Rahul)
  INSERT INTO feedback (id, company_id, manager_id, employee_id, feedback_cycle_id, submitted_at)
  VALUES (gen_random_uuid(), ashoka_id, priya_id, emp5_id, c1_id, '2026-06-28') RETURNING id INTO fb_id;
  INSERT INTO feedback_scores (id, feedback_id, parameter_id, score, justification) VALUES
    (gen_random_uuid(), fb_id, p1_id, 4, 'Good ownership'), (gen_random_uuid(), fb_id, p2_id, 3, 'Can improve communication'),
    (gen_random_uuid(), fb_id, p3_id, 5, 'Excellent quality'), (gen_random_uuid(), fb_id, p4_id, 4, 'Works well in team'), (gen_random_uuid(), fb_id, p5_id, 4, 'Shows initiative');
  INSERT INTO feedback (id, company_id, manager_id, employee_id, feedback_cycle_id, submitted_at)
  VALUES (gen_random_uuid(), ashoka_id, priya_id, emp5_id, c2_id, '2026-07-28') RETURNING id INTO fb_id;
  INSERT INTO feedback_scores (id, feedback_id, parameter_id, score, justification) VALUES
    (gen_random_uuid(), fb_id, p1_id, 4, 'Consistent'), (gen_random_uuid(), fb_id, p2_id, 4, 'Better communication'),
    (gen_random_uuid(), fb_id, p3_id, 5, 'Top quality'), (gen_random_uuid(), fb_id, p4_id, 4, 'Team contributor'), (gen_random_uuid(), fb_id, p5_id, 4, 'Proactive');

  -- Employee 6 (Pooja)
  INSERT INTO feedback (id, company_id, manager_id, employee_id, feedback_cycle_id, submitted_at)
  VALUES (gen_random_uuid(), ashoka_id, priya_id, emp6_id, c1_id, '2026-06-28') RETURNING id INTO fb_id;
  INSERT INTO feedback_scores (id, feedback_id, parameter_id, score, justification) VALUES
    (gen_random_uuid(), fb_id, p1_id, 5, 'Strong ownership'), (gen_random_uuid(), fb_id, p2_id, 4, 'Good communication'),
    (gen_random_uuid(), fb_id, p3_id, 4, 'Quality work'), (gen_random_uuid(), fb_id, p4_id, 5, 'Excellent team player'), (gen_random_uuid(), fb_id, p5_id, 5, 'Very proactive');
  INSERT INTO feedback (id, company_id, manager_id, employee_id, feedback_cycle_id, submitted_at)
  VALUES (gen_random_uuid(), ashoka_id, priya_id, emp6_id, c2_id, '2026-07-28') RETURNING id INTO fb_id;
  INSERT INTO feedback_scores (id, feedback_id, parameter_id, score, justification) VALUES
    (gen_random_uuid(), fb_id, p1_id, 5, 'Excellent ownership'), (gen_random_uuid(), fb_id, p2_id, 5, 'Great communicator'),
    (gen_random_uuid(), fb_id, p3_id, 5, 'Outstanding quality'), (gen_random_uuid(), fb_id, p4_id, 5, 'Team leader'), (gen_random_uuid(), fb_id, p5_id, 5, 'Highly initiative');

  -- CURRENT CYCLE (August 2026): Priya -> 3 of 6 employees (partial)
  INSERT INTO feedback (id, company_id, manager_id, employee_id, feedback_cycle_id, submitted_at)
  VALUES (gen_random_uuid(), ashoka_id, priya_id, emp1_id, c3_id, '2026-08-10') RETURNING id INTO fb_id;
  INSERT INTO feedback_scores (id, feedback_id, parameter_id, score, justification) VALUES
    (gen_random_uuid(), fb_id, p1_id, 4, 'Good progress'), (gen_random_uuid(), fb_id, p2_id, 4, 'Clear communication'),
    (gen_random_uuid(), fb_id, p3_id, 4, 'Quality maintained'), (gen_random_uuid(), fb_id, p4_id, 5, 'Team player'), (gen_random_uuid(), fb_id, p5_id, 4, 'Proactive');

  INSERT INTO feedback (id, company_id, manager_id, employee_id, feedback_cycle_id, submitted_at)
  VALUES (gen_random_uuid(), ashoka_id, priya_id, emp2_id, c3_id, '2026-08-10') RETURNING id INTO fb_id;
  INSERT INTO feedback_scores (id, feedback_id, parameter_id, score, justification) VALUES
    (gen_random_uuid(), fb_id, p1_id, 5, 'Excellent ownership'), (gen_random_uuid(), fb_id, p2_id, 5, 'Outstanding communication'),
    (gen_random_uuid(), fb_id, p3_id, 5, 'Top quality'), (gen_random_uuid(), fb_id, p4_id, 5, 'Team leader'), (gen_random_uuid(), fb_id, p5_id, 5, 'Very proactive');

  INSERT INTO feedback (id, company_id, manager_id, employee_id, feedback_cycle_id, submitted_at)
  VALUES (gen_random_uuid(), ashoka_id, priya_id, emp3_id, c3_id, '2026-08-10') RETURNING id INTO fb_id;
  INSERT INTO feedback_scores (id, feedback_id, parameter_id, score, justification) VALUES
    (gen_random_uuid(), fb_id, p1_id, 4, 'Improved'), (gen_random_uuid(), fb_id, p2_id, 4, 'Better communication'),
    (gen_random_uuid(), fb_id, p3_id, 4, 'Good quality'), (gen_random_uuid(), fb_id, p4_id, 5, 'Great teamwork'), (gen_random_uuid(), fb_id, p5_id, 4, 'More initiative');
  -- Note: emp4, emp5, emp6 pending for current cycle
  -- Note: Rohan -> Priya also pending for current cycle

  -- BRIGHT PATH: Founder -> employees (cycles 1 & 2)
  -- BP Employee 1
  INSERT INTO feedback (id, company_id, manager_id, employee_id, feedback_cycle_id, submitted_at)
  VALUES (gen_random_uuid(), bp_id, founder_id, bp1_id, bc1_id, '2026-06-28') RETURNING id INTO fb_id;
  INSERT INTO feedback_scores (id, feedback_id, parameter_id, score, justification) VALUES
    (gen_random_uuid(), fb_id, p1_id, 4, 'Good ownership'), (gen_random_uuid(), fb_id, p2_id, 4, 'Clear communication'),
    (gen_random_uuid(), fb_id, p3_id, 4, 'Quality work'), (gen_random_uuid(), fb_id, p4_id, 4, 'Team player'), (gen_random_uuid(), fb_id, p5_id, 4, 'Shows initiative');
  INSERT INTO feedback (id, company_id, manager_id, employee_id, feedback_cycle_id, submitted_at)
  VALUES (gen_random_uuid(), bp_id, founder_id, bp1_id, bc2_id, '2026-07-28') RETURNING id INTO fb_id;
  INSERT INTO feedback_scores (id, feedback_id, parameter_id, score, justification) VALUES
    (gen_random_uuid(), fb_id, p1_id, 4, 'Consistent'), (gen_random_uuid(), fb_id, p2_id, 5, 'Great communication'),
    (gen_random_uuid(), fb_id, p3_id, 4, 'Good quality'), (gen_random_uuid(), fb_id, p4_id, 5, 'Excellent team'), (gen_random_uuid(), fb_id, p5_id, 4, 'Proactive');

  -- BP Employee 2
  INSERT INTO feedback (id, company_id, manager_id, employee_id, feedback_cycle_id, submitted_at)
  VALUES (gen_random_uuid(), bp_id, founder_id, bp2_id, bc1_id, '2026-06-28') RETURNING id INTO fb_id;
  INSERT INTO feedback_scores (id, feedback_id, parameter_id, score, justification) VALUES
    (gen_random_uuid(), fb_id, p1_id, 5, 'Strong ownership'), (gen_random_uuid(), fb_id, p2_id, 4, 'Good communication'),
    (gen_random_uuid(), fb_id, p3_id, 5, 'Excellent quality'), (gen_random_uuid(), fb_id, p4_id, 4, 'Collaborative'), (gen_random_uuid(), fb_id, p5_id, 5, 'Very proactive');
  INSERT INTO feedback (id, company_id, manager_id, employee_id, feedback_cycle_id, submitted_at)
  VALUES (gen_random_uuid(), bp_id, founder_id, bp2_id, bc2_id, '2026-07-28') RETURNING id INTO fb_id;
  INSERT INTO feedback_scores (id, feedback_id, parameter_id, score, justification) VALUES
    (gen_random_uuid(), fb_id, p1_id, 5, 'Excellent'), (gen_random_uuid(), fb_id, p2_id, 5, 'Outstanding'),
    (gen_random_uuid(), fb_id, p3_id, 5, 'Top quality'), (gen_random_uuid(), fb_id, p4_id, 5, 'Team leader'), (gen_random_uuid(), fb_id, p5_id, 5, 'Highly proactive');

  -- BP Employees 3-8 (cycles 1 & 2)
  INSERT INTO feedback (id, company_id, manager_id, employee_id, feedback_cycle_id, submitted_at)
  VALUES (gen_random_uuid(), bp_id, founder_id, bp3_id, bc1_id, '2026-06-28') RETURNING id INTO fb_id;
  INSERT INTO feedback_scores (id, feedback_id, parameter_id, score, justification) VALUES
    (gen_random_uuid(), fb_id, p1_id, 4, 'Good'), (gen_random_uuid(), fb_id, p2_id, 4, 'Clear'), (gen_random_uuid(), fb_id, p3_id, 4, 'Quality'), (gen_random_uuid(), fb_id, p4_id, 4, 'Team'), (gen_random_uuid(), fb_id, p5_id, 3, 'Developing');
  INSERT INTO feedback (id, company_id, manager_id, employee_id, feedback_cycle_id, submitted_at)
  VALUES (gen_random_uuid(), bp_id, founder_id, bp3_id, bc2_id, '2026-07-28') RETURNING id INTO fb_id;
  INSERT INTO feedback_scores (id, feedback_id, parameter_id, score, justification) VALUES
    (gen_random_uuid(), fb_id, p1_id, 4, 'Good'), (gen_random_uuid(), fb_id, p2_id, 4, 'Clear'), (gen_random_uuid(), fb_id, p3_id, 5, 'Improved'), (gen_random_uuid(), fb_id, p4_id, 4, 'Team'), (gen_random_uuid(), fb_id, p5_id, 4, 'Better');

  INSERT INTO feedback (id, company_id, manager_id, employee_id, feedback_cycle_id, submitted_at)
  VALUES (gen_random_uuid(), bp_id, founder_id, bp4_id, bc1_id, '2026-06-28') RETURNING id INTO fb_id;
  INSERT INTO feedback_scores (id, feedback_id, parameter_id, score, justification) VALUES
    (gen_random_uuid(), fb_id, p1_id, 5, 'Strong'), (gen_random_uuid(), fb_id, p2_id, 4, 'Good'), (gen_random_uuid(), fb_id, p3_id, 4, 'Quality'), (gen_random_uuid(), fb_id, p4_id, 5, 'Excellent'), (gen_random_uuid(), fb_id, p5_id, 4, 'Proactive');
  INSERT INTO feedback (id, company_id, manager_id, employee_id, feedback_cycle_id, submitted_at)
  VALUES (gen_random_uuid(), bp_id, founder_id, bp4_id, bc2_id, '2026-07-28') RETURNING id INTO fb_id;
  INSERT INTO feedback_scores (id, feedback_id, parameter_id, score, justification) VALUES
    (gen_random_uuid(), fb_id, p1_id, 5, 'Strong'), (gen_random_uuid(), fb_id, p2_id, 5, 'Great'), (gen_random_uuid(), fb_id, p3_id, 5, 'Excellent'), (gen_random_uuid(), fb_id, p4_id, 5, 'Leader'), (gen_random_uuid(), fb_id, p5_id, 5, 'Very proactive');

  INSERT INTO feedback (id, company_id, manager_id, employee_id, feedback_cycle_id, submitted_at)
  VALUES (gen_random_uuid(), bp_id, founder_id, bp5_id, bc1_id, '2026-06-28') RETURNING id INTO fb_id;
  INSERT INTO feedback_scores (id, feedback_id, parameter_id, score, justification) VALUES
    (gen_random_uuid(), fb_id, p1_id, 3, 'Developing'), (gen_random_uuid(), fb_id, p2_id, 4, 'Good'), (gen_random_uuid(), fb_id, p3_id, 4, 'Quality'), (gen_random_uuid(), fb_id, p4_id, 4, 'Team'), (gen_random_uuid(), fb_id, p5_id, 3, 'Room to grow');
  INSERT INTO feedback (id, company_id, manager_id, employee_id, feedback_cycle_id, submitted_at)
  VALUES (gen_random_uuid(), bp_id, founder_id, bp5_id, bc2_id, '2026-07-28') RETURNING id INTO fb_id;
  INSERT INTO feedback_scores (id, feedback_id, parameter_id, score, justification) VALUES
    (gen_random_uuid(), fb_id, p1_id, 4, 'Improved'), (gen_random_uuid(), fb_id, p2_id, 4, 'Good'), (gen_random_uuid(), fb_id, p3_id, 4, 'Consistent'), (gen_random_uuid(), fb_id, p4_id, 4, 'Team'), (gen_random_uuid(), fb_id, p5_id, 4, 'Better');

  INSERT INTO feedback (id, company_id, manager_id, employee_id, feedback_cycle_id, submitted_at)
  VALUES (gen_random_uuid(), bp_id, founder_id, bp6_id, bc1_id, '2026-06-28') RETURNING id INTO fb_id;
  INSERT INTO feedback_scores (id, feedback_id, parameter_id, score, justification) VALUES
    (gen_random_uuid(), fb_id, p1_id, 4, 'Good'), (gen_random_uuid(), fb_id, p2_id, 5, 'Excellent'), (gen_random_uuid(), fb_id, p3_id, 4, 'Quality'), (gen_random_uuid(), fb_id, p4_id, 4, 'Team'), (gen_random_uuid(), fb_id, p5_id, 4, 'Proactive');
  INSERT INTO feedback (id, company_id, manager_id, employee_id, feedback_cycle_id, submitted_at)
  VALUES (gen_random_uuid(), bp_id, founder_id, bp6_id, bc2_id, '2026-07-28') RETURNING id INTO fb_id;
  INSERT INTO feedback_scores (id, feedback_id, parameter_id, score, justification) VALUES
    (gen_random_uuid(), fb_id, p1_id, 5, 'Strong'), (gen_random_uuid(), fb_id, p2_id, 5, 'Excellent'), (gen_random_uuid(), fb_id, p3_id, 5, 'Top'), (gen_random_uuid(), fb_id, p4_id, 5, 'Leader'), (gen_random_uuid(), fb_id, p5_id, 5, 'Very proactive');

  INSERT INTO feedback (id, company_id, manager_id, employee_id, feedback_cycle_id, submitted_at)
  VALUES (gen_random_uuid(), bp_id, founder_id, bp7_id, bc1_id, '2026-06-28') RETURNING id INTO fb_id;
  INSERT INTO feedback_scores (id, feedback_id, parameter_id, score, justification) VALUES
    (gen_random_uuid(), fb_id, p1_id, 4, 'Good'), (gen_random_uuid(), fb_id, p2_id, 3, 'Needs improvement'), (gen_random_uuid(), fb_id, p3_id, 4, 'Quality'), (gen_random_uuid(), fb_id, p4_id, 4, 'Team'), (gen_random_uuid(), fb_id, p5_id, 4, 'Initiative');
  INSERT INTO feedback (id, company_id, manager_id, employee_id, feedback_cycle_id, submitted_at)
  VALUES (gen_random_uuid(), bp_id, founder_id, bp7_id, bc2_id, '2026-07-28') RETURNING id INTO fb_id;
  INSERT INTO feedback_scores (id, feedback_id, parameter_id, score, justification) VALUES
    (gen_random_uuid(), fb_id, p1_id, 4, 'Good'), (gen_random_uuid(), fb_id, p2_id, 4, 'Better'), (gen_random_uuid(), fb_id, p3_id, 4, 'Quality'), (gen_random_uuid(), fb_id, p4_id, 5, 'Excellent'), (gen_random_uuid(), fb_id, p5_id, 4, 'Proactive');

  INSERT INTO feedback (id, company_id, manager_id, employee_id, feedback_cycle_id, submitted_at)
  VALUES (gen_random_uuid(), bp_id, founder_id, bp8_id, bc1_id, '2026-06-28') RETURNING id INTO fb_id;
  INSERT INTO feedback_scores (id, feedback_id, parameter_id, score, justification) VALUES
    (gen_random_uuid(), fb_id, p1_id, 5, 'Strong'), (gen_random_uuid(), fb_id, p2_id, 4, 'Good'), (gen_random_uuid(), fb_id, p3_id, 5, 'Excellent'), (gen_random_uuid(), fb_id, p4_id, 4, 'Team'), (gen_random_uuid(), fb_id, p5_id, 5, 'Very proactive');
  INSERT INTO feedback (id, company_id, manager_id, employee_id, feedback_cycle_id, submitted_at)
  VALUES (gen_random_uuid(), bp_id, founder_id, bp8_id, bc2_id, '2026-07-28') RETURNING id INTO fb_id;
  INSERT INTO feedback_scores (id, feedback_id, parameter_id, score, justification) VALUES
    (gen_random_uuid(), fb_id, p1_id, 5, 'Excellent'), (gen_random_uuid(), fb_id, p2_id, 5, 'Outstanding'), (gen_random_uuid(), fb_id, p3_id, 5, 'Top'), (gen_random_uuid(), fb_id, p4_id, 5, 'Leader'), (gen_random_uuid(), fb_id, p5_id, 5, 'Highly proactive');

  -- BRIGHT PATH CURRENT CYCLE (August 2026): 4 of 8 employees (partial)
  INSERT INTO feedback (id, company_id, manager_id, employee_id, feedback_cycle_id, submitted_at)
  VALUES (gen_random_uuid(), bp_id, founder_id, bp1_id, bc3_id, '2026-08-10') RETURNING id INTO fb_id;
  INSERT INTO feedback_scores (id, feedback_id, parameter_id, score, justification) VALUES
    (gen_random_uuid(), fb_id, p1_id, 4, 'Good'), (gen_random_uuid(), fb_id, p2_id, 5, 'Great'), (gen_random_uuid(), fb_id, p3_id, 4, 'Quality'), (gen_random_uuid(), fb_id, p4_id, 5, 'Excellent'), (gen_random_uuid(), fb_id, p5_id, 4, 'Proactive');

  INSERT INTO feedback (id, company_id, manager_id, employee_id, feedback_cycle_id, submitted_at)
  VALUES (gen_random_uuid(), bp_id, founder_id, bp2_id, bc3_id, '2026-08-10') RETURNING id INTO fb_id;
  INSERT INTO feedback_scores (id, feedback_id, parameter_id, score, justification) VALUES
    (gen_random_uuid(), fb_id, p1_id, 5, 'Excellent'), (gen_random_uuid(), fb_id, p2_id, 5, 'Outstanding'), (gen_random_uuid(), fb_id, p3_id, 5, 'Top'), (gen_random_uuid(), fb_id, p4_id, 5, 'Leader'), (gen_random_uuid(), fb_id, p5_id, 5, 'Very proactive');

  INSERT INTO feedback (id, company_id, manager_id, employee_id, feedback_cycle_id, submitted_at)
  VALUES (gen_random_uuid(), bp_id, founder_id, bp3_id, bc3_id, '2026-08-10') RETURNING id INTO fb_id;
  INSERT INTO feedback_scores (id, feedback_id, parameter_id, score, justification) VALUES
    (gen_random_uuid(), fb_id, p1_id, 4, 'Good'), (gen_random_uuid(), fb_id, p2_id, 4, 'Clear'), (gen_random_uuid(), fb_id, p3_id, 5, 'Excellent'), (gen_random_uuid(), fb_id, p4_id, 4, 'Team'), (gen_random_uuid(), fb_id, p5_id, 4, 'Proactive');

  INSERT INTO feedback (id, company_id, manager_id, employee_id, feedback_cycle_id, submitted_at)
  VALUES (gen_random_uuid(), bp_id, founder_id, bp4_id, bc3_id, '2026-08-10') RETURNING id INTO fb_id;
  INSERT INTO feedback_scores (id, feedback_id, parameter_id, score, justification) VALUES
    (gen_random_uuid(), fb_id, p1_id, 5, 'Strong'), (gen_random_uuid(), fb_id, p2_id, 5, 'Great'), (gen_random_uuid(), fb_id, p3_id, 5, 'Excellent'), (gen_random_uuid(), fb_id, p4_id, 5, 'Leader'), (gen_random_uuid(), fb_id, p5_id, 5, 'Very proactive');

  -- Note: bp5, bp6, bp7, bp8 pending for current cycle

  RAISE NOTICE 'Seed completed successfully!';
END $$;

-- Verify counts
SELECT 'companies' as table_name, COUNT(*) as count FROM companies
UNION ALL SELECT 'users', COUNT(*) FROM users
UNION ALL SELECT 'manager_relationships', COUNT(*) FROM manager_relationships
UNION ALL SELECT 'feedback_parameters', COUNT(*) FROM feedback_parameters
UNION ALL SELECT 'feedback_cycles', COUNT(*) FROM feedback_cycles
UNION ALL SELECT 'feedback', COUNT(*) FROM feedback
UNION ALL SELECT 'feedback_scores', COUNT(*) FROM feedback_scores;
