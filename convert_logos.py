import os
import fitz # PyMuPDF

logo_dir = r"c:\Users\Ala\Desktop\art-vision\tools\Logo"
public_dir = r"c:\Users\Ala\Desktop\art-vision\public"

pdf_logos = {
    "logo blanc.pdf": "logo_blanc.svg",
    "logo couleur.pdf": "logo_couleur.svg",
    "logo noir et blanc.pdf": "logo_noir_et_blanc.svg"
}

for pdf_name, svg_name in pdf_logos.items():
    pdf_path = os.path.join(logo_dir, pdf_name)
    svg_path = os.path.join(public_dir, svg_name)
    
    if os.path.exists(pdf_path):
        try:
            print(f"Opening {pdf_name}...")
            doc = fitz.open(pdf_path)
            page = doc[0]
            print(f"Extracting SVG from {pdf_name}...")
            svg_text = page.get_svg_image()
            
            with open(svg_path, "w", encoding="utf-8") as f:
                f.write(svg_text)
            print(f"Successfully saved to {svg_path}")
        except Exception as e:
            print(f"Failed to convert {pdf_name}: {e}")
    else:
        print(f"Source file {pdf_path} not found")
