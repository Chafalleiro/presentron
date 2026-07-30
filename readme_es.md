# Presentron 🖵

**Slideshare with text** - Una aplicación web de presentaciones con estética retro CRT

## Descripción

Presentron es una aplicación web que permite crear y visualizar presentaciones con un estilo visual retro inspirado en los monitores CRT antiguos. Ofrece efectos visuales auténticos como curvatura de pantalla, brillo, contraste y filtros de color personalizables.

## Características Principales

- 🖥️ **Estética CRT**: Efectos visuales de monitores antiguos (curvatura, scanlines, brillo)
- 🎨 **Personalización**: Ajuste de color, brillo, contraste y efecto barril
- 📑 **Gestión de Slides**: Sistema de presentación de diapositivas con transiciones
- 🔊 **Efectos de Sonido**: Sonidos ambientales de proyectores y cambios de diapositiva
- 📱 **Responsive**: Adaptable a diferentes resoluciones de pantalla
- 🗂️ **Base de Datos Local**: Almacenamiento de configuraciones y datos de presentaciones

## Estructura del Proyecto

```
presentron/
├── index.html              # Aplicación principal
├── presentron.html         # Vista alternativa del presentador
├── s_presentron.html       # Vista secundaria
├── template.html           # Plantilla base
├── slides.json             # Datos principales de slides
├── slides_data.json        # Información adicional de slides
├── quick_slides.json       # Guía de inicio rápido
├── files_data.json         # Metadatos de archivos
├── config_help.json        # Configuración de ayuda
├── presentron_help.json    # Ayuda contextual
├── pressentronConf.json    # Configuración de la aplicación
├── .gitignore              # Archivos ignorados por Git
│
├── js/                     # Scripts JavaScript
│   ├── presentron.js       # Lógica principal
│   ├── db_routines.js      # Funciones de base de datos
│   ├── crt.js              # Efectos CRT
│   ├── colors.js           # Gestión de colores
│   ├── pr_data.js          # Datos de presentación
│   ├── scripts.js          # Scripts utilitarios
│   └── umd.js              # Módulo UMD
│
├── styles/                 # Hojas de estilo CSS
│   ├── crt.css             # Estilos de efectos CRT
│   ├── fonts.css           # Fuentes personalizadas
│   ├── menus.css           # Estilos de menús
│   ├── slides.css          # Estilos de diapositivas
│   └── tele.css            # Estilos de televisión/monitor
│
├── img/                    # Recursos gráficos
│   ├── crt_green_mask.png  # Máscara de monitor verde
│   ├── teleback.jpg        # Fondo de televisión
│   ├── vga.png/.ico        # Iconos VGA
│   └── favicons            # Iconos de varios colores
│
├── slides/                 # Imágenes de diapositivas
│   ├── Texture*.png        # Texturas de fondo
│   ├── dedazo*.png/jpg     # Imágenes de demostración
│   ├── pelo*.png/jpg       # Imágenes adicionales
│   └── mando.svg           # Gráficos de control
│
├── fonts/                  # Fuentes personalizadas
│   ├── IBMPlexMono-*.woff2 # Familia IBM Plex Mono
│   ├── Web437_*.woff       # Fuentes estilo DOS/CGA
│   └── Minecart-LCD.woff   # Fuente LCD
│
└── snd/                    # Efectos de sonido
    ├── encenderptoyectorvideo.*  # Sonido de encendido
    ├── apagarproyectorvideo.*    # Sonido de apagado
    ├── ventiladorproyectorvideo.*# Sonido de ventilador
    ├── cambioDiapo.*             # Cambio de diapositiva
    └── switch.*                  # Efectos de interruptor
```

## Instalación y Uso

### Requisitos Previos

- Navegador web moderno con soporte para HTML5, CSS3 y JavaScript ES6+
- Servidor web local (opcional pero recomendado)

### Ejecución Local

1. **Clonar el repositorio:**
   ```bash
   git clone <repository-url>
   cd presentron
   ```

2. **Abrir en el navegador:**
   - Opción A: Abrir directamente `index.html` en tu navegador
   - Opción B: Usar un servidor local:
     ```bash
     # Python 3
     python -m http.server 8000
     
     # Node.js (npx)
     npx http-server -p 8000
     ```
   - Acceder a `http://localhost:8000`

### Navegación

- **Menú Principal**: Haz clic en el botón 🗗 para expandir el menú
- **Controles de Presentación**: Usa los botones del menú para navegar entre slides
- **Configuración**: Ajusta color, brillo, contraste desde el panel de configuración
- **Modo Pantalla Completa**: Disponible para experiencia inmersiva

## Configuración

La aplicación utiliza archivos JSON para la configuración:

- **pressentronConf.json**: Configuración de efectos visuales
  - `color`: Esquema de color (originalC, etc.)
  - `brightness`: Nivel de brillo (0-2)
  - `contrast`: Nivel de contraste (0-2)
  - `barrel`: Activar/desactivar efecto barril CRT
  - `arrsBarrels`: Configuraciones predefinidas por formato (wide, square, tall)

- **slides.json / slides_data.json**: Datos de las presentaciones
- **files_data.json**: Metadatos de archivos multimedia

## Tecnologías Utilizadas

- **Frontend**: HTML 4.01 Transitional, CSS3, JavaScript ES6+
- **Fuentes**: IBM Plex Mono, fuentes retro CGA/VGA, LCD
- **Audio**: Formatos WAV y MP3 para efectos de sonido
- **Gráficos**: PNG, JPG, SVG, ICO

## Licencia

Las fuentes incluidas en la carpeta `fonts/` están bajo licencia Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0). Ver `fonts/LICENSE_int10h.TXT` para más detalles.

El resto del proyecto puede tener sus propios términos de uso.

## Créditos

- **Presentron**: Desarrollado por Chafalleiro
- **Fuentes**: The Ultimate Oldschool PC Font Pack por VileR (int10h.org)
- **Iconos y Gráficos**: Recursos personalizados estilo retro

## Enlaces

- **Repositorio**: [Enlace al repositorio]
- **Demo**: [Enlace a demo si está disponible]
- **Fuentes**: [The Ultimate Oldschool PC Font Pack](http://int10h.org/oldschool-pc-fonts/)

## Soporte

Para problemas o sugerencias, por favor abre un issue en el repositorio o contacta al autor.

---

*Presentron - Reviviendo la estética de las presentaciones retro* 📼
