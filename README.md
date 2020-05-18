# halo

> The magic conch shell

## Instructions

### Setup
Make sure you have [sqlite](https://www.sqlite.org/index.html) and [ffmpeg](https://www.ffmpeg.org/) installed

``` bash
yarn
yarn db migration:run

cp .env.example .env
# edit .env file in your editor
```

### Development
```bash
yarn dev
```

⚠ 請盡量在本地開發，因為 luffy 同時監視檔案的數量可能會塞滿而導致出錯

`yarn dev` 會監視檔案的更動，自動刷新瀏覽器 \
~~只是如果改的是 server 端相關的檔案，伺服器的 RAM 不知道為什麼會越用越多~~ \
~~所以改 server 相關的檔案 (`server/`) 的時候 可能需要不時手動重啟 `yarn dev`~~ \
~~改客戶端頁面 (`pages/`) 就正常~~\
更新：現在 server 端**必須**手動重啟 才會更動

### Production
```bash
yarn build
yarn start
```

### Linting
```bash
yarn lint
```
在 git commit 之前，務必先 lint 確定沒有格式錯誤，否則 commit 會失敗 \
如果編輯器用的是 vscode 可以裝可以裝 eslint 套件，這樣存檔的時候會自動整理格式。

## Directory structure
```
.
├── assets            可以 import 的 css, js, ...
├── components        可在不同頁面重複利用的 vue 物件
├── layouts
├── middleware
├── models            資料庫定義,migration
├── node_modules
├── pages             獨立頁面
├── patches
├── plugins
├── server            伺服器端邏輯
├── static            這會 mount 到網站的 /
├── store
└── test
```

## Frameworks / technologies

* [Nuxt.js](https://nuxtjs.org/)
* [TypeORM](https://typeorm.io/#/)
* [Express](https://expressjs.com/)
* [TypeScript](https://www.typescriptlang.org/)
