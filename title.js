1.CORS - Cross Origin Resource Sharing

https://localhost:5000 - frontend

https://localhost:3000 - backend

two different ports . two different origins.

2. Middleware 

Request / Response process 

3. CRON job - schedule task

* * * * * - every minute

20 * * * * - every hour

55 8 * * * - 08:55 every day

0 0 1 * * - 00:00 every month

0 0 1 12 * - 00:00 every year

0 0 * * 0 - 00:00 every Sunday

cron.schedule( "0 * * * *", () => {
  console.log("running a task every hour");
});