use axum::{extract::State, http::StatusCode, routing::get, Json, Router};
use serde_json::{json, Value};
use sqlx::MySqlPool;

pub fn router(pool: MySqlPool) -> Router {
    Router::new()
        .route("/api/health", get(health))
        .route("/api/db-test", get(db_test))
        .with_state(pool)
}

async fn health() -> Json<Value> {
    Json(json!({ "status": "Backend is running!" }))
}

async fn db_test(
    State(pool): State<MySqlPool>,
) -> Result<Json<Value>, (StatusCode, Json<Value>)> {
    let time: chrono::NaiveDateTime = sqlx::query_scalar("SELECT NOW()")
        .fetch_one(&pool)
        .await
        .map_err(|e| {
            eprintln!("Database error: {e}");
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(json!({ "error": "Could not connect to the database" })),
            )
        })?;

    Ok(Json(json!({
        "status": "MySQL connection successful!",
        "databaseTime": time.to_string()
    })))
}