# FreeLance_Website

Simple Django-based freelance portfolio/contact website. This repo contains frontend assets (static JS/CSS), Django views/models/templates and a contact form that saves messages to the database.

## Table of Contents

- Project overview
- Prerequisites
- Quick setup
- Database migrations
- Running the development server
- Frontend form behavior & debugging
- Production notes
- Tests
- Contributing
- License

## Project overview

This project serves as a portfolio and contact site for freelance services. The key feature is a contact form that saves messages to the database (model: `ContactMessage`) and optionally sends notifications.

## Prerequisites

- Python 3.8+
- pip
- virtualenv or venv
- SQLite (default) or another DB supported by Django
- Node/npm only if you're building additional frontend tooling (not required for basic run)

## Quick setup

1. Clone the repository:

   - git clone <repo-url> c:\Freelance_Website

2. Create and activate a virtual environment:

   - python -m venv myenv
   - Windows: `myenv\Scripts\activate`
   - macOS/Linux: `source myenv/bin/activate`

3. Install Python requirements:

   - pip install -r requirements.txt
     (If requirements.txt is not present, install Django: `pip install Django`)

4. Create environment variables (optional):
   - Set `DJANGO_SECRET_KEY`, `EMAIL_*` settings etc. via environment or a .env loader if used.

## Database migrations

Apply migrations before running:

- python manage.py migrate
- python manage.py makemigrations (only if you changed models)

Create a superuser:

- python manage.py createsuperuser

## Running the development server

- python manage.py runserver
- Open http://127.0.0.1:8000/ in your browser.

## Frontend form behavior & debugging (common cause for "form not saved")

This project uses a JS frontend submit (AJAX) for the contact form. Common reasons why messages are not saved:

1. CSRF protection

   - Ensure the template form contains `{% csrf_token %}`.
   - The JavaScript must send the CSRF token via the `X-CSRFToken` header or allow cookies (`credentials: 'same-origin'`) so Django accepts the POST.
   - Check cookies in DevTools → Application → Cookies for `csrftoken`.

2. Target URL / form action

   - Confirm the `<form id="projectForm" action="/path/">` points to the view handling POSTs, or leave it empty to post to the same URL.
   - The frontend JS should send the request to the correct URL (it falls back to current location if action is empty).

3. JS errors or invalid response handling

   - Open DevTools → Console and Network. Inspect the POST request:
     - Request URL
     - Response status (200 vs 403 vs 500)
     - Response body (JSON or HTML)
   - If you see 403, it's often CSRF related. If 500, check Django server logs for stack traces.

4. View only accepts AJAX

   - If the view only processes requests that have header `x-requested-with: XMLHttpRequest`, normal form posts will be ignored. Ensure view handles both AJAX and standard POSTs if needed.

5. Form validation in view

   - The view may reject missing fields. Confirm required fields are present in the request body.

6. Database / migrations
   - Ensure migrations were applied and the DB is writable (check for integrity errors or field validation exceptions in logs).

Quick reproduction steps:

- Fill the form in browser, open DevTools → Network → filter XHR/Post, submit.
- Inspect the POST: response body and HTTP code.
- Check the Django runserver console for printed errors.

## Production notes

- Configure ALLOWED_HOSTS and DEBUG=False.
- Use a proper database (Postgres recommended).
- Configure static files (collectstatic) and a WSGI server.
- Configure email backend credentials for notification emails.

## Tests

- No automated tests included by default. Add unit tests for views and models (recommended).

## Contributing

- Fork, create feature branches, and submit PRs.
- Ensure migrations are included for model changes.
- Run linters and tests before PR.

## Troubleshooting checklist for contact form

- [ ] Template includes `{% csrf_token %}` inside `<form>`.
- [ ] JS sends CSRF header or credentials: 'same-origin'.
- [ ] form `action` points to correct view URL.
- [ ] View handles POST and returns JSON for AJAX requests (or HTML for normal posts).
- [ ] Migrations applied and DB accessible.
- [ ] Check server logs (runserver) for exceptions on save.

## Contact / Maintainers

- Project maintained by Freelance_Website contributors.

## License

This project is licensed under the MIT License — see the `LICENSE` file for details.
