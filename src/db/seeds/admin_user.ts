import { db } from '@/db';
import { user, account } from '@/db/schema';
import { hash } from 'bcrypt';

async function createAdminUser() {
  try {
    console.log('Creating admin user...');

    // Hash the password
    const hashedPassword = await hash('admin', 12);
    const userId = 'admin-user-' + Date.now();

    // Create admin user
    const adminUser = {
      id: userId,
      name: 'Admin User',
      email: 'admin@admin.com',
      emailVerified: 1, // SQLite boolean as integer
      image: null,
      created_at: new Date(),
      updated_at: new Date(),
    };

    // Insert user
    await db.insert(user).values(adminUser);

    // Create account record for email/password auth
    const adminAccount = {
      id: 'admin-account-' + Date.now(),
      account_id: 'admin@admin.com',
      provider_id: 'credential', // Better Auth provider for email/password
      user_id: userId,
      access_token: null,
      refresh_token: null,
      id_token: null,
      access_token_expires_at: null,
      refresh_token_expires_at: null,
      scope: null,
      password: hashedPassword,
      created_at: new Date(),
      updated_at: new Date(),
    };

    // Insert account
    await db.insert(account).values(adminAccount);

    console.log('Admin user created successfully!');
    console.log('Email: admin@admin.com');
    console.log('Password: admin');

  } catch (error) {
    console.error('Error creating admin user:', error);
    console.error('Full error:', error);
  }
}

createAdminUser();
