use axum::{extract::State, http::StatusCode, routing::get, Json, Router};
use serde_json::{json, Value};
use sqlx::MySqlPool;

use crate::controllers::emissions_controller;
use crate::repositories::emissions_repository::EmissionsRepository;
use crate::services::emissions_service::EmissionsService;

pub fn router(pool: MySqlPool) -> Router {
    let repository = EmissionsRepository::new(pool.clone());
    let emissions_service = EmissionsService::new(repository);

    // Routes that need the raw pool
    let system_routes = Router::new()
        .route("/api/health", get(health))
        .route("/api/db-test", get(db_test))
        .with_state(pool);

    // Routes that need the service
    let emissions_routes = Router::new()
        .route("/api/emissions", get(emissions_controller::get_emissions))
        .with_state(emissions_service);

    system_routes.merge(emissions_routes)
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