# How to Free Port 3000

Process 57580 is stuck in an uninterruptible kernel wait state and cannot be killed from the command line.

## Quick Fix (Activity Monitor):

1. Press `Cmd + Space` and type "Activity Monitor"
2. Press `Cmd + F` to search
3. Type `57580` or search for `next-server`
4. Select the process
5. Click the **Force Quit** button (or press `Cmd + Option + Esc`, find it, and Force Quit)

## Alternative: Use Terminal (try this):

```bash
# Try sending different signals
kill -TERM 57580
sleep 2
kill -9 57580
```

## After killing the process:

```bash
cd /Users/yasiinali/careercompassi
npm run dev
```

Your dev server will start on **http://localhost:3000**


