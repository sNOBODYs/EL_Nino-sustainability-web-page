use axum::{
    extract::{Path, State},
    http::StatusCode,
    Json,
};
use serde_json::{json, Value};

// use crate::routes::AppState;

use crate::{
    models::emissions::EmissionsResponse,
    services::emissions_service::EmissionsService
};


pub async fn get_emissions(
    // State(state): State<AppState>,
    State(service): State<EmissionsService>,
    Path(year): Path<i32>,
) -> Result<Json<EmissionsResponse>, (StatusCode, Json<Value>)> {
    
    let emissions = service
        .calculate_emissions(year)
        .await
        .map_err(|e| {
            eprintln!("Emissions error: {e}");

            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(json!({
                    "error": "Could not retrieve emissions data"
                })),
            )
        })?;

    Ok(Json(emissions))
}