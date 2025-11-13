import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import type { Pothole } from '../types/pothole';

interface ReportStats {
  total: number;
  byStatus: {
    new: number;
    in_progress: number;
    scheduled: number;
    completed: number;
  };
  totalCost: number;
  avgSeverity: number;
  completionRate: number;
}

interface ReportFilters {
  startDate: string;
  endDate: string;
  ward: string;
}

export const generatePDFReport = (
  potholes: Pothole[],
  stats: ReportStats,
  reportType: string,
  filters: ReportFilters
) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Header
  doc.setFontSize(20);
  doc.setTextColor(25, 118, 210);
  doc.text('Brampton Pothole Management Report', pageWidth / 2, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setTextColor(100);
  doc.text(`Report Type: ${reportType.charAt(0).toUpperCase() + reportType.slice(1)}`, 14, 35);
  doc.text(`Period: ${filters.startDate} to ${filters.endDate}`, 14, 42);
  doc.text(`Ward: ${filters.ward === 'all' ? 'All Wards' : filters.ward}`, 14, 49);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 56);
  
  // Executive Summary
  doc.setFontSize(14);
  doc.setTextColor(0);
  doc.text('Executive Summary', 14, 70);
  
  doc.setFontSize(10);
  const summaryData = [
    ['Total Detections', stats.total.toString()],
    ['Completed Repairs', `${stats.byStatus.completed} (${stats.completionRate.toFixed(1)}%)`],
    ['In Progress', stats.byStatus.in_progress.toString()],
    ['Scheduled', stats.byStatus.scheduled.toString()],
    ['New/Pending', stats.byStatus.new.toString()],
    ['Total Estimated Cost', `$${stats.totalCost.toLocaleString()} CAD`],
    ['Average Severity', stats.avgSeverity.toFixed(2)],
  ];
  
  autoTable(doc, {
    startY: 75,
    head: [['Metric', 'Value']],
    body: summaryData,
    theme: 'grid',
    headStyles: { fillColor: [25, 118, 210] },
  });
  
  // Detailed Breakdown by Ward
  if (reportType === 'ward' || reportType === 'detailed') {
    const wards = Array.from(new Set(potholes.map(p => p.ward).filter(Boolean)));
    const wardData = wards.map(ward => {
      const wardPotholes = potholes.filter(p => p.ward === ward);
      const wardCompleted = wardPotholes.filter(p => p.status === 'completed').length;
      const wardCost = wardPotholes.reduce((sum, p) => sum + p.estimated_repair_cost_cad, 0);
      return [
        ward || 'Unknown',
        wardPotholes.length.toString(),
        wardCompleted.toString(),
        `${((wardCompleted / wardPotholes.length) * 100).toFixed(1)}%`,
        `$${wardCost.toLocaleString()}`,
      ];
    });
    
    doc.addPage();
    doc.setFontSize(14);
    doc.text('Ward Breakdown', 14, 20);
    
    autoTable(doc, {
      startY: 25,
      head: [['Ward', 'Total', 'Completed', 'Rate', 'Cost']],
      body: wardData,
      theme: 'striped',
      headStyles: { fillColor: [25, 118, 210] },
    });
  }
  
  // Cost Analysis
  if (reportType === 'cost' || reportType === 'detailed') {
    doc.addPage();
    doc.setFontSize(14);
    doc.text('Cost Analysis', 14, 20);
    
    const costByStatus = [
      ['New', potholes.filter(p => p.status === 'new').reduce((sum, p) => sum + p.estimated_repair_cost_cad, 0)],
      ['In Progress', potholes.filter(p => p.status === 'in_progress').reduce((sum, p) => sum + p.estimated_repair_cost_cad, 0)],
      ['Scheduled', potholes.filter(p => p.status === 'scheduled').reduce((sum, p) => sum + p.estimated_repair_cost_cad, 0)],
      ['Completed', potholes.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.estimated_repair_cost_cad, 0)],
    ].map(([status, cost]) => [status, `$${(cost as number).toLocaleString()} CAD`]);
    
    autoTable(doc, {
      startY: 25,
      head: [['Status', 'Total Cost']],
      body: costByStatus,
      theme: 'grid',
      headStyles: { fillColor: [25, 118, 210] },
    });
  }
  
  // Recent Detections (last 20)
  if (reportType === 'detailed') {
    doc.addPage();
    doc.setFontSize(14);
    doc.text('Recent Detections (Last 20)', 14, 20);
    
    const recentData = potholes.slice(0, 20).map(p => [
      p.id,
      new Date(p.detected_at).toLocaleDateString(),
      p.ward || '-',
      p.status.replace('_', ' '),
      p.severity.toFixed(2),
      `$${p.estimated_repair_cost_cad}`,
    ]);
    
    autoTable(doc, {
      startY: 25,
      head: [['ID', 'Date', 'Ward', 'Status', 'Severity', 'Cost']],
      body: recentData,
      theme: 'striped',
      headStyles: { fillColor: [25, 118, 210] },
      styles: { fontSize: 8 },
    });
  }
  
  // Save PDF
  const filename = `pothole-report-${reportType}-${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(filename);
};

export const generateExcelReport = (
  potholes: Pothole[],
  stats: ReportStats,
  reportType: string,
  filters: ReportFilters
) => {
  const wb = XLSX.utils.book_new();
  
  // Summary Sheet
  const summaryData = [
    ['Brampton Pothole Management Report'],
    [''],
    ['Report Type', reportType.charAt(0).toUpperCase() + reportType.slice(1)],
    ['Period', `${filters.startDate} to ${filters.endDate}`],
    ['Ward', filters.ward === 'all' ? 'All Wards' : filters.ward],
    ['Generated', new Date().toLocaleString()],
    [''],
    ['EXECUTIVE SUMMARY'],
    ['Total Detections', stats.total],
    ['Completed Repairs', `${stats.byStatus.completed} (${stats.completionRate.toFixed(1)}%)`],
    ['In Progress', stats.byStatus.in_progress],
    ['Scheduled', stats.byStatus.scheduled],
    ['New/Pending', stats.byStatus.new],
    ['Total Estimated Cost', `$${stats.totalCost.toLocaleString()} CAD`],
    ['Average Severity', stats.avgSeverity.toFixed(2)],
  ];
  
  const ws1 = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(wb, ws1, 'Summary');
  
  // Detailed Data Sheet
  const detailedData = potholes.map(p => ({
    ID: p.id,
    'Detected Date': new Date(p.detected_at).toLocaleString(),
    Ward: p.ward || '-',
    'Road Name': p.road_name || '-',
    Status: p.status.replace('_', ' '),
    Priority: p.priority || '-',
    Severity: p.severity,
    'Estimated Cost (CAD)': p.estimated_repair_cost_cad,
    Latitude: p.lat,
    Longitude: p.lng,
    Source: p.source,
    Description: p.description || '-',
  }));
  
  const ws2 = XLSX.utils.json_to_sheet(detailedData);
  XLSX.utils.book_append_sheet(wb, ws2, 'Detailed Data');
  
  // Ward Analysis Sheet
  const wards = Array.from(new Set(potholes.map(p => p.ward).filter(Boolean)));
  const wardAnalysis = wards.map(ward => {
    const wardPotholes = potholes.filter(p => p.ward === ward);
    const wardCompleted = wardPotholes.filter(p => p.status === 'completed').length;
    const wardCost = wardPotholes.reduce((sum, p) => sum + p.estimated_repair_cost_cad, 0);
    return {
      Ward: ward,
      'Total Detections': wardPotholes.length,
      'Completed': wardCompleted,
      'Completion Rate': `${((wardCompleted / wardPotholes.length) * 100).toFixed(1)}%`,
      'Total Cost (CAD)': wardCost,
      'Average Cost': Math.round(wardCost / wardPotholes.length),
    };
  });
  
  const ws3 = XLSX.utils.json_to_sheet(wardAnalysis);
  XLSX.utils.book_append_sheet(wb, ws3, 'Ward Analysis');
  
  // Status Breakdown Sheet
  const statusBreakdown = [
    { Status: 'New', Count: stats.byStatus.new, Cost: potholes.filter(p => p.status === 'new').reduce((sum, p) => sum + p.estimated_repair_cost_cad, 0) },
    { Status: 'In Progress', Count: stats.byStatus.in_progress, Cost: potholes.filter(p => p.status === 'in_progress').reduce((sum, p) => sum + p.estimated_repair_cost_cad, 0) },
    { Status: 'Scheduled', Count: stats.byStatus.scheduled, Cost: potholes.filter(p => p.status === 'scheduled').reduce((sum, p) => sum + p.estimated_repair_cost_cad, 0) },
    { Status: 'Completed', Count: stats.byStatus.completed, Cost: potholes.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.estimated_repair_cost_cad, 0) },
  ];
  
  const ws4 = XLSX.utils.json_to_sheet(statusBreakdown);
  XLSX.utils.book_append_sheet(wb, ws4, 'Status Breakdown');
  
  // Save Excel
  const filename = `pothole-report-${reportType}-${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(wb, filename);
};

export const generateCSVReport = (potholes: Pothole[]) => {
  const csvData = potholes.map(p => ({
    ID: p.id,
    'Detected Date': new Date(p.detected_at).toLocaleString(),
    Ward: p.ward || '-',
    'Road Name': p.road_name || '-',
    Status: p.status.replace('_', ' '),
    Priority: p.priority || '-',
    Severity: p.severity,
    'Estimated Cost (CAD)': p.estimated_repair_cost_cad,
    Latitude: p.lat,
    Longitude: p.lng,
    Source: p.source,
    Description: p.description || '-',
  }));
  
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(csvData);
  XLSX.utils.book_append_sheet(wb, ws, 'Potholes');
  
  const filename = `potholes-data-${new Date().toISOString().split('T')[0]}.csv`;
  XLSX.writeFile(wb, filename, { bookType: 'csv' });
};
