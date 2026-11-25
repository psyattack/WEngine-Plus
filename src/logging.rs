//! Minimal file logger for the daemon.
//!
//! `wengine-helper.exe` is built as a Windows GUI subsystem binary, so stdout
//! and stderr are invisible in production. Everything that matters is written
//! to `<data dir>/wengine-helper.log` instead.

use std::fs::{File, OpenOptions};
use std::io::Write;
use std::path::Path;
use std::sync::{Mutex, OnceLock};
use std::time::{SystemTime, UNIX_EPOCH};

/// A log file larger than this is rotated to `wengine-helper.log.old`.
const MAX_LOG_BYTES: u64 = 4 * 1024 * 1024;

static LOG_FILE: OnceLock<Mutex<File>> = OnceLock::new();

/// Opens the log file in `dir`, rotating an oversized one. Returns `false` when
/// the directory is not writable (the daemon keeps running without a log).
pub fn init(dir: &Path) -> bool {
    if LOG_FILE.get().is_some() {
        return true;
    }

    let path = dir.join("wengine-helper.log");
    if let Ok(meta) = std::fs::metadata(&path) {
        if meta.len() > MAX_LOG_BYTES {
            let old = dir.join("wengine-helper.log.old");
            let _ = std::fs::remove_file(&old);
            let _ = std::fs::rename(&path, &old);
        }
    }

    match OpenOptions::new().create(true).append(true).open(&path) {
        Ok(file) => LOG_FILE.set(Mutex::new(file)).is_ok(),
        Err(_) => false,
    }
}

/// Appends one line. Never panics: logging must not take the daemon down.
pub fn write(level: &str, message: &str) {
    let line = format!("{} [{}] {}\r\n", timestamp(), level, message);
    if let Some(file) = LOG_FILE.get() {
        if let Ok(mut file) = file.lock() {
            let _ = file.write_all(line.as_bytes());
            let _ = file.flush();
        }
    }
}

fn timestamp() -> String {
    let secs = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|d| d.as_secs() as i64)
        .unwrap_or_default();
    let days = secs.div_euclid(86_400);
    let seconds_of_day = secs.rem_euclid(86_400);
    let (year, month, day) = civil_from_days(days);
    format!(
        "{year:04}-{month:02}-{day:02} {:02}:{:02}:{:02}",
        seconds_of_day / 3600,
        (seconds_of_day % 3600) / 60,
        seconds_of_day % 60
    )
}

/// Converts days since the Unix epoch into a civil (year, month, day) date
/// (Howard Hinnant's algorithm, valid for the whole i64 range).
fn civil_from_days(days: i64) -> (i64, u32, u32) {
    let z = days + 719_468;
    let era = if z >= 0 { z } else { z - 146_096 } / 146_097;
    let day_of_era = (z - era * 146_097) as u64;
    let year_of_era =
        (day_of_era - day_of_era / 1_460 + day_of_era / 36_524 - day_of_era / 146_096) / 365;
    let year = year_of_era as i64 + era * 400;
    let day_of_year = day_of_era - (365 * year_of_era + year_of_era / 4 - year_of_era / 100);
    let mp = (5 * day_of_year + 2) / 153;
    let day = (day_of_year - (153 * mp + 2) / 5 + 1) as u32;
    let month = (if mp < 10 { mp + 3 } else { mp - 9 }) as u32;
    (if month <= 2 { year + 1 } else { year }, month, day)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn converts_known_dates() {
        assert_eq!(civil_from_days(0), (1970, 1, 1));
        assert_eq!(civil_from_days(31), (1970, 2, 1));
        assert_eq!(civil_from_days(11_016), (2000, 2, 29));
        assert_eq!(civil_from_days(20_454), (2026, 1, 1));
    }

    #[test]
    fn writes_and_rotates_log_file() {
        let dir = std::env::temp_dir().join(format!(
            "wep-log-test-{}-{}",
            std::process::id(),
            SystemTime::now()
                .duration_since(UNIX_EPOCH)
                .map(|d| d.as_nanos())
                .unwrap_or_default()
        ));
        std::fs::create_dir_all(&dir).unwrap();

        assert!(init(&dir));
        write("INFO", "hello from test");
        let content = std::fs::read_to_string(dir.join("wengine-helper.log")).unwrap();
        assert!(content.contains("hello from test"));
        assert!(content.contains("[INFO]"));

        std::fs::remove_dir_all(&dir).ok();
    }
}
