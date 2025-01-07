import { supabase } from './config/supabaseClient';


const port = 3000;

export const test = async () => {
  const { data, error } = await supabase.from('users').select('*');
  if (error) {
    console.log(error);
  }
}

test();