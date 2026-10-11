use std::collections::HashMap;
use regex::Regex;
use scraper::{ElementRef, Html, Selector};
use serde_json::Value;

use super::types::{WorkshopItem, WorkshopPage};

pub fn parse_browse(html: &str, _current_page: u32, token: u64) -> WorkshopPage {
    let doc = Html::parse_document(html);

    // 1. Try SSR data first (fast path with exact data and tags)
    let (mut items, ssr_pagination) = parse_browse_ssr(html);

    // 2. Parse HTML tiles
    let mut html_items = parse_browse_html(&doc);

    if html_items.is_empty() {
        html_items = parse_browse_loose(&doc, html);
    }

    if items.is_empty() {
        items = html_items;
    } else {
        // Merge author info and additional metadata from HTML parsing into SSR items
        let by_id: HashMap<String, &WorkshopItem> = html_items
            .iter()
            .map(|i| (i.workshopid.clone(), i))
            .collect();

        for it in &mut items {
            if let Some(src) = by_id.get(&it.workshopid) {
                if it.author.is_empty() {
                    it.author = src.author.clone();
                }
                if it.author_url.is_empty() {
                    it.author_url = src.author_url.clone();
                }
                if it.author_avatar.is_empty() {
                    it.author_avatar = src.author_avatar.clone();
                }
                if it.preview.is_empty() {
                    it.preview = src.preview.clone();
                    it.previewsmall = src.previewsmall.clone();
                }
                if it.tags.is_empty() && !src.tags.is_empty() {
                    it.tags = src.tags.clone();
                }
                if it.authorsteamid.is_empty() && !src.authorsteamid.is_empty() {
                    it.authorsteamid = src.authorsteamid.clone();
                }
            }
        }
    }

    for it in &mut items {
        if it.preview.is_empty() {
            it.is_collection = true;
        }
        if it.previewsmall.is_empty() {
            it.previewsmall = it.preview.clone();
        }
        if it.title.is_empty() {
            it.title = format!("Wallpaper {}", it.workshopid);
        }
        it.file = format!("workshop/{}", it.workshopid);
        it.status = "downloadable".to_string();
        it.approved = it.tags.contains("Approved");
        it.portrait = it.tags.contains("Portrait");
        if it.tags.contains("Video") {
            it.item_type = "Video".to_string();
        } else if it.tags.contains("Web") {
            it.item_type = "Web".to_string();
        } else if it.tags.contains("Application") {
            it.item_type = "Application".to_string();
        } else {
            it.item_type = "Scene".to_string();
        }
        it.typelabel = it.item_type.clone();
        if it.rating_star_file.contains("not-enough-ratings") {
            it.rating = 0.0;
            it.ratingrounded = 0;
            it.hasrating = false;
        } else {
            it.hasrating = it.rating > 0.0 || (it.votesup > 0 && it.ratingrounded > 0);
            if it.rating > 0.0 {
                it.ratingrounded = ((it.rating / 20.0).round() as u32).clamp(1, 5);
            }
        }
    }

    let (total_pages, total_items) = if let Some((p, c)) = ssr_pagination {
        (p, c)
    } else {
        parse_pagination(&doc, html, &items)
    };

    WorkshopPage {
        action: "queryWorkshop".to_string(),
        wallpapers: items,
        pagecount: total_pages.max(1),
        token,
        isbackup: false,
        total_items,
    }
}

fn parse_browse_ssr(html: &str) -> (Vec<WorkshopItem>, Option<(u32, u64)>) {
    let mut queries_array = None;

    let marker = r#""queryData":""#;
    if let Some(start) = html.find(marker) {
        let content_start = start + marker.len();
        let bytes = html.as_bytes();
        let mut pos = content_start;
        let mut escaped = false;
        while pos < bytes.len() {
            let b = bytes[pos];
            if escaped {
                escaped = false;
            } else if b == b'\\' {
                escaped = true;
            } else if b == b'"' {
                break;
            }
            pos += 1;
        }
        let raw = &html[content_start..pos];
        let wrapped = format!("\"{}\"", raw);
        if let Ok(un) = serde_json::from_str::<String>(&wrapped) {
            if let Ok(val) = serde_json::from_str::<Value>(&un) {
                if let Some(arr) = val.get("queries").and_then(|q| q.as_array()) {
                    queries_array = Some(arr.clone());
                }
            }
        }
    }

    if queries_array.is_none() {
        let re_queries = Regex::new(r#"(?s)queries"\s*:\s*"((?:\\.|[^"\\])*)""#).unwrap();
        if let Some(cap) = re_queries.captures(html) {
            let raw = cap[1].replace(r"\\", r"\");
            let unescaped = unescape_json_string(&raw);
            if let Ok(val) = serde_json::from_str::<Value>(&unescaped) {
                if let Some(arr) = val.as_array() {
                    queries_array = Some(arr.clone());
                }
            }
        }
    }

    let Some(arr) = queries_array else {
        return (Vec::new(), None);
    };

    let mut authors = HashMap::new();
    for q in &arr {
        if let Some(data) = q.pointer("/state/data") {
            if let Some(list) = data.get("creator_player_link_details").and_then(|l| l.as_array()) {
                for c in list {
                    if let Some(pub_data) = c.get("public_data") {
                        if let Some(sid) = pub_data.get("steamid").and_then(|v| v.as_str()) {
                            let name = pub_data.get("persona_name").and_then(|v| v.as_str()).unwrap_or("");
                            let prof = pub_data.get("profile_url").and_then(|v| v.as_str()).unwrap_or("");
                            let avatar = if let Some(v) = pub_data.pointer("/sha_digest_avatar/v").and_then(|v| v.as_array()) {
                                let hex: String = v.iter().filter_map(|b| b.as_u64()).map(|b| format!("{:02x}", b)).collect();
                                format!("https://avatars.fastly.steamstatic.com/{}_medium.jpg", hex)
                            } else {
                                String::new()
                            };
                            authors.insert(sid.to_string(), (name.to_string(), prof.to_string(), avatar));
                        }
                    }
                }
            }
            if let Some(pub_data) = data.get("public_data") {
                if let Some(sid) = pub_data.get("steamid").and_then(|v| v.as_str()) {
                    let name = pub_data.get("persona_name").and_then(|v| v.as_str()).unwrap_or("");
                    let prof = pub_data.get("profile_url").and_then(|v| v.as_str()).unwrap_or("");
                    let avatar = if let Some(v) = pub_data.pointer("/sha_digest_avatar/v").and_then(|v| v.as_array()) {
                        let hex: String = v.iter().filter_map(|b| b.as_u64()).map(|b| format!("{:02x}", b)).collect();
                        format!("https://avatars.fastly.steamstatic.com/{}_medium.jpg", hex)
                    } else {
                        String::new()
                    };
                    authors.insert(sid.to_string(), (name.to_string(), prof.to_string(), avatar));
                }
            }
        }
    }

    let mut found_items = None;
    let mut pagination = None;

    for q in &arr {
        if let Some(state_data) = q.pointer("/state/data") {
            let results = state_data.get("results").or_else(|| state_data.get("items"));
            if let Some(items) = results {
                if items.as_array().map(|a| !a.is_empty()).unwrap_or(false) {
                    found_items = Some(items.clone());

                    let pages = state_data
                        .get("total_pages")
                        .and_then(|v| v.as_u64())
                        .map(|n| n as u32);
                    let total = state_data
                        .get("total_count")
                        .and_then(|v| v.as_u64());

                    if let (Some(p), Some(c)) = (pages, total) {
                        pagination = Some((p, c));
                    }
                    break;
                }
            }
        }
    }

    let Some(items_val) = found_items else {
        return (Vec::new(), pagination);
    };
    let Some(items_arr) = items_val.as_array() else {
        return (Vec::new(), pagination);
    };

    let items = items_arr
        .iter()
        .filter_map(|i| {
            let pubfileid = i
                .get("publishedfileid")
                .and_then(|v| v.as_str())
                .map(|s| s.to_string())
                .or_else(|| {
                    i.get("publishedfileid")
                        .and_then(|v| v.as_u64())
                        .map(|n| n.to_string())
                })?;

            let title = i
                .get("title")
                .and_then(|v| v.as_str())
                .unwrap_or("")
                .to_string();

            let preview_url = i
                .get("preview_url")
                .and_then(|v| v.as_str())
                .unwrap_or("")
                .to_string();

            let mut author = i
                .get("creator_persona_name")
                .and_then(|v| v.as_str())
                .map(String::from)
                .unwrap_or_default();

            let mut author_url = String::new();
            let mut author_avatar = String::new();
            let mut authorsteamid = String::new();

            if let Some(creator) = i.get("creator").and_then(|v| v.as_str()) {
                authorsteamid = creator.to_string();
                if let Some((name, prof, av)) = authors.get(creator) {
                    if author.is_empty() {
                        author = name.clone();
                    }
                    if author_url.is_empty() {
                        author_url = prof.clone();
                    }
                    if author_avatar.is_empty() {
                        author_avatar = av.clone();
                    }
                }
            }

            for key in ["creator_info", "creator_data", "creator"] {
                if author.is_empty() {
                    if let Some(name) = i
                        .pointer(&format!("/{}/persona_name", key))
                        .and_then(|v| v.as_str())
                    {
                        author = name.to_string();
                    }
                }
                if author_url.is_empty() {
                    if let Some(url) = i
                        .pointer(&format!("/{}/profile_url", key))
                        .and_then(|v| v.as_str())
                    {
                        author_url = url.to_string();
                    }
                }
                if authorsteamid.is_empty() {
                    if let Some(sid) = i
                        .pointer(&format!("/{}/steamid", key))
                        .and_then(|v| v.as_str())
                    {
                        authorsteamid = sid.to_string();
                    }
                }
            }

            if authorsteamid.is_empty() {
                if let Some(sid) = i
                    .get("creator")
                    .and_then(|v| v.as_str())
                    .or_else(|| i.get("creator_steamid").and_then(|v| v.as_str()))
                {
                    authorsteamid = sid.to_string();
                }
            }

            if author_url.is_empty() && !authorsteamid.is_empty() {
                author_url = format!("https://steamcommunity.com/profiles/{authorsteamid}");
            }

            let mut tags_vec = Vec::new();
            if let Some(tags_arr) = i.get("tags").and_then(|v| v.as_array()) {
                for t in tags_arr {
                    if let Some(tag_str) = t.get("tag").and_then(|v| v.as_str()).or_else(|| t.as_str()) {
                        tags_vec.push(tag_str.to_string());
                    }
                }
            }

            let star_rating = i.get("star_rating").and_then(|v| v.as_u64()).unwrap_or(0) as u32;
            let rating = (star_rating as f32) * 20.0;
            let votesup = i.get("total_votes").and_then(|v| v.as_u64()).unwrap_or(0);
            let hasrating = star_rating > 0 || votesup > 0;
            let description = i.get("short_description").and_then(|v| v.as_str()).unwrap_or("").to_string();
            let file_size = i.get("file_size").and_then(|v| v.as_str()).unwrap_or("").to_string();

            Some(WorkshopItem {
                workshopid: pubfileid,
                title,
                preview: preview_url.clone(),
                previewsmall: preview_url,
                author,
                author_url,
                author_avatar,
                authorsteamid,
                tags: tags_vec.join(","),
                rating,
                ratingrounded: star_rating,
                hasrating,
                votesup,
                description,
                file_size,
                ..Default::default()
            })
        })
        .collect();

    (items, pagination)
}

fn parse_browse_html(doc: &Html) -> Vec<WorkshopItem> {
    let container_sel = Selector::parse(
        ".tmIrUKf-Mh8-, .sDK5fonBQMA-, .workshopItem, .workshopItemCollection, \
         a.workshopItemCollection",
    )
    .unwrap();
    let link_sel = Selector::parse(r#"a[href*="filedetails"]"#).unwrap();
    let title_sel = Selector::parse("._3rvey4VpXts- a, .workshopItemTitle").unwrap();
    let img_sel = Selector::parse("img").unwrap();
    let author_link_sel = Selector::parse(
        ".CmHGWYJjMk0- a, .workshopItemAuthorName a, \
         a.workshop_author_link, \
         a[href*=\"/myworkshopfiles/\"], a[href*=\"/myworkshopcollections/\"], a[href*=\"/profiles/\"]",
    )
    .unwrap();
    let author_text_sel = Selector::parse(".workshopItemAuthorName").unwrap();
    let author_re = Regex::new(r"(?i)^\s*(?:by|collection\s+by)\s+").unwrap();

    let mut items = Vec::new();
    let mut seen = std::collections::HashSet::new();

    for tile in doc.select(&container_sel) {
        let tile_name = tile.value().name();
        let tile_href = if tile_name == "a" {
            tile.value().attr("href")
        } else {
            None
        };
        let href = tile_href.or_else(|| {
            tile.select(&link_sel)
                .next()
                .and_then(|l| l.value().attr("href"))
        });
        let Some(href) = href else { continue };
        let Some(id) = extract_pubfileid(href) else {
            continue;
        };
        if !seen.insert(id.clone()) {
            continue;
        }

        let mut item = WorkshopItem {
            workshopid: id,
            ..Default::default()
        };

        if let Some(t) = tile.select(&title_sel).next() {
            item.title = inner_text(t);
        }
        if item.title.is_empty() {
            if let Some(link) = tile.select(&link_sel).next() {
                let lt = inner_text(link);
                if !lt.starts_with("By ") {
                    item.title = lt;
                }
            }
        }
        if item.title.is_empty() {
            if let Some(img) = tile.select(&img_sel).next() {
                if let Some(alt) = img.value().attr("alt") {
                    item.title = alt.trim().to_string();
                }
            }
        }

        if let Some(img) = tile.select(&img_sel).next() {
            if let Some(src) = img
                .value()
                .attr("src")
                .or_else(|| img.value().attr("data-src"))
            {
                item.preview = src.to_string();
                item.previewsmall = src.to_string();
            }
        }

        if let Some(a) = tile.select(&author_link_sel).next() {
            let raw = inner_text(a);
            item.author = author_re.replace(&raw, "").trim().to_string();
            item.author_url = a.value().attr("href").unwrap_or("").to_string();
            if let Some(sid) = extract_steamid(&item.author_url) {
                item.authorsteamid = sid;
            }
        } else if let Some(span) = tile.select(&author_text_sel).next() {
            let raw = inner_text(span);
            item.author = author_re.replace(&raw, "").trim().to_string();
        }

        items.push(item);
    }

    items
}

fn parse_browse_loose(doc: &Html, html: &str) -> Vec<WorkshopItem> {
    let link_sel = Selector::parse(r#"a[href*="filedetails/?id="]"#).unwrap();
    let img_sel = Selector::parse("img").unwrap();
    let mut by_id: HashMap<String, WorkshopItem> = HashMap::new();

    for a in doc.select(&link_sel) {
        let Some(href) = a.value().attr("href") else {
            continue;
        };
        let Some(id) = extract_pubfileid(href) else {
            continue;
        };
        let entry = by_id.entry(id.clone()).or_insert_with(|| WorkshopItem {
            workshopid: id.clone(),
            ..Default::default()
        });
        let txt = inner_text(a);
        if !txt.is_empty() && entry.title.is_empty() && !txt.starts_with("By ") {
            entry.title = txt;
        }
        if entry.preview.is_empty() {
            if let Some(img) = a.select(&img_sel).next() {
                if let Some(src) = img
                    .value()
                    .attr("src")
                    .or_else(|| img.value().attr("data-src"))
                {
                    entry.preview = src.to_string();
                    entry.previewsmall = src.to_string();
                }
                if entry.title.is_empty() {
                    if let Some(alt) = img.value().attr("alt") {
                        if !alt.is_empty() {
                            entry.title = alt.trim().to_string();
                        }
                    }
                }
            }
        }
    }

    let author_re = Regex::new(
        r#"<a href="(https://steamcommunity\.com/(?:id|profiles)/[^"]+/(?:myworkshopfiles|myworkshopcollections)/[^"]*)"[^>]*>By\s+([^<]+)</a>"#,
    )
    .unwrap();
    let id_re = Regex::new(r#"filedetails/\?id=(\d+)"#).unwrap();
    let id_positions: Vec<(String, usize)> = id_re
        .captures_iter(html)
        .map(|c| (c[1].to_string(), c.get(0).unwrap().start()))
        .collect();

    for cap in author_re.captures_iter(html) {
        let start = cap.get(0).unwrap().start();
        let url = cap[1].to_string();
        let name = cap[2].trim().to_string();
        if let Some(id) = id_positions
            .iter()
            .rev()
            .find(|(_, p)| *p < start)
            .map(|(id, _)| id.clone())
        {
            if let Some(entry) = by_id.get_mut(&id) {
                if entry.author.is_empty() {
                    entry.author = name;
                    entry.author_url = url;
                }
            }
        }
    }

    let mut ordered: Vec<(usize, WorkshopItem)> = by_id
        .into_iter()
        .filter_map(|(id, item)| {
            id_positions
                .iter()
                .find(|(p_id, _)| p_id == &id)
                .map(|(_, p)| (*p, item))
        })
        .collect();
    ordered.sort_by_key(|(p, _)| *p);
    ordered.into_iter().map(|(_, it)| it).collect()
}

fn parse_pagination(doc: &Html, html: &str, items: &[WorkshopItem]) -> (u32, u64) {
    let re_ellipsis_last = Regex::new(
        r#"<div>\.\.\.</div><div[^>]*class="[^"]*Panel[^"]*"[^>]*tabindex="0"[^>]*role="button"[^>]*>\s*([\d,]+)\s*</div>"#
    ).unwrap();

    let last_match = re_ellipsis_last.captures_iter(html).last();
    if let Some(cap) = last_match {
        if let Ok(max) = cap[1].replace(',', "").parse::<u32>() {
            let re_total = Regex::new(
                r#"(?:Showing|Отображаются?)\s+\d+[\s\-–]\d+\s+(?:of|из)\s+([\d,.\s]+)"#,
            )
            .unwrap();
            let total_items = re_total
                .captures(html)
                .and_then(|cap| cap[1].replace([',', '.', ' '], "").parse::<u64>().ok())
                .unwrap_or_else(|| {
                    let per_page = items.len().max(30) as u64;
                    (max as u64) * per_page
                });
            return (max, total_items);
        }
    }

    let re_total =
        Regex::new(r#"(?:Showing|Отображаются?)\s+(\d+)[\s\-–](\d+)\s+(?:of|из)\s+([\d,.\s]+)"#)
            .unwrap();
    if let Some(cap) = re_total.captures(html) {
        let start: u64 = cap[1].replace([',', '.', ' '], "").parse().unwrap_or(0);
        let end: u64 = cap[2].replace([',', '.', ' '], "").parse().unwrap_or(0);
        let total: u64 = cap[3].replace([',', '.', ' '], "").parse().unwrap_or(0);
        if total > 0 {
            let per_page = (end - start + 1).max(1);
            return (total.div_ceil(per_page) as u32, total);
        }
    }

    if let Ok(paging_sel) = Selector::parse(".workshopBrowsePagingControls a, .workshopBrowsePagingControls span") {
        let mut max_page = 0;
        for el in doc.select(&paging_sel) {
            let text = el.text().collect::<String>().trim().to_string();
            if let Ok(p) = text.parse::<u32>() {
                if p > max_page {
                    max_page = p;
                }
            }
        }
        if max_page > 0 {
            let per_page = items.len().max(30) as u64;
            return (max_page, (max_page as u64) * per_page);
        }
    }

    let re_pages_1 = Regex::new(r#"class="pagelink"[^>]*>\s*(\d+)\s*<"#).unwrap();
    let re_pages_2 = Regex::new(r#"class="page_current"[^>]*>\s*(\d+)\s*<"#).unwrap();

    let max_page_1 = re_pages_1
        .captures_iter(html)
        .filter_map(|c| c[1].parse::<u32>().ok())
        .max();
    let max_page_2 = re_pages_2
        .captures_iter(html)
        .filter_map(|c| c[1].parse::<u32>().ok())
        .max();

    let max_page = max_page_1.max(max_page_2);
    if let Some(max) = max_page {
        let per_page = items.len().max(30) as u64;
        return (max, (max as u64) * per_page);
    }

    if items.len() >= 30 {
        return (99, (items.len() as u64) * 99);
    }
    (1, items.len() as u64)
}

fn extract_pubfileid(href: &str) -> Option<String> {
    let re = Regex::new(r#"[?&]id=(\d+)"#).unwrap();
    re.captures(href).map(|c| c[1].to_string())
}

fn extract_steamid(href: &str) -> Option<String> {
    let re = Regex::new(r#"/profiles/(\d+)"#).unwrap();
    re.captures(href).map(|c| c[1].to_string())
}

fn inner_text(el: ElementRef<'_>) -> String {
    el.text().collect::<String>().trim().to_string()
}

fn unescape_json_string(s: &str) -> String {
    let mut out = String::with_capacity(s.len());
    let mut chars = s.chars().peekable();
    while let Some(c) = chars.next() {
        if c == '\\' {
            match chars.next() {
                Some('"') => out.push('"'),
                Some('n') => out.push('\n'),
                Some('t') => out.push('\t'),
                Some('r') => out.push('\r'),
                Some('/') => out.push('/'),
                Some('\\') => out.push('\\'),
                Some('u') => {
                    let hex: String = (&mut chars).take(4).collect();
                    if let Ok(n) = u32::from_str_radix(&hex, 16) {
                        if let Some(ch) = char::from_u32(n) {
                            out.push(ch);
                        }
                    }
                }
                Some(other) => {
                    out.push('\\');
                    out.push(other);
                }
                None => break,
            }
        } else {
            out.push(c);
        }
    }
    out
}

pub fn parse_item_details(html: &str, pubfileid: &str) -> WorkshopItem {
    let doc = Html::parse_document(html);
    let mut item = WorkshopItem {
        workshopid: pubfileid.to_string(),
        file: format!("workshop/{}", pubfileid),
        status: "downloadable".to_string(),
        item_type: "Scene".to_string(),
        typelabel: "Scene".to_string(),
        ..Default::default()
    };

    let title_sel = Selector::parse(".workshopItemTitle").unwrap();
    if let Some(el) = doc.select(&title_sel).next() {
        item.title = inner_text(el);
    }
    if item.title.is_empty() {
        let tag_title_sel = Selector::parse("title").unwrap();
        if let Some(el) = doc.select(&tag_title_sel).next() {
            item.title = inner_text(el).replace("Steam Workshop::", "").trim().to_string();
        }
    }

    let desc_sel = Selector::parse(".workshopItemDescription").unwrap();
    if let Some(el) = doc.select(&desc_sel).next() {
        item.description = inner_text(el);
    }

    let preview_selectors = [
        "#previewImageMain",
        ".workshopItemPreviewImageEnlarge img",
        ".workshopItemPreviewImage img",
        ".highlight_screenshot img",
        "meta[property=\"og:image\"]",
    ];
    for sel_str in preview_selectors {
        if let Ok(sel) = Selector::parse(sel_str) {
            if let Some(el) = doc.select(&sel).next() {
                let src = el
                    .value()
                    .attr("src")
                    .or_else(|| el.value().attr("content"))
                    .unwrap_or("");
                if !src.is_empty() {
                    item.preview = src.to_string();
                    item.previewsmall = src.to_string();
                    break;
                }
            }
        }
    }

    let author_sel = Selector::parse(
        ".friendBlockContent a, .workshopItemAuthorName a, .creatorsBlock .friendBlock a",
    ).unwrap();
    if let Some(el) = doc.select(&author_sel).next() {
        if let Some(href) = el.value().attr("href") {
            item.author_url = href.to_string();
            if let Some(sid) = extract_steamid(href) {
                item.authorsteamid = sid;
            }
        }
    }

    let friend_content_sel = Selector::parse(".friendBlockContent").unwrap();
    if let Some(el) = doc.select(&friend_content_sel).next() {
        let children: Vec<_> = el
            .children()
            .filter_map(|c| c.value().as_text().map(|t| t.trim().to_string()))
            .filter(|s| !s.is_empty())
            .collect();
        if let Some(first) = children.first() {
            item.author = first.clone();
        }
    }
    if item.author.is_empty() {
        let author_name_sel = Selector::parse(".workshopItemAuthorName").unwrap();
        if let Some(el) = doc.select(&author_name_sel).next() {
            let raw = inner_text(el);
            let re = Regex::new(r"(?i)^\s*(?:by|collection\s+by)\s+").unwrap();
            item.author = re.replace(&raw, "").trim().to_string();
        }
    }

    let avatar_sel = Selector::parse(
        ".creatorsBlock .playerAvatar img, .friendBlock .playerAvatar img, .friendBlockIcon img"
    ).unwrap();
    if let Some(img) = doc.select(&avatar_sel).next() {
        if let Some(src) = img.value().attr("src") {
            item.author_avatar = src.to_string();
        }
    }

    let labels = Selector::parse(".detailsStatLeft").unwrap();
    let values = Selector::parse(".detailsStatRight").unwrap();
    let lbls: Vec<_> = doc.select(&labels).map(inner_text).collect();
    let vals: Vec<_> = doc.select(&values).map(inner_text).collect();
    for (i, lbl) in lbls.iter().enumerate() {
        let clean_lbl = lbl.trim_end_matches(':').trim();
        if clean_lbl.eq_ignore_ascii_case("Posted") {
            item.posted_date = vals.get(i).cloned().unwrap_or_default();
        } else if clean_lbl.eq_ignore_ascii_case("Updated") {
            item.updated_date = vals.get(i).cloned().unwrap_or_default();
        } else if clean_lbl.eq_ignore_ascii_case("File Size") || clean_lbl.eq_ignore_ascii_case("Size") {
            item.file_size = vals.get(i).cloned().unwrap_or_default();
            item.filesizelabel = item.file_size.clone();
        }
    }
    if item.file_size.is_empty() {
        let stat_right_sel = Selector::parse(".detailsStatRight").unwrap();
        if let Some(el) = doc.select(&stat_right_sel).next() {
            item.file_size = inner_text(el);
            item.filesizelabel = item.file_size.clone();
        }
    }

    let rating_sel = Selector::parse(".fileRatingDetails img").unwrap();
    if let Some(img) = doc.select(&rating_sel).next() {
        if let Some(src) = img.value().attr("src") {
            item.rating_star_file = src.to_string();
            if src.contains("not-enough-ratings") {
                item.rating = 0.0;
                item.ratingrounded = 0;
                item.hasrating = false;
            } else if src.contains("5-star") {
                item.rating = 100.0;
                item.ratingrounded = 5;
                item.hasrating = true;
            } else if src.contains("4-star") {
                item.rating = 80.0;
                item.ratingrounded = 4;
                item.hasrating = true;
            } else if src.contains("3-star") {
                item.rating = 60.0;
                item.ratingrounded = 3;
                item.hasrating = true;
            } else if src.contains("2-star") {
                item.rating = 40.0;
                item.ratingrounded = 2;
                item.hasrating = true;
            } else if src.contains("1-star") {
                item.rating = 20.0;
                item.ratingrounded = 1;
                item.hasrating = true;
            }
        }
    }

    let num_sel = Selector::parse(".numRatings").unwrap();
    if let Some(el) = doc.select(&num_sel).next() {
        let raw = inner_text(el);
        let digits: String = raw
            .chars()
            .filter(|c| c.is_ascii_digit() || *c == ',')
            .collect();
        item.num_ratings = digits;
    }

    // Parse tags: <div class="workshopTags">Category: <a>Tag1</a>, <a>Tag2</a></div>
    let tag_block_sel = Selector::parse(".workshopTags").unwrap();
    let tag_link_sel = Selector::parse("a").unwrap();
    let mut tags_vec = Vec::new();
    for block in doc.select(&tag_block_sel) {
        for a in block.select(&tag_link_sel) {
            let t = inner_text(a);
            if !t.is_empty() && !tags_vec.contains(&t) {
                tags_vec.push(t);
            }
        }
    }
    item.tags = tags_vec.join(",");
    item.approved = item.tags.contains("Approved");
    item.portrait = item.tags.contains("Portrait");

    if item.tags.contains("Video") {
        item.item_type = "Video".to_string();
    } else if item.tags.contains("Web") {
        item.item_type = "Web".to_string();
    } else if item.tags.contains("Application") {
        item.item_type = "Application".to_string();
    } else {
        item.item_type = "Scene".to_string();
    }
    item.typelabel = item.item_type.clone();

    item
}




