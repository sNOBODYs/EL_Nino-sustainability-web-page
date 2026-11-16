use sqlx::MySqlPool;

use crate::models::emissions::ActivityRow;

pub struct EmissionsRepository {
    pool: MySqlPool,
}

impl EmissionsRepository {
    pub fn new(pool: MySqlPool) -> Self {
        Self { pool }
    }

    pub async fn get_activity_data(
        &self,
        year: i32,
    ) -> Result<Vec<ActivityRow>, sqlx::Error> {

        let rows = sqlx::query_as::<_, ActivityRow>(
            r#"
            SELECT
                a.year,
                a.category,
                a.item,
                a.label,
                a.quantity,
                f.kg_co2e_per_unit,
                f.unit AS factor_unit
            FROM activity_data a
            JOIN emission_factors f
                ON a.factor_key = f.factor_key
            WHERE a.year = ?
            "#
        )
            .bind(year)
            .fetch_all(&self.pool)
            .await?;

        Ok(rows)
    }
}