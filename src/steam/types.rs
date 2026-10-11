use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct WorkshopItem {
    pub workshopid: String,
    pub title: String,
    #[serde(default)]
    pub titleoverride: String,
    pub preview: String,
    pub previewsmall: String,
    #[serde(default)]
    pub tags: String,
    #[serde(rename = "type", default = "default_item_type")]
    pub item_type: String,
    #[serde(default)]
    pub typelabel: String,
    pub status: String,
    pub file: String,
    #[serde(default)]
    pub author: String,
    #[serde(default)]
    pub authorsteamid: String,
    #[serde(default)]
    pub author_url: String,
    #[serde(default)]
    pub author_avatar: String,
    #[serde(default)]
    pub description: String,
    #[serde(default)]
    pub file_size: String,
    #[serde(default)]
    pub filesizelabel: String,
    #[serde(default)]
    pub rating: f32,
    #[serde(default)]
    pub ratingrounded: u32,
    #[serde(default)]
    pub hasrating: bool,
    #[serde(default)]
    pub votesup: u64,
    #[serde(default)]
    pub is_collection: bool,
    #[serde(default)]
    pub approved: bool,
    #[serde(default)]
    pub portrait: bool,
    #[serde(default)]
    pub posted_date: String,
    #[serde(default)]
    pub updated_date: String,
    #[serde(default)]
    pub rating_star_file: String,
    #[serde(default)]
    pub num_ratings: String,
    #[serde(default)]
    pub installed_ts: u64,
}

fn default_item_type() -> String {
    "Scene".to_string()
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WorkshopPage {
    pub action: String,
    pub wallpapers: Vec<WorkshopItem>,
    pub pagecount: u32,
    pub token: u64,
    pub isbackup: bool,
    pub total_items: u64,
}

#[derive(Debug, Clone, Deserialize, Default)]
pub struct BrowseQuery {
    #[serde(default = "default_page")]
    pub page: u32,
    #[serde(default = "default_sort")]
    pub sort: String,
    #[serde(default)]
    pub text: String,
    #[serde(default)]
    pub required_tags: Option<String>, // comma separated or single
    #[serde(default)]
    pub excluded_tags: Option<String>,
    #[serde(default)]
    pub required_flags: Option<String>,
    #[serde(default)]
    pub incompatible: Option<bool>,
    #[serde(default)]
    pub itemid: Option<String>,
    #[serde(default)]
    pub preset: Option<String>,
    #[serde(default)]
    pub token: u64,
    #[serde(default = "default_num_per_page")]
    pub num_per_page: u32,
    #[serde(default)]
    pub numperpage: Option<u32>,
}

impl BrowseQuery {
    pub fn get_num_per_page(&self) -> u32 {
        self.numperpage.unwrap_or(self.num_per_page)
    }
}

fn default_page() -> u32 {
    1
}

fn default_sort() -> String {
    "trend".to_string()
}

fn default_num_per_page() -> u32 {
    50
}
