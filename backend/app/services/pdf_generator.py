# app/services/pdf_generator.py
"""
PDF Generator für Durchgangsarztbericht (F1000)
"""

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm, cm
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, PageBreak
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from io import BytesIO
from datetime import datetime
from typing import Optional
import os


class F1000PDFGenerator:
    """Generator für das F1000 Durchgangsarztbericht-Formular"""
    
    def __init__(self):
        self.page_width, self.page_height = A4
        self.margin_left = 15 * mm
        self.margin_right = 15 * mm
        self.margin_top = 12 * mm
        self.margin_bottom = 12 * mm
        self.content_width = self.page_width - self.margin_left - self.margin_right
        
        # Styles
        self.styles = getSampleStyleSheet()
        self._setup_styles()
    
    def _setup_styles(self):
        """Custom Styles für das Formular"""
        self.styles.add(ParagraphStyle(
            name='FormHeader',
            fontSize=10,
            leading=12,
            fontName='Helvetica-Bold'
        ))
        self.styles.add(ParagraphStyle(
            name='FormLabel',
            fontSize=7,
            leading=9,
            fontName='Helvetica'
        ))
        self.styles.add(ParagraphStyle(
            name='FormValue',
            fontSize=9,
            leading=11,
            fontName='Helvetica'
        ))
        self.styles.add(ParagraphStyle(
            name='FormSmall',
            fontSize=6,
            leading=8,
            fontName='Helvetica'
        ))
        self.styles.add(ParagraphStyle(
            name='SectionNumber',
            fontSize=8,
            leading=10,
            fontName='Helvetica-Bold'
        ))
    
    def _format_date(self, date_str: Optional[str]) -> str:
        """Datum formatieren"""
        if not date_str:
            return ""
        try:
            date_obj = datetime.strptime(date_str, "%Y-%m-%d")
            return date_obj.strftime("%d.%m.%Y")
        except:
            return date_str or ""
    
    def _format_time(self, time_val) -> str:
        if hasattr(time_val, 'strftime'):  # datetime.time
            return time_val.strftime("%H:%M")
        if isinstance(time_val, str):
            return time_val[:5]
        return str(time_val) if time_val else ""
    
    def _checkbox(self, checked: bool) -> str:
        """Checkbox Symbol"""
        return "☒" if checked else "☐"
    
    def _draw_header(self, c: canvas.Canvas, y: float, for_kasse: bool = False) -> float:
        """Kopfzeile zeichnen"""
        # Formular-Kennung links oben
        c.setFont("Helvetica", 7)
        c.drawString(self.margin_left, self.page_height - 10*mm, "F 1000 0718 Durchgangsarztbericht")
        
        # Titel
        c.setFont("Helvetica-Bold", 12)
        title = "Durchgangsarztbericht - Für die Krankenkasse -" if for_kasse else "Durchgangsarztbericht"
        c.drawString(self.margin_left, y, title)
        
        if not for_kasse:
            c.setFont("Helvetica", 10)
            c.drawString(self.margin_left + 120*mm, y, "UV-Träger")
        
        return y - 8*mm
    
    def _draw_text_field(self, c: canvas.Canvas, x: float, y: float, 
                         label: str, value: str, width: float, height: float = 12*mm,
                         label_above: bool = True):
        """Textfeld mit Label zeichnen"""
        # Rahmen
        c.setStrokeColor(colors.black)
        c.setLineWidth(0.5)
        c.rect(x, y - height, width, height)
        
        # Label
        c.setFont("Helvetica", 6)
        if label_above:
            c.drawString(x + 1*mm, y - 3*mm, label)
            # Wert
            c.setFont("Helvetica", 9)
            c.drawString(x + 1*mm, y - height + 2*mm, str(value or ""))
        else:
            c.drawString(x + 1*mm, y - height + 1*mm, label)
            c.setFont("Helvetica", 9)
            c.drawString(x + 1*mm, y - 4*mm, str(value or ""))
    
    def _draw_checkbox_field(self, c: canvas.Canvas, x: float, y: float,
                             label: str, checked: bool):
        """Checkbox mit Label"""
        c.setFont("Helvetica", 8)
        checkbox = "☒" if checked else "☐"
        c.drawString(x, y, f"{checkbox} {label}")
    
    def generate_uv_traeger_pdf(self, bericht: dict, patient: dict, 
                                 arzt: dict, unfallbetrieb: dict = None,
                                 uv_traeger: dict = None, krankenkasse: dict = None) -> BytesIO:
        """
        Generiert das PDF für den UV-Träger (Seite 1-2)
        """
        buffer = BytesIO()
        c = canvas.Canvas(buffer, pagesize=A4)
        
        # === SEITE 1 ===
        self._draw_page1(c, bericht, patient, arzt, unfallbetrieb, uv_traeger, krankenkasse, for_kasse=False)
        
        c.showPage()
        
        # === SEITE 2 ===
        self._draw_page2(c, bericht, patient, for_kasse=False)
        
        c.save()
        buffer.seek(0)
        return buffer
    
    def generate_krankenkasse_pdf(self, bericht: dict, patient: dict,
                                   arzt: dict, unfallbetrieb: dict = None,
                                   uv_traeger: dict = None, krankenkasse: dict = None) -> BytesIO:
        """
        Generiert das PDF für die Krankenkasse (reduzierte Version)
        """
        buffer = BytesIO()
        c = canvas.Canvas(buffer, pagesize=A4)
        
        # === SEITE 1 (Krankenkasse) ===
        self._draw_page1(c, bericht, patient, arzt, unfallbetrieb, uv_traeger, krankenkasse, for_kasse=True)
        
        c.showPage()
        
        # === SEITE 2 ===
        self._draw_page2(c, bericht, patient, for_kasse=True)
        
        c.save()
        buffer.seek(0)
        return buffer
    
    def _draw_page1(self, c: canvas.Canvas, bericht: dict, patient: dict,
                    arzt: dict, unfallbetrieb: dict, uv_traeger: dict, 
                    krankenkasse: dict, for_kasse: bool = False):
        """Seite 1 des Formulars"""
        y = self.page_height - self.margin_top
        
        # Header
        y = self._draw_header(c, y, for_kasse)
        y -= 2*mm
        
        # === ZEILE 1: Lfd. Nr. ===
        c.setFont("Helvetica", 7)
        c.drawString(self.page_width - 50*mm, y + 5*mm, "Lfd. Nr.")
        c.setFont("Helvetica-Bold", 10)
        c.drawString(self.page_width - 50*mm, y - 2*mm, bericht.get('lfd_nr', ''))
        
        # === UV-Träger / Eingetroffen ===
        y -= 5*mm
        row_height = 12*mm
        
        # UV-Träger Box
        c.setStrokeColor(colors.black)
        c.setLineWidth(0.5)
        c.rect(self.margin_left, y - row_height, 90*mm, row_height)
        c.setFont("Helvetica", 6)
        c.drawString(self.margin_left + 1*mm, y - 3*mm, "Unfallversicherungsträger")
        c.setFont("Helvetica", 9)
        uv_name = uv_traeger.get('name', '') if uv_traeger else ''
        c.drawString(self.margin_left + 1*mm, y - row_height + 2*mm, uv_name)
        
        # Eingetroffen am
        c.rect(self.margin_left + 90*mm, y - row_height, 35*mm, row_height)
        c.setFont("Helvetica", 6)
        c.drawString(self.margin_left + 91*mm, y - 3*mm, "Eingetroffen am")
        c.setFont("Helvetica", 9)
        c.drawString(self.margin_left + 91*mm, y - row_height + 2*mm, 
                     self._format_date(bericht.get('eingetroffen_datum', '')))
        
        # Uhrzeit
        c.rect(self.margin_left + 125*mm, y - row_height, 25*mm, row_height)
        c.setFont("Helvetica", 6)
        c.drawString(self.margin_left + 126*mm, y - 3*mm, "Uhrzeit")
        c.setFont("Helvetica", 9)
        c.drawString(self.margin_left + 126*mm, y - row_height + 2*mm,
                     self._format_time(bericht.get('eingetroffen_uhrzeit', '')))
        
        y -= row_height + 1*mm
        
        # === PATIENT ZEILE 1: Name, Vorname, Geburtsdatum, Krankenkasse ===
        row_height = 12*mm
        
        # Name
        c.rect(self.margin_left, y - row_height, 50*mm, row_height)
        c.setFont("Helvetica", 6)
        c.drawString(self.margin_left + 1*mm, y - 3*mm, "Name der versicherten Person")
        c.setFont("Helvetica", 9)
        c.drawString(self.margin_left + 1*mm, y - row_height + 2*mm, patient.get('nachname', ''))
        
        # Vorname
        c.rect(self.margin_left + 50*mm, y - row_height, 35*mm, row_height)
        c.setFont("Helvetica", 6)
        c.drawString(self.margin_left + 51*mm, y - 3*mm, "Vorname")
        c.setFont("Helvetica", 9)
        c.drawString(self.margin_left + 51*mm, y - row_height + 2*mm, patient.get('vorname', ''))
        
        # Geburtsdatum
        c.rect(self.margin_left + 85*mm, y - row_height, 30*mm, row_height)
        c.setFont("Helvetica", 6)
        c.drawString(self.margin_left + 86*mm, y - 3*mm, "Geburtsdatum")
        c.setFont("Helvetica", 9)
        c.drawString(self.margin_left + 86*mm, y - row_height + 2*mm,
                     self._format_date(patient.get('geburtsdatum', '')))
        
        # Krankenkasse
        c.rect(self.margin_left + 115*mm, y - row_height, 35*mm, row_height)
        c.setFont("Helvetica", 6)
        c.drawString(self.margin_left + 116*mm, y - 3*mm, "Krankenkasse")
        c.setFont("Helvetica", 9)
        kk_name = krankenkasse.get('name', '') if krankenkasse else ''
        c.drawString(self.margin_left + 116*mm, y - row_height + 2*mm, kk_name)
        
        # Familienversichert
        c.rect(self.margin_left + 150*mm, y - row_height, 30*mm, row_height)
        c.setFont("Helvetica", 6)
        c.drawString(self.margin_left + 151*mm, y - 3*mm, "Familienversichert")
        fam = patient.get('familienversichert', False)
        c.setFont("Helvetica", 8)
        c.drawString(self.margin_left + 151*mm, y - 7*mm, 
                     f"{self._checkbox(not fam)} Nein  {self._checkbox(fam)} Ja:")
        if fam and patient.get('familienversichert_name'):
            c.setFont("Helvetica", 7)
            c.drawString(self.margin_left + 151*mm, y - row_height + 2*mm, 
                        patient.get('familienversichert_name', ''))
        
        y -= row_height + 1*mm
        
        # === KOPIE AN KASSE (rechts oben) ===
        c.setFont("Helvetica", 7)
        kopie = bericht.get('kopie_an_kasse', False)
        c.drawString(self.page_width - 35*mm, y + row_height - 2*mm, 
                     f"Kopie an Kasse  {self._checkbox(kopie)}")
        
        # === ANSCHRIFT ZEILE ===
        row_height = 12*mm
        
        # Anschrift
        c.rect(self.margin_left, y - row_height, 100*mm, row_height)
        c.setFont("Helvetica", 6)
        c.drawString(self.margin_left + 1*mm, y - 3*mm, "Vollständige Anschrift")
        c.setFont("Helvetica", 9)
        adresse = f"{patient.get('strasse', '')}, {patient.get('plz', '')} {patient.get('ort', '')}"
        c.drawString(self.margin_left + 1*mm, y - row_height + 2*mm, adresse)
        
        # Pflegekasse
        c.rect(self.margin_left + 100*mm, y - row_height, 80*mm, row_height)
        c.setFont("Helvetica", 6)
        c.drawString(self.margin_left + 101*mm, y - 3*mm, "Bei Pflegeunfall Pflegekasse der pflegebedürftigen Person")
        c.setFont("Helvetica", 9)
        if bericht.get('ist_pflegeunfall'):
            c.drawString(self.margin_left + 101*mm, y - row_height + 2*mm, patient.get('pflegekasse', ''))
        
        y -= row_height + 1*mm
        
        # === BESCHÄFTIGUNG ZEILE ===
        row_height = 10*mm
        
        # Beschäftigt als
        c.rect(self.margin_left, y - row_height, 45*mm, row_height)
        c.setFont("Helvetica", 6)
        c.drawString(self.margin_left + 1*mm, y - 3*mm, "Beschäftigt als")
        c.setFont("Helvetica", 8)
        c.drawString(self.margin_left + 1*mm, y - row_height + 2*mm, patient.get('beschaeftigt_als', ''))
        
        # Seit
        c.rect(self.margin_left + 45*mm, y - row_height, 25*mm, row_height)
        c.setFont("Helvetica", 6)
        c.drawString(self.margin_left + 46*mm, y - 3*mm, "Seit")
        c.setFont("Helvetica", 8)
        c.drawString(self.margin_left + 46*mm, y - row_height + 2*mm, 
                     self._format_date(patient.get('beschaeftigt_seit', '')))
        
        # Telefon
        c.rect(self.margin_left + 70*mm, y - row_height, 35*mm, row_height)
        c.setFont("Helvetica", 6)
        c.drawString(self.margin_left + 71*mm, y - 3*mm, "Telefon-Nr.")
        c.setFont("Helvetica", 8)
        c.drawString(self.margin_left + 71*mm, y - row_height + 2*mm, patient.get('telefon', ''))
        
        # Staatsangehörigkeit
        c.rect(self.margin_left + 105*mm, y - row_height, 40*mm, row_height)
        c.setFont("Helvetica", 6)
        c.drawString(self.margin_left + 106*mm, y - 3*mm, "Staatsangehörigkeit")
        c.setFont("Helvetica", 8)
        c.drawString(self.margin_left + 106*mm, y - row_height + 2*mm, patient.get('staatsangehoerigkeit', ''))
        
        # Geschlecht
        c.rect(self.margin_left + 145*mm, y - row_height, 35*mm, row_height)
        c.setFont("Helvetica", 6)
        c.drawString(self.margin_left + 146*mm, y - 3*mm, "Geschlecht")
        c.setFont("Helvetica", 8)
        geschlecht = patient.get('geschlecht', '')
        geschlecht_text = {'m': 'männlich', 'w': 'weiblich', 'd': 'divers'}.get(geschlecht, geschlecht)
        c.drawString(self.margin_left + 146*mm, y - row_height + 2*mm, geschlecht_text)
        
        y -= row_height + 1*mm
        
        # === UNFALLBETRIEB ===
        row_height = 14*mm
        c.rect(self.margin_left, y - row_height, self.content_width, row_height)
        c.setFont("Helvetica", 6)
        c.drawString(self.margin_left + 1*mm, y - 3*mm, 
                     "Unfallbetrieb (Name, Anschrift und Telefon-Nr. des Arbeitgebers, der Kita, der (Hoch-)Schule, der pflegebedürftigen Person)")
        c.setFont("Helvetica", 9)
        if unfallbetrieb:
            ub_text = f"{unfallbetrieb.get('name', '')}, {unfallbetrieb.get('strasse', '')}, "
            ub_text += f"{unfallbetrieb.get('plz', '')} {unfallbetrieb.get('ort', '')}, Tel.: {unfallbetrieb.get('telefon', '')}"
            c.drawString(self.margin_left + 1*mm, y - row_height + 2*mm, ub_text)
        
        y -= row_height + 2*mm
        
        # === ABSCHNITT 1: UNFALLDATEN ===
        row_height = 12*mm
        
        c.setFont("Helvetica-Bold", 8)
        c.drawString(self.margin_left, y, "1")
        
        # Unfalltag
        c.rect(self.margin_left + 5*mm, y - row_height + 5*mm, 25*mm, row_height - 5*mm)
        c.setFont("Helvetica", 6)
        c.drawString(self.margin_left + 6*mm, y - 1*mm, "Unfalltag")
        c.setFont("Helvetica", 9)
        c.drawString(self.margin_left + 6*mm, y - row_height + 7*mm, 
                     self._format_date(bericht.get('unfalltag', '')))
        
        # Uhrzeit
        c.rect(self.margin_left + 30*mm, y - row_height + 5*mm, 20*mm, row_height - 5*mm)
        c.setFont("Helvetica", 6)
        c.drawString(self.margin_left + 31*mm, y - 1*mm, "Uhrzeit")
        c.setFont("Helvetica", 9)
        c.drawString(self.margin_left + 31*mm, y - row_height + 7*mm,
                     self._format_time(bericht.get('unfallzeit', '')))
        
        # Unfallort
        c.rect(self.margin_left + 50*mm, y - row_height + 5*mm, 55*mm, row_height - 5*mm)
        c.setFont("Helvetica", 6)
        c.drawString(self.margin_left + 51*mm, y - 1*mm, "Unfallort")
        c.setFont("Helvetica", 9)
        c.drawString(self.margin_left + 51*mm, y - row_height + 7*mm, bericht.get('unfallort', ''))
        
        # Arbeitszeit Beginn
        c.rect(self.margin_left + 105*mm, y - row_height + 5*mm, 25*mm, row_height - 5*mm)
        c.setFont("Helvetica", 6)
        c.drawString(self.margin_left + 106*mm, y - 1*mm, "Beginn der Arbeitszeit")
        c.setFont("Helvetica", 9)
        beginn = self._format_time(bericht.get('arbeitszeit_beginn', ''))
        c.drawString(self.margin_left + 106*mm, y - row_height + 7*mm, f"{beginn} Uhr" if beginn else "")
        
        # Arbeitszeit Ende
        c.rect(self.margin_left + 130*mm, y - row_height + 5*mm, 25*mm, row_height - 5*mm)
        c.setFont("Helvetica", 6)
        c.drawString(self.margin_left + 131*mm, y - 1*mm, "Ende der Arbeitszeit")
        c.setFont("Helvetica", 9)
        ende = self._format_time(bericht.get('arbeitszeit_ende', ''))
        c.drawString(self.margin_left + 131*mm, y - row_height + 7*mm, f"{ende} Uhr" if ende else "")
        
        y -= row_height + 1*mm
        
        # === ABSCHNITT 2: UNFALLHERGANG ===
        row_height = 18*mm
        
        c.setFont("Helvetica-Bold", 8)
        c.drawString(self.margin_left, y, "2")
        c.setFont("Helvetica", 6)
        c.drawString(self.margin_left + 5*mm, y, "Angaben der versicherten Person zum Unfallhergang und zur Tätigkeit, bei der der Unfall eingetreten ist")
        
        c.rect(self.margin_left + 5*mm, y - row_height + 3*mm, self.content_width - 5*mm, row_height - 5*mm)
        c.setFont("Helvetica", 8)
        # Textumbruch für langen Text
        hergang = bericht.get('unfallhergang', '')
        if hergang:
            lines = self._wrap_text(hergang, 170*mm, 8)
            text_y = y - 5*mm
            for line in lines[:3]:  # Max 3 Zeilen
                c.drawString(self.margin_left + 6*mm, text_y, line)
                text_y -= 4*mm
        
        y -= row_height + 1*mm
        
        # === NUR FÜR UV-TRÄGER: Abschnitte 3-6, 8, 9 ===
        if not for_kasse:
            # === ABSCHNITT 3: VERHALTEN NACH UNFALL ===
            row_height = 12*mm
            
            c.setFont("Helvetica-Bold", 8)
            c.drawString(self.margin_left, y, "3")
            c.setFont("Helvetica", 6)
            c.drawString(self.margin_left + 5*mm, y, "Verhalten der versicherten Person nach dem Unfall")
            
            c.rect(self.margin_left + 5*mm, y - row_height + 3*mm, self.content_width - 5*mm, row_height - 5*mm)
            c.setFont("Helvetica", 8)
            c.drawString(self.margin_left + 6*mm, y - row_height + 5*mm, bericht.get('verhalten_nach_unfall', ''))
            
            y -= row_height + 1*mm
            
            # === ABSCHNITT 4: ERSTVERSORGUNG ===
            row_height = 10*mm
            
            c.setFont("Helvetica-Bold", 8)
            c.drawString(self.margin_left, y, "4.1")
            c.setFont("Helvetica", 6)
            c.drawString(self.margin_left + 8*mm, y, "Art der ersten (nicht durchgangsärztlichen) Versorgung")
            
            c.rect(self.margin_left + 8*mm, y - row_height + 3*mm, 90*mm, row_height - 5*mm)
            c.setFont("Helvetica", 8)
            c.drawString(self.margin_left + 9*mm, y - row_height + 5*mm, bericht.get('art_erstversorgung', '') or "")
            
            c.setFont("Helvetica-Bold", 8)
            c.drawString(self.margin_left + 100*mm, y, "4.2")
            c.setFont("Helvetica", 6)
            c.drawString(self.margin_left + 108*mm, y, "Erstmalig ärztlich behandelt am")
            c.rect(self.margin_left + 108*mm, y - row_height + 3*mm, 25*mm, row_height - 5*mm)
            c.setFont("Helvetica", 8)
            c.drawString(self.margin_left + 109*mm, y - row_height + 5*mm,
                         self._format_date(bericht.get('erstbehandlung_datum', '')) or "")
            
            c.setFont("Helvetica", 6)
            c.drawString(self.margin_left + 135*mm, y, "durch")
            c.rect(self.margin_left + 135*mm, y - row_height + 3*mm, 45*mm, row_height - 5*mm)
            c.setFont("Helvetica", 8)
            c.drawString(self.margin_left + 136*mm, y - row_height + 5*mm, bericht.get('erstbehandlung_durch', ''))
            
            y -= row_height + 1*mm
            
            # === ABSCHNITT 5: BEFUND ===
            c.setFont("Helvetica-Bold", 8)
            c.drawString(self.margin_left, y, "5")
            c.setFont("Helvetica", 6)
            c.drawString(self.margin_left + 5*mm, y, "Befund")
            
            # Alkohol/Drogen Verdacht
            verdacht = bericht.get('verdacht_alkohol_drogen', False)
            c.drawString(self.margin_left + 25*mm, y, f"Verdacht auf Alkohol-, Drogen-, Medikamenteneinfluss?")
            c.setFont("Helvetica", 8)
            c.drawString(self.margin_left + 95*mm, y, f"{self._checkbox(not verdacht)} Nein  {self._checkbox(verdacht)} Ja")
            
            if verdacht:
                c.setFont("Helvetica", 6)
                c.drawString(self.margin_left + 120*mm, y, "Welche Anzeichen?")
                c.setFont("Helvetica", 8)
                c.drawString(self.margin_left + 145*mm, y, bericht.get('alkohol_drogen_anzeichen', ''))
            
            # Blutentnahme
            blut = bericht.get('blutentnahme_durchgefuehrt', False)
            c.setFont("Helvetica", 6)
            c.drawString(self.margin_left + 160*mm, y, "Blutentnahme")
            c.setFont("Helvetica", 8)
            c.drawString(self.margin_left + 160*mm, y - 4*mm, f"{self._checkbox(not blut)} Nein {self._checkbox(blut)} Ja")
            
            y -= 6*mm
            
            # 5.1 Beschwerden
            row_height = 12*mm
            c.setFont("Helvetica-Bold", 8)
            c.drawString(self.margin_left, y, "5.1")
            c.setFont("Helvetica", 6)
            c.drawString(self.margin_left + 8*mm, y, "Beschwerden/Klagen")
            
            c.rect(self.margin_left + 8*mm, y - row_height + 3*mm, self.content_width - 60*mm, row_height - 5*mm)
            c.setFont("Helvetica", 8)
            c.drawString(self.margin_left + 9*mm, y - row_height + 5*mm, bericht.get('beschwerden_klagen', ''))
            
            # Handverletzung Box (rechts)
            hand = bericht.get('handverletzung', False)
            c.setFont("Helvetica", 6)
            c.drawString(self.margin_left + 130*mm, y, "Bei Handverletzung")
            c.drawString(self.margin_left + 130*mm, y - 4*mm, "Gebrauchshand")
            c.setFont("Helvetica", 8)
            gebrauch = bericht.get('gebrauchshand', '')
            c.drawString(self.margin_left + 130*mm, y - 8*mm, 
                        f"{self._checkbox(gebrauch == 'rechts')} Rechts  {self._checkbox(gebrauch == 'links')} Links")
            
            y -= row_height + 1*mm
            
            # 5.2 Klinische Befunde
            row_height = 16*mm
            c.setFont("Helvetica-Bold", 8)
            c.drawString(self.margin_left, y, "5.2")
            c.setFont("Helvetica", 6)
            c.drawString(self.margin_left + 8*mm, y, "Klinische Untersuchungsbefunde")
            
            c.rect(self.margin_left + 8*mm, y - row_height + 3*mm, self.content_width - 60*mm, row_height - 5*mm)
            c.setFont("Helvetica", 8)
            befunde = bericht.get('klinische_befunde', '')
            if befunde:
                lines = self._wrap_text(befunde, 100*mm, 8)
                text_y = y - 5*mm
                for line in lines[:2]:
                    c.drawString(self.margin_left + 9*mm, text_y, line)
                    text_y -= 4*mm
            
            # Ergänzungsberichte Box (rechts)
            c.setFont("Helvetica", 6)
            c.drawString(self.margin_left + 130*mm, y, "Ergänzungsbericht")
            c.drawString(self.margin_left + 130*mm, y - 3*mm, "beigefügt wegen")
            c.setFont("Helvetica", 7)
            c.drawString(self.margin_left + 130*mm, y - 7*mm, 
                        f"{self._checkbox(bericht.get('ergaenzung_kopfverletzung', False))} Kopfverletzung")
            c.drawString(self.margin_left + 130*mm, y - 10*mm,
                        f"{self._checkbox(bericht.get('ergaenzung_knieverletzung', False))} Knieverletzung")
            c.drawString(self.margin_left + 155*mm, y - 7*mm,
                        f"{self._checkbox(bericht.get('ergaenzung_schulterverletzung', False))} Schulterverletzung")
            c.drawString(self.margin_left + 155*mm, y - 10*mm,
                        f"{self._checkbox(bericht.get('ergaenzung_verbrennung', False))} Verbrennung")
            
            # Polytrauma
            poly = bericht.get('polytrauma', False)
            c.setFont("Helvetica", 6)
            c.drawString(self.margin_left + 130*mm, y - 14*mm, "Bei Polytrauma/weiteren")
            c.drawString(self.margin_left + 130*mm, y - 17*mm, "schweren Verletzungen")
            c.drawString(self.margin_left + 160*mm, y - 14*mm, "ISS")
            c.setFont("Helvetica", 9)
            c.drawString(self.margin_left + 170*mm, y - 14*mm, str(bericht.get('iss_score', '')) if poly else '')
            
            y -= row_height + 1*mm
            
            # === ABSCHNITT 6: BILDGEBENDE DIAGNOSTIK ===
            row_height = 12*mm
            c.setFont("Helvetica-Bold", 8)
            c.drawString(self.margin_left, y, "6")
            c.setFont("Helvetica", 6)
            c.drawString(self.margin_left + 5*mm, y, "Ergebnis bildgebender Diagnostik")
            
            c.rect(self.margin_left + 5*mm, y - row_height + 3*mm, self.content_width - 5*mm, row_height - 5*mm)
            c.setFont("Helvetica", 8)
            c.drawString(self.margin_left + 6*mm, y - row_height + 5*mm, bericht.get('bildgebende_diagnostik', ''))
            
            y -= row_height + 1*mm
        else:
            # Für Krankenkasse: Ergänzungsberichte und Handverletzung trotzdem zeigen
            # Handverletzung Box
            c.setFont("Helvetica", 6)
            c.drawString(self.margin_left + 130*mm, y + 15*mm, "Bei Handverletzung")
            c.drawString(self.margin_left + 130*mm, y + 11*mm, "Gebrauchshand")
            c.setFont("Helvetica", 8)
            gebrauch = bericht.get('gebrauchshand', '')
            c.drawString(self.margin_left + 130*mm, y + 7*mm,
                        f"{self._checkbox(gebrauch == 'rechts')} Rechts  {self._checkbox(gebrauch == 'links')} Links")
            
            # Ergänzungsberichte
            c.setFont("Helvetica", 6)
            c.drawString(self.margin_left + 155*mm, y + 15*mm, "Ergänzungsbericht")
            c.drawString(self.margin_left + 155*mm, y + 12*mm, "beigefügt wegen")
            c.setFont("Helvetica", 7)
            c.drawString(self.margin_left + 155*mm, y + 8*mm,
                        f"{self._checkbox(bericht.get('ergaenzung_kopfverletzung', False))} Kopfverletzung")
            c.drawString(self.margin_left + 155*mm, y + 5*mm,
                        f"{self._checkbox(bericht.get('ergaenzung_knieverletzung', False))} Knieverletzung")
            c.drawString(self.margin_left + 155*mm, y + 2*mm,
                        f"{self._checkbox(bericht.get('ergaenzung_schulterverletzung', False))} Schulterverletzung")
            c.drawString(self.margin_left + 155*mm, y - 1*mm,
                        f"{self._checkbox(bericht.get('ergaenzung_verbrennung', False))} Verbrennung")
            
            # Polytrauma
            poly = bericht.get('polytrauma', False)
            c.setFont("Helvetica", 6)
            c.drawString(self.margin_left + 130*mm, y + 2*mm, "Bei Polytrauma ISS")
            c.setFont("Helvetica", 9)
            c.drawString(self.margin_left + 145*mm, y + 2*mm, str(bericht.get('iss_score', '')) if poly else '')
        
        # === ABSCHNITT 7: ERSTDIAGNOSE ===
        row_height = 16*mm
        c.setFont("Helvetica-Bold", 8)
        c.drawString(self.margin_left, y, "7")
        c.setFont("Helvetica", 6)
        c.drawString(self.margin_left + 5*mm, y, "Erstdiagnose - Freitext -")
        c.drawString(self.margin_left + 5*mm, y - 3*mm, "(Änderungen/Konkretisierungen unverzüglich nachmelden, bei Frakturen zwingend AO-Klassifikation angeben.)")
        
        c.rect(self.margin_left + 5*mm, y - row_height + 3*mm, self.content_width - 50*mm, row_height - 8*mm)
        c.setFont("Helvetica", 8)
        diagnose = bericht.get('erstdiagnose_freitext', '')
        if diagnose:
            lines = self._wrap_text(diagnose, 120*mm, 8)
            text_y = y - 7*mm
            for line in lines[:2]:
                c.drawString(self.margin_left + 6*mm, text_y, line)
                text_y -= 4*mm
        
        # AO-Klassifikation
        c.setFont("Helvetica", 6)
        c.drawString(self.margin_left + 135*mm, y - 3*mm, "AO-Klassifikation")
        c.rect(self.margin_left + 135*mm, y - 10*mm, 40*mm, 7*mm)
        c.setFont("Helvetica", 9)
        c.drawString(self.margin_left + 136*mm, y - 9*mm, bericht.get('erstdiagnose_ao', ''))
        
        # ICD-10
        c.setFont("Helvetica", 6)
        c.drawString(self.margin_left + 135*mm, y - 12*mm, "ICD 10")
        c.rect(self.margin_left + 135*mm, y - row_height + 3*mm, 40*mm, 7*mm)
        c.setFont("Helvetica", 9)
        c.drawString(self.margin_left + 136*mm, y - row_height + 5*mm, bericht.get('erstdiagnose_icd10', ''))
        
        y -= row_height + 1*mm
        
        # === NUR UV-TRÄGER: Abschnitte 8 und 9 ===
        if not for_kasse:
            # === ABSCHNITT 8: D-ÄRZTLICHE VERSORGUNG ===
            row_height = 12*mm
            c.setFont("Helvetica-Bold", 8)
            c.drawString(self.margin_left, y, "8")
            c.setFont("Helvetica", 6)
            c.drawString(self.margin_left + 5*mm, y, "Art der durchgangsärztlichen Versorgung")
            
            c.rect(self.margin_left + 5*mm, y - row_height + 3*mm, self.content_width - 5*mm, row_height - 5*mm)
            c.setFont("Helvetica", 8)
            c.drawString(self.margin_left + 6*mm, y - row_height + 5*mm, bericht.get('art_da_versorgung', ''))
            
            y -= row_height + 1*mm
            
            # === ABSCHNITT 9: VORERKRANKUNGEN ===
            row_height = 12*mm
            c.setFont("Helvetica-Bold", 8)
            c.drawString(self.margin_left, y, "9")
            c.setFont("Helvetica", 6)
            c.drawString(self.margin_left + 5*mm, y, "Vom Unfall unabhängige gesundheitliche Beeinträchtigungen, die für die Beurteilung des Arbeitsunfalls von Bedeutung sein können")
            
            c.rect(self.margin_left + 5*mm, y - row_height + 3*mm, self.content_width - 5*mm, row_height - 5*mm)
            c.setFont("Helvetica", 8)
            c.drawString(self.margin_left + 6*mm, y - row_height + 5*mm, bericht.get('vorerkrankungen', ''))
            
            y -= row_height + 1*mm
        
        # === ABSCHNITT 10: ZWEIFEL AN ARBEITSUNFALL ===
        row_height = 10*mm
        c.setFont("Helvetica-Bold", 8)
        c.drawString(self.margin_left, y, "10")
        c.setFont("Helvetica", 6)
        c.drawString(self.margin_left + 7*mm, y, "Ergeben sich aus Hergang und Befund Zweifel an einem Arbeitsunfall? Wenn ja, ist eine Kopie des Durchgangsarztberichts auszuhändigen.")
        
        zweifel = bericht.get('zweifel_arbeitsunfall', False)
        c.setFont("Helvetica", 8)
        c.drawString(self.margin_left + 7*mm, y - 5*mm, f"{self._checkbox(not zweifel)} Nein  {self._checkbox(zweifel)} Ja, weil")
        
        if zweifel:
            c.rect(self.margin_left + 45*mm, y - row_height + 3*mm, self.content_width - 45*mm, row_height - 5*mm)
            c.setFont("Helvetica", 8)
            c.drawString(self.margin_left + 46*mm, y - row_height + 5*mm, bericht.get('zweifel_begruendung', ''))
        
        y -= row_height + 1*mm
        
        # === ABSCHNITT 11: HEILBEHANDLUNG ===
        row_height = 18*mm
        c.setFont("Helvetica-Bold", 8)
        c.drawString(self.margin_left, y, "11")
        c.setFont("Helvetica", 6)
        c.drawString(self.margin_left + 7*mm, y, "Art der Heilbehandlung")
        
        hb_art = bericht.get('heilbehandlung_art', '')
        c.setFont("Helvetica", 8)
        c.drawString(self.margin_left + 7*mm, y - 4*mm, f"{self._checkbox(hb_art == 'ambulant')} Ambulant")
        c.drawString(self.margin_left + 7*mm, y - 8*mm, f"  {self._checkbox(hb_art == 'allgemein')} Allgemeine Heilbehandlung")
        c.drawString(self.margin_left + 7*mm, y - 12*mm, f"  {self._checkbox(hb_art == 'besondere')} Besondere Heilbehandlung")
        c.drawString(self.margin_left + 7*mm, y - 16*mm, f"{self._checkbox(hb_art == 'stationaer')} Stationär (besondere Heilbehandlung)")
        
        # VAV/SAV
        vav = bericht.get('verletzung_vav', False)
        sav = bericht.get('verletzung_sav', False)
        c.setFont("Helvetica", 6)
        c.drawString(self.margin_left + 85*mm, y, "Liegt eine Verletzung nach dem")
        c.drawString(self.margin_left + 85*mm, y - 3*mm, "Verletzungsartenverzeichnis vor?")
        c.setFont("Helvetica", 8)
        c.drawString(self.margin_left + 85*mm, y - 7*mm, f"{self._checkbox(not vav and not sav)} Nein")
        c.drawString(self.margin_left + 85*mm, y - 11*mm, f"{self._checkbox(vav or sav)} Ja")
        c.drawString(self.margin_left + 100*mm, y - 11*mm, f"{self._checkbox(vav)} VAV nach Ziffer {bericht.get('verletzung_vav_ziffer', '')}")
        c.drawString(self.margin_left + 100*mm, y - 15*mm, f"{self._checkbox(sav)} SAV nach Ziffer {bericht.get('verletzung_sav_ziffer', '')}")
        
        # Keine Heilbehandlung
        keine_hb = hb_art == 'keine'
        c.setFont("Helvetica", 8)
        c.drawString(self.margin_left + 140*mm, y - 4*mm, f"{self._checkbox(keine_hb)} Es wird keine Heilbehandlung zu Lasten der UV")
        c.drawString(self.margin_left + 145*mm, y - 8*mm, "durchgeführt, weil")
        if keine_hb:
            c.setFont("Helvetica", 7)
            c.drawString(self.margin_left + 145*mm, y - 12*mm, bericht.get('keine_heilbehandlung_grund', ''))
        
        y -= row_height + 1*mm
        
        # === ABSCHNITT 12: WEITERBEHANDLUNG ===
        row_height = 12*mm
        c.setFont("Helvetica-Bold", 8)
        c.drawString(self.margin_left, y, "12")
        c.setFont("Helvetica", 6)
        c.drawString(self.margin_left + 7*mm, y, "Weiterbehandlung erfolgt")
        
        wb = bericht.get('weiterbehandlung_durch', '')
        c.setFont("Helvetica", 8)
        c.drawString(self.margin_left + 7*mm, y - 5*mm, f"{self._checkbox(wb == 'durch_mich')} durch mich")
        c.drawString(self.margin_left + 7*mm, y - 9*mm, f"{self._checkbox(wb == 'andere_arzt')} durch andere Ärztin/anderen Arzt (auch Verlegung/Vorstellung), bitte Name und Anschrift angeben")
        
        if wb == 'andere_arzt':
            c.rect(self.margin_left + 95*mm, y - row_height + 3*mm, 85*mm, row_height - 5*mm)
            c.setFont("Helvetica", 8)
            arzt_info = f"{bericht.get('anderer_arzt_name', '')}, {bericht.get('anderer_arzt_adresse', '')}"
            c.drawString(self.margin_left + 96*mm, y - row_height + 5*mm, arzt_info)
        
        y -= row_height + 1*mm
        
        # === ABSCHNITT 13: ARBEITSFÄHIGKEIT ===
        row_height = 14*mm
        c.setFont("Helvetica-Bold", 8)
        c.drawString(self.margin_left, y, "13")
        c.setFont("Helvetica", 6)
        c.drawString(self.margin_left + 7*mm, y, "Beurteilung der")
        c.drawString(self.margin_left + 7*mm, y - 3*mm, "Arbeitsfähigkeit")
        
        af = bericht.get('arbeitsfaehig', None)
        c.setFont("Helvetica", 8)
        c.drawString(self.margin_left + 35*mm, y, f"{self._checkbox(af == True)} Arbeitsfähig")
        c.drawString(self.margin_left + 35*mm, y - 4*mm, f"{self._checkbox(af == False)} Arbeitsunfähig ab {self._format_date(bericht.get('arbeitsunfaehig_ab', ''))}")
        c.drawString(self.margin_left + 35*mm, y - 8*mm, f"{self._checkbox(af == False)} Voraussichtlich wieder arbeitsfähig ab {self._format_date(bericht.get('arbeitsfaehig_ab', ''))}")
        
        au_lang = bericht.get('au_laenger_3_monate', False)
        c.drawString(self.margin_left + 35*mm, y - 12*mm, f"{self._checkbox(au_lang)} Voraussichtlich länger als 3 Monate arbeitsunfähig")
        
        y -= row_height + 1*mm
        
        # === ABSCHNITT 14: WEITERE ÄRZTE ===
        row_height = 8*mm
        c.setFont("Helvetica-Bold", 8)
        c.drawString(self.margin_left, y, "14")
        c.setFont("Helvetica", 6)
        c.drawString(self.margin_left + 7*mm, y, "Ist die Zuziehung weiterer Ärztinnen/Ärzte zur Klärung")
        c.drawString(self.margin_left + 7*mm, y - 3*mm, "der Diagnose und/oder Mitbehandlung erforderlich?")
        
        weitere = bericht.get('weitere_aerzte_noetig', False)
        c.setFont("Helvetica", 8)
        c.drawString(self.margin_left + 75*mm, y, f"{self._checkbox(not weitere)} Nein  {self._checkbox(weitere)} Ja, zugezogen wird")
        if weitere:
            c.drawString(self.margin_left + 130*mm, y, bericht.get('weitere_aerzte_namen', ''))
        
        y -= row_height + 1*mm
        
        # === ABSCHNITT 15: WIEDERVORSTELLUNG ===
        row_height = 10*mm
        c.setFont("Helvetica-Bold", 8)
        c.drawString(self.margin_left, y, "15")
        c.setFont("Helvetica", 6)
        wiedervorstellung = self._format_date(bericht.get('wiedervorstellung_datum', ''))
        c.drawString(self.margin_left + 7*mm, y, 
                    f"Wiedervorstellung ist erforderlich, sofern dann noch AU oder Behandlungsbedürftigkeit vorliegen sollte, am {wiedervorstellung}; bei Verschlimmerung sofort.")
        c.drawString(self.margin_left + 7*mm, y - 4*mm, "Der Termin wurde der versicherten Person bekannt gegeben.")
        
        mitgeteilt = bericht.get('wiedervorstellung_mitgeteilt', False)
        c.setFont("Helvetica", 8)
        c.drawString(self.margin_left + 85*mm, y - 4*mm, f"{self._checkbox(mitgeteilt)}")
        
        y -= row_height + 1*mm
        
        # === ABSCHNITT 16: BEMERKUNGEN ===
        row_height = 14*mm
        c.setFont("Helvetica-Bold", 8)
        c.drawString(self.margin_left, y, "16")
        c.setFont("Helvetica", 6)
        c.drawString(self.margin_left + 7*mm, y, "Bemerkungen (z. B. Beratungsbedarf durch Reha-Management des UV-Trägers, Kontextfaktoren, besondere Umstände)")
        
        c.rect(self.margin_left + 7*mm, y - row_height + 3*mm, self.content_width - 7*mm, row_height - 5*mm)
        c.setFont("Helvetica", 8)
        bemerkungen = bericht.get('bemerkungen', '')
        if bemerkungen:
            lines = self._wrap_text(bemerkungen, 160*mm, 8)
            text_y = y - 5*mm
            for line in lines[:2]:
                c.drawString(self.margin_left + 8*mm, text_y, line)
                text_y -= 4*mm
        
        y -= row_height + 2*mm
        
        # === UNTERSCHRIFT ===
        c.setFont("Helvetica", 7)
        c.drawString(self.margin_left, y, "Datum")
        c.line(self.margin_left + 15*mm, y, self.margin_left + 45*mm, y)
        c.setFont("Helvetica", 9)
        c.drawString(self.margin_left + 16*mm, y + 2*mm, self._format_date(bericht.get('erstellt_am', '')))
        
        c.setFont("Helvetica", 7)
        c.drawString(self.margin_left + 50*mm, y, "Name und Anschrift der Durchgangsärztin/des Durchgangsarztes")
        c.line(self.margin_left + 50*mm, y, self.page_width - self.margin_right, y)
        
        # Arzt-Infos
        if arzt:
            c.setFont("Helvetica", 9)
            arzt_name = f"{arzt.get('titel', '')} {arzt.get('vorname', '')} {arzt.get('nachname', '')}"
            c.drawString(self.margin_left + 51*mm, y + 2*mm, arzt_name.strip())
            if arzt.get('praxis_name'):
                c.setFont("Helvetica", 8)
                praxis = f"{arzt.get('praxis_name', '')}, {arzt.get('praxis_strasse', '')}, {arzt.get('praxis_plz', '')} {arzt.get('praxis_ort', '')}"
                c.drawString(self.margin_left + 51*mm, y + 6*mm, praxis)
    
    def _draw_page2(self, c: canvas.Canvas, bericht: dict, patient: dict, for_kasse: bool = False):
        """Seite 2 des Formulars"""
        y = self.page_height - self.margin_top
        
        # Seitenzahl
        c.setFont("Helvetica", 10)
        page_num = "- 4 -" if for_kasse else "- 2 -"
        c.drawCentredString(self.page_width / 2, y, page_num)
        y -= 8*mm
        
        # Formularkennung
        c.setFont("Helvetica", 7)
        c.drawString(self.margin_left, self.page_height - 10*mm, "F 1000 0718 Durchgangsarztbericht")
        
        # === KOPFZEILE MIT PATIENTENDATEN ===
        row_height = 10*mm
        c.setStrokeColor(colors.black)
        c.setLineWidth(0.5)
        
        # Name, Vorname
        c.rect(self.margin_left, y - row_height, 80*mm, row_height)
        c.setFont("Helvetica", 6)
        c.drawString(self.margin_left + 1*mm, y - 3*mm, "Name, Vorname:")
        c.setFont("Helvetica", 9)
        c.drawString(self.margin_left + 1*mm, y - row_height + 2*mm, 
                     f"{patient.get('nachname', '')}, {patient.get('vorname', '')}")
        
        # Geburtsdatum
        c.rect(self.margin_left + 80*mm, y - row_height, 35*mm, row_height)
        c.setFont("Helvetica", 6)
        c.drawString(self.margin_left + 81*mm, y - 3*mm, "Geburtsdatum:")
        c.setFont("Helvetica", 9)
        c.drawString(self.margin_left + 81*mm, y - row_height + 2*mm,
                     self._format_date(patient.get('geburtsdatum', '')))
        
        # Unfalltag
        c.rect(self.margin_left + 115*mm, y - row_height, 35*mm, row_height)
        c.setFont("Helvetica", 6)
        c.drawString(self.margin_left + 116*mm, y - 3*mm, "Unfalltag:")
        c.setFont("Helvetica", 9)
        c.drawString(self.margin_left + 116*mm, y - row_height + 2*mm,
                     self._format_date(bericht.get('unfalltag', '')))
        
        # Lfd. Nr.
        c.rect(self.margin_left + 150*mm, y - row_height, 30*mm, row_height)
        c.setFont("Helvetica", 6)
        c.drawString(self.margin_left + 151*mm, y - 3*mm, "Lfd. Nr.")
        c.setFont("Helvetica", 9)
        c.drawString(self.margin_left + 151*mm, y - row_height + 2*mm, bericht.get('lfd_nr', ''))
        
        y -= row_height + 5*mm
        
        # === WEITERE AUSFÜHRUNGEN ===
        c.setFont("Helvetica-Bold", 10)
        c.drawString(self.margin_left, y, "W e i t e r e   A u s f ü h r u n g e n")
        y -= 5*mm
        
        # Großes Textfeld
        text_height = 160*mm
        c.rect(self.margin_left, y - text_height, self.content_width, text_height)
        
        # Text einfügen
        weitere = bericht.get('weitere_ausfuehrungen', '')
        if weitere:
            c.setFont("Helvetica", 9)
            lines = self._wrap_text(weitere, self.content_width - 10*mm, 9)
            text_y = y - 5*mm
            for line in lines:
                if text_y < y - text_height + 5*mm:
                    break
                c.drawString(self.margin_left + 2*mm, text_y, line)
                text_y -= 4*mm
        
        y -= text_height + 5*mm
        
        # === ERGÄNZUNGSBERICHTE HINWEIS ===
        c.setFont("Helvetica-Bold", 8)
        c.drawString(self.margin_left, y, "Ergänzungsberichte nicht vergessen!")
        y -= 4*mm
        c.setFont("Helvetica", 8)
        c.drawString(self.margin_left, y, "F 1002 Kopfverletzung")
        c.drawString(self.margin_left + 70*mm, y, "F 1006 Schulterverletzung")
        y -= 4*mm
        c.drawString(self.margin_left, y, "F 1004 Knieverletzung")
        c.drawString(self.margin_left + 70*mm, y, "F 1008 Schwere Verbrennung")
        y -= 6*mm
        
        # === DATENSCHUTZ ===
        c.setFont("Helvetica-Bold", 8)
        c.drawString(self.margin_left, y, "Datenschutz:")
        c.setFont("Helvetica", 8)
        datenschutz = bericht.get('datenschutz_hinweis_gegeben', False)
        checkbox = "☒" if datenschutz else "☐"
        c.drawString(self.margin_left + 25*mm, y, f"{checkbox} Ich habe die Hinweise nach § 201 SGB VII gegeben.")
        y -= 8*mm
        
        # === MITTEILUNG AN BEHANDELNDEN ARZT ===
        c.setStrokeColor(colors.black)
        c.setLineWidth(0.5)
        c.rect(self.margin_left, y - 20*mm, self.content_width, 20*mm)
        
        c.setFont("Helvetica-Bold", 8)
        c.drawString(self.margin_left + 2*mm, y - 4*mm, "Mitteilung an die behandelnde Ärztin/den behandelnden Arzt")
        c.setFont("Helvetica", 8)
        c.drawString(self.margin_left + 2*mm, y - 10*mm, 
                    "Sie erhalten meinen Bericht. Bitte stellen Sie die Patientin/den Patienten spätestens zum vorgesehenen Nachschautermin (siehe Nr. 15)")
        c.drawString(self.margin_left + 2*mm, y - 14*mm,
                    "wieder bei mir vor, wenn sie/er bis dahin nicht wieder arbeitsfähig oder noch behandlungsbedürftig ist.")
        
        y -= 25*mm
        
        # === VERTEILER (nur für UV-Träger) ===
        if not for_kasse:
            c.setFont("Helvetica-Bold", 8)
            c.drawString(self.margin_left, y, "Verteiler")
            y -= 4*mm
            c.setFont("Helvetica", 8)
            c.drawString(self.margin_left, y, "Unfallversicherungsträger")
            y -= 4*mm
            c.drawString(self.margin_left, y, "Behandelnde Ärztin/Behandelnder Arzt")
            y -= 4*mm
            c.drawString(self.margin_left, y, "Eigenbedarf")
        
        # === UNTERSCHRIFT ===
        y -= 10*mm
        c.setFont("Helvetica", 7)
        c.drawString(self.margin_left, y, ",")
        c.line(self.margin_left, y - 1*mm, self.margin_left + 80*mm, y - 1*mm)
        
        # Formularfuß
        c.setFont("Helvetica", 7)
        c.drawString(self.margin_left, 10*mm, "F 1000 0718 Durchgangsarztbericht")
    
    def _wrap_text(self, text: str, max_width: float, font_size: int) -> list:
        """Text in Zeilen umbrechen"""
        if not text:
            return []
        
        # Ungefähre Zeichenbreite
        char_width = font_size * 0.5
        chars_per_line = int(max_width / char_width)
        
        words = text.replace('\n', ' ').split(' ')
        lines = []
        current_line = ""
        
        for word in words:
            if len(current_line) + len(word) + 1 <= chars_per_line:
                current_line += (" " if current_line else "") + word
            else:
                if current_line:
                    lines.append(current_line)
                current_line = word
        
        if current_line:
            lines.append(current_line)
        
        return lines
