class UserRepository {
  constructor(db) {
    this.db = db;
  }

  getAll() {
    return this.db.data.users.map(({ password, ...u }) => u);
  }

  getById(id) {
    const user = this.db.data.users.find(u => u.id === id);
    if (!user) return null;
    const { password, ...safeUser } = user;
    return safeUser;
  }

  authenticate(username, password) {
    const user = this.db.data.users.find(
      u => u.username.toUpperCase() === (username || '').trim().toUpperCase() &&
           u.password === (password || '').trim()
    );
    if (user) {
      const { password, ...safeUser } = user;
      return { success: true, user: safeUser };
    }
    return { success: false, message: 'Invalid Username or Password!' };
  }

  create(userData) {
    const exists = this.db.data.users.some(
      u => u.username.toUpperCase() === (userData.username || '').trim().toUpperCase()
    );
    if (exists) {
      return { success: false, message: 'Username already exists!' };
    }

    const newUser = {
      id: `usr-${Date.now()}`,
      username: userData.username.trim().toUpperCase(),
      name: userData.name || userData.username,
      role: userData.role || 'ENGINEER',
      password: userData.password || '123456',
      email: userData.email || '',
      phone: userData.phone || '',
      department: userData.department || 'Engineering',
      created_at: new Date().toISOString().split('T')[0]
    };

    this.db.data.users.push(newUser);
    this.db.save();
    const { password, ...safeUser } = newUser;
    return { success: true, user: safeUser };
  }

  update(id, updates) {
    const idx = this.db.data.users.findIndex(u => u.id === id);
    if (idx === -1) return { success: false, message: 'User not found' };

    if (this.db.data.users[idx].username === 'ANAND' && updates.role && updates.role !== 'ADMIN') {
      return { success: false, message: 'Primary Admin role cannot be changed' };
    }

    this.db.data.users[idx] = { ...this.db.data.users[idx], ...updates };
    this.db.save();
    const { password, ...safeUser } = this.db.data.users[idx];
    return { success: true, user: safeUser };
  }

  delete(id) {
    const user = this.db.data.users.find(u => u.id === id);
    if (!user) return { success: false, message: 'User not found' };
    if (user.username === 'ANAND') {
      return { success: false, message: 'Primary Admin user cannot be deleted' };
    }

    this.db.data.users = this.db.data.users.filter(u => u.id !== id);
    this.db.save();
    return { success: true };
  }
}

module.exports = UserRepository;
