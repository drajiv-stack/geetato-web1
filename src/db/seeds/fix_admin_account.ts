import { db } from '@/db';
import { user, account } from '@/db/schema';
import { hash } from 'bcrypt';

async function upsertAdminUser() {
  try {
    const adminEmail = 'admin@admin.com';
    const plainPassword = 'admin';
    const hashedPassword = await hash(plainPassword, 12);

    // Find or create user
    let [adminUser] = await db.select().from(user).where(user.email === adminEmail).limit(1);
    if (!adminUser) {
      const userId = 'admin-user-' + Date.now();
      await db.insert(user).values({
        id: userId,
        name: 'Admin User',
        email: adminEmail,
        emailVerified: 1,
        image: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      [adminUser] = await db.select().from(user).where(user.email === adminEmail).limit(1);
      console.log('Created new admin user');
    } else {
      console.log('Admin user already exists, id =', adminUser.id);
    }

    // Upsert account credential
    let [adminAccount] = await db.select().from(account).where(
      account.accountId === adminEmail && account.providerId === 'credential'
    );
    if (adminAccount) {
      // Update password
      await db.update(account)
        .set({ password: hashedPassword, userId: adminUser.id })
        .where(account.accountId === adminEmail && account.providerId === 'credential');
      console.log('Updated admin account password!');
    } else {
      // Create new account row
      await db.insert(account).values({
        id: 'admin-account-' + Date.now(),
        accountId: adminEmail,
        providerId: 'credential',
        userId: adminUser.id,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log('Inserted admin account credential!');
    }

    console.log('Admin login fixed! You can now use admin@admin.com / admin');
  } catch (error) {
    console.error('Error fixing admin account:', error);
  }
}

upsertAdminUser();
