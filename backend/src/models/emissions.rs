use serde::Serialize;
use std::collections::BTreeMap;

#[derive(sqlx::FromRow)]
pub struct ActivityRow {
    pub year: i32,
    pub category: String,
    pub item: String,
    pub label: String,
    pub quantity: f64,
    pub kg_co2e_per_unit: f64,
    pub factor_unit: String,
}

#[derive(Serialize)]
pub struct EmissionsResponse {
    pub year: i32,
    pub unit: String,
    pub categories: BTreeMap<String, BTreeMap<String, f64>>,
}