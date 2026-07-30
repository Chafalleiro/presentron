# Presentron 🖵

**Slideshare with text** - A web-based presentation application with retro CRT aesthetics

## Description

Presentron is a web application that allows you to create and view presentations with a retro visual style inspired by old CRT monitors. It offers authentic visual effects such as screen curvature, brightness, contrast, and customizable color filters.

## Main Features

- 🖥️ **CRT Aesthetics**: Visual effects of old monitors (curvature, scanlines, brightness)
- 🎨 **Customization**: Adjust color, brightness, contrast, and barrel effect
- 📑 **Slide Management**: Slide presentation system with transitions
- 🔊 **Sound Effects**: Ambient projector sounds and slide changes
- 📱 **Responsive**: Adaptable to different screen resolutions
- 🗂️ **Local Database**: Storage of configurations and presentation data

## Project Structure

```
presentron/
├── index.html              # Main application
├── presentron.html         # Alternative presenter view
├── s_presentron.html       # Secondary view
├── template.html           # Base template
├── slides.json             # Main slides data
├── slides_data.json        # Additional slides information
├── quick_slides.json       # Quick start guide
├── files_data.json         # File metadata
├── config_help.json        # Help configuration
├── presentron_help.json    # Contextual help
├── pressentronConf.json    # Application configuration
├── .gitignore              # Files ignored by Git
│
├── js/                     # JavaScript scripts
│   ├── presentron.js       # Main logic
│   ├── db_routines.js      # Database functions
│   ├── crt.js              # CRT effects
│   ├── colors.js           # Color management
│   ├── pr_data.js          # Presentation data
│   ├── scripts.js          # Utility scripts
│   └── umd.js              # UMD module
│
├── styles/                 # CSS stylesheets
│   ├── crt.css             # CRT effects styles
│   ├── fonts.css           # Custom fonts
│   ├── menus.css           # Menu styles
│   ├── slides.css          # Slide styles
│   └── tele.css            # TV/monitor styles
│
├── img/                    # Graphic resources
│   ├── crt_green_mask.png  # Green monitor mask
│   ├── teleback.jpg        # TV background
│   ├── vga.png/.ico        # VGA icons
│   └── favicons            # Multi-colored icons
│
├── slides/                 # Slide images
│   ├── Texture*.png        # Background textures
│   ├── dedazo*.png/jpg     # Demo images
│   ├── pelo*.png/jpg       # Additional images
│   └── mando.svg           # Control graphics
│
├── fonts/                  # Custom fonts
│   ├── IBMPlexMono-*.woff2 # IBM Plex Mono family
│   ├── Web437_*.woff       # DOS/CGA style fonts
│   └── Minecart-LCD.woff   # LCD font
│
└── snd/                    # Sound effects
    ├── encenderptoyectorvideo.*  # Power-on sound
    ├── apagarproyectorvideo.*    # Power-off sound
    ├── ventiladorproyectorvideo.*# Fan sound
    ├── cambioDiapo.*             # Slide change
    └── switch.*                  # Switch effects
```

## Installation and Usage

### Prerequisites

- Modern web browser with HTML5, CSS3, and JavaScript ES6+ support
- Local web server (optional but recommended)

### Running Locally

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd presentron
   ```

2. **Open in browser:**
   - Option A: Open `index.html` directly in your browser
   - Option B: Use a local server:
     ```bash
     # Python 3
     python -m http.server 8000
     
     # Node.js (npx)
     npx http-server -p 8000
     ```
   - Access `http://localhost:8000`

### Navigation

- **Main Menu**: Click the 🗗 button to expand the menu
- **Presentation Controls**: Use menu buttons to navigate between slides
- **Settings**: Adjust color, brightness, contrast from the settings panel
- **Fullscreen Mode**: Available for immersive experience

## Configuration

The application uses JSON files for configuration:

- **pressentronConf.json**: Visual effects configuration
  - `color`: Color scheme (originalC, etc.)
  - `brightness`: Brightness level (0-2)
  - `contrast`: Contrast level (0-2)
  - `barrel`: Enable/disable CRT barrel effect
  - `arrsBarrels`: Preset configurations by format (wide, square, tall)

- **slides.json / slides_data.json**: Presentation data
- **files_data.json**: Multimedia file metadata

## Technologies Used

- **Frontend**: HTML 4.01 Transitional, CSS3, JavaScript ES6+
- **Fonts**: IBM Plex Mono, retro CGA/VGA fonts, LCD
- **Audio**: WAV and MP3 formats for sound effects
- **Graphics**: PNG, JPG, SVG, ICO

## License

The fonts included in the `fonts/` folder are under Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0) license. See `fonts/LICENSE_int10h.TXT` for more details.

The rest of the project may have its own terms of use.

## Credits

- **Presentron**: Developed by Chafalleiro
- **Fonts**: The Ultimate Oldschool PC Font Pack by VileR (int10h.org)
- **Icons and Graphics**: Custom retro-style resources

## Links

- **Repository**: [Link to repository]
- **Demo**: [Link to demo if available]
- **Fonts**: [The Ultimate Oldschool PC Font Pack](http://int10h.org/oldschool-pc-fonts/)

## Support

For issues or suggestions, please open an issue in the repository or contact the author.

---

*Presentron - Reviving the aesthetics of retro presentations* 📼
