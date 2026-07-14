-- ===========================================
-- Velora Database Schema
-- ===========================================

-- ===========================================
-- Users Table
-- ===========================================

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    university VARCHAR(255) NOT NULL,
    major VARCHAR(255),
    year INTEGER NOT NULL CHECK (year BETWEEN 1 AND 4),
    graduation_year INTEGER,
    profile_photo TEXT,
    streak INTEGER DEFAULT 0
);

-- ===========================================
-- Tasks Table
-- ===========================================

CREATE TABLE tasks (
    task_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id),
    title VARCHAR(255) NOT NULL,
    priority VARCHAR(100) NOT NULL
        CHECK (priority IN ('High','Medium','Low')),
    due_date DATE NOT NULL,
    status VARCHAR(100) NOT NULL DEFAULT 'Pending'
        CHECK (status IN ('Pending','Completed'))
);

-- ===========================================
-- Notes Table
-- ===========================================

CREATE TABLE notes (
    note_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id),
    title VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    tags VARCHAR(100),
    created_date DATE NOT NULL
);

-- ===========================================
-- Applications Table
-- ===========================================

CREATE TABLE applications (
    application_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id),
    company_name VARCHAR(100) NOT NULL,
    role VARCHAR(100) NOT NULL,
    status VARCHAR(100) NOT NULL
        CHECK (status IN ('Applied','Interview','Offer','Rejected')),
    applied_date DATE NOT NULL
);

-- ===========================================
-- Skills Table
-- ===========================================

CREATE TABLE skills (
    skill_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id),
    skill_name VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL,
    level VARCHAR(100) NOT NULL
        CHECK (level IN ('Beginner','Intermediate','Advanced')),
    progress INTEGER NOT NULL
        CHECK (progress BETWEEN 0 AND 100)
);

-- ===========================================
-- Resume Table
-- ===========================================

CREATE TABLE resume (
    resume_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL UNIQUE REFERENCES users(user_id),
    summary TEXT
);

-- ===========================================
-- Projects Table
-- ===========================================

CREATE TABLE projects (
    project_id SERIAL PRIMARY KEY,
    resume_id INTEGER NOT NULL REFERENCES resume(resume_id),
    project_name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    github_link TEXT,
    live_link TEXT,
    tech_stack TEXT NOT NULL
);

-- ===========================================
-- Education Table
-- ===========================================

CREATE TABLE education (
    education_id SERIAL PRIMARY KEY,
    resume_id INTEGER NOT NULL REFERENCES resume(resume_id),
    institution VARCHAR(255) NOT NULL,
    degree VARCHAR(100) NOT NULL,
    cgpa NUMERIC(3,2) NOT NULL,
    start_year INTEGER NOT NULL,
    end_year INTEGER NOT NULL
);

-- ===========================================
-- Resources Table
-- ===========================================

CREATE TABLE resources (
    resource_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id),
    title VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL
        CHECK (type IN ('Video','Article','PDF','Website','Course')),
    category VARCHAR(100) NOT NULL,
    link TEXT NOT NULL
);

-- ===========================================
-- Roadmap Items Table
-- ===========================================

CREATE TABLE roadmap_items (
    roadmap_item_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id),
    title VARCHAR(255) NOT NULL,
    duration VARCHAR(100) NOT NULL,
    status VARCHAR(100) NOT NULL
        CHECK (status IN ('Pending','In Progress','Completed'))
);

-- ===========================================
-- Pomodoro Sessions Table
-- ===========================================

CREATE TABLE pomodoro_sessions (
    pomodoro_session_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id),
    duration INTEGER NOT NULL,
    completed_date DATE NOT NULL
);