from PIL import Image, ImageDraw, ImageFont
import os

MODULES = [
  ("home","Mission Control"),
  ("init","git init"),
  ("staging","Stage & Commit"),
  ("branch","Branching"),
  ("merge","Merge & Rebase"),
  ("remote","Remote & Push"),
  ("pullrequest","Pull Requests"),
  ("gitflow","Git Flow"),
  ("advanced","Advanced Magic"),
  ("collaborate","Open Source"),
  ("visualizer","Commit Graph"),
  ("actions","GitHub Actions"),
  ("security","Security"),
  ("issues","Issues"),
  ("projects","GitHub Projects"),
  ("pages","GitHub Pages"),
  ("releases","Releases"),
  ("protection","Branch Protection"),
  ("codeowners","CODEOWNERS"),
  ("githubapi","GitHub API"),
  ("dotgithub",".github Folder"),
  ("dependabot","Dependabot"),
  ("codespaces","Codespaces"),
  ("quiz","Master Quiz"),
]

OUT_DIR = os.path.join(os.path.dirname(__file__), '..', 'public', 'social')
os.makedirs(OUT_DIR, exist_ok=True)

W, H = 1200, 630
BG = (6,11,24)
TITLE_COLOR = (226,232,240)
SUB_COLOR = (148,163,184)

try:
    font_title = ImageFont.truetype("arial.ttf", 64)
    font_sub = ImageFont.truetype("arial.ttf", 28)
except Exception:
    font_title = ImageFont.load_default()
    font_sub = ImageFont.load_default()

for id,label in MODULES:
    img = Image.new('RGB', (W,H), BG)
    d = ImageDraw.Draw(img)
    icon = ""
    title = label
    sub = "gitsimulator.xyz"
    # draw title (fixed position)
    d.text((60, 180), title, font=font_title, fill=TITLE_COLOR)
    # draw subtitle
    d.text((60, 260), sub, font=font_sub, fill=SUB_COLOR)
    out_path = os.path.join(OUT_DIR, f"{id}.png")
    img.save(out_path, format='PNG', optimize=True)
    print('Wrote', out_path)

# default image
img = Image.new('RGB', (W,H), BG)
d = ImageDraw.Draw(img)
d.text((60,180), 'GitSimulator', font=font_title, fill=TITLE_COLOR)
d.text((60,260), 'https://gitsimulator.xyz', font=font_sub, fill=SUB_COLOR)
img.save(os.path.join(OUT_DIR, 'default.png'), format='PNG', optimize=True)
print('Wrote default.png')
