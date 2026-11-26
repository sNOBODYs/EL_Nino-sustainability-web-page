use serde::Serialize;
use std::collections::BTreeMap;

#[derive(sqlx::FromRow)]
pub struct ActivityRow {
    pub year: i32,
    pub category: String,
    pub item: String,
    pub label: String,
    pub quantity: f64,
    pub kg_co2_per_unit: f64,
    pub factor_unit: String,
}

#[derive(Serialize)]
pub struct EmissionsResponse {
    pub year: i32,
    pub unit: String,
    pub categories: BTreeMap<String, BTreeMap<String, f64>>,
}

//TODO instead of constants have a table in DB for it
pub const KG_PER_TREE_YEAR: f64 = 21.0;        // CO2 absorbed by one tree per year (commonly cited average)
pub const KG_PER_FLIGHT: f64 = 70.6;           // Amsterdam > London, economy, one way, per person
pub const KG_PER_CAR_TRIP: f64 = 21.0;         // Amsterdam > Rotterdam, medium petrol car
pub const KG_PER_CAR_TRIP_LONG: f64 = 55.0;    // Enschede > The Hague (unused for now, see note 2)
pub const KG_PER_TRAIN_TRIP: f64 = 6.0;        // ESTIMATE, see note 1
pub const KG_PER_HOUSEHOLD_YEAR: f64 = 16_500.0;

#[derive(Serialize, Debug, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct Comparison {
    pub trees: u32,
    pub flights: f64,
    pub train_trips: u32,
    pub car_trips: u32,
    pub home_days: u32,
}

impl Comparison {
    pub fn from_kg(kg: f64) -> Self {
        let kg_per_home_day = KG_PER_HOUSEHOLD_YEAR / 365.0;
        Self {
            trees: (kg / KG_PER_TREE_YEAR).round() as u32,
            flights: ((kg / KG_PER_FLIGHT) * 10.0).round() / 10.0,
            train_trips: (kg / KG_PER_TRAIN_TRIP).round() as u32,
            car_trips: (kg / KG_PER_CAR_TRIP).round() as u32,
            home_days: (kg / kg_per_home_day).round() as u32,
        }
    }
}