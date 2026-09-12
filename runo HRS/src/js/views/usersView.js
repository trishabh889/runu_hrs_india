// ==========================================================================
// RUNO HRS INDIA - User Management View Controller
// ==========================================================================

function initUsers() {
  const btnAdd = document.getElementById('btn-add-user-modal');
  if (btnAdd) btnAdd.addEventListener('click', openAddUserModal);

  const form = document.getElementById('form-user');
  if (form) {
    form.addEventListener('submit', async () => {
      const id = document.getElementById('usr-id').value;
      const dept = document.getElementById('usr-department').value;
      const desig = document.getElementById('usr-designation').value.trim();
      const status = document.getElementById('usr-status').value;
      const data = {
        username: document.getElementById('usr-username').value.trim(),
        role: dept,
        designation: desig,
        name: document.getElementById('usr-fullname').value.trim(),
        password: document.getElementById('usr-password').value.trim(),
        email: document.getElementById('usr-email').value.trim(),
        department: dept,
        status: status,
        is_approved: (status === 'APPROVED')
      };

      if (id) {
        const res = await window.api.updateUser(id, data);
        if (res.success) window.showToast('User profile updated successfully', 'success');
        else window.showToast(res.message, 'error');
      } else {
        const res = await window.api.createUser(data);
        if (res.success) window.showToast('User created successfully', 'success');
        else window.showToast(res.message, 'error');
      }
      window.closeModal('modal-user');
      loadUsers();
    });
  }

  const pwdForm = document.getElementById('form-change-password');
  if (pwdForm) {
    pwdForm.addEventListener('submit', async () => {
      const username = document.getElementById('pwd-username').value;
      const newPwd = document.getElementById('pwd-new').value;
      const confirmPwd = document.getElementById('pwd-confirm').value;

      if (!newPwd || newPwd !== confirmPwd) {
        window.showToast('Passwords do not match or are empty', 'error');
        return;
      }

      const res = await window.api.changePassword(username, newPwd);
      if (res.success) {
        window.showToast(`Password changed successfully for ${username}`, 'success');
        window.closeModal('modal-change-password');
      } else {
        window.showToast(res.message || 'Failed to change password', 'error');
      }
    });
  }
}

function openAddUserModal() {
  document.getElementById('modal-user-title').innerText = 'ADD SYSTEM USER';
  document.getElementById('usr-id').value = '';
  document.getElementById('usr-username').value = '';
  document.getElementById('usr-username').disabled = false;
  document.getElementById('usr-department').value = 'DESIGN';
  document.getElementById('usr-designation').value = '';
  document.getElementById('usr-status').value = 'APPROVED';
  document.getElementById('usr-fullname').value = '';
  document.getElementById('usr-password').value = '';
  document.getElementById('usr-email').value = '';
  window.openModal('modal-user');
}

window.openChangePasswordModal = function(username) {
  document.getElementById('pwd-username').value = username;
  document.getElementById('pwd-new').value = '';
  document.getElementById('pwd-confirm').value = '';
  document.getElementById('modal-pwd-title').innerText = `CHANGE PASSWORD: ${username}`;
  window.openModal('modal-change-password');
};

async function loadUsers() {
  try {
    const list = await window.api.getUsers();
    window.AppState.users = list;
    const tbody = document.getElementById('users-table-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    list.forEach(u => {
      const isApproved = u.status === 'APPROVED' || u.is_approved === true || u.username === 'ANAND';
      const statusBadge = isApproved
        ? `<span class="badge badge-completed">APPROVED</span>`
        : `<span class="badge badge-pending">PENDING APPROVAL</span>`;

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="font-weight: 700; color: var(--text-primary);">${u.username}</td>
        <td>${u.name || '-'}</td>
        <td>
          <div><span class="badge ${u.role === 'ADMIN' ? 'badge-admin' : 'badge-active'}">${u.role}</span></div>
          ${u.designation ? `<div style="font-size: 11px; color: var(--text-muted); margin-top: 3px;">${u.designation}</div>` : ''}
        </td>
        <td>${u.department || '-'}</td>
        <td>${statusBadge}</td>
        <td>${u.email || '-'}</td>
        <td>${u.created_at || '-'}</td>
        <td>
          <div class="table-actions">
            ${!isApproved ? `
              <button class="btn-table-action" style="background: #10B981; color: #FFFFFF; border: none; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 700; display: inline-flex; align-items: center; gap: 4px; cursor: pointer;" title="Approve Account" onclick="approveUser('${u.id}')">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg>
                APPROVE
              </button>
            ` : ''}
            <button class="btn-icon" title="Change Password" onclick="openChangePasswordModal('${u.username}')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12.65 10C11.83 7.67 9.61 6 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c2.61 0 4.83-1.67 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/></svg>
            </button>
            <button class="btn-icon" title="Edit" onclick="editUser('${u.id}')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
            </button>
            ${u.username !== 'ANAND' ? `
              <button class="btn-icon danger" title="Delete" onclick="deleteUser('${u.id}')">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
              </button>
            ` : ''}
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error('Failed to load users:', err);
  }
}

window.approveUser = async function(id) {
  const u = window.AppState.users.find(item => item.id === id);
  const userName = u ? u.username : 'user';
  const confirmed = await window.showConfirmDialog({
    title: 'APPROVE USER ACCESS',
    message: `Are you sure you want to approve user account "${userName}"?`,
    subtext: 'This user will be permitted to log into RUNO HRS MIS immediately.',
    confirmText: 'APPROVE ACCESS',
    cancelText: 'CANCEL',
    danger: false
  });
  if (!confirmed) return;

  const res = await window.api.updateUser(id, { status: 'APPROVED', is_approved: true });
  if (res.success) {
    window.showToast(`User "${userName}" approved successfully!`, 'success');
    loadUsers();
  } else {
    window.showToast(res.message || 'Failed to approve user', 'error');
  }
};

window.editUser = function(id) {
  const u = window.AppState.users.find(item => item.id === id);
  if (!u) return;
  document.getElementById('modal-user-title').innerText = 'EDIT USER';
  document.getElementById('usr-id').value = u.id;
  document.getElementById('usr-username').value = u.username;
  document.getElementById('usr-username').disabled = (u.username === 'ANAND');

  const deptSelect = document.getElementById('usr-department');
  if (deptSelect) deptSelect.value = u.department || u.role || 'DESIGN';

  const desigInput = document.getElementById('usr-designation');
  if (desigInput) desigInput.value = u.designation || '';

  const statusSelect = document.getElementById('usr-status');
  if (statusSelect) {
    statusSelect.value = (u.status === 'PENDING_APPROVAL' && u.username !== 'ANAND') ? 'PENDING_APPROVAL' : 'APPROVED';
    statusSelect.disabled = (u.username === 'ANAND');
  }

  document.getElementById('usr-fullname').value = u.name || '';
  document.getElementById('usr-password').value = '';
  document.getElementById('usr-email').value = u.email || '';
  window.openModal('modal-user');
};

window.deleteUser = async function(id) {
  const confirmed = await window.showConfirmDialog({
    title: 'DELETE SYSTEM USER',
    message: 'Are you sure you want to delete this user account?',
    subtext: 'This action will revoke access and remove their system role.',
    confirmText: 'DELETE USER',
    cancelText: 'KEEP USER',
    danger: true
  });
  if (!confirmed) return;

  const res = await window.api.deleteUser(id);
  if (res.success) {
    window.showToast('User account deleted successfully', 'info');
    loadUsers();
  } else {
    window.showToast(res.message || 'Cannot delete user', 'error');
  }
};

window.initUsers = initUsers;
window.loadUsers = loadUsers;
