use std::io::Write;
use std::path::{Path, PathBuf};
use std::sync::Arc;

use parking_lot::RwLock;

pub struct MetadataManager {
    data: Arc<RwLock<serde_json::Map<String, serde_json::Value>>>,
    storage_path: PathBuf,
}

impl MetadataManager {
    pub fn new(storage_dir: &Path) -> Self {
        let storage_path = storage_dir.join("metadata.json");

        let initial_map = if storage_path.exists() {
            std::fs::read_to_string(&storage_path)
                .ok()
                .and_then(|s| serde_json::from_str::<serde_json::Value>(&s).ok())
                .and_then(|v| v.as_object().cloned())
                .unwrap_or_default()
        } else {
            serde_json::Map::new()
        };

        Self {
            data: Arc::new(RwLock::new(initial_map)),
            storage_path,
        }
    }

    pub fn get_all(&self) -> serde_json::Value {
        serde_json::Value::Object(self.data.read().clone())
    }

    pub fn get_item(&self, pubfileid: &str) -> Option<serde_json::Value> {
        let clean = pubfileid.trim();
        self.data.read().get(clean).cloned()
    }

    pub fn set_item(&self, pubfileid: &str, item: serde_json::Value) {
        let clean = pubfileid.trim();
        if clean.is_empty() {
            return;
        }
        let mut guard = self.data.write();
        guard.insert(clean.to_string(), item);
        Self::persist(&self.storage_path, &guard);
    }

    pub fn remove_item(&self, pubfileid: &str) -> bool {
        let clean = pubfileid.trim();
        if clean.is_empty() {
            return false;
        }
        let mut guard = self.data.write();
        let removed = guard.remove(clean).is_some();
        if removed {
            Self::persist(&self.storage_path, &guard);
        }
        removed
    }

    pub fn update_all(&self, map: serde_json::Map<String, serde_json::Value>) {
        let mut guard = self.data.write();
        for (k, v) in map {
            let clean = k.trim().to_string();
            if !clean.is_empty() {
                guard.insert(clean, v);
            }
        }
        Self::persist(&self.storage_path, &guard);
    }

    pub fn clean_uninstalled(&self, we_dir: &Path) {
        let mut guard = self.data.write();
        let initial_len = guard.len();
        guard.retain(|id, _| {
            let clean = id.trim();
            !clean.is_empty() && crate::api_security::is_installed_wallpaper(we_dir, clean)
        });
        if guard.len() != initial_len {
            Self::persist(&self.storage_path, &guard);
        }
    }

    /// Writes the map through a temporary file so a crash cannot leave a
    /// truncated `metadata.json` behind (`fs::rename` replaces files on
    /// Windows). Errors are logged instead of being silently dropped.
    fn persist(
        storage_path: &Path,
        map: &serde_json::Map<String, serde_json::Value>,
    ) {
        if let Err(e) = Self::save(storage_path, map) {
            log_error!("failed to persist metadata.json: {e}");
        }
    }

    fn save(
        storage_path: &Path,
        map: &serde_json::Map<String, serde_json::Value>,
    ) -> anyhow::Result<()> {
        let json_str = serde_json::to_string_pretty(&serde_json::Value::Object(map.clone()))?;
        let tmp_path = storage_path.with_file_name(format!(
            "metadata.json.tmp.{}",
            std::process::id()
        ));

        let written = (|| -> anyhow::Result<()> {
            let mut file = std::fs::File::create(&tmp_path)?;
            file.write_all(json_str.as_bytes())?;
            file.sync_all()?;
            Ok(())
        })();
        if let Err(e) = written {
            let _ = std::fs::remove_file(&tmp_path);
            return Err(e);
        }

        if let Err(e) = std::fs::rename(&tmp_path, storage_path) {
            let _ = std::fs::remove_file(&tmp_path);
            return Err(e.into());
        }
        Ok(())
    }
}
