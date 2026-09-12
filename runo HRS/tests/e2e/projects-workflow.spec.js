// ==========================================================================
// RUNO HRS MIS - E2E Test: Projects Workflow & Search (PROJ-01, SALES-01)
// ==========================================================================

const { test, expect } = require('@playwright/test');
const { launchTestApp, closeTestApp } = require('../fixtures/electron.fixture');
const NavigationPage = require('../pages/navigation.page');
const ProjectsPage = require('../pages/projects.page');

test.describe('Projects Workflow (PROJ-01, SALES-01)', () => {
  let context = null;

  test.afterEach(async () => {
    await closeTestApp(context);
    context = null;
  });

  test('PROJ-01: Create project in UI and verify entry in projects table', async () => {
    context = await launchTestApp({ tag: 'proj-create' });
    const { window } = context;
    const navPage = new NavigationPage(window);
    const projPage = new ProjectsPage(window);

    await navPage.navigateTo('projects');
    await projPage.clickNewProject();

    // Fill form and save project
    await projPage.fillNewProject({
      desc: 'Synthetic 8-Drop Manifold Injection Mould System',
      drops: 8,
      material: 'Polycarbonate (PC)',
      targetDate: '2026-11-30'
    });
    await projPage.submitNewProject();

    // Verify view returns to projects list and row appears
    await window.waitForTimeout(800);
    const rowTexts = await projPage.getRowTexts();
    expect(rowTexts.some(t => t.includes('Synthetic 8-Drop Manifold'))).toBe(true);
  });

  test('SALES-01: Search projects table by keyword and customer name', async () => {
    context = await launchTestApp({ tag: 'proj-search' });
    const { window } = context;
    const navPage = new NavigationPage(window);
    const projPage = new ProjectsPage(window);

    await navPage.navigateTo('projects');

    // Filter by existing fixture project
    await projPage.search('Front Bumper');
    await window.waitForTimeout(400);

    const rows = await projPage.getRowTexts();
    expect(rows.length).toBeGreaterThan(0);
    expect(rows[0]).toContain('Front Bumper');

    // Filter by non-existent project
    await projPage.search('ZzzNonExistentMouldProject');
    await window.waitForTimeout(400);

    const emptyRows = await projPage.getRowTexts();
    expect(emptyRows.some(t => t.includes('Front Bumper'))).toBe(false);
  });
});
