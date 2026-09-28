-- Optional Demo Data
-- First we need some auth users, but since we can't easily insert raw passwords and hash them in plain SQL,
-- we'll create some mock profile rows. Note: if these profiles don't have matching auth.users, they won't 
-- be able to login, but we can assign issues to them for demo purposes.

INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, recovery_sent_at, last_sign_in_at, app_metadata, user_metadata, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
VALUES
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'alice@example.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Alice Admin"}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'bob@example.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Bob Builder"}', now(), now(), '', '', '', '');

-- The trigger should handle profiles, but just in case, or if we want specific profiles:
-- (Assuming the trigger ran)

DO $$
DECLARE
  v_issue1 uuid;
  v_issue2 uuid;
BEGIN
  INSERT INTO issues (title, description, status, priority, reporter_id, assignee_id)
  VALUES 
    ('Setup the project', 'Initialize vite, tailwind, shadcn.', 'closed', 'high', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001') RETURNING id INTO v_issue1;

  INSERT INTO issues (title, description, status, priority, reporter_id, assignee_id)
  VALUES 
    ('Implement Kanban board', 'Drag and drop is nice.', 'in_progress', 'medium', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002') RETURNING id INTO v_issue2;

  INSERT INTO comments (issue_id, author_id, body)
  VALUES
    (v_issue1, '00000000-0000-0000-0000-000000000002', 'Great job Alice!'),
    (v_issue2, '00000000-0000-0000-0000-000000000001', 'Let me know if you need help with dnd-kit.');
END $$;
