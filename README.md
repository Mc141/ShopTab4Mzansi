# #ShopTab4Mzansi - Browser Extension

**Adds a convenient Shopping button to Google Search pages.**

A browser extension that provides quick access to Shopping-style results for South African users by adding a "Shopping" button to Google Search pages.

## Features

- Automatically detects Google Search pages
- Extracts your search query
- Adds a "Shopping" button that matches Google's design
- Opens Shopping-style results using an alternative Google view mode
- Works on Chrome and Firefox

## Installation

1. **Chrome/Edge/Brave:**
   - Open `chrome://extensions/` (or `edge://extensions/`)
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select this project folder

2. **Firefox:**
   - Open `about:debugging`
   - Click "This Firefox"
   - Click "Load Temporary Add-on"
   - Select the `manifest.json` file in this folder

## Project Structure

```
#ShopTab4Mzansi/
├── manifest.json      # Extension configuration (Manifest V3)
├── content.js         # Main script that injects the Shopping tab
├── styles.css         # Styling for the injected tab
├── popup.html         # Extension popup UI
├── icons/             # Extension icons (16x16, 48x48, 128x128)
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md          # This file
```

## How It Works

1. **Detection**: The extension monitors Google Search pages (`google.com` and `google.co.za`)
2. **Query Extraction**: Reads the `q` parameter from the URL
3. **Button Addition**: Finds Google's tab bar and adds a "Shopping" button
4. **Navigation**: Clicking the button opens Shopping-style results in the same tab

## Privacy

This extension:
- Does NOT collect any user data
- Does NOT send data to any server
- Works entirely client-side
- Only accesses Google Search pages
- No tracking, no analytics, no telemetry

## License

This project is licensed under the GNU General Public License v3.0 (GPL-3.0).

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

See the [LICENSE](LICENSE) file for the full license text, or visit [https://www.gnu.org/licenses/gpl-3.0.txt](https://www.gnu.org/licenses/gpl-3.0.txt).

## Contributing

Contributions welcome!

## Contact

For issues, questions, or contributions:
- Email: mcwolmarans141@gmail.com
- LinkedIn: [www.linkedin.com/in/martinus-christoffel-wolmarans](https://www.linkedin.com/in/martinus-christoffel-wolmarans)
- Project Repository: Open an issue on the project repository

---

**#ShopTab4Mzansi** - Quick access to Shopping-style results for South African users.