import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://iuirzytmehfhkeeevnra.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1aXJ6eXRtZWhmaGtlZWV2bnJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwMjI2NjYsImV4cCI6MjA2NjU5ODY2Nn0.J5EdtEQwVD9wdbjVRYekNmIbS8KzmzljfXVQByEcFNU"

const supabase = createClient(supabaseUrl, supabaseAnonKey);
export default supabase;