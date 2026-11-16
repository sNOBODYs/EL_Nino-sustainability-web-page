mod db;
mod routes;

use tower_http::cors::CorsLayer;

#[tokio::main]
async fn main() {
    dotenvy::dotenv().ok();

    let pool = db::create_pool().await;
    let app = routes::router(pool).layer(CorsLayer::permissive()); // restrict in production

    let port = std::env::var("PORT").unwrap_or_else(|_| "3000".into());
    let listener = tokio::net::TcpListener::bind(format!("0.0.0.0:{port}"))
        .await
        .expect("Could not bind to port");

    println!("Backend running at http://localhost:{port}");
    axum::serve(listener, app).await.unwrap();
}