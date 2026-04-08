<?php

use Illuminate\Support\Facades\Schedule;

Schedule::command('clients:flag-expired')->daily();
