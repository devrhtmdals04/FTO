pub mod tactics_view;
pub mod commands;

pub use tactics_view::{
    PhaseDirective,
    PhaseFocus,
    QuantifiedTactics,
    TacticModel,
    TacticsView,
    XtGrid,
};
pub use commands::{kickoff_positions, set_piece_positions, CoachCmd};
