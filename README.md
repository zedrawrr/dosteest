# Safe Load Test Runner — Demo Frontend

**Important:** This project is intended for *legal, ethical, educational* use only. Do **not** use this to attack third-party services. Running unauthorized load tests or DDoS attacks is illegal and may lead to criminal charges and civil liability.

## What this project does
- Provides a frontend UI to **generate example k6 scripts** and simple `curl` / `ab` command examples.
- The UI **does not** perform load-testing itself. The "Simulate Run" button only performs a client-side visual simulation.
- You can download a k6 script and run it locally with `k6 run k6_test.js` — **only against systems you own or have permission to test**.

## How to use (legal workflow)
1. Fill the target URL with a server you control (or a test server) and check the confirmation box.
2. Click **Generate k6 script**.
3. Download the produced `k6_test.js` and run it on your local machine:
   ```bash
   # install k6 (see https://k6.io/docs/getting-started/installation/)
   k6 run k6_test.js
