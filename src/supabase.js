import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://jtvlgmdkvnrgxkcvicle.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0dmxnbWRrdm5yZ3hrY3ZpY2xlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2MDkyOTUsImV4cCI6MjA5MzE4NTI5NX0.t9PHqNisysNCeV91B940dwgrPU1beMd9saDM9byqfCs"

export const supabase = createClient(supabaseUrl, supabaseKey)