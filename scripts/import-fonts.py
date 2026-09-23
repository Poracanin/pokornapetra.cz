from pathlib import Path
import re, subprocess
css=Path('/private/tmp/petra-fonts.css').read_text()
font_dir=Path('dist/assets/fonts');font_dir.mkdir(exist_ok=True)
urls=list(dict.fromkeys(re.findall(r'url\((https://[^)]+)\)',css)))
for i,url in enumerate(urls):
 name=f'font-{i+1}.ttf'
 subprocess.run(['curl','--fail','--silent','--show-error',url,'-o',str(font_dir/name)],check=True)
 css=css.replace(url,f'/assets/fonts/{name}')
Path('src/fonts.css').write_text(css)
print(f'Saved {len(urls)} local fonts.')
