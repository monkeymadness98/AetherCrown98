"""
Financial Report PDF Generator
Uses ReportLab to generate professional PDF reports
"""
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_RIGHT
from datetime import datetime
from io import BytesIO
from typing import Dict, List

class FinancialReportGenerator:
    """Generate professional financial PDF reports"""
    
    def __init__(self):
        self.styles = getSampleStyleSheet()
        self._setup_custom_styles()
    
    def _setup_custom_styles(self):
        """Setup custom paragraph styles"""
        # Title style
        self.styles.add(ParagraphStyle(
            name='CustomTitle',
            parent=self.styles['Title'],
            fontSize=24,
            textColor=colors.HexColor('#00A86B'),
            spaceAfter=30,
            alignment=TA_CENTER
        ))
        
        # Subtitle style
        self.styles.add(ParagraphStyle(
            name='CustomSubtitle',
            parent=self.styles['Normal'],
            fontSize=14,
            textColor=colors.HexColor('#FFD700'),
            spaceAfter=20,
            alignment=TA_CENTER
        ))
        
        # Section header style
        self.styles.add(ParagraphStyle(
            name='SectionHeader',
            parent=self.styles['Heading2'],
            fontSize=16,
            textColor=colors.HexColor('#00A86B'),
            spaceAfter=12,
            spaceBefore=12
        ))
    
    def generate_report(self, data: Dict) -> BytesIO:
        """
        Generate comprehensive financial report PDF
        
        Args:
            data: Dictionary containing financial data
            
        Returns:
            BytesIO object containing PDF data
        """
        buffer = BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=letter)
        story = []
        
        # Title
        title = Paragraph("AetherCrown98 Financial Report", self.styles['CustomTitle'])
        story.append(title)
        
        # Date
        date_str = datetime.now().strftime("%B %d, %Y")
        subtitle = Paragraph(f"Generated on {date_str}", self.styles['CustomSubtitle'])
        story.append(subtitle)
        story.append(Spacer(1, 0.3 * inch))
        
        # AI Summary Section
        story.append(Paragraph("Empire Performance Summary", self.styles['SectionHeader']))
        
        summary_text = f"""
        Your autonomous business empire is performing exceptionally well. 
        Total revenue has reached <b>${data.get('totalRevenue', 0):,.2f}</b> with a 
        healthy subscription distribution across all tiers. The AI-driven automation 
        continues to optimize operations and maximize profitability.
        """
        story.append(Paragraph(summary_text, self.styles['Normal']))
        story.append(Spacer(1, 0.3 * inch))
        
        # Revenue Overview
        story.append(Paragraph("Revenue Overview", self.styles['SectionHeader']))
        
        revenue_data = [
            ['Metric', 'Value'],
            ['Total Revenue', f"${data.get('totalRevenue', 0):,.2f}"],
            ['Active Subscriptions', str(sum([s.get('value', 0) for s in data.get('subscriptions', [])]))],
            ['Average Transaction', f"${self._calculate_avg_transaction(data):,.2f}"]
        ]
        
        revenue_table = Table(revenue_data, colWidths=[3*inch, 2*inch])
        revenue_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#00A86B')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 12),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        story.append(revenue_table)
        story.append(Spacer(1, 0.3 * inch))
        
        # Subscription Breakdown
        story.append(Paragraph("Subscription Breakdown", self.styles['SectionHeader']))
        
        subscription_data = [['Plan', 'Subscribers', 'Revenue', 'Percentage']]
        total_revenue = data.get('totalRevenue', 1)
        
        for sub in data.get('subscriptions', []):
            percentage = (sub.get('revenue', 0) / total_revenue * 100) if total_revenue > 0 else 0
            subscription_data.append([
                sub.get('name', 'Unknown'),
                str(sub.get('value', 0)),
                f"${sub.get('revenue', 0):,.2f}",
                f"{percentage:.1f}%"
            ])
        
        sub_table = Table(subscription_data, colWidths=[1.5*inch, 1.5*inch, 1.5*inch, 1.5*inch])
        sub_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#FFD700')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.black),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 11),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.lightgrey),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        story.append(sub_table)
        story.append(Spacer(1, 0.3 * inch))
        
        # Recent Transactions
        story.append(Paragraph("Recent Transactions", self.styles['SectionHeader']))
        
        transaction_data = [['Date', 'Type', 'Amount']]
        for trans in data.get('transactions', [])[:10]:  # Last 10 transactions
            transaction_data.append([
                trans.get('date', 'N/A'),
                trans.get('type', 'Unknown').capitalize(),
                f"${trans.get('amount', 0):,.2f}"
            ])
        
        trans_table = Table(transaction_data, colWidths=[2*inch, 2*inch, 2*inch])
        trans_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#00A86B')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 11),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.white),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        story.append(trans_table)
        
        # Footer
        story.append(Spacer(1, 0.5 * inch))
        footer_text = f"""
        <para align=center>
        <i>Generated by AetherCrown98 AI-Driven Business Empire</i><br/>
        <font color="#00A86B">Confidential Financial Report</font>
        </para>
        """
        story.append(Paragraph(footer_text, self.styles['Normal']))
        
        # Build PDF
        doc.build(story)
        buffer.seek(0)
        return buffer
    
    def _calculate_avg_transaction(self, data: Dict) -> float:
        """Calculate average transaction amount"""
        transactions = data.get('transactions', [])
        if not transactions:
            return 0.0
        total = sum(t.get('amount', 0) for t in transactions)
        return total / len(transactions)

# FastAPI endpoint integration
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse

router = APIRouter()

@router.post("/export/report")
async def export_financial_report(data: Dict):
    """
    Generate and download financial report as PDF
    
    POST /export/report
    Body: Financial data dictionary
    """
    try:
        generator = FinancialReportGenerator()
        pdf_buffer = generator.generate_report(data)
        
        return StreamingResponse(
            pdf_buffer,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"attachment; filename=financial-report-{datetime.now().strftime('%Y%m%d')}.pdf"
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF generation failed: {str(e)}")
