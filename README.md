# VoteSphere — Online Voting System

## SDC requirement mapping

| Requirement | Implementation |
|---|---|
| Problem statement | Digital student voting portal with voter authentication, ballot casting, admin management and results |
| Minimum modules | Admin Module + User/Voter Module |
| Technologies | HTML, CSS, JavaScript only |
| UI template | CSS Grid + Flexbox throughout |
| Signup/Login | Local Storage (`votesphere_users`) |
| Navigation | JavaScript role-based redirection and dashboard section navigation |
| Major functionality | Election creation, candidate management, voter list, voting, one-vote-per-election rule, results |
| GitHub | Static project; can be pushed directly to a GitHub repository |
| Demo | Open `index.html` in a browser |

## Demo credentials

- Admin: `admin` / `admin123`
- Voter: `voter` / `voter123`

A new voter can also use **Create account**.

## Project structure

```text
Online_Voting_System/
├── index.html
├── admin.html
├── user.html
├── README.md
├── css/
│   └── styles.css
└── js/
    ├── data.js
    ├── auth.js
    ├── app.js
    ├── admin.js
    └── user.js
```

## How to run

1. Extract the folder.
2. Open `index.html` in a modern browser.
3. Login with the demo admin or voter credentials.
4. As Admin: create/activate elections and add candidates.
5. As User: select a candidate and submit the ballot.
6. Open Results after voting to view the stored vote count.

No backend or database is used because the SDC requirement permits only HTML, CSS and JavaScript. All demo data is stored in the browser's Local Storage.

## GitHub

Create a new GitHub repository and upload all files while preserving the folder structure. Because this is a static application, it can also be deployed using GitHub Pages.

## Important academic note

This is a **client-side academic demonstration**, not a production-grade election system. Local Storage is intentionally used to satisfy the project requirement and should not be described as secure election infrastructure.
