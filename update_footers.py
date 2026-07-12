import os
import re

files = ['index.html', 'planning.html', 'clubs.html', 'contact.html', 'disciplines.html']
replacement = '''<h3 class="footer-title">Plannings & Horaires</h3>
                <ul class="footer-links">
                    <li><a href="planning.html" style="color: var(--bronze); font-weight: bold; display: inline-flex; align-items: center; gap: 0.5rem; text-decoration: none;">Voir tous les horaires <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></a></li>
                </ul>'''

pattern = re.compile(r'<h3 class="footer-title">Horaires Club</h3>\s*<ul class="footer-hours-list">.*?</ul>', re.DOTALL)

for f in files:
    if os.path.exists(f):
        with open(f, 'r', encoding='utf-8') as file:
            content = file.read()
        
        new_content = pattern.sub(replacement, content)
        
        with open(f, 'w', encoding='utf-8') as file:
            file.write(new_content)
            print(f'Updated {f}')
