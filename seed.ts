// Supabase seed script
// Run: npm run db:seed

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { INITIAL_PRODUCTS, INITIAL_ORDERS } from './constants';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase environment variables');
    process.exit(1);
}

// Create Supabase client with Service Role Key to bypass RLS
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seed() {
    try {
        console.log('🌱 Seeding Supabase...');

        const args = process.argv.slice(2);
        const shouldReset = args.includes('--reset');

        if (shouldReset) {
            console.warn('⚠️  RESET MODE: Deleting existing data...');

            const { error: productsError } = await supabase.from('products').delete().neq('id', 'placeholder');
            if (productsError) throw productsError;
            console.log('   Deleted products');

            const { error: ordersError } = await supabase.from('orders').delete().neq('id', 'placeholder');
            if (ordersError) throw ordersError;
            console.log('   Deleted orders');
        }

        // Add products
        console.log('Adding products...');
        for (const product of INITIAL_PRODUCTS) {
            // Check if exists
            if (!shouldReset) {
                const { data } = await supabase.from('products').select('id').eq('id', product.id).single();
                if (data) continue;
            }

            const { error } = await supabase.from('products').upsert(product);
            if (error) {
                console.error(`Failed to add product ${product.id}:`, error.message);
            }
        }
        console.log(`✅ Products seeded`);

        // Add orders
        // Note: Orders reference users, so this might fail if users don't exist. 
        // For now we will try to insert, but in a real scenario we need valid user UUIDs.
        // The INITIAL_ORDERS in constants.tsx might need adjustment if they rely on hardcoded IDs or if schema constraints enforce valid UUIDs.
        // Our schema allows nullable user_id, so it might be okay if we omit it or if we handle it.

        console.log('Adding orders...');
        for (const order of INITIAL_ORDERS) {
            // We need to match the schema. Constants might not have correct field names.
            // The schema uses snake_case: user_id, customer_name, etc.
            // The constants use cameCase: customerName, etc.
            // We need to map them.

            const mappedOrder = {
                id: order.id,
                customer_name: order.customerName,
                phone: order.phone,
                items: order.items, // JSONB
                amount: order.amount,
                status: order.status,
                // user_id is missing in initial orders or needs to be mapped if present
                // date needs to be timestamp
                date: new Date(order.date).toISOString()
            };

            if (!shouldReset) {
                const { data } = await supabase.from('orders').select('id').eq('id', mappedOrder.id).single();
                if (data) continue;
            }

            const { error } = await supabase.from('orders').upsert(mappedOrder);
            if (error) {
                console.error(`Failed to add order ${order.id}:`, error.message);
            }
        }
        console.log(`✅ Orders seeded`);

        // Create Admin User
        const adminEmail = 'stevenmwangi1722@gmail.com';
        const adminPassword = 'Mwa$0152';

        console.log('Creating/Updating Admin User...');

        // Check if user exists
        // Note: listUsers is not available in all client versions without specific auth admin api access.
        // using @supabase/supabase-js with service role key exposes auth.admin

        const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();

        if (listError) throw listError;

        let adminUser = users.find(u => u.email === adminEmail);

        if (!adminUser) {
            console.log('Creating new admin user...');
            const { data: { user }, error: createError } = await supabase.auth.admin.createUser({
                email: adminEmail,
                password: adminPassword,
                email_confirm: true,
                user_metadata: { full_name: 'Steven Mwangi' }
            });
            if (createError) throw createError;
            adminUser = user;
        } else {
            console.log('Admin user already exists.');
            // Optionally update password if needed, but skipping for now to avoid reset loops
        }

        if (adminUser) {
            // Ensure profile exists and is_admin is true
            const { error: profileError } = await supabase.from('profiles').upsert({
                id: adminUser.id,
                email: adminEmail,
                full_name: 'Steven Mwangi',
                is_admin: true
            });
            if (profileError) throw profileError;
            console.log('✅ Admin privileges granted.');
        }

        console.log('🎉 Seeding complete!');
        process.exit(0);

    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
}

seed();
