<?php

namespace App\Notifications;

use App\Models\Client;
use App\Models\Redemption;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class RedemptionApproved extends Notification
{
    use Queueable;

    public function __construct(
        public Client $client,
        public Redemption $redemption,
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Your redemption has been approved!')
            ->greeting('Hi ' . $this->client->name . '!')
            ->line('Your redemption for "' . $this->redemption->reward->name . '" has been approved.')
            ->line('Points deducted: ' . $this->redemption->points_used)
            ->line('Your remaining balance: ' . $this->client->total_points . ' points.')
            ->action('View Your Profile', url('/'));
    }

    public function toArray(object $notifiable): array
    {
        return [
            'client_id' => $this->client->id,
            'redemption_id' => $this->redemption->id,
            'points_used' => $this->redemption->points_used,
        ];
    }
}
