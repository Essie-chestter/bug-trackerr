-- Create enums for bug properties
CREATE TYPE public.bug_status AS ENUM ('open', 'in-progress', 'resolved');
CREATE TYPE public.bug_severity AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE public.bug_priority AS ENUM ('low', 'medium', 'high', 'critical');

-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create bugs table
CREATE TABLE public.bugs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status public.bug_status NOT NULL DEFAULT 'open',
  severity public.bug_severity NOT NULL,
  priority public.bug_priority NOT NULL,
  assigned_to UUID REFERENCES public.profiles(id),
  reported_by UUID NOT NULL REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  tags TEXT[] DEFAULT '{}',
  steps_to_reproduce TEXT,
  expected_behavior TEXT,
  actual_behavior TEXT
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bugs ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles table
CREATE POLICY "Users can view all profiles" 
ON public.profiles 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
TO authenticated 
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = id);

-- Create policies for bugs table
CREATE POLICY "Users can view all bugs" 
ON public.bugs 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Users can create bugs" 
ON public.bugs 
FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = reported_by);

CREATE POLICY "Users can update bugs they reported or are assigned to" 
ON public.bugs 
FOR UPDATE 
TO authenticated 
USING (auth.uid() = reported_by OR auth.uid() = assigned_to);

CREATE POLICY "Users can delete bugs they reported" 
ON public.bugs 
FOR DELETE 
TO authenticated 
USING (auth.uid() = reported_by);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bugs_updated_at
  BEFORE UPDATE ON public.bugs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data ->> 'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();