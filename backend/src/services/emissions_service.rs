use std::collections::BTreeMap;

use crate::{
    models::emissions::EmissionsResponse,
    repositories::emissions_repository::EmissionsRepository,
};

#[derive(Clone)]
pub struct EmissionsService {
    repository: EmissionsRepository,
}

impl EmissionsService {
    pub fn new(repository: EmissionsRepository) -> Self {
        Self { repository }
    }

    pub async fn calculate_emissions(
        &self,
        year: i32,
    ) -> Result<EmissionsResponse, sqlx::Error> {

        let rows = self.repository
            .get_activity_data(year)
            .await?;

        let mut categories: BTreeMap<
            String,
            BTreeMap<String, f64>
        > = BTreeMap::new();

        for row in rows {
            let emissions =
                row.quantity * row.kg_co2_per_unit;

            let item = categories
                .entry(row.category)
                .or_default()
                .entry(row.item)
                .or_insert(0.0);

            *item += emissions;
        }

        Ok(EmissionsResponse {
            year,
            unit: "kg CO₂e".to_string(),
            categories,
        })
    }
}