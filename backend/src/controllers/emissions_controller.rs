use std::collections::BTreeMap;
use axum::{
    extract::{Query, State},
    http::StatusCode,
    Json,
};
use serde::Deserialize;
use serde_json::{json, Value};

use crate::{
    models::emissions::{EmissionsResponse,Comparison},
    services::emissions_service::{EmissionsService}
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

pub async fn get_comparisons(
    State(service): State<EmissionsService>,
    Query(q): Query<YearQuery>,
) -> Result<Json<BTreeMap<String, Comparison>>, (StatusCode, Json<Value>)> {
    let comparisons = service
        .calculate_comparisons(q.year)
        .await
        .map_err(|e| {
            eprintln!("Comparisons error: {e}");
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(json!({ "error": "Could not retrieve comparisons data" })),
            )
        })?;

    Ok(Json(comparisons))
}