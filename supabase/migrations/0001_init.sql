-- Enums
CREATE TYPE issue_status AS ENUM ('open', 'in_progress', 'closed');
CREATE TYPE issue_priority AS ENUM ('low', 'medium', 'high', 'critical');

-- Profiles
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  email text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Trigger to create profile on auth.users insert
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Issues
CREATE TABLE issues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_number bigint GENERATED ALWAYS AS IDENTITY,
  title text NOT NULL CHECK (char_length(title) >= 3 AND char_length(title) <= 120),
  description text DEFAULT '',
  status issue_status DEFAULT 'open',
  priority issue_priority DEFAULT 'medium',
  reporter_id uuid NOT NULL REFERENCES profiles(id),
  assignee_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  closed_at timestamptz
);

-- Trigger for updated_at and closed_at on issues
CREATE OR REPLACE FUNCTION public.handle_issue_update()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  IF NEW.status = 'closed' AND OLD.status != 'closed' THEN
    NEW.closed_at = now();
  ELSIF NEW.status != 'closed' AND OLD.status = 'closed' THEN
    NEW.closed_at = NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_issue_updated
  BEFORE UPDATE ON issues
  FOR EACH ROW EXECUTE PROCEDURE public.handle_issue_update();

-- Comments
CREATE TABLE comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id uuid NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
  author_id uuid NOT NULL REFERENCES profiles(id),
  body text NOT NULL CHECK (char_length(body) >= 1 AND char_length(body) <= 2000),
  created_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX idx_issues_status ON issues(status);
CREATE INDEX idx_issues_assignee_id ON issues(assignee_id);
CREATE INDEX idx_issues_reporter_id ON issues(reporter_id);
CREATE INDEX idx_comments_issue_created ON comments(issue_id, created_at);

-- Dashboard stats function
CREATE OR REPLACE FUNCTION get_dashboard_stats()
RETURNS json
LANGUAGE plpgsql
SECURITY INVOKER
AS $$
DECLARE
  uid uuid;
  v_total int;
  v_open int;
  v_in_progress int;
  v_closed int;
  v_assigned_to_me int;
  v_created_by_me int;
BEGIN
  uid := auth.uid();
  
  SELECT COUNT(*) INTO v_total FROM issues;
  SELECT COUNT(*) INTO v_open FROM issues WHERE status = 'open';
  SELECT COUNT(*) INTO v_in_progress FROM issues WHERE status = 'in_progress';
  SELECT COUNT(*) INTO v_closed FROM issues WHERE status = 'closed';
  SELECT COUNT(*) INTO v_assigned_to_me FROM issues WHERE assignee_id = uid;
  SELECT COUNT(*) INTO v_created_by_me FROM issues WHERE reporter_id = uid;

  RETURN json_build_object(
    'total', v_total,
    'open', v_open,
    'in_progress', v_in_progress,
    'closed', v_closed,
    'assigned_to_me', v_assigned_to_me,
    'created_by_me', v_created_by_me
  );
END;
$$;

-- RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Issues policies
CREATE POLICY "Issues are viewable by everyone" ON issues FOR SELECT USING (true);
CREATE POLICY "Users can create issues" ON issues FOR INSERT WITH CHECK (auth.uid() = reporter_id);
CREATE POLICY "Reporter or assignee can update issue" ON issues FOR UPDATE USING (auth.uid() = reporter_id OR auth.uid() = assignee_id);
CREATE POLICY "Reporter can delete issue" ON issues FOR DELETE USING (auth.uid() = reporter_id);

-- Comments policies
CREATE POLICY "Comments are viewable by everyone" ON comments FOR SELECT USING (true);
CREATE POLICY "Users can create comments" ON comments FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can delete own comments" ON comments FOR DELETE USING (auth.uid() = author_id);
