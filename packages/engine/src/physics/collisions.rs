use crate::types::Vec2;

pub fn circle_distance(a: Vec2, b: Vec2) -> f32 {
    (a - b).norm()
}

pub fn separate_overlap(a: Vec2, b: Vec2, max_dist: f32) -> (Vec2, Vec2) {
    let delta = b - a;
    let dist = delta.norm();
    if dist < 1e-5 {
        let offset = Vec2::new(max_dist * 0.5, 0.0);
        return (a - offset, b + offset);
    }
    if dist <= max_dist {
        let correction = (max_dist - dist) * 0.5;
        let normal = delta / dist;
        (a - normal * correction, b + normal * correction)
    } else {
        (a, b)
    }
}

pub fn reflect(velocity: Vec2, normal: Vec2) -> Vec2 {
    let n = normal.normalize();
    velocity - n * (2.0 * velocity.dot(n))
}
