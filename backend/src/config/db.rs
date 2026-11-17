use sqlx::mysql::{MySqlConnectOptions, MySqlPoolOptions};
use sqlx::MySqlPool;

pub async fn create_pool() -> MySqlPool {
    let opts = MySqlConnectOptions::new()
        .host(&std::env::var("DB_HOST").expect("DB_HOST missing").as_str())
        .port(
            std::env::var("DB_PORT")
                .ok()
                .and_then(|p| p.parse().ok())
                .unwrap_or(3306),
        )
        .database(&std::env::var("DB_NAME").expect("DB_NAME missing"))
        .username(&std::env::var("DB_USER").expect("DB_USER missing"))
        .password(&std::env::var("DB_PASSWORD").unwrap_or_default());

    MySqlPoolOptions::new()
        .max_connections(10)
        .connect_with(opts)
        .await
        .expect("Could not connect to MySQL")
}