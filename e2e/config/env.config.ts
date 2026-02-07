// e2e/config/env.config.ts
const environments = {
    testing: {
        baseUrl: 'https://ticket-training.onrender.com/',
        apiUrl: 'https://ticket-training.onrender.com/api',
    },
    production: {
        baseUrl: 'https://tixcraft.com/',
        apiUrl: 'https://tixcraft.com/api',
    }
};

const currentEnv = process.env.ENV || 'testing';

export const config = environments[currentEnv];