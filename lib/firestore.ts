// Conditional Firestore - works without GCP credentials in dev
// firebase-admin is an optional peer dependency; graceful fallback when absent

/* eslint-disable @typescript-eslint/no-explicit-any */
let db: any = null;

async function getDb(): Promise<any> {
  if (db) return db;
  try {
    // Dynamic import so the module is only loaded when firebase-admin is installed
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const adminApp = require('firebase-admin/app');
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const adminFirestore = require('firebase-admin/firestore');

    if (adminApp.getApps().length === 0) {
      const credJson = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON || '{}';
      const cred = JSON.parse(credJson);
      if (!cred.project_id) return null;
      adminApp.initializeApp({ credential: adminApp.cert(cred) });
    }
    db = adminFirestore.getFirestore(process.env.FIRESTORE_DATABASE || 'aistockradar');
    return db;
  } catch {
    return null;
  }
}

export async function getLatestSignals(): Promise<Record<string, unknown> | null> {
  const firestore = await getDb();
  if (!firestore) return null;
  try {
    const doc = await firestore.collection('signals').doc('latest').get();
    return doc.exists ? doc.data() : null;
  } catch {
    return null;
  }
}

export async function saveLatestSignals(data: Record<string, unknown>): Promise<void> {
  const firestore = await getDb();
  if (!firestore) return;
  try {
    await firestore.collection('signals').doc('latest').set(
      { ...data, updatedAt: new Date().toISOString() },
      { merge: true }
    );
  } catch (e) {
    console.error('Firestore save error:', e);
  }
}
