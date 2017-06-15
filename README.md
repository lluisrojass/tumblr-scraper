# Tumblr Post Scraper <img src="/Resources/icon.png" width="45">  
Desktop Application to scrape user uploaded content from a [Tumblr](www.tumblr.com) blog. Tumblr provides no way to do this naturally and alternative apps are notoriously slow.

Built utilizing Github's [Electron Framework](https://electron.atom.io/) & rendered using Facebook's [React](https://facebook.github.io/react/). 


![](https://img.shields.io/badge/npm-v4.1.2-green.svg)  ![](https://img.shields.io/badge/electron-v1.4.15-blue.svg) ![](https://img.shields.io/badge/react-v15.4.2-yellow.svg) ![](https://img.shields.io/badge/build-passing-brightgreen.svg)

<a href="https://gyazo.com/9eb0825ddca040f8467838ca519029e9"><img src="https://i.gyazo.com/9eb0825ddca040f8467838ca519029e9.gif" alt="https://gyazo.com/9eb0825ddca040f8467838ca519029e9" width="980"/></a>
## Contribution 
```
git clone https://github.com/lluisrojass/Tumblr-Blog-Scraper.git
cd Tumblr-Post-Scraper
npm install 
```
the npm install command downloads several Babel presets & plugins utilized by the renderer process. Further Reading on them: [Class Properties Transform](https://babeljs.io/docs/plugins/transform-class-properties/), [ES2015 Preset](https://babeljs.io/docs/plugins/preset-es2015/), [React Preset](https://babeljs.io/docs/plugins/preset-react/). 

When developing, run `npm run start` to run and `npm run watch` to execute a [watchify](https://github.com/substack/watchify) script to monitor and update changes. Also change devmode to true in [config.json](./config.json) to enable [electron-reload](https://www.npmjs.com/package/electron-reload) and chrome devtools.



## To-do list:
- [ ] Option to export post links to a text file.
- [ ] Proxy Support.
- [ ] Gzip Response.
