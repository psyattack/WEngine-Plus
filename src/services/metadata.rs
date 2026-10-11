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
        let _ = self.save(&guard);
    }

    pub fn remove_item(&self, pubfileid: &str) -> bool {
        let clean = pubfileid.trim();
        if clean.is_empty() {
            return false;
        }
        let mut guard = self.data.write();
        let removed = guard.remove(clean).is_some();
        if removed {
            let _ = self.save(&guard);
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
        let _ = self.save(&guard);
    }

    pub fn clean_uninstalled(&self, we_dir: &Path) {
        let mut guard = self.data.write();
        let initial_len = guard.len();
        guard.retain(|id, _| {
            let clean = id.trim();
            if clean.is_empty() {
                return false;
            }
            if we_dir.join("projects").join("myprojects").join(clean).exists() {
                return true;
            }
            if we_dir.join("projects").join("defaultprojects").join(clean).exists() {
                return true;
            }
            if we_dir.join("workshop").join("content").join("431960").join(clean).exists() {
                return true;
            }
            false
        });
        if guard.len() != initial_len {
            let _ = self.save(&guard);
        }
    }

    fn save(&self, map: &serde_json::Map<String, serde_json::Value>) -> anyhow::Result<()> {
        let json_str = serde_json::to_string_pretty(&serde_json::Value::Object(map.clone()))?;
        std::fs::write(&self.storage_path, &json_str)?;
        Ok(())
    }
}
