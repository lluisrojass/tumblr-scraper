# Tumblr Personal Post Scraper

![](https://img.shields.io/badge/npm-v4.1.2-green.svg)  ![](https://img.shields.io/badge/electron-v1.4.15-blue.svg) ![](https://img.shields.io/badge/react-v15.4.2-yellow.svg) ![](https://img.shields.io/badge/build-passing-brightgreen.svg)

Scrape user uploaded content from a [Tumblr](www.tumblr.com) blog. Tumblr provides no natural mechanism for viewing user uploaded content on their website nor do they have any plans to integrate such a feature.

example scrape for photo, ask and text posts in <https://support.tumblr.com>:
<img src="https://i.gyazo.com/0700e8ee70bdaa1517f2cd4cb01d4c23.gif" alt="https://gyazo.com/9eb0825ddca040f8467838ca519029e9" width="980"/>


## New In V1.2.0

- Request Throttling
- Single file executables including installers (DMG, NSIS)
- Faster UI (React PureComponent and Redux Integration)
- New Icon
- Smaller JavaScript bundle

## Download V1.2

- [macOS (DMG)](https://github.com/lluisrojass/tumblr-scraper/releases/download/v1.2/Tumblr.Scraper-1.2.0.dmg)  
- [Windows (NSIS)](https://github.com/lluisrojass/tumblr-scraper/releases/download/v1.2/Tumblr.Scraper.Setup.1.2.0.exe)
- [Linux (AppImage)](https://github.com/lluisrojass/tumblr-scraper/releases/download/v1.2/tumblr-scraper-1.2.0-x86_64.AppImage)
- [Linux (deb)](https://github.com/lluisrojass/tumblr-scraper/releases/download/v1.2/tumblr-scraper_1.2.0_amd64.deb)

## Contribution 
Clone the rep:

```
git clone https://github.com/lluisrojass/tumblr-scraper.git
cd tumblr-scraper
npm install
```
Run `npm run watch` to execute a development watchify script which monitors files and re-builds the bundle file upon noticing a change. The bundle file will not be present upon cloning and will require generation regardless. The other method for bundle file generation is running `npm run min` which ouputs a minified and production ready bundle. While in development, use the `npm run simulate` command to simulate the app with development addons (chrome devtools and [electron-reload](https://github.com/yan-foto/electron-reload)) which are useful for logging and debugging.   

**Tools/Libraries to be aware of**: 

-  [Electron Framework](https://electron.atom.io/)
- [Browserify](http://browserify.org/)
- [Babel](https://babeljs.io/)
- [Redux](https://github.com/reactjs/redux)
- [React](https://github.com/facebook/react)
- [htmlparser2](https://github.com/fb55/htmlparser2)
- [Transform class babel properties plugin](https://babeljs.io/docs/plugins/transform-class-properties/)
- [ES2015 babel preset](https://babeljs.io/docs/plugins/preset-es2015/)
- [React babel preset](https://babeljs.io/docs/plugins/preset-react/)


## What is Request Throttling?
When scraping blogs with large frequency and density of original posts the application could become unresponsive or a large CPU burden. To help aleviate this, throttling was introduced. When turned on (default behaviour) the application will keep track of the pending image load the application has to yet to fulfil and could temporaily dely the continuation of the requests loop. This provides breathing time between page requests to prevent overwhelmight rush of front-end workload. Throttling can also be toggled while scrapes are executing.



