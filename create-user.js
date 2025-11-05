// create-simple-users.js
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ijyupykrvelhzylqidha.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlqeXVweWtydmVsaHp5bHFpZGhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyNjA4NjQsImV4cCI6MjA3NzgzNjg2NH0.IaBglX8hJTQTeo9zu1G7VD7-yoFAEHyWyVAzbr26zk8';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const users = [
    { email: 'michaelparlie@gmail.com', password: 'c@)V*F$!PTLbdnjqnSHyLQGa', full_name: 'Michael Parlie' },
    { email: 'pesma.usman@gmail.com', password: 'M5xZ!GrU3iWvjT&OXCEakH^g', full_name: 'Mufti Al Amin' },
    { email: 'indramwn@gmail.com', password: '1U)hMMlNdDeIcfz#lLMb2KpW', full_name: 'Indramawan' },
    { email: 'kusmayadiandri76@gmail.com', password: 'jjjpyEtrnXPI)GO4oDO7rOWZ', full_name: 'Andri Kusmayadi' },
    { email: 'igntbb@gmail.com', password: 'NMLaFLxgpeWrfKwXAn878ese', full_name: 'IGNTB Bimantara' },
    { email: 'nashirotun83@gmail.com', password: 'bsE37LlShN^Nr%N4V#$WC^fc', full_name: 'Nashirotun Nisa Nurharjanti' },
    { email: 'ffy.fify12@gmail.com', password: 'mLKM*1jnKZsI8S7S1bLeWlDB', full_name: 'Fitria Sari' },
    { email: 'sanbrelle@gmail.com', password: 'ngbpSM@XZhIPMam8y8@cf)qc', full_name: 'Dr. Aty Susanti, S.S., M.Pd' },
    { email: 'surfdewi723@gmail.com', password: 'bDWR0xKunXsoh&rzUOaOSukC', full_name: 'Ni Made Dewi Suryani' },
    { email: 'khotibbelajar@gmail.com', password: 'FHSVivUPOoyuCD3M8#eD8%G%', full_name: 'KHOTIBUL UMAM' },
    { email: 'wciptaningrum8@gmail.com', password: 'za^HcIIRA7Q6@HjJcS&)0qv4', full_name: 'Wahyu Ciptaningrum' },
    { email: 'hartonorobert6@gmail.com', password: '8T8fv&SUYo7dsfw*@0fyn@DA', full_name: 'Robertus Heru Setyo Suhartono' },
    { email: 'miftah.ridha84@gmail.com', password: 'hCckOSZw5r&g%fiLkL4r9)Ea', full_name: 'Miftahul jannah' },
    { email: 'kevin.khoe.kk@gmail.com', password: 'qnMfplcTCiG!A%Yy%ud3eKgS', full_name: 'Kevin Khoe' },
    { email: 'emesemem062002@gmail.com', password: 'o3yK7k4Vswbzp!OB*yl9XrI8', full_name: 'Capt. Maman Suryaman, AFNI' },
    { email: 'kampusriset@gmail.com', password: 'hceriset123', full_name: 'Capt. Maman Suryaman, AFNI' },
    { email: 'setyohapri@gmail.com', password: '4lrijlkvr1laS#A&yZDZmW$*', full_name: 'Setyo Hari Priyono' }
];

async function createUsers() {
    console.log('🚀 Creating users in Supabase Auth...');
    
    for (const user of users) {
        try {
            // Method 1: Try admin createUser
            const { data: authData, error: authError } = await supabase.auth.admin.createUser({
                email: user.email,
                password: user.password,
                email_confirm: true
            });

            if (authError) {
                console.log(`❌ Error creating ${user.email}:`, authError.message);
                
                // Method 2: Try signUp (self-service)
                const { data: signupData, error: signupError } = await supabase.auth.signUp({
                    email: user.email,
                    password: user.password
                });

                if (signupError) {
                    console.log(`❌ Signup also failed for ${user.email}:`, signupError.message);
                } else {
                    console.log(`✅ Signup initiated for: ${user.email}`);
                }
            } else {
                console.log(`✅ Created auth user: ${user.email}`);
            }

        } catch (error) {
            console.log(`❌ Failed for ${user.email}:`, error.message);
        }
    }
}

createUsers();