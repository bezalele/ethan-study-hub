"""Create a single-file offline review copy, without changing published files."""
import base64
import mimetypes
import re
import sys
from pathlib import Path

root = Path(__file__).resolve().parents[1]
output = Path(sys.argv[1]).resolve()
html = (root / 'index.html').read_text()

def inline_css(match):
    path = root / match[1].split('?')[0]
    css = path.read_text()
    def asset(m):
        url = m[1].strip('\"\'')
        if url.startswith(('data:', 'http:', 'https:')):
            return m[0]
        file = path.parent / url
        mime = mimetypes.guess_type(file.name)[0] or 'application/octet-stream'
        data = base64.b64encode(file.read_bytes()).decode()
        return 'url("data:' + mime + ';base64,' + data + '")'
    return '<style>' + re.sub(r'url\(([^)]+)\)', asset, css) + '</style>'

html = re.sub(r'<link\s+rel="stylesheet"\s+href="([^"]+)"\s*/?>', inline_css, html)
def inline_js(match):
    source = (root / match[1].split('?')[0]).read_text()
    source = source.replace('const KEY = "ethan_math_quest_v2";', 'const KEY = "ethan_math_unit3_review_v1";')
    return '<script>' + source.replace('</script', '<\\/script') + '</script>'
html = re.sub(r'<script\s+src="([^"]+)"\s*>\s*</script>', inline_js, html)
html = html.replace('<title>Ethan Math Quest · Algebra 1</title>', '<title>REVIEW · Ethan’s Algebra Unit 3</title>')
html = html.replace('</head>', '<script>if(!location.hash)location.hash="unit/two-variable";</script></head>')
html = html.replace('href="../"', 'href="https://bezalele.github.io/ethan-study-hub/"')
html = html.replace('<span>Ethan Math Quest</span', '<span>REVIEW COPY · Not published</span')
output.parent.mkdir(parents=True, exist_ok=True)
output.write_text(html)
print(output)
print(f'{output.stat().st_size:,} bytes; scripts, styles, images and fonts embedded')
