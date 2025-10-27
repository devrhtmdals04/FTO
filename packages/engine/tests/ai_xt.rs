#[cfg(test)]
mod tests {
    use engine::ai::positioning::calculate_normalized_xt_score;
    use engine::types::{TeamId, Vec2};

    #[test]
    fn test_xt_mirroring() {
        // Define a position on the left side of the pitch (Home team's attacking side)
        let pos_left = Vec2::new(-30.0, 10.0);

        // Define the mirrored position on the right side (Away team's attacking side)
        let pos_right = Vec2::new(30.0, 10.0);

        // Calculate xT score for Home team on the left side
        let xt_home = calculate_normalized_xt_score(pos_left, TeamId::Home);

        // Calculate xT score for Away team on the right side
        let xt_away = calculate_normalized_xt_score(pos_right, TeamId::Away);
        
        // The scores should be very close (using a small epsilon for float comparison)
        assert!((xt_home - xt_away).abs() < 1e-6, "xT scores should be mirrored for Home and Away teams");

        // Also check that the non-mirrored scores are different
        let xt_home_right = calculate_normalized_xt_score(pos_right, TeamId::Home);
        assert!((xt_home - xt_home_right).abs() > 1e-6, "xT scores should be different for the same team on opposite sides");
    }
}
