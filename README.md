# Restaurant Menu Builder

A technology demonstration, in the form of a simple restaurant menu management app, that integrates the following technologies:

- [Redux](http://redux.js.org/) for the app's model layer.

- [React](https://facebook.github.io/react/) for the app's view layer.

- [TypeScript](http://www.typescriptlang.org/) as the scripting language.

- [Webpack](https://webpack.github.io/) for build and bundling.

- [Bootstrap](http://getbootstrap.com/) for styling.

- [Karma](https://karma-runner.github.io/1.0/index.html)/[Mocha](https://mochajs.org/) for testing.

- [SASS](http://sass-lang.com/) for styling. Here we use [Libsass](http://sass-lang.com/libsass) instead of Ruby SASS.

To view the app live, click [here](https://huy-nguyen.github.io/restaurant-menu-builder/). Please note that visual aesthetics is not the main purpose of this app.

## Overview

The UI has two panels: the left-hand panel for adding, selecting/deselecting or deleting menu items and the right-hand one for immediate viewing of the resulting menu.

Each menu item has the following properties:

- Category, e.g desserts, vegetables, snacks and so on.

- Name: name of the menu item.

- Description: description of the menu item. Usually the ingredients.

- Price, in dollars.

- Whether or not the item is vegetarian.

- Whether or not the item is undercooked. Sometimes food can contain foodstuffs that are undercooked, like a medium­rare steak, which restaurants must report by law.

The user interface:

- The left panel is used to edit menu items.

    - Click on each menu item to toggle that item's inclusion in the menu.

    - Click "Delete" to remove that item from the database.

    - Fill in the form at the top to add new items.

- The right panel is a live preview of the menu.

## Build

- On the command line, `cd` to the project directory

- Run `npm install`. If you don't have `npm` already installed, follow the instructions [here](https://docs.npmjs.com/getting-started/installing-node).

- To do development, run `npm run start`. This will start a web server on port `8080` so point your web browser to `http://localhost:8080/` to see a working version of the app. Because [Hot Module Replacement](https://webpack.github.io/docs/hot-module-replacement.html) is enabled, any SASS changes will take effect right away without reloading and any TypeScript changes will take effect after a refresh.

- To build for production, run `npm run build`. The resulting app is in the `dist` directory in the project directory. `index.html` is the entry point.

- To run tests, execute `npm test`.

## Note:

- While debugging with Chrome Dev tools, use the `webpack:///./~/` pattern to blackbox third-party libraries.
