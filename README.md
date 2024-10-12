1. public/manifest.json untuk gonta ganti config nya.
2. ./src untuk inject content di dalam sidebar
3. extension/background.js untuk gonta ganti background.
4. extension/contentScript.js untuk inject file yang lain nya.
5. ini file di buat auto build setiap save, jadi gk perlu npm run build melainkan npm run watch.
6. file build ada di dist. upload ke chrome extension yang di upload dist nya...
7. npm run dev untuk melakukan editing file pada saat blm mau di upload ke chrome extension.
# deoapp-extension-boilerplate
