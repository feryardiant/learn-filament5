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
        $schema = $this->systemSchema();

        DB::statement('DROP SCHEMA IF EXISTS "'.$schema.'" CASCADE');
        DB::statement('CREATE SCHEMA "'.$schema.'"');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement('DROP SCHEMA IF EXISTS "'.$this->systemSchema().'" CASCADE');
    }

    /**
     * Determine whether the migration should run.
     */
    public function shouldRun(): bool
    {
        $config = config('database');
        $default = $config['default'];

        return $config['connections'][$default]['driver'] === 'pgsql' && $default !== $config['system'];
    }

    /**
     * The configured system schema name.
     */
    protected function systemSchema(): string
    {
        return config('database.schemas.system');
    }
};
