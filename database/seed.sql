-- ===========================================
-- Velora Sample Data
-- ===========================================

-- ===========================================
-- Users
-- ===========================================

INSERT INTO users (
    name,
    email,
    password,
    university,
    major,
    year,
    graduation_year,
    profile_photo
)
VALUES
(
    'Tapasya Raghuwanshi',
    'tapasyaraghuwanshi0726@gmail.com',
    'hashed_password',
    'UPES',
    'Cloud Computing',
    2,
    2028,
    NULL
),
(
    'Raghav Sharma',
    'raghav.sharma@gmail.com',
    'hashed_password',
    'UPES',
    'Computer Science',
    3,
    2027,
    NULL
),
(
    'Priya Verma',
    'priya.verma@gmail.com',
    'hashed_password',
    'UPES',
    'Artificial Intelligence',
    1,
    2029,
    NULL
);

-- ===========================================
-- Resume
-- ===========================================

INSERT INTO resume (
    user_id,
    summary
)
VALUES
(
    1,
    'Cloud Computing student at UPES passionate about full-stack development, PostgreSQL and the MERN stack.'
),
(
    2,
    'Computer Science student interested in Java, backend development and software engineering.'
);

-- ===========================================
-- Education
-- ===========================================

INSERT INTO education (
    resume_id,
    institution,
    degree,
    cgpa,
    start_year,
    end_year
)
VALUES
(
    1,
    'University of Petroleum and Energy Studies (UPES)',
    'B.Tech Computer Science Engineering (Cloud Computing)',
    7.80,
    2024,
    2028
),
(
    2,
    'University of Petroleum and Energy Studies (UPES)',
    'B.Tech Computer Science Engineering',
    8.20,
    2023,
    2027
);

-- ===========================================
-- Projects
-- ===========================================

INSERT INTO projects (
    resume_id,
    project_name,
    description,
    github_link,
    live_link,
    tech_stack
)
VALUES
(
    1,
    'Velora',
    'A student productivity and career management platform with task tracking, notes, roadmap, resume builder and internship management.',
    'https://github.com/Tapasya0726/Velora',
    NULL,
    'React, Node.js, Express.js, PostgreSQL'
),
(
    1,
    'ResQPulse',
    'Emergency response system connecting users, hospitals and ambulances with real-time updates.',
    'https://github.com/Tapasya0726/ResQPulse',
    NULL,
    'React, Node.js, MongoDB, Socket.io'
),
(
    2,
    'Student Management System',
    'A web application for managing student records and academic information.',
    'https://github.com/example/student-management',
    NULL,
    'Java, Spring Boot, MySQL'
);

-- ===========================================
-- Tasks
-- ===========================================

INSERT INTO tasks (
    user_id,
    title,
    priority,
    due_date,
    status
)
VALUES
(1,'Complete PostgreSQL Module','High','2026-07-10','Pending'),
(1,'Build Express Backend','High','2026-07-15','Pending'),
(1,'Revise React','Medium','2026-07-20','Completed'),
(2,'Prepare Resume','Medium','2026-07-08','Completed'),
(2,'Practice DSA','High','2026-07-12','Pending'),
(2,'Apply for Internship','Low','2026-07-18','Pending');

-- ===========================================
-- Notes
-- ===========================================

INSERT INTO notes (
    user_id,
    title,
    content,
    category,
    tags,
    created_date
)
VALUES
(1,'PostgreSQL Notes','Revision notes for PostgreSQL.','Database','SQL','2026-07-01'),
(1,'React Hooks','Important React hooks and examples.','Frontend','React','2026-07-02'),
(1,'Express APIs','REST API structure and routing.','Backend','Express','2026-07-03'),
(2,'Java OOP','OOP concepts in Java.','Programming','Java','2026-07-02'),
(2,'DSA Revision','Arrays, Linked Lists and Trees.','DSA','Coding','2026-07-04');


-- ===========================================
-- Skills
-- ===========================================

INSERT INTO skills (
    user_id,
    skill_name,
    category,
    level,
    progress
)
VALUES
(1,'React','Frontend','Intermediate',80),
(1,'PostgreSQL','Database','Beginner',65),
(1,'Node.js','Backend','Beginner',45),
(2,'Java','Programming','Advanced',90),
(2,'Spring Boot','Backend','Intermediate',70),
(2,'MySQL','Database','Intermediate',75);

-- ===========================================
-- Applications
-- ===========================================

INSERT INTO applications (
    user_id,
    company_name,
    role,
    status,
    applied_date
)
VALUES
(1,'Google','Software Engineer Intern','Applied','2026-07-01'),
(1,'Microsoft','Frontend Developer Intern','Interview','2026-07-03'),
(2,'Amazon','Backend Developer Intern','Rejected','2026-06-28'),
(2,'Adobe','Software Engineer Intern','Offer','2026-07-05');

-- ===========================================
-- Resources
-- ===========================================

INSERT INTO resources (
    user_id,
    title,
    type,
    category,
    link
)
VALUES
(1,'React Documentation','Website','Frontend','https://react.dev'),
(1,'PostgreSQL Tutorial','Website','Database','https://www.postgresql.org/docs/'),
(1,'Node.js Guide','Website','Backend','https://nodejs.org'),
(2,'Java Documentation','Website','Programming','https://docs.oracle.com/javase/'),
(2,'Spring Boot Course','Video','Backend','https://youtube.com');

-- ===========================================
-- Roadmap Items
-- ===========================================

INSERT INTO roadmap_items (
    user_id,
    title,
    duration,
    status
)
VALUES
(1,'Learn PostgreSQL','2 Weeks','Completed'),
(1,'Learn Express.js','3 Weeks','In Progress'),
(1,'Build Velora Backend','4 Weeks','Pending'),
(2,'Practice DSA','6 Weeks','In Progress'),
(2,'Prepare for Interviews','8 Weeks','Pending');

-- ===========================================
-- Pomodoro Sessions
-- ===========================================

INSERT INTO pomodoro_sessions (
    user_id,
    duration,
    completed_date
)
VALUES
(1,25,'2026-07-01'),
(1,50,'2026-07-02'),
(1,25,'2026-07-03'),
(2,25,'2026-07-01'),
(2,50,'2026-07-04'),
(2,25,'2026-07-05');