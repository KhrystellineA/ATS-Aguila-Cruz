<?php

namespace App\Services;

class ReferralCodeService
{
    const PATTERN = '/^[A-Z]{3,4}[0-9]{3}$/';

    public function generate(): string
    {
        do {
            $letters = strtoupper(substr(str_shuffle('ABCDEFGHIJKLMNOPQRSTUVWXYZ'), 0, rand(3, 4)));
            $digits = str_pad(rand(0, 999), 3, '0', STR_PAD_LEFT);
            $code = $letters . $digits;
        } while (\App\Models\Client::where('referral_code', $code)->exists());

        return $code;
    }

    public function validate(string $code): bool
    {
        return preg_match(self::PATTERN, strtoupper($code)) === 1;
    }

    public function isUnique(string $code, ?int $excludeClientId = null): bool
    {
        $query = \App\Models\Client::where('referral_code', strtoupper($code));

        if ($excludeClientId) {
            $query->where('id', '!=', $excludeClientId);
        }

        return !$query->exists();
    }
}