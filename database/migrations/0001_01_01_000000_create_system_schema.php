<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (! $this->shouldCreateSystemSchema()) {
            return;
        }

        $schema = $this->systemSchema();

        DB::statement('DROP SCHEMA IF EXISTS "'.$schema.'" CASCADE');
        DB::statement('CREATE SCHEMA "'.$schema.'"');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (! $this->shouldCreateSystemSchema()) {
            return;
        }

        DB::statement('DROP SCHEMA IF EXISTS "'.$this->systemSchema().'" CASCADE');
    }

    /**
     * Whether a separate system schema is configured.
     */
    protected function shouldCreateSystemSchema(): bool
    {
        return config('database.default') !== config('database.system');
    }

    /**
     * The configured system schema name.
     */
    protected function systemSchema(): string
    {
        return config('database.schemas.system');
    }
};
