# Event Management & UMKM Bazaar Platform

This project is a sophisticated web platform designed to manage the entire lifecycle of an event or bazaar, focusing on the participation of MSMEs (Micro, Small, and Medium Enterprises). The application brings together Event Organizers, MSME Participants, Admins, and Field Committees into a single integrated ecosystem.

Built with **Laravel** for the backend and **React** for the frontend, this application offers a modern and reactive user experience, complete with real-time notifications.

---

## Key Features

The application features a complex multi-role system, where each role has its own dashboard and functionality.

### Roles & Functionalities

-   **MSME (Participant)**

    -   Register and create a business profile.
    -   Manage products to be displayed.
    -   Search and register for available events.
    -   Make payments and upload transfer proof.
    -   Receive and download E-Tickets with QR codes.
    -   Upload personal QRIS for on-site transactions.

-   **Event Organizer**

    -   Submit new event proposals via a multi-step wizard.
    -   Monitor proposal approval status.
    -   Verify payments from registering MSMEs.
    -   Assign booth/stall numbers to participants.
    -   Download activity reports and participant data in PDF or Excel format.

-   **Admin**

    -   Verify and manage MSME and Organizer accounts.
    -   Review, approve, or reject event proposals.
    -   Publish events so they are visible to MSMEs.
    -   Monitor and verify all financial transactions.
    -   Access basic reports and analytics, and export them to PDF/Excel.

-   **Field Committee**

    -   Quick login using a special PIN at the event location.
    -   Check-in participants by scanning QR codes on E-Tickets.
    -   Search participant data in real-time.

-   **Super Admin**
    -   Full management over all users and roles.
    -   Create and delete Admin accounts.
    -   "Impersonate" feature to log in as other users for troubleshooting.
    -   Access advanced system logs and reports.

---

## Tech Stack

-   **Backend**: Laravel 12, PHP 8.2
-   **Frontend**: React, Vite, Inertia.js
-   **Styling**: TailwindCSS
-   **Database**: MySQL (recommended), or other databases supported by Laravel.
-   **Real-time**: Laravel Reverb (WebSockets)
-   **Additional Features**:
    -   PDF Generation: `barryvdh/laravel-dompdf`
    -   QR Code Generation: `simplesoftwareio/simple-qrcode`
    -   Social Login: `laravel/socialite`
    -   Security: `react-google-recaptcha`

---

### New Highlights

-   **Advanced Security**:

    -   **Google OAuth**: Fast and secure login using Google accounts.
    -   **OTP Verification**: Registration verification using real-time OTP codes via email.

-   **User Privacy (Secure Impersonation)**:

    -   Super Admin can troubleshoot user accounts with the Impersonate feature.
    -   **Privacy-First**: Uses a _Request-Approval_ mechanism, where admins must request permission and users must approve before the account can be accessed.

-   **Smart Location Management**:

    -   Interactive map integration for accurate bazaar location coordinate determination.
    -   Location visualization for visitors.

-   **Staged Proposal Validation**:

    -   Separate proposal review system between legality document completeness and event details, facilitating the audit process for Admins.

-   **Reporting & Data Export**:
    -   Easy download of accountability reports and participant data in industry-standard formats (PDF & Excel) for administrative needs.

---

## Installation & Setup

Here is a step-by-step guide to clone and run this project in a local development environment.

### 1. Prerequisites

-   PHP 8.2 or higher
-   Composer
-   Node.js & NPM
-   Database (e.g., MySQL, MariaDB)
-   Git

### 2. Installation Steps

1.  **Clone Repository**

    ```bash
    git clone [YOUR_REPOSITORY_URL]
    cd [PROJECT_DIRECTORY_NAME]
    ```

2.  **Environment Configuration**

    -   Copy the `.env.example` file to `.env`. This file contains all the environment variables needed by the project.
        ```bash
        cp .env.example .env
        ```
    -   Open the `.env` file and fill in all necessary values, especially:
        -   **Database Configuration**: `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`.
        -   **Email Configuration (SMTP)**: `MAIL_USERNAME`, `MAIL_PASSWORD` (Required for OTP verification).
        -   **Google API Keys**: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` (Required for Google Login).
        -   **reCAPTCHA Keys**: `RECAPTCHA_V...` (If you want the reCAPTCHA feature active).

3.  **Install Backend Dependencies**

    ```bash
    composer install
    ```

4.  **Install Frontend Dependencies**

    ```bash
    npm install
    ```

5.  **Generate Application Key**
    Every Laravel application requires a unique encryption key.

    ```bash
    php artisan key:generate
    ```

6.  **Run Migrations & Database Seeder**

    -   The `migrate` command will create all necessary tables in your database.
    -   The `db:seed` command will populate the database with initial data (including default admin/superadmin accounts) as directed by `DatabaseSeeder.php`.

    ```bash
    php artisan migrate
    php artisan db:seed --class=DatabaseSeeder
    ```

7.  **Run Development Server**
    This project uses Vite to manage frontend assets and Reverb for WebSockets. You can run everything with a single command:

    ```bash
    npm run dev
    ```

    This command will:

    -   Run the PHP development server (`php artisan serve`).
    -   Run the Vite server. (`npm run dev`)
    -   Run the queue listener. (`php artisan queue:work`)
    -   Run the Laravel Reverb server. (`php artisan reverb:start`)

8.  **Access Application**
    Once all servers are running, you can open the application in your browser at the address shown (usually `http://127.0.0.1:8000`).

Congratulations! The project is now running on your local machine.
