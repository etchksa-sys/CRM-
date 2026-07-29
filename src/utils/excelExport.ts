import { Deal, Contact, UserAccount } from '../types';
import { STAGE_LABELS, STATUS_LABELS, SOURCE_LABELS, PRIORITY_LABELS, getRoleLabel } from '../data/mockData';

/**
 * Core function to export data to an Excel-compatible CSV file with UTF-8 BOM for full Arabic support.
 */
export function exportToExcelCSV(filename: string, headers: string[], rows: (string | number)[][]): void {
  // Add UTF-8 BOM so Microsoft Excel opens Arabic text correctly without encoding corruption
  const BOM = '\uFEFF';
  
  // Format headers and rows
  const csvHeaders = headers.map(h => `"${String(h).replace(/"/g, '""')}"`).join(',');
  const csvRows = rows.map(row => 
    row.map(cell => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(',')
  );
  
  const csvContent = BOM + [csvHeaders, ...csvRows].join('\r\n');
  
  // Create Blob and download link
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export Deals to Excel CSV
 */
export function exportDealsToExcel(deals: Deal[]): void {
  const headers = [
    'معرف الصفقة',
    'عنوان الصفقة',
    'اسم العميل / الشركة',
    'مسؤول التواصل',
    'القيمة (ر.س)',
    'المرحلة البيعية',
    'نسبة الاحتمالية (%)',
    'الأولوية',
    'تاريخ الإغلاق المتوقع',
    'المندوب المسؤول'
  ];

  const rows = deals.map(d => [
    d.id,
    d.title,
    d.company,
    d.contactName,
    d.value,
    STAGE_LABELS[d.stage] || d.stage,
    `${d.probability}%`,
    PRIORITY_LABELS[d.priority] || d.priority,
    d.expectedCloseDate,
    d.assignedTo
  ]);

  exportDealsToExcelCustom('تقرير_الصفقات_والمبيعات.csv', headers, rows);
}

function exportDealsToExcelCustom(filename: string, headers: string[], rows: (string | number)[][]): void {
  exportToExcelCSV(filename, headers, rows);
}

/**
 * Export Contacts to Excel CSV
 */
export function exportContactsToExcel(contacts: Contact[]): void {
  const headers = [
    'معرف العميل',
    'الاسم الكامل',
    'الشركة / المؤسسة',
    'المسمى الوظيفي',
    'البريد الإلكتروني',
    'رقم الهاتف',
    'حالة الحساب',
    'المصدر',
    'تاريخ التسجيل',
    'المندوب المسؤول'
  ];

  const rows = contacts.map(c => [
    c.id,
    c.name,
    c.company,
    c.tags ? c.tags.join(' | ') : '-',
    c.email,
    c.phone,
    STATUS_LABELS[c.status] || c.status,
    SOURCE_LABELS[c.source] || c.source,
    c.createdAt,
    c.assignedTo
  ]);

  exportToExcelCSV('تقرير_العملاء_والحسابات.csv', headers, rows);
}

/**
 * Export Team / Users Performance to Excel CSV
 */
export function exportUsersToExcel(users: UserAccount[]): void {
  const headers = [
    'معرف الموظف',
    'اسم الموظف',
    'البريد الإلكتروني',
    'الدور الوظيفي',
    'المستهدف البيعي (ر.س)',
    'فترة المستهدف',
    'الإيراد المحقق (ر.س)',
    'نسبة التحقيق (%)',
    'معدل إغلاق الصفقات (%)',
    'تقييم الأداء (KPI)',
    'حالة الاتصال',
    'ملاحظات تقييم المدير'
  ];

  const rows = users.map(u => {
    const target = u.monthlyTarget || 1;
    const achievePct = Math.round((u.revenueGenerated / target) * 100);
    const periodLabel = u.targetPeriod === 'quarterly' ? 'ربع سنوي' : u.targetPeriod === 'half_yearly' ? 'نصف سنوي' : u.targetPeriod === 'yearly' ? 'سنوي' : 'شهري';
    
    return [
      u.id,
      u.name,
      u.email,
      getRoleLabel(u.role),
      u.monthlyTarget || 0,
      periodLabel,
      u.revenueGenerated,
      `${achievePct}%`,
      `${u.conversionRate}%`,
      `${u.kpiScore || 85}/100`,
      u.status === 'active' ? 'نشط متصل' : 'غير متصل',
      u.managerFeedback || 'لا توجد ملاحظات'
    ];
  });

  exportToExcelCSV('تقرير_أداء_فريق_المبيعات.csv', headers, rows);
}

/**
 * Export Full System Backup (Deals, Contacts, Users) into a multi-section Excel CSV
 */
export function exportFullSystemToExcel(deals: Deal[], contacts: Contact[], users: UserAccount[]): void {
  const headers = ['نوع السجل', 'المعرف', 'الاسم / العنوان', 'الشركة / التفاصيل', 'القيمة / المستهدف', 'المرحلة / الحالة', 'المسؤول / الدور'];
  
  const dealRows = deals.map(d => [
    'صفقة بيع',
    d.id,
    d.title,
    d.company,
    `${d.value.toLocaleString()} ر.س`,
    STAGE_LABELS[d.stage] || d.stage,
    d.assignedTo
  ]);

  const contactRows = contacts.map(c => [
    'عميل / حساب',
    c.id,
    c.name,
    c.company,
    c.phone,
    STATUS_LABELS[c.status] || c.status,
    c.assignedTo
  ]);

  const userRows = users.map(u => [
    'موظف / مندوب',
    u.id,
    u.name,
    u.email,
    `${(u.monthlyTarget || 0).toLocaleString()} ر.س (${u.targetPeriod === 'quarterly' ? 'ربع سنوي' : u.targetPeriod === 'yearly' ? 'سنوي' : 'شهري'})`,
    `محقق: ${(u.revenueGenerated || 0).toLocaleString()} ر.س`,
    getRoleLabel(u.role)
  ]);

  const allRows = [
    ...dealRows,
    ['---', '---', '---', '---', '---', '---', '---'],
    ...contactRows,
    ['---', '---', '---', '---', '---', '---', '---'],
    ...userRows
  ];

  exportToExcelCSV('نسخة_احتياطية_شاملة_CRM.csv', headers, allRows);
}
