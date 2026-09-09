// ==========================================================================
// RUNO HRS INDIA - New Project Creation View Controller
// ==========================================================================

function initNewProjectForm() {
  const form = document.getElementById('form-create-project');
  const btnCancel = document.getElementById('btn-cancel-new-project');
  if (btnCancel) btnCancel.addEventListener('click', () => window.switchView('projects'));

  const getVal = (id) => {
    const el = document.getElementById(id);
    return el ? el.value.trim() : '';
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    const customerSelect = document.getElementById('newproj-customer');
    const custId = customerSelect ? customerSelect.value : '';
    const custName = (customerSelect && customerSelect.selectedIndex >= 0 && customerSelect.options[customerSelect.selectedIndex])
      ? customerSelect.options[customerSelect.selectedIndex].text
      : 'General Customer';

    const desc = getVal('newproj-desc');
    const targetDate = getVal('newproj-date');

    if (!desc) {
      if (window.showToast) window.showToast('Please enter Mould Description', 'error');
      return;
    }

    const data = {
      project_code: getVal('newproj-code'),
      customer_id: custId,
      customer_name: custName,
      mould_description: desc,
      nozzle_count: parseInt(getVal('newproj-drops')) || 1,
      nozzle_type: getVal('newproj-nozzle-type') || 'Standard Valve Gate',
      manifold_type: getVal('newproj-manifold') || 'Custom Balanced Manifold',
      runner_diameter: getVal('newproj-runner-dia') || '12 mm',
      material: getVal('newproj-material') || 'Polypropylene (PP)',
      target_date: targetDate || new Date().toISOString().split('T')[0],
      priority: getVal('newproj-priority') || 'HIGH',
      value: getVal('newproj-value'),
      notes: getVal('newproj-notes')
    };

    try {
      const res = await window.api.createProject(data);
      if (res && res.success) {
        if (window.showToast) window.showToast(`Project ${res.project.project_code} created!`, 'success');
        if (form) form.reset();
        window.switchView('projects');
      } else {
        if (window.showToast) window.showToast((res && res.message) || 'Failed to create project', 'error');
      }
    } catch (err) {
      console.error('Project creation failed:', err);
      if (window.showToast) window.showToast('Error: ' + err.message, 'error');
    }
  };

  if (form) form.addEventListener('submit', handleSubmit);
  const btnSubmit = document.getElementById('btn-submit-project');
  if (btnSubmit) btnSubmit.addEventListener('click', handleSubmit);
}

async function prepareNewProjectForm() {
  const customers = await window.api.getCustomers();
  const select = document.getElementById('newproj-customer');
  if (!select) return;
  select.innerHTML = '';

  if (customers.length === 0) {
    select.innerHTML = '<option value="">-- No Customers Registered. Please Add One First --</option>';
    return;
  }

  customers.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.id;
    opt.innerText = c.company_name;
    select.appendChild(opt);
  });

  const target = new Date();
  target.setDate(target.getDate() + 30);
  const dateInput = document.getElementById('newproj-date');
  if (dateInput) dateInput.value = target.toISOString().split('T')[0];
}

window.initNewProjectForm = initNewProjectForm;
window.prepareNewProjectForm = prepareNewProjectForm;
