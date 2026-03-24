# GitHub Pages uchun loyihani yuklash qo'llanmasi

Loyihani GitHub Pages'da to'g'ri ishlashi uchun uni "build" (yig'ish) qilish va faqat `dist` papkasini yuklash kerak. Shunchaki `src` papkasini yuklash "Oq ekran" xatosiga olib keladi, chunki brauzerlar `.vue` fayllarini to'g'ridan-to'g'ri tushunmaydi.

## Bosqichma-bosqich yuklash

1. **Loyihani yig'ish (Build)**:
   Terminalda loyihaning asosiy papkasida turib ushbu buyruqni ishga tushiring:
   ```bash
   npm run build
   ```
   Bu buyruq `dist` degan papka yaratadi. Unda saytning tayyor, brauzer tushunadigan fayllari bo'ladi.

2. **GitHub Pages'ga yuklash (Deploy)**:
   Loyiha allaqachon `gh-pages` bilan moslangan. Shunchaki buni ishga tushiring:
   ```bash
   npm run deploy
   ```
   Bu buyruq avtomatik ravishda `dist` papkasidagi fayllarni GitHub'dagi `gh-pages` branchiga jo'natadi.

3. **Saytni tekshirish**:
   Bir daqiqa kutib, saytingizga kiring:
   `https://shaxzod-hp.github.io/Iso-Uz/`

## Agar yana oq ekran chiqsa:

- **Keshni tozalang**: Brauzerda saytni ochib `Ctrl + F5` tugmalarini bosing.
- **LocalStorage'ni tozalang**: Brauzer konsolini (F12) oching -> Application -> Local Storage -> saytni tanlab "Clear all" bosing. Men kodda buni tuzatganman, lekin tozalab yuborish eng ishonchli usul.
- **GitHub Sozlamalari**: GitHub -> Settings -> Pages bo'limiga kiring. "Build and deployment" qismida branch sifatida `gh-pages` va `/ (root)` tanlanganligiga ishonch hosil qiling.
