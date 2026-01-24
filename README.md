# Quiet Numbers

Quiet Numbers הוא פרויקט Web שמטרתו לסייע בניהול תקציב בסיסי בצורה פשוטה וברורה, עם מיקוד מיוחד בסטודנטים בתקופת הלימודים.

## מטרת הפרויקט
ניהול תקציב יומיומי עשוי להיות מאתגר.  
הפרויקט פותח מתוך צורך בכלי נגיש ולא מורכב, שמאפשר להזין הוצאות בצורה מסודרת ולשמור על מודעות להתנהלות הכלכלית.
מתוך ניסיון אישי במהלך שנות הלימודים האקדמיים, עלה הצורך במערכת פשוטה שתאפשר מעקב רציף אחרי הוצאות, במיוחד עבור מי שמתמודד עם קשיי ריכוז ועם עומס מתמשך.  
בהיעדר כלי כזה, ההתנהלות הכלכלית עלולה להפוך כשלון.


## הקלות
הפרויקט פותח בהתאם להקלות בדרגה 3:
- מימוש בהיקף מצומצם (2 עמודים בלבד)
- מיקוד בלמידה ויישום של HTML/CSS/JavaScript בצד לקוח

## מימוש
- שני עמודי HTML מקושרים
- קובץ CSS חיצוני עם עיצוב אחיד, רספונסיבי ואנימציה בסיסית
- קובץ JavaScript חיצוני הכולל:
  - טיפול בקלטי משתמש (Forms)
  - ולידציות והצגת התראות
  - אפשרות מעבר בין מצב יום / לילה  
    (נוספה מתוך סקרנות והתנסות אישית, מעבר לדרישות הבסיסיות)
  - שמירת העדפת המשתמש באמצעות localStorage

# Quiet Numbers – Web Project (Part C)

## Description
Quiet Numbers is a simple web application for managing income and expenses.
The project includes a client side and a server side, built with Node.js and Express.

## Technologies
- Node.js
- Express
- SQLite (database)
- HTML, CSS, JavaScript (Vanilla)

## Project Structure
- public/ – client side (HTML, CSS, JS)
- server.js – Express server and routing
- db.js – SQLite database connection and SQL queries
- database.db – SQLite database file

## Server Routes (Routing)
- GET /api/test – test route
- GET /api/transactions – fetch all transactions
- POST /api/transactions – add a new transaction
- DELETE /api/transactions/:id – delete transaction by id

## Database
The project uses SQLite as a local database.
A table named `transactions` is created with the following fields:
- id
- description
- category
- type (income / expense)
- amount
- createdAt

SQL queries are used for:
- SELECT
- INSERT
- DELETE

## Forms
The Add Transaction form sends user input from the client side to the server,
where the data is validated and stored in the database.

## Validation & Edge Cases
- Amount must be greater than 0
- Type must be income or expense
- Missing fields are rejected with an error response

## How to Run
1. Run `npm install`
2. Run `npm start`
3. Open http://localhost:3000 in the browser
