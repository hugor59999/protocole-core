const password = process.env.DASHBOARD_PASSWORD || 'admin';
console.log('DASHBOARD_PASSWORD is:', password);
console.log('Match admin?', password === 'admin');
