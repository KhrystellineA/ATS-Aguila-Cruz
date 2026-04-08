<?php

namespace App\Notifications;

use App\Models\Client;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class CodeChangeApproved extends Notification
{
    use Queueable;

    public function __construct(
        public Client $client,
        public string $oldCode,
        public string $newCode,
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Your referral code has been changed')
            ->greeting('Hi ' . $this->client->name . '!')
            ->line('Your referral code has been changed from ' . $this->oldCode . ' to ' . $this->newCode . '.')
            ->line('Share your new code with friends to earn more points!')
            ->action('View Your Profile', url('/'));
    }

    public function toArray(object $notifiable): array
    {
        return [
            'client_id' => $this->client->id,
            'old_code' => $this->oldCode,
            'new_code' => $this->newCode,
        ];
    }
}
