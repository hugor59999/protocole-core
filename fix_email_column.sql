-- Make email column nullable
ALTER TABLE quiz_results 
ALTER COLUMN email DROP NOT NULL;
