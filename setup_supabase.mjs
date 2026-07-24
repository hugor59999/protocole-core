import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

// Load env manually
const envContent = fs.readFileSync('.env.local', 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && !line.startsWith('#')) {
    let value = valueParts.join('=').replace(/^"|"$/g, '');
    envVars[key.trim()] = value;
  }
});

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Supabase URL:', supabaseUrl);

const supabase = createClient(supabaseUrl, supabaseKey);

(async () => {
  try {
    console.log('Checking if quiz_results table exists...');
    const { data: tableData, error: tableError } = await supabase
      .from('quiz_results')
      .select('*')
      .limit(1);
    
    if (tableError && tableError.message?.includes('does not exist')) {
      console.log('❌ Table does not exist - CREATING...');
      
      // Try to create table (will fail if no permission, but worth trying)
      const { error: createError } = await supabase
        .rpc('create_quiz_table', {});
      
      console.log('Note: Automatic table creation requires service role key');
      console.log('Please manually create the table in Supabase dashboard');
      process.exit(1);
    } else if (tableError) {
      console.log('Error checking table:', tableError.message);
      process.exit(1);
    } else {
      console.log('✅ Table exists and is ready!');
      process.exit(0);
    }
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
})();
