import admin from 'firebase-admin';

admin.initializeApp({
    credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
    })
});

export const sendPushNotification = async (token: string, title: string, body: string) => {
    await admin.messaging().send({
        token,
        notification: {
            title,
            body
        }
    });
};