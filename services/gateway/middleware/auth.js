const admin = require('firebase-admin');

// Initialize Firebase Admin SDK (will pick up default service account in Cloud Run)
try {
    admin.initializeApp();
} catch (error) {
    console.error('Firebase Admin init error', error);
}

const verifyToken = async (request, reply) => {
    // In a real hackathon, we skip strict auth for local dev if not configured
    if (process.env.NODE_ENV === 'development' || !process.env.FIREBASE_CONFIG) {
        request.user = { uid: 'dev-user' };
        return;
    }

    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return reply.status(401).send({ error: 'Unauthorized' });
    }

    const token = authHeader.split('Bearer ')[1];
    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        request.user = decodedToken;
    } catch (error) {
        console.error('Token verification failed:', error);
        return reply.status(401).send({ error: 'Unauthorized' });
    }
};

module.exports = { verifyToken };
