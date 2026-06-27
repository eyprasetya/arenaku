<?php

namespace Database\Seeders;

use App\Models\Court;
use App\Models\TimeSlot;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class CourtsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create courts
        $courts = [
            [
                'name' => 'Lapangan A',
                'description' => 'Lapangan standar dengan pencahayaan modern',
                'price_per_hour' => 150000,
                'location' => 'Lantai 1',
                'status' => 'active',
                'image_url' => null,
                'max_players' => 4,
            ],
            [
                'name' => 'Lapangan B',
                'description' => 'Lapangan premium dengan sistem AC',
                'price_per_hour' => 200000,
                'location' => 'Lantai 2',
                'status' => 'active',
                'image_url' => null,
                'max_players' => 4,
            ],
            [
                'name' => 'Lapangan C',
                'description' => 'Lapangan ekonomis untuk practice',
                'price_per_hour' => 100000,
                'location' => 'Lantai 1',
                'status' => 'active',
                'image_url' => null,
                'max_players' => 4,
            ],
            [
                'name' => 'Lapangan D',
                'description' => 'Lapangan VIP dengan fasilitas premium',
                'price_per_hour' => 250000,
                'location' => 'Lantai 3',
                'status' => 'active',
                'image_url' => null,
                'max_players' => 4,
            ],
        ];

        foreach ($courts as $court) {
            Court::create($court);
        }

        // Create time slots for next 30 days
        $courts = Court::all();
        $now = Carbon::now();
        $businessHours = [
            '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
            '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
            '18:00', '19:00', '20:00', '21:00', '22:00',
        ];

        for ($dayOffset = 0; $dayOffset < 30; $dayOffset++) {
            $date = $now->copy()->addDays($dayOffset)->toDateString();

            foreach ($courts as $court) {
                foreach ($businessHours as $hour) {
                    $startTime = $hour;
                    $endHour = ((int) explode(':', $hour)[0]) + 1;
                    $endTime = str_pad((string) $endHour, 2, '0', STR_PAD_LEFT) . ':00';

                    if ($endHour < 23) {
                        TimeSlot::create([
                            'court_id' => $court->id,
                            'date' => $date,
                            'start_time' => $startTime,
                            'end_time' => $endTime,
                            'status' => 'available',
                        ]);
                    }
                }
            }
        }
    }
}
