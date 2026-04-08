<?php

namespace App\Notifications;

use App\Models\Client;
use App\Models\Redemption;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class RedemptionRejected extends Notification
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
            ->subject('Your redemption has been rejected')
            ->greeting('Hi ' . $this->client->name . '.')
            ->line('Your redemption for "' . $this->redemption->reward->name . '" has been rejected.')
            ->line('Your points have not been deducted.')
            ->line('Contact us if you have questions about this decision.')
            ->action('View Your Profile', url('/'));
    }

    public function toArray(object $notifiable): array
    {
        return [
            'client_id' => $this->client->id,
            'redemption_id' => $this->redemption->id,
        ];
    }
}
