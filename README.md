# Louvre Project - Gobelins 2019 - 2020

Built with:

* Handlebars
* SASS
* Babel
* Webpack

### Commands

Setup using:
```bash
npm install
```

Start a development server with watch tasks:
```bash
npm start
```

Build for production:
```bash
npm build
```

### Project Structure

```
/
├── src
│   ├── css
│   │   └── index.scss
│   ├── data
│   │   ├── replacements.json
│   │   └── site.json
│   ├── fonts
│   ├── img
│   ├── js
│   │   └── index.js
│   ├── views
│   │   ├── layout
│   │   │   └── template.hbs
│   │   ├── paritals
│   │   ├── page.hbs
│   │   └── index.hbs
│   └── entry.js
├── webpack.config.js
└── webpack.helpers.js
```

The generated _build_ will have the following structure:
```
dist
├── bundle[hash].js
├── fonts
├── img
├── index.html
├── main[hash].css
└── page
    └── index.html
```

### THREE JS
To add a new 3D Model (gltf only) just add your 3D Object folder into src/modeles and then add a new item in src/data/modeles.json. 

### TODO
Add browsersync
Handle Handlebars compilation errors
