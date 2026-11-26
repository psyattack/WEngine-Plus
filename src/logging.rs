//! Minimal single-file logger for the daemon.
//!
//! `wengine-helper.exe` is built as a Windows GUI subsystem binary, so stdout
//! and stderr are invisible in production. Everything that matters is written
//! to `<data dir>/wengine-helper.log`. The file is capped: at the limit the
//! older half is dropped and only the newest entries stay, so a single log file
//! is always available for diagnostics.

use std::fs::{File, OpenOptions};
use std::io::{Read, Seek, SeekFrom, Write};
use std::path::Path;
use std::sync::{Mutex, OnceLock};
use std::time::{SystemTime, UNIX_EPOCH};

/// The log never grows past this size.
const MAX_LOG_BYTES: u64 = 8 * 1024 * 1024;

/// At the limit the older half is dropped, so about this much of the newest
/// data survives a trim.
const KEEP_LOG_BYTES: u64 = MAX_LOG_BYTES / 2;

const LOG_NAME: &str = "wengine-helper.log";

static LOG_FILE: OnceLock<Mutex<File>> = OnceLock::new();

/// Opens the log file in `dir`, trimming an oversized one. Returns `false` when
/// the directory is not writable (the daemon keeps running without a log).
pub fn init(dir: &Path) -> bool {
    if LOG_FILE.get().is_some() {
        return true;
    }

    let path = dir.join(LOG_NAME);
    match OpenOptions::new()
        .create(true)
        .truncate(false)
        .read(true)
        .write(true)
        .open(&path)
    {
        Ok(mut file) => {
            let oversized = file.metadata().is_ok_and(|meta| meta.len() > MAX_LOG_BYTES);
            if oversized {
                let _ = trim_to_half(&mut file);
            }
            LOG_FILE.set(Mutex::new(file)).is_ok()
        }
        Err(_) => false,
    }
}

/// Appends one line. Never panics: logging must not take the daemon down.
pub fn write(level: &str, message: &str) {
    if let Some(log) = LOG_FILE.get() {
        if let Ok(mut file) = log.lock() {
            append(&mut file, level, message);
        }
    }
}

/// Appends one line to `file`, trimming the older half first when the line would
/// push the file past `MAX_LOG_BYTES`.
fn append(file: &mut File, level: &str, message: &str) {
    let line = format!("{} [{}] {}\r\n", timestamp(), level, message);
    let len = file.metadata().map_or(0, |meta| meta.len());
    if len.saturating_add(line.len() as u64) > MAX_LOG_BYTES {
        let _ = trim_to_half(file);
    }
    if file.seek(SeekFrom::End(0)).is_ok() {
        let _ = file.write_all(line.as_bytes());
        let _ = file.flush();
    }
}

/// Drops the older half of the log, keeping the newest `KEEP_LOG_BYTES` from a
/// line boundary. The file is rewritten in place, so no second log file exists.
fn trim_to_half(file: &mut File) -> std::io::Result<()> {
    file.seek(SeekFrom::Start(0))?;
    let mut data = Vec::new();
    file.read_to_end(&mut data)?;

    let start = tail_start(&data, KEEP_LOG_BYTES);
    if start == 0 {
        return Ok(());
    }

    file.set_len(0)?;
    file.seek(SeekFrom::Start(0))?;
    file.write_all(&data[start..])?;
    file.flush()
}

/// Index of the first byte of the newest `keep` bytes, moved forward to the
/// next line start. Returns `0` when the whole buffer fits, and `data.len()`
/// when the tail contains no complete line.
fn tail_start(data: &[u8], keep: u64) -> usize {
    if (data.len() as u64) <= keep {
        return 0;
    }

    let cut = data.len() - keep as usize;
    if data.get(cut - 1) == Some(&b'\n') {
        return cut;
    }
    match data[cut..].iter().position(|byte| *byte == b'\n') {
        Some(offset) => cut + offset + 1,
        None => data.len(),
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

    fn temp_dir(tag: &str) -> std::path::PathBuf {
        std::env::temp_dir().join(format!(
            "wep-log-{tag}-{}-{}",
            std::process::id(),
            SystemTime::now()
                .duration_since(UNIX_EPOCH)
                .map(|d| d.as_nanos())
                .unwrap_or_default()
        ))
    }

    #[test]
    fn converts_known_dates() {
        assert_eq!(civil_from_days(0), (1970, 1, 1));
        assert_eq!(civil_from_days(31), (1970, 2, 1));
        assert_eq!(civil_from_days(11_016), (2000, 2, 29));
        assert_eq!(civil_from_days(20_454), (2026, 1, 1));
    }

    #[test]
    fn writes_log_file() {
        let dir = temp_dir("write");
        std::fs::create_dir_all(&dir).unwrap();

        assert!(init(&dir));
        write("INFO", "hello from test");
        let content = std::fs::read_to_string(dir.join(LOG_NAME)).unwrap();
        assert!(content.contains("hello from test"));
        assert!(content.contains("[INFO]"));

        std::fs::remove_dir_all(&dir).ok();
    }

    #[test]
    fn tail_start_keeps_whole_lines() {
        let data = b"aaaa\nbbbb\ncccc\n";
        assert_eq!(tail_start(data, 100), 0);
        assert_eq!(tail_start(data, 15), 0);
        assert_eq!(tail_start(data, 11), 5);
        assert_eq!(tail_start(data, 10), 5);
        assert_eq!(tail_start(data, 5), 10);
        assert_eq!(tail_start(data, 4), data.len());

        let crlf = b"aa\r\nbb\r\n";
        assert_eq!(tail_start(crlf, 5), 4);
        assert_eq!(tail_start(crlf, 4), 4);

        let no_newline = b"no newline here";
        assert_eq!(tail_start(no_newline, 4), no_newline.len());
    }

    #[test]
    fn trim_keeps_the_newest_half() {
        let dir = temp_dir("trim");
        std::fs::create_dir_all(&dir).unwrap();
        let path = dir.join(LOG_NAME);
        let line = "2026-01-01 00:00:00 [INFO] trim test line\r\n";
        let mut data = String::new();
        while (data.len() as u64) < MAX_LOG_BYTES + 128 * 1024 {
            data.push_str(line);
        }
        std::fs::write(&path, &data).unwrap();

        let mut file = OpenOptions::new()
            .read(true)
            .write(true)
            .open(&path)
            .unwrap();
        trim_to_half(&mut file).unwrap();
        drop(file);

        let trimmed = std::fs::read_to_string(&path).unwrap();
        assert!(!trimmed.is_empty());
        assert!((trimmed.len() as u64) <= KEEP_LOG_BYTES);
        assert!(data.ends_with(&trimmed));
        assert!(trimmed.starts_with("2026-01-01 00:00:00 [INFO]"));
        assert!(trimmed.ends_with("\r\n"));
        assert!(trimmed
            .lines()
            .all(|entry| entry.starts_with("2026-01-01 00:00:00 [INFO]")));

        std::fs::remove_dir_all(&dir).ok();
    }

    #[test]
    fn trim_keeps_a_small_log() {
        let dir = temp_dir("small");
        std::fs::create_dir_all(&dir).unwrap();
        let path = dir.join(LOG_NAME);
        std::fs::write(&path, b"one\r\ntwo\r\n").unwrap();

        let mut file = OpenOptions::new()
            .read(true)
            .write(true)
            .open(&path)
            .unwrap();
        trim_to_half(&mut file).unwrap();
        drop(file);

        assert_eq!(std::fs::read_to_string(&path).unwrap(), "one\r\ntwo\r\n");

        std::fs::remove_dir_all(&dir).ok();
    }

    #[test]
    fn keeps_the_log_below_the_cap() {
        let dir = temp_dir("cap");
        std::fs::create_dir_all(&dir).unwrap();
        let path = dir.join(LOG_NAME);
        std::fs::write(&path, b"").unwrap();
        let mut file = OpenOptions::new()
            .read(true)
            .write(true)
            .open(&path)
            .unwrap();

        let message = "x".repeat(4096);
        for _ in 0..(MAX_LOG_BYTES / 4096 + 64) {
            append(&mut file, "INFO", &message);
        }
        drop(file);

        let content = std::fs::read(&path).unwrap();
        assert!((content.len() as u64) <= MAX_LOG_BYTES);
        // The older half was dropped at least once, so the file is below the cap.
        assert!((content.len() as u64) < MAX_LOG_BYTES);
        let first_line = content.split(|byte| *byte == b'\n').next().unwrap();
        assert!(first_line.starts_with(b"20") && first_line.ends_with(b"\r"));

        std::fs::remove_dir_all(&dir).ok();
    }
}
