// ==========================================================================
// RUNO HRS INDIA - Project Approvals View Controller
// ==========================================================================

async function loadApprovals() {
  try {
    const list = await window.api.getApprovals();
    window.AppState.approvals = list;
    const tbody = document.getElementById('approvals-table-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (list.length === 0) {
      tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; color: #64748B;">No approval requests pending.</td></tr>';
      return;
    }

    list.forEach(a => {
      const tr = document.createElement('tr');
      const badgeClass = a.status === 'APPROVED' ? 'completed' : (a.status === 'REJECTED' ? 'danger' : 'pending');
      tr.innerHTML = `
        <td style="font-weight: 700; color: var(--brand-orange);">${a.project_code}</td>
        <td style="font-weight: 600; color: var(--text-primary);">${a.title}</td>
        <td><span style="font-size: 11px; color: var(--text-muted);">${a.type}</span></td>
        <td>${a.requested_by}</td>
        <td>${a.submitted_date}</td>
        <td><span class="badge badge-${badgeClass}">${a.status}</span></td>
        <td style="font-size: 12px; color: var(--text-secondary);">${a.remarks || '-'}</td>
        <td>
          ${a.status === 'PENDING' ? `
            <div class="table-actions">
              <button class="btn-icon" style="color: #10B981; border-color: #10B981;" title="Approve" onclick="handleApprovalAction('${a.id}', 'APPROVED')">✓</button>
              <button class="btn-icon danger" title="Reject" onclick="handleApprovalAction('${a.id}', 'REJECTED')">✕</button>
            </div>
          ` : `<span style="font-size: 11px; color: #64748B;">Signed off by ${a.approved_by}</span>`}
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error('Failed to load approvals:', err);
  }
}

window.handleApprovalAction = function(id, status) {
  const approval = (window.AppState.approvals || []).find(a => a.id === id);
  const modal = document.getElementById('modal-approval-action');
  if (!modal) return;

  const idInput = document.getElementById('approval-action-id');
  const statusInput = document.getElementById('approval-action-status');
  const codeEl = document.getElementById('approval-meta-code');
  const titleEl = document.getElementById('approval-meta-title');
  const reqEl = document.getElementById('approval-meta-requester');
  const remarksInput = document.getElementById('approval-remarks-input');
  const submitBtn = document.getElementById('btn-submit-approval');
  const titleHeader = document.getElementById('approval-modal-title');
  const iconBadge = document.getElementById('approval-modal-icon-badge');

  if (idInput) idInput.value = id;
  if (statusInput) statusInput.value = status;
  if (codeEl) codeEl.innerText = approval ? approval.project_code : '-';
  if (titleEl) titleEl.innerText = approval ? approval.title : '-';
  if (reqEl) reqEl.innerText = approval ? approval.requested_by : '-';

  const isApprove = status === 'APPROVED';
  if (titleHeader) titleHeader.innerText = isApprove ? 'APPROVE REQUEST & SIGN-OFF' : 'REJECT REQUEST & REQUIRE REVISION';

  if (iconBadge) {
    iconBadge.style.background = isApprove ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)';
    iconBadge.style.border = isApprove ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)';
    iconBadge.innerHTML = isApprove
      ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>'
      : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>';
  }

  if (remarksInput) {
    remarksInput.value = isApprove ? 'Verified and approved for production release.' : 'Drawing modifications required before gate release.';
  }

  if (submitBtn) {
    submitBtn.innerText = isApprove ? 'CONFIRM & SIGN OFF' : 'CONFIRM REJECTION';
    submitBtn.style.background = isApprove ? '#16A34A' : '#DC2626';
    submitBtn.onclick = async () => {
      const remarks = remarksInput.value.trim() || (isApprove ? 'Approved' : 'Rejected');
      const res = await window.api.updateApproval(id, status, remarks);
      if (res && res.success) {
        window.closeModal('modal-approval-action');
        window.showToast(`Request marked as ${status}`, 'success');
        loadApprovals();
      } else {
        window.showToast((res && res.message) || 'Failed to update approval', 'error');
      }
    };
  }

  window.openModal('modal-approval-action');
  if (remarksInput) remarksInput.focus();
};

window.loadApprovals = loadApprovals;
