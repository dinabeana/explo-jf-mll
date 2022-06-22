### Project Description

See the [exhibit page on the wiki](https://wiki.exploratorium.edu/pages/viewpage.action?pageId=75956372) for a description and history of this project.

This web app reads the QR labels on exhibits and allows visitors to chose between online English, Spanish, and Chinese translations of the label. The QR reader will work on Android mobile devices but not iOS phone devices. iOS will not allow access to the mobile camera via the browser on cell phones.

The app is served from http://www.exploratorium.edu/mllapp/
The intro and content pages are served from http://www.exploratorium.edu/mll/
The intro and content pages were written in Drupal by Erin Elliott of the web group.

This app can be easily extended to other languages as well as repurposed for multi-lingual new media exhibits written in Javascript.

##### App Features
* full standalone, one-page version of the app
* QR reader capability detection (i.e. whether the camera can be accessed from the browser) + error handling
* domain restriction, limited to urls on the www.exploratorium.edu/mll domain, + error handling
* external config file allows change of settings without going into the code
* app can be altered to add/subtract languages in three steps:

    1. create introduction and content pages in the new language (if adding a language)

    2. change language and translations directly in config_MultiLingualLabels.json

    3. re-transpile app

    The app will autogenerate the UI elements in the new language. There is no need to alter the javascript to configure the app or add/subtract languages.

* inactivity timeout

##### Code Environment
* Javascript ECMA2015
* Node v7.3.0
* webpack + babel with polyfills to transpile for target browser, Chrome for Android (not necessary if repurposed for a kiosk app)
* ESLint
* see package.json for details

##### Code Description
This code allows visitors a choice of languages to toggle between. When a different language is chosen, all UI elements appear in that language. As mentioned above, the languages and translations are easily alterable through the config\_MultiLingualLabels.json file. There is no need to alter the javascript to configure the app or change the languages. 

The code checks to see if the browser allows QR scanning capabilities/accessing the mobile's camera and displays an error message if not. The QR code triggers a request to display the corresponding label content in the corresponding language in an iframe embedded in the html page. The codes and url are verified. If they are outside of the chosen domain/subdomain the app displays an error message and does not proceed to the url.

The external json configuration file allows:

* app settings to be configured (e.g. inactivity timeout)
* configuration of the urls for the content pages
* translation text to be directly typed in, without need to access the Javascript to incorporate the translations into the interface code.

### External libraries

llqrcode QR scanning library from Lazlo Lazer (included)
https://github.com/LazarSoft/jsqrcode

### Compiling information

Ready-to-go files are in the /dist folder. To compile the source code, make sure you have the correct version or higher of Node running (see above). Using the command-line, cd to the repository folder, run

    npm install

then you can run


```
#!javascript

npm development
```

or

```
#!javascript

npm production
```


or


```
#!javascript

npm start
```

according to details in the package.json file.

### Hardware configuration

This web app runs on the Explo web server. Server must be configured to accept cross-origin requests (see Troubleshooting for a discussion of this below).

Loaner mobile hardware will be provided to the general public at Guest Services. This hardware should be an Android device, as Android allows the browser to access the camera, which is important to the QR reading functionality. iOS devices do not allow this functionality. Currently we are using the **unlocked** Motorola Moto G5 Play.

![mot-moto-g-play-blk.jpg](https://bitbucket.org/repo/ekrx7dX/images/1749335089-mot-moto-g-play-blk.jpg)

See the wiki entry at: https://wiki.exploratorium.edu/pages/viewpage.action?pageId=75956372
for more information about setting up and maintaining the Android device.

### Troubleshooting

Cross-origin (CORS) errors: As a security feature, most browsers enact the Same Origin Policy to disallow a script from one domain to load a script from another. The solution is to enable Cross-Origin-Resource-Sharing in the server that hosts the label content files by using an Access-Control- header to explicitly allow the origin of the web app, for example:

    Access-Control-Allow-Origin: http://www.exploratorium.edu

or if you want to allow any site to access the labels, use a wildcard:

    Access-Control-Allow-Origin: *

See [https://enable-cors.org/server.html](https://enable-cors.org/server.html) for specific information for various servers.

### Error handling and status indication

* Capability verification: If the device accessing the app does not allow accessing the camera from the browser (and hence won't scan the QR codes), a message is displayed.

* MLL domain verification: QR code input is limited to the exploratorium.edu/mll subdomain and an error message is displayed if QR codes are scanned outside of this subdomain. This setting can be changed in the config json file.

### Future-proofing

* This app is responsive to variable screen sizes and resolutions and can be used as a basis for multi-lingual kiosk apps.

* Languages, translations, and settings can be extended/changed through the json config file without having to touch the javascript code.

* Code is in ECMA 2015 transpiled through Babel to target various browsers. Polyfills for
```
#!javascript

fetch
```
 and
```
#!javascript

promises
```
 are used.

### Modules that can be reused:

##### Classes

**QRReader.js** for browser-based qr reading: Create a new instance of QRReader.js and set the qrCallback function as in MLLApplication.js. Also be sure to use controlCameraOnPageVisibilityChange() in MLLApplication.js to turn on and off the camera when the focus is on and off the web page, so that the camera does not stay on when people are not using the app.

**LanguageForm.js** is an example of using ECMA2015 template strings to generate HTML from js.

**MLLApplication.js** and the HTML page structure is an example of how to create a single-page app to load multiple screens, including an iframe which loads external content and css selectors that change the state of the app.

**MLLApplication.js** also demonstrates how to load and toggle between multiple contexts/UI languages. See the function updateTranslationStrings.js in MLLApplication.js.

##### Reusable Functions

**combineArrays.js** combines two arrays via ECMA2015 destructuring.

**configureURL.js** uses ECMA2015 template strings to create a url from strings.

**fetchJSON.js** is an ECMA2015 replacement for XMLHttpRequests. The polyfills are only necessary for cross-browser compatibility.

**testURL.js** tests to see if a file is returned from a given URL after a specified amount of time.

##### Other utilities

**LanguageForm.js + MLLApplication.js + HTML** gives an example of creating usable radio buttons without the buttons.

**processCode() in MLLApplication.js** contains an example of form validation.

**updateTranslationStrings()** in MLLApplication.js is handy for apps with UI labels that require translations to multiple languages.

### Code diagrams

https://docs.google.com/a/exploratorium.edu/drawings/d/1ujWM5yAA-xLIoL7TfaDtMejULXTbTj9ycKKFf9VDQk0/edit?usp=sharing

### Circuit diagrams

none

### Related assets outside of this repo

QR + numerical code stickers, to be created by graphics and stored in the exhibit folder on the server. Poster at the Guest Services desk introduces the app.

