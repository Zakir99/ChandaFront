import html2pdf from "html2pdf.js";

const generatePDF = async ({
  record,
  families,
  paidfamilies,
  totalfamilies,
  totalExpected,
  setGeneratingPdf = true,
  totalCollected,
}) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  
  // Split families into two columns for the table
  const half = Math.ceil(families.length / 2);
  const leftColumn = families.slice(0, half);
  const rightColumn = families.slice(half);
  
  // Create PDF content
  const pdfContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Death Support Payment Record - ${record.deceased_name}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      padding: 40px;
      max-width: 1200px;
      margin: 0 auto;
      background: #ffffff;
    }
    
    .header {
      text-align: center;
      margin-bottom: 35px;
      border-bottom: 4px solid #3b82f6;
      padding-bottom: 20px;
    }
    
    .header h1 {
      margin: 0 0 12px 0;
      color: #1e40af;
      font-size: 32px;
      font-weight: 700;
      letter-spacing: -0.5px;
    }
    
    .header p {
      margin: 6px 0;
      color: #64748b;
      font-size: 15px;
    }
    
    .info-section {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 25px;
      margin-bottom: 35px;
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      padding: 28px;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
    }
    
    .info-item {
      margin-bottom: 16px;
    }
    
    .info-label {
      font-weight: 600;
      color: #64748b;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      margin-bottom: 6px;
    }
    
    .info-value {
      color: #0f172a;
      font-size: 17px;
      font-weight: 500;
    }
    
    .summary {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 18px;
      margin-bottom: 35px;
    }
    
    .summary-card {
      background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
      padding: 22px;
      border-radius: 12px;
      text-align: center;
      border: 2px solid #93c5fd;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }
    
    .summary-label {
      font-size: 11px;
      color: #1e40af;
      font-weight: 700;
      text-transform: uppercase;
      margin-bottom: 10px;
      letter-spacing: 0.8px;
    }
    
    .summary-value {
      font-size: 26px;
      font-weight: 700;
      color: #1e3a8a;
    }
    
    /* Modern Two-Column Table */
    .table-container {
      margin: 30px 0;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      background: white;
    }
    
    thead {
      background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
    }
    
    th {
      color: white;
      padding: 16px 20px;
      text-align: left;
      font-weight: 600;
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      border-right: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    th:last-child {
      border-right: none;
    }
    
    th.divider {
      background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%);
      border-left: 2px solid rgba(255, 255, 255, 0.2);
    }
    
    td {
      padding: 14px 20px;
      border-bottom: 1px solid #e2e8f0;
      font-size: 15px;
      color: #334155;
    }
    
    td.index {
      font-weight: 700;
      color: #64748b;
      width: 60px;
      text-align: center;
      background: #f8fafc;
    }
    
    td.name {
      font-weight: 500;
      color: #0f172a;
    }
    
    td.status {
      text-align: center;
      width: 100px;
    }
    
    td.divider {
      background: #f1f5f9;
      border-left: 2px solid #cbd5e1;
      border-right: 2px solid #cbd5e1;
    }
    
    tbody tr:hover {
      background: #f8fafc;
    }
    
    tbody tr:last-child td {
      border-bottom: none;
    }
    
    .status-badge {
      display: inline-block;
      padding: 5px 12px;
      border-radius: 6px;
      font-weight: 600;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .status-paid {
      background: #dcfce7;
      color: #15803d;
      border: 1px solid #86efac;
    }
    
    .status-unpaid {
      background: #fef3c7;
      color: #b45309;
      border: 1px solid #fcd34d;
    }
    
    .totals-section {
      margin-top: 35px;
      background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
      border: 2px solid #86efac;
      padding: 28px;
      border-radius: 12px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 30px;
    }
    
    .total-item {
      text-align: center;
    }
    
    .total-label {
      font-size: 12px;
      font-weight: 700;
      color: #15803d;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      margin-bottom: 8px;
    }
    
    .total-value {
      font-size: 30px;
      font-weight: 700;
      color: #15803d;
    }
    
    .total-value.remaining {
      color: #c2410c;
    }
    
    .notes-section {
      margin-top: 35px;
      padding: 25px;
      background: linear-gradient(135deg, #fefce8 0%, #fef9c3 100%);
      border-left: 5px solid #eab308;
      border-radius: 8px;
    }
    
    .notes-label {
      font-weight: 700;
      color: #854d0e;
      margin-bottom: 12px;
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 0.8px;
    }
    
    .notes-content {
      color: #713f12;
      line-height: 1.7;
      font-size: 15px;
    }
    
    .signature-section {
      margin-top: 50px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 60px;
    }
    
    .signature-box {
      text-align: center;
      padding-top: 20px;
    }
    
    .signature-label {
      font-weight: 700;
      color: #475569;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      margin-bottom: 50px;
    }
    
    .signature-line {
      border-top: 2px solid #94a3b8;
      padding-top: 8px;
      color: #94a3b8;
      font-size: 11px;
    }
    
    .footer {
      margin-top: 50px;
      padding-top: 25px;
      border-top: 3px solid #e2e8f0;
      text-align: center;
    }
    
    .footer p {
      margin: 6px 0;
      color: #64748b;
      font-size: 13px;
    }
    
    .footer strong {
      color: #334155;
      font-size: 15px;
    }
    
    @media print {
      body { 
        padding: 20px;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Death Support Payment Record</h1>
    <p><strong>Deceased:</strong> ${record.deceased_name}</p>
    <p><strong>Generated:</strong> ${new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })}</p>
  </div>

  <div class="info-section">
    <div>
      <div class="info-item">
        <div class="info-label">Death Type</div>
        <div class="info-value">${
          record.death_type === "local" ? "Local Death" : "External Death"
        }</div>
      </div>
      <div class="info-item">
        <div class="info-label">Family ID</div>
        <div class="info-value">#${record.family_id}</div>
      </div>
      ${
        record.relationship
          ? `
      <div class="info-item">
        <div class="info-label">Relationship</div>
        <div class="info-value">${record.relationship}</div>
      </div>
      `
          : ""
      }
    </div>
    <div>
      <div class="info-item">
        <div class="info-label">Amount per Member</div>
        <div class="info-value">${formatCurrency(
          record.amount_per_member
        )}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Created Date</div>
        <div class="info-value">${formatDate(record.created_at)}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Recorded By</div>
        <div class="info-value">User #${record.recorded_by}</div>
      </div>
    </div>
  </div>

  <div class="summary">
    <div class="summary-card">
      <div class="summary-label">Total Families</div>
      <div class="summary-value">${totalfamilies}</div>
    </div>
    <div class="summary-card">
      <div class="summary-label">Paid</div>
      <div class="summary-value" style="color: #15803d;">${paidfamilies}</div>
    </div>
    <div class="summary-card">
      <div class="summary-label">Pending</div>
      <div class="summary-value" style="color: #c2410c;">${
        totalfamilies - paidfamilies
      }</div>
    </div>
    <div class="summary-card">
      <div class="summary-label">Total Expected</div>
      <div class="summary-value">${formatCurrency(totalExpected)}</div>
    </div>
  </div>

  <div class="table-container">
    <table>
      <thead>
        <tr>
          <th style="width: 8%;">#</th>
          <th style="width: 30%;">Family Name</th>
          <th style="width: 12%;">Status</th>
          <th class="divider" style="width: 8%;">#</th>
          <th style="width: 30%;">Family Name</th>
          <th style="width: 12%;">Status</th>
        </tr>
      </thead>
      <tbody>
        ${leftColumn
          .map((leftMember, index) => {
            const rightMember = rightColumn[index];
            const leftIndex = index;
            const rightIndex = half + index;
            
            return `
        <tr>
          <td class="index">${leftIndex + 1}</td>
          <td class="name">${leftMember.name}</td>
          <td class="status">
            <span class="status-badge ${
              leftMember.paid_at !== null ? "status-paid" : "status-unpaid"
            }">
              ${leftMember.paid_at !== null ? "Paid" : "Unpaid"}
            </span>
          </td>
          ${
            rightMember
              ? `
          <td class="index divider">${rightIndex + 1}</td>
          <td class="name">${rightMember.name}</td>
          <td class="status">
            <span class="status-badge ${
              rightMember.paid_at !== null ? "status-paid" : "status-unpaid"
            }">
              ${rightMember.paid_at !== null ? "Paid" : "Unpaid"}
            </span>
          </td>
          `
              : `
          <td class="index divider"></td>
          <td class="name"></td>
          <td class="status"></td>
          `
          }
        </tr>
            `;
          })
          .join("")}
      </tbody>
    </table>
  </div>

  <div class="totals-section">
    <div class="total-item">
      <div class="total-label">Total Collected</div>
      <div class="total-value">${formatCurrency(totalCollected)}</div>
    </div>
    <div class="total-item">
      <div class="total-label">Remaining Balance</div>
      <div class="total-value remaining">${formatCurrency(
        totalExpected - totalCollected
      )}</div>
    </div>
  </div>

  ${
    record.notes
      ? `
  <div class="notes-section">
    <div class="notes-label">Notes</div>
    <div class="notes-content">${record.notes}</div>
  </div>
  `
      : ""
  }

  <div class="signature-section">
    <div class="signature-box">
      <div class="signature-label">Prepared By</div>
      <div class="signature-line">_______________________</div>
      <div style="margin-top: 6px; color: #94a3b8; font-size: 11px;">Name & Signature</div>
    </div>
    <div class="signature-box">
      <div class="signature-label">Verified By</div>
      <div class="signature-line">_______________________</div>
      <div style="margin-top: 6px; color: #94a3b8; font-size: 11px;">Name & Signature</div>
    </div>
  </div>

  <div class="footer">
    <p><strong>Death Support Management System</strong></p>
    <p>This is an official record. Please keep for future reference.</p>
    <p>Printed on: ${new Date().toLocaleString()}</p>
  </div>
</body>
</html>
    `;

  const container = document.createElement("div");
  container.innerHTML = pdfContent;

  const options = {
    margin: 10,
    filename: `Death-Support-${record.deceased_name}.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  };

  await html2pdf().set(options).from(container).save();

  setGeneratingPdf(false);
};

export default generatePDF;