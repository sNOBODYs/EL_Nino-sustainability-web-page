// // use axum::{extract::State, http::StatusCode, routing::get, Json, Router};
// // use serde_json::{json, Value};
// // use sqlx::MySqlPool;
//
// // pub fn router(pool: MySqlPool) -> Router {
// //     Router::new()
// //         .route("/api/health", get(health))
// //         .route("/api/db-test", get(db_test))
// //         .with_state(pool)
// // }
//
// ///////////////////////////////////////////////////////
// async fn health() -> Json<Value> {
//     Json(json!({ "status": "Backend is running!" }))
// }
//
// async fn db_test(
//     State(pool): State<MySqlPool>,
// ) -> Result<Json<Value>, (StatusCode, Json<Value>)> {
//     let time: chrono::NaiveDateTime = sqlx::query_scalar("SELECT NOW()")
//         .fetch_one(&pool)
//         .await
//         .map_err(|e| {
//             eprintln!("Database error: {e}");
//             (
//                 StatusCode::INTERNAL_SERVER_ERROR,
//                 Json(json!({ "error": "Could not connect to the database" })),
//             )
//         })?;
//
//     Ok(Json(json!({
//         "status": "MySQL connection successful!",
//         "databaseTime": time.to_string()
//     })))
// }
// /////////////////////////////////////////////////////////
//
// use crate::controllers::{emissions_controller};
// use crate::repositories::emissions_repository::EmissionsRepository;
// use crate::services::emissions_service::EmissionsService;
//
// use axum::{
//     extract::State,
//     http::StatusCode,
//     routing::get,
//     Json,
//     Router,
// };
//
// use serde_json::{json, Value};
// use sqlx::MySqlPool;
//
// pub fn router(pool: MySqlPool) -> Router {
//     let repository = EmissionsRepository::new(pool);
//     // let controller = emissions_controller
//     let emissions_service = EmissionsService::new(repository);
//
//     Router::new()
//         .route("/api/health", get(health))
//         .route("/api/db-test", get(db_test))
//         .route(
//             "/api/emissions/{year}",
//             get(emissions_controller::get_emissions),
//         )
//         .with_state(emissions_service)
//         // .route("/api/emissions/{year}", get(emissions_controller::get_emissions()))
//         // .with_state(emissions_service)
// }
//
// // use axum::{
// //     extract::State,
// //     http::StatusCode,
// //     routing::get,
// //     Json,
// //     Router,
// // };
// // use serde_json::{json, Value};
// // use sqlx::MySqlPool;
// // use std::sync::Arc;
// //
// // use crate::controllers::emissions_controller;
// // use crate::repositories::emissions_repository::EmissionsRepository;
// // use crate::services::emissions_service::EmissionsService;
// //
// // #[derive(Clone)]
// // pub struct AppState {
// //     pub pool: MySqlPool,
// //     pub emissions_service: Arc<EmissionsService>,
// // }
// //
// // pub fn router(pool: MySqlPool) -> Router {
// //     let repository = EmissionsRepository::new(pool.clone());
// //     let emissions_service = EmissionsService::new(repository);
// //
// //     let state = AppState {
// //         pool,
// //         emissions_service: Arc::new(emissions_service),
// //     };
// //
// //     Router::new()
// //         .route("/api/health", get(health))
// //         .route("/api/db-test", get(db_test))
// //         .route("/api/emissions/{year}", get(emissions_controller::get_emissions(state)))
// //         .with_state(state)
// // }
// //
// // async fn health() -> Json<Value> {
// //     Json(json!({ "status": "Backend is running!" }))
// // }
// //
// // async fn db_test(
// //     State(state): State<AppState>,
// // ) -> Result<Json<Value>, (StatusCode, Json<Value>)> {
// //     let time: chrono::NaiveDateTime = sqlx::query_scalar("SELECT NOW()")
// //         .fetch_one(&state.pool)
// //         .await
// //         .map_err(|e| {
// //             eprintln!("Database error: {e}");
// //             (
// //                 StatusCode::INTERNAL_SERVER_ERROR,
// //                 Json(json!({ "error": "Could not connect to the database" })),
// //             )
// //         })?;
// //
// //     Ok(Json(json!({
// //         "status": "MySQL connection successful!",
// //         "databaseTime": time.to_string()
// //     })))
// // }

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
        .route("/api/emissions/:year", get(emissions_controller::get_emissions))
        //.route("/api/emissions/{year}", get(emissions_controller::get_emissions))
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