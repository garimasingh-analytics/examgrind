/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    outputFileTracingIncludes: {
      "/api/cron/current-affairs": [
        "./supabase/migration_082_current_affairs_2026_09_04_non_pib_briefs.sql",
        "./supabase/migration_083_current_affairs_2026_09_04_breadth_desk.sql",
        "./supabase/migration_085_current_affairs_2026_09_05_morning_desk.sql",
        "./supabase/migration_088_current_affairs_2026_09_06_daily_desk.sql",
        "./supabase/migration_089_current_affairs_2026_09_07_recovered_desk.sql",
        "./supabase/migration_093_current_affairs_2026_09_08_daily_desk.sql",
        "./supabase/migration_098_current_affairs_2026_09_09_daily_desk.sql",
        "./supabase/migration_099_current_affairs_2026_09_10_daily_desk.sql",
      ],
    },
  },
};

export default nextConfig;
