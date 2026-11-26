use axum::{
    extract::{Query, State},
    http::StatusCode,
    Json,
};
use serde::Deserialize;
use serde_json::{json, Value};

use crate::{
    models::emissions::EmissionsResponse,
    services::emissions_service::EmissionsService,
};

#[derive(Deserialize)]
pub struct YearQuery {
    year: i32,
}

pub async fn get_emissions(
    State(service): State<EmissionsService>,
    Query(q): Query<YearQuery>,
) -> Result<Json<EmissionsResponse>, (StatusCode, Json<Value>)> {
    let emissions = service
        .calculate_emissions(q.year)
        .await
        .map_err(|e| {
            eprintln!("Emissions error: {e}");
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(json!({ "error": "Could not retrieve emissions data" })),
            )
        })?;

    Ok(Json(emissions))
}