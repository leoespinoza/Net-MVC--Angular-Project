An AngularJS Dashboard, Part 8: Role Support and Mobile Improvements
https://davidpallmann.blogspot.com/2017/11/an-angularjs-dashboard-part-8-mobile.html

After downloading the code project, you can either
(1) run it as downloaded. This will use the demo.data.service.js with inline tile definitions in the JavaScript code; or
(2) create a database and change the project to use sql.data.service.js, pulling dashboard layout from the database.

If you are going to use configuration (1), just build and run the project.
If you are going to use configuration (2), follow the instructions below:


Configuration Options
---------------------
DATA SOURCE
Configuration 1: in index.html, include demo.data.service.js, and comment out sql.data.service.js
Configuration 2: in index.html, include sql.data.service.js, and comment out demo.data.service.js
CHART PROVIDER
To use Google Visualization API : in index.html, include google.chart.service.js, and comment out chartjs.chart.service.js
To use Chart.js : in index.html, include chartjs.chart.service.js, and comment out google.chart.service.js

Instructions--Configuration 2

1. Create a SQL Server Database
You will need SQL Server Express or SQL Server installed on your computer for this step, plus SQL Server Management Studio (SSMS).
1a. Launch SSMS.
1b. Open the script dashboard_database.sql included in the project.
1c. Execute the script to create SQL Server database Dashboard.

2. Update database appSetting in web.config
2a. Open the Dashoard solution in Visual Studio.
2b. Edit web.config
2c. Find the <appSetting> named "dashboard".
2d. Update the connection string to point to YOUR database. Make sure the server name and instance name match what you created in Step 1.

3. Update Index.html to use the sql.data.service.js.
3a. In Visual Studio, edit Index.html.
3b. Comment out the line near the bottom that includes demo.data.service.js.
3c. Uncomment the line near the bottom that includes sql.data.service.js.

That's it, you're ready to try running the project
