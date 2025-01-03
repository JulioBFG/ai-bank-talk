import { createClient } from '@supabase/supabase-js'
import config from './config';

const supabaseUrl = config.supabaseUrl || process.env.SUPABASE_URL; // Obtem a URL do ambiente ou config
const supabaseAnonKey = config.supabaseAnonKey || process.env.SUPABASE_ANON_KEY; // Obtem a chave anon do ambiente ou config

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('As variáveis SUPABASE_URL e SUPABASE_ANON_KEY devem estar definidas.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);