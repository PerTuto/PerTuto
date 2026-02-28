
import base64
import json
import os

pdf_path = "/Users/ankur/Desktop/Antigravity/Projects/TutorOS/APPC 3.7A Wkst.pdf"
output_json = "/Users/ankur/Desktop/Antigravity/Projects/TutorOS/input.json"

with open(pdf_path, "rb") as f:
    pdf_base64 = base64.b64encode(f.read()).decode("utf-8")

data = {"pdfBase64": pdf_base64}

with open(output_json, "w") as f:
    json.dump(data, f)

print(f"Created {output_json} with base64 of {pdf_path}")
