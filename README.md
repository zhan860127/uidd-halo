# HALO

## Running the app

### Step 0: Get the code
```bash
$ git clone https://github.com/guaneec/uidd-halo.git
$ cd uidd-halo
```

### Step 1: Install dependencies
```bash
$ yarn
```

### Step 2: Build the code
```bash
$ yarn build
```

### Step 3: Setup database
```bash
$ npx typeorm migration:run
```

### Step 4: Edit config
Copy the default config file
```
$ cp .env.example .env
```
Open the copied `.env` file in your editor and change the port number to a free one:

```bash
# in your editor:
HALO_PORT=YOUR_PORT_NUMBER
```

### Step 5: Run the app
```bash
$ yarn start
```

## Restarting after modifying
For some reason, `parcel watch`  does not rebuild when css files are edited. \
You would have to recompile manually:
```
yarn clean
yarn build-parcel
yarn start
```

## Database migration
若要修改資料庫 schema，需更改 `src/models/entity/` 裡面的定義\
改完後執行：
```bash
$ npx tsc
$ npx typeorm migration:generate -n 自訂名稱
$ npx tsc
$ npx typeorm migration:run
```

若是由 git pull 發現其他人有更改資料庫定義，則執行：
```bash
$ npx tsc
$ npx typeorm migration:run
```
參見：[TypeORM - Migrations](https://typeorm.io/#/migrations)