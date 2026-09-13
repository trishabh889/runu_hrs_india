// ==========================================================================
// RUNO HRS MIS - Base Database Adapter Contract
// ==========================================================================

class BaseDatabaseAdapter {
  constructor(name = 'base') {
    this.name = name;
  }

  async initialize() {
    throw new Error(`${this.name}: initialize() not implemented`);
  }

  async isHealthy() {
    return true;
  }

  getMode() {
    return this.name;
  }
}

module.exports = BaseDatabaseAdapter;
