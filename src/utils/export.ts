import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Sale, Expense } from '../types';
import { formatCurrency } from './pricing';

export interface ExportData {
  period: string;
  type: 'day' | 'month' | 'year';
  summary: {
    totalIncome: number;
    totalExpenses: number;
    profit: number;
  };
  sales: Sale[];
  expenses: Expense[];
}

export const exportToExcel = (data: ExportData) => {
  try {
    // Create a new workbook
    const workbook = XLSX.utils.book_new();

    // Summary sheet
    const summaryData = [
      ['Laporan Manajemen Es Batu Pua Ranga'],
      ['Periode:', data.period],
      ['Tanggal Export:', new Date().toLocaleDateString('id-ID')],
      [],
      ['RINGKASAN KEUANGAN'],
      ['Total Pemasukan:', formatCurrency(data.summary.totalIncome)],
      ['Total Pengeluaran:', formatCurrency(data.summary.totalExpenses)],
      ['Laba/Rugi:', formatCurrency(data.summary.profit)],
      [],
      ['DETAIL TRANSAKSI'],
      ['Jumlah Penjualan:', `${data.sales.length} transaksi`],
      ['Jumlah Pengeluaran:', `${data.expenses.length} transaksi`],
    ];
    
    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Ringkasan');

    // Sales sheet
    if (data.sales.length > 0) {
      const salesData = [
        ['RIWAYAT PENJUALAN'],
        ['Tanggal', 'Jumlah Es Batu', 'Total Harga'],
        ...data.sales.map(sale => [
          new Date(sale.date).toLocaleDateString('id-ID'),
          sale.quantity,
          sale.totalPrice
        ])
      ];
      
      const salesSheet = XLSX.utils.aoa_to_sheet(salesData);
      XLSX.utils.book_append_sheet(workbook, salesSheet, 'Penjualan');
    }

    // Expenses sheet
    if (data.expenses.length > 0) {
      const expensesData = [
        ['RIWAYAT PENGELUARAN'],
        ['Tanggal', 'Nama Pengeluaran', 'Jumlah'],
        ...data.expenses.map(expense => [
          new Date(expense.date).toLocaleDateString('id-ID'),
          expense.name,
          expense.amount
        ])
      ];
      
      const expensesSheet = XLSX.utils.aoa_to_sheet(expensesData);
      XLSX.utils.book_append_sheet(workbook, expensesSheet, 'Pengeluaran');
    }

    // Generate filename
    const fileName = `Laporan_Es_Batu_${data.period.replace(/\//g, '-')}_${new Date().toISOString().split('T')[0]}.xlsx`;
    
    // Save file
    XLSX.writeFile(workbook, fileName);
    
    return { success: true, fileName };
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    return { success: false, error: 'Gagal mengexport ke Excel' };
  }
};

export const exportToPDF = async (data: ExportData) => {
  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const margin = 20;
    let yPosition = margin;

    // Title
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Laporan Manajemen Es Batu Pua Ranga', margin, yPosition);
    yPosition += 15;

    // Period info
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Periode: ${data.period}`, margin, yPosition);
    yPosition += 8;
    pdf.text(`Tanggal Export: ${new Date().toLocaleDateString('id-ID')}`, margin, yPosition);
    yPosition += 15;

    // Summary section
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('RINGKASAN KEUANGAN', margin, yPosition);
    yPosition += 10;

    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Total Pemasukan: ${formatCurrency(data.summary.totalIncome)}`, margin, yPosition);
    yPosition += 8;
    pdf.text(`Total Pengeluaran: ${formatCurrency(data.summary.totalExpenses)}`, margin, yPosition);
    yPosition += 8;
    
    // Profit/Loss with color
    const profitColor = data.summary.profit >= 0 ? [0, 128, 0] : [255, 0, 0];
    pdf.setTextColor(profitColor[0], profitColor[1], profitColor[2]);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`Laba/Rugi: ${formatCurrency(data.summary.profit)}`, margin, yPosition);
    pdf.setTextColor(0, 0, 0);
    yPosition += 15;

    // Sales section
    if (data.sales.length > 0) {
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('RIWAYAT PENJUALAN', margin, yPosition);
      yPosition += 10;

      // Table headers
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Tanggal', margin, yPosition);
      pdf.text('Qty', margin + 40, yPosition);
      pdf.text('Total Harga', margin + 70, yPosition);
      yPosition += 8;

      // Table data
      pdf.setFont('helvetica', 'normal');
      data.sales.slice(0, 15).forEach(sale => { // Limit to prevent overflow
        if (yPosition > 250) { // Add new page if needed
          pdf.addPage();
          yPosition = margin;
        }
        pdf.text(new Date(sale.date).toLocaleDateString('id-ID'), margin, yPosition);
        pdf.text(sale.quantity.toString(), margin + 40, yPosition);
        pdf.text(formatCurrency(sale.totalPrice), margin + 70, yPosition);
        yPosition += 6;
      });

      if (data.sales.length > 15) {
        pdf.setFont('helvetica', 'italic');
        pdf.text(`... dan ${data.sales.length - 15} transaksi lainnya`, margin, yPosition);
        yPosition += 10;
      }
    }

    // Generate filename
    const fileName = `Laporan_Es_Batu_${data.period.replace(/\//g, '-')}_${new Date().toISOString().split('T')[0]}.pdf`;
    
    // Save file
    pdf.save(fileName);
    
    return { success: true, fileName };
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    return { success: false, error: 'Gagal mengexport ke PDF' };
  }
};

export const printReport = async (elementId: string) => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      return { success: false, error: 'Element tidak ditemukan' };
    }

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    const fileName = `Laporan_Print_${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(fileName);
    
    return { success: true, fileName };
  } catch (error) {
    console.error('Error printing report:', error);
    return { success: false, error: 'Gagal mencetak laporan' };
  }
};
