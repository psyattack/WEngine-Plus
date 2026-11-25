use url::form_urlencoded;

use super::types::BrowseQuery;

const STEAM_APP_ID: &str = "431960";
const BASE_URL: &str = "https://steamcommunity.com/workshop/browse/";

pub fn build_browse_url(query: &BrowseQuery) -> String {
    // If preset / collection is queried directly
    if let Some(ref pid) = query.preset {
        let trimmed = pid.trim();
        if !trimmed.is_empty() {
            return format!("https://steamcommunity.com/sharedfiles/filedetails/?id={trimmed}");
        }
    }

    // Determine base URL: community workshop browse or author workshop items
    let (base_url, is_author) = if let Some(ref sid) = query.itemid {
        let trimmed = sid.trim();
        if !trimmed.is_empty() {
            let author_base = if trimmed.starts_with("http://") || trimmed.starts_with("https://") {
                let clean = trimmed.split('?').next().unwrap_or(trimmed).trim_end_matches('/');
                if clean.ends_with("/myworkshopfiles") {
                    format!("{clean}/")
                } else {
                    format!("{clean}/myworkshopfiles/")
                }
            } else if trimmed.starts_with("profiles/") || trimmed.starts_with("id/") {
                let clean = trimmed.trim_end_matches('/');
                if clean.ends_with("/myworkshopfiles") {
                    format!("https://steamcommunity.com/{clean}/")
                } else {
                    format!("https://steamcommunity.com/{clean}/myworkshopfiles/")
                }
            } else if trimmed.chars().all(|c| c.is_ascii_digit()) && trimmed.len() >= 16 {
                format!("https://steamcommunity.com/profiles/{trimmed}/myworkshopfiles/")
            } else {
                format!("https://steamcommunity.com/id/{trimmed}/myworkshopfiles/")
            };
            (author_base, true)
        } else {
            (BASE_URL.to_string(), false)
        }
    } else {
        (BASE_URL.to_string(), false)
    };

    let mut serializer = form_urlencoded::Serializer::new(String::new());

    // Map all sort options from Wallpaper Engine
    let (sort_param, days, filter_param) = match query.sort.as_str() {
        "trend_today" | "trend_day" | "1" => ("trend", Some("1"), None),
        "trend_week" | "trend_7" | "7" => ("trend", Some("7"), None),
        "trend_month" | "trend_30" | "30" => ("trend", Some("30"), None),
        "trend_3months" | "trend_90" | "90" => ("trend", Some("90"), None),
        "trend_6months" | "trend_180" | "180" => ("trend", Some("180"), None),
        "trend_year" | "trend_365" | "365" => ("trend", Some("365"), None),
        "trend_all" | "trend_-1" | "-1" => ("trend", Some("-1"), None),
        "trend" => ("trend", Some("7"), None),
        "top_rated" | "toprated" | "most_up_votes" | "published_votes" => ("toprated", None, None),
        "most_recent" | "mostrecent" | "published_desc" => ("mostrecent", None, None),
        "subscriptions" | "totaluniquesubscribers" => ("totaluniquesubscribers", None, None),
        "last_updated" | "lastupdated" => ("lastupdated", None, None),
        "relevance" | "textsearch" => ("textsearch", None, None),
        "my_favorites" => ("mostrecent", None, Some("myfavorites")),
        "voted_up" => ("mostrecent", None, Some("votedup")),
        "friends_favorites" => ("mostrecent", None, Some("favoritedbyfriends")),
        "friends_created" => ("mostrecent", None, Some("friendcreated")),
        "followers_created" => ("mostrecent", None, Some("followed")),
        _ => {
            if query.sort.is_empty() {
                if !query.text.trim().is_empty() {
                    ("textsearch", None, None)
                } else {
                    ("trend", Some("7"), None)
                }
            } else {
                (query.sort.as_str(), None, None)
            }
        }
    };

    let q_per_page = query.get_num_per_page();
    let per_page = if q_per_page > 0 {
        if is_author && q_per_page == 50 {
            30
        } else {
            q_per_page
        }
    } else if is_author {
        30
    } else {
        50
    };

    if !is_author {
        serializer
            .append_pair("appid", STEAM_APP_ID)
            .append_pair("browsesort", sort_param)
            .append_pair("section", "readytouseitems")
            .append_pair("p", &query.page.max(1).to_string())
            .append_pair("num_per_page", &per_page.to_string())
            .append_pair("actualsort", sort_param);

        if let Some(f) = filter_param {
            serializer.append_pair("browsefilter", f);
        }
        if sort_param == "trend" {
            if let Some(d) = days {
                serializer.append_pair("days", d);
            }
        }
    } else {
        serializer
            .append_pair("appid", STEAM_APP_ID)
            .append_pair("p", &query.page.max(1).to_string())
            .append_pair("numperpage", &per_page.to_string())
            .append_pair("browsesort", sort_param);
    }

    let search_trimmed = query.text.trim();
    if !search_trimmed.is_empty() {
        let is_exact = search_trimmed.starts_with('"') && search_trimmed.ends_with('"');
        let clean_text = search_trimmed.trim_matches('"');
        serializer.append_pair("searchtext", clean_text);
        if is_exact {
            serializer.append_pair("search_text_mode", "1");
        }
    }

    if let Some(ref req) = query.required_tags {
        for tag in req.split(',') {
            let t = tag.trim();
            if !t.is_empty() {
                serializer.append_pair("requiredtags[]", t);
            }
        }
    }

    if let Some(ref exc) = query.excluded_tags {
        for tag in exc.split(',') {
            let t = tag.trim();
            if !t.is_empty() {
                serializer.append_pair("excludedtags[]", t);
            }
        }
    }

    if query.incompatible == Some(true) {
        serializer.append_pair("requiredflags[]", "incompatible");
    }

    if let Some(ref flags) = query.required_flags {
        for flag in flags.split(',') {
            let f = flag.trim();
            if !f.is_empty() && (f != "incompatible" || query.incompatible != Some(true)) {
                serializer.append_pair("requiredflags[]", f);
            }
        }
    }

    format!("{base_url}?{}", serializer.finish())
}

#[cfg(test)]
mod tests {
    use super::*;

    fn base_query() -> BrowseQuery {
        BrowseQuery {
            page: 1,
            sort: "trend".to_string(),
            text: String::new(),
            required_tags: None,
            excluded_tags: None,
            required_flags: None,
            incompatible: None,
            itemid: None,
            preset: None,
            token: 0,
            num_per_page: 50,
            numperpage: None,
        }
    }

    #[test]
    fn default_browse_url_targets_workshop() {
        let url = build_browse_url(&base_query());
        assert!(url.starts_with("https://steamcommunity.com/workshop/browse/?"));
        for expected in [
            "appid=431960",
            "browsesort=trend",
            "actualsort=trend",
            "days=7",
            "num_per_page=50",
            "section=readytouseitems",
        ] {
            assert!(url.contains(expected), "missing {expected} in {url}");
        }
    }

    #[test]
    fn clamps_page_to_one() {
        let mut query = base_query();
        query.page = 0;
        assert!(build_browse_url(&query).contains("p=1"));
    }

    #[test]
    fn encodes_search_and_tags() {
        let mut query = base_query();
        query.text = "  \"night city\"  ".to_string();
        query.required_tags = Some("Anime, Sci-Fi".to_string());
        query.excluded_tags = Some("Cartoon".to_string());
        query.incompatible = Some(true);

        let url = build_browse_url(&query);
        for expected in [
            "searchtext=night+city",
            "search_text_mode=1",
            "requiredtags%5B%5D=Anime",
            "excludedtags%5B%5D=Cartoon",
            "requiredflags%5B%5D=incompatible",
        ] {
            assert!(url.contains(expected), "missing {expected} in {url}");
        }
    }

    #[test]
    fn author_query_uses_profile_page() {
        let mut query = base_query();
        query.itemid = Some("76561198000000000".to_string());

        let url = build_browse_url(&query);
        assert!(url.starts_with(
            "https://steamcommunity.com/profiles/76561198000000000/myworkshopfiles/?"
        ));
        assert!(url.contains("numperpage=30"), "{url}");
        assert!(!url.contains("section="), "{url}");
    }

    #[test]
    fn preset_returns_filedetails() {
        let mut query = base_query();
        query.preset = Some("123456789".to_string());
        assert_eq!(
            build_browse_url(&query),
            "https://steamcommunity.com/sharedfiles/filedetails/?id=123456789"
        );
    }
}
