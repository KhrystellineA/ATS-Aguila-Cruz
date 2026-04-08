<?php

namespace App\Notifications;

use App\Models\Client;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PointsEarned extends Notification
{
    use Queueable;

    public function __construct(
        public Client $client,
        public int $points,
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('You earned points at TATS by TATS!')
            ->greeting('Hi ' . $this->client->name . '!')
            ->line('You just earned ' . $this->points . ' points.')
            ->line('Your balance: ' . $this->client->total_points . ' points.')
            ->line('Your referral code: ' . $this->client->referral_code)
            ->action('View Your Profile', url('/'));
    }

    public function toArray(object $notifiable): array
    {
        return [
            'client_id' => $this->client->id,
            'points' => $this->points,
            'balance' => $this->client->total_points,
        ];
    }
}
