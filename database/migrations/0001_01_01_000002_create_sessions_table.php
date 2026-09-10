<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Determine whether the migration should run.
     */
    public function shouldRun(): bool
    {
        return config('session.driver') === 'database';
    }

    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $session = config('session');

        Schema::connection($session['connection'])->create($session['table'], function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()
                ->references('id')
                ->on(config('database.schemas.public').'.users')
                ->nullOnDelete();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $session = config('session');

        Schema::connection($session['connection'])->dropIfExists($session['table']);
    }
};
