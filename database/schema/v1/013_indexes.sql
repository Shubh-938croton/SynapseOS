USE synapseos;            -- creating the index for make database faster.

CREATE INDEX idx_tasks_user
ON tasks(user_id);

CREATE INDEX idx_tasks_subject
ON tasks(subject_id);

CREATE INDEX idx_notes_user
ON notes(user_id);

CREATE INDEX idx_notes_subject
ON notes(subject_id);

CREATE INDEX idx_sessions_user
ON study_sessions(user_id);

CREATE INDEX idx_sessions_subject
ON study_sessions(subject_id);

CREATE INDEX idx_progress_user
ON progress(user_id);

CREATE INDEX idx_calendar_user
ON calendar_events(user_id);

CREATE INDEX idx_goals_user
ON goals(user_id);

CREATE INDEX idx_contests_user
ON contests(user_id);