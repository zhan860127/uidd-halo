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