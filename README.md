AGUILA, KHRYSTEL & CRUZ, CADHLA

# ATS-Aguila-Cruz Referral & Rewards System

A Laravel-based system designed to manage client referrals, point tracking, and reward redemptions.

## CRITERIA FOR GRADING

1. CRUD operations (Create, Read, Update, Delete) - gew
2. The frontend must use Tailwind CSS (you can install additional frontend packages) - gew
3. The backend must use Laravel (you can install additional Laravel packages) - gew
4. Users/Visitors must be able to register and log in to your website (use Laravel's default authentication) - gew. Ang main user po is yung admin only so siya lang yung may login and CRUD functions (request nung ginawan)
5. Visitors who have not yet logged in must not be able to visit protected routes in your web application (use Auth middleware in routes) - gew, it still does that naman kase users can only access other kinemerlus if they have a name and code in the system na crineate ng admin so yuh

sir ano, mag ask ka nalang para sure hahahha plsplspls

## System Overview

### 1. Admin Functionalities (Protected)
The admin panel is protected via Laravel Sanctum. Admins have full CRUD control over the core entities:

*   **Client Management**: 
    *   Full CRUD operations for client profiles.
    *   **Point Adjustments**: Manually add or deduct points from a client's balance.
    *   **Code Management**: Approve or reject requests from clients to change their unique referral codes.
    *   **Automated Maintenance**: A scheduled task runs daily to flag expired client accounts.
*   **Referral Tracking**: Manage and view the relationship between referrers and new sign-ups.
*   **Reward Catalog**: CRUD operations for rewards (defining point costs, descriptions, etc.).
*   **Redemption Processing**: 
    *   Review pending redemption requests.
    *   Approve or reject requests.
    *   Mark rewards as "Used" once the client has claimed them.
*   **Media & Settings**:
    *   Upload and manage media (images/banners) for different sections of the site.
    *   Configure system-wide settings and view audit logs for security tracking.

### 2. Client/Public Functionalities
The client-side interface allows users to interact with the system without requiring an administrative login for basic actions:

*   **Authentication**: Users can register for an account and log in.
*   **Search**: Publicly search for client status or referral information.
*   **Reward Discovery**: Browse the list of available rewards and their point requirements.
*   **Redemption Requests**: Clients can submit requests to redeem their earned points for specific rewards.
*   **Code Change Requests**: Clients can request a change to their referral code (subject to admin approval).
*   **Media Viewing**: View public-facing media and content organized by section.

## Technical Implementation

*   **Backend**: Laravel 11 API.
*   **Authentication**: Laravel Sanctum for secure token-based access.
*   **Routing**: 
    *   `api.php`: Handles all data transactions.
    *   `web.php`: Serves the SPA (Single Page Application) entry point.
*   **Scheduling**: Uses `routes/console.php` to handle daily logic like `clients:flag-expired`.

## Getting Started

1. Run `composer install` and `php artisan migrate`.
2. Start the scheduler for automated tasks: `php artisan schedule:work`.
3. The API is structured under the `/api` prefix.
4. Admin routes require a `Bearer` token obtained via the `/api/auth/login` endpoint.

---
*Developed for ATS-Aguila-Cruz.*

<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

<p align="center">
<a href="https://github.com/laravel/framework/actions"><img src="https://github.com/laravel/framework/workflows/tests/badge.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

## About Laravel

Laravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable and creative experience to be truly fulfilling. Laravel takes the pain out of development by easing common tasks used in many web projects, such as:

- [Simple, fast routing engine](https://laravel.com/docs/routing).
- [Powerful dependency injection container](https://laravel.com/docs/container).
- Multiple back-ends for [session](https://laravel.com/docs/session) and [cache](https://laravel.com/docs/cache) storage.
- Expressive, intuitive [database ORM](https://laravel.com/docs/eloquent).
- Database agnostic [schema migrations](https://laravel.com/docs/migrations).
- [Robust background job processing](https://laravel.com/docs/queues).
- [Real-time event broadcasting](https://laravel.com/docs/broadcasting).

Laravel is accessible, powerful, and provides tools required for large, robust applications.

## Learning Laravel

Laravel has the most extensive and thorough [documentation](https://laravel.com/docs) and video tutorial library of all modern web application frameworks, making it a breeze to get started with the framework. You can also check out [Laravel Learn](https://laravel.com/learn), where you will be guided through building a modern Laravel application.

If you don't feel like reading, [Laracasts](https://laracasts.com) can help. Laracasts contains thousands of video tutorials on a range of topics including Laravel, modern PHP, unit testing, and JavaScript. Boost your skills by digging into our comprehensive video library.

## Laravel Sponsors

We would like to extend our thanks to the following sponsors for funding Laravel development. If you are interested in becoming a sponsor, please visit the [Laravel Partners program](https://partners.laravel.com).

### Premium Partners

- **[Vehikl](https://vehikl.com)**
- **[Tighten Co.](https://tighten.co)**
- **[Kirschbaum Development Group](https://kirschbaumdevelopment.com)**
- **[64 Robots](https://64robots.com)**
- **[Curotec](https://www.curotec.com/services/technologies/laravel)**
- **[DevSquad](https://devsquad.com/hire-laravel-developers)**
- **[Redberry](https://redberry.international/laravel-development)**
- **[Active Logic](https://activelogic.com)**

## Contributing

Thank you for considering contributing to the Laravel framework! The contribution guide can be found in the [Laravel documentation](https://laravel.com/docs/contributions).

## Code of Conduct

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
=======
# ATS-Aguila-Cruz

