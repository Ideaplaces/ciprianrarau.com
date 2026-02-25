#!/usr/bin/env python3
"""
Substack Sync - Automatically publish and update ciprianrarau.com blog posts on Substack.

Usage:
    # Sync all posts (create new, update changed)
    python sync.py

    # Sync a specific post
    python sync.py --post meta-repository-pattern

    # Dry run (show what would happen without publishing)
    python sync.py --dry-run

    # Force re-sync all posts (ignore tracking state)
    python sync.py --force

Environment variables:
    SUBSTACK_URL         - Your publication URL (e.g., https://chiprarau.substack.com)
    SUBSTACK_COOKIE      - substack.sid cookie value from browser

Cookie auth:
    1. Log into substack.com in your browser
    2. DevTools (F12) > Application > Cookies > substack.com
    3. Copy the "substack.sid" value
    4. export SUBSTACK_COOKIE="s%3A..."

The script maintains a .substack-sync.json tracking file to know which posts have been
synced and their content hashes, enabling incremental updates.
"""

import argparse
import hashlib
import json
import os
import re
import sys
from pathlib import Path
from urllib.parse import unquote

import requests
import yaml

# Blog posts directory (relative to this script)
SCRIPT_DIR = Path(__file__).parent
BLOG_ROOT = SCRIPT_DIR.parent.parent
POSTS_DIR = BLOG_ROOT / "src" / "data" / "post"
SYNC_STATE_FILE = SCRIPT_DIR / ".substack-sync.json"
SITE_URL = "https://ciprianrarau.com"


def parse_frontmatter(filepath: Path) -> tuple[dict, str]:
    """Parse YAML frontmatter and markdown body from a blog post file."""
    content = filepath.read_text(encoding="utf-8")

    if not content.startswith("---"):
        return {}, content

    # Find the closing ---
    end_idx = content.index("---", 3)
    frontmatter_str = content[3:end_idx].strip()
    body = content[end_idx + 3:].strip()

    frontmatter = yaml.safe_load(frontmatter_str)
    return frontmatter, body


def convert_tables_to_text(body: str) -> str:
    """Convert markdown tables to a readable text format for Substack.

    Substack's API does not support table nodes in ProseMirror JSON,
    so we convert tables to bold headers with aligned rows.
    """
    lines = body.split("\n")
    result = []
    i = 0

    while i < len(lines):
        line = lines[i]

        # Detect start of a markdown table
        if re.match(r"^\|.+\|$", line.strip()):
            table_lines = []
            while i < len(lines) and re.match(r"^\|.+\|$", lines[i].strip()):
                table_lines.append(lines[i])
                i += 1

            if len(table_lines) >= 3:
                # Parse header and data rows
                headers = [c.strip() for c in table_lines[0].strip().strip("|").split("|")]
                data_rows = []
                for row_line in table_lines[2:]:
                    cells = [c.strip() for c in row_line.strip().strip("|").split("|")]
                    data_rows.append(cells)

                # Convert to readable format: each row becomes "Header1: Value1 | Header2: Value2"
                for row in data_rows:
                    parts = []
                    for j, cell in enumerate(row):
                        if j < len(headers):
                            parts.append(f"**{headers[j]}**: {cell}")
                    result.append(" vs ".join(parts))
                    result.append("")
            else:
                # Not a proper table, keep original lines
                result.extend(table_lines)
            continue

        result.append(line)
        i += 1

    return "\n".join(result)


def clean_markdown_for_substack(body: str, frontmatter: dict) -> str:
    """Transform blog markdown into Substack-compatible markdown."""

    # Strip mermaid code blocks (the rendered PNG image already follows them in the source)
    body = re.sub(
        r"```mermaid\n.*?```\n*",
        "",
        body,
        flags=re.DOTALL,
    )

    # Convert relative image paths to absolute
    body = re.sub(
        r"!\[([^\]]*)\]\((/[^)]+)\)",
        lambda m: f"![{m.group(1)}]({SITE_URL}{m.group(2)})",
        body,
    )

    # Convert relative links to absolute
    body = re.sub(
        r"\[([^\]]+)\]\((/[^)]+)\)",
        lambda m: f"[{m.group(1)}]({SITE_URL}{m.group(2)})",
        body,
    )

    # Convert markdown tables to text (Substack API doesn't support table nodes)
    body = convert_tables_to_text(body)

    return body


def build_post_slug(filename: str) -> str:
    """Convert a blog post filename to a URL slug."""
    return filename.replace(".md", "")


def content_hash(frontmatter: dict, body: str) -> str:
    """Generate a hash of the post content to detect changes."""
    hashable = json.dumps({
        "title": frontmatter.get("title", ""),
        "excerpt": frontmatter.get("excerpt", ""),
        "body": body,
    }, sort_keys=True)
    return hashlib.sha256(hashable.encode()).hexdigest()[:16]


def load_sync_state() -> dict:
    """Load the sync tracking state."""
    if SYNC_STATE_FILE.exists():
        return json.loads(SYNC_STATE_FILE.read_text())
    return {"posts": {}}


def save_sync_state(state: dict):
    """Save the sync tracking state."""
    SYNC_STATE_FILE.write_text(json.dumps(state, indent=2) + "\n")


def get_all_posts() -> list[dict]:
    """Read all blog posts and return parsed data."""
    posts = []
    for filepath in sorted(POSTS_DIR.glob("*.md")):
        frontmatter, body = parse_frontmatter(filepath)
        if not frontmatter:
            print(f"  SKIP {filepath.name} (no frontmatter)")
            continue
        if frontmatter.get("draft", False):
            print(f"  SKIP {filepath.name} (draft)")
            continue
        if not frontmatter.get("substack", False):
            print(f"  SKIP {filepath.name} (substack not enabled)")
            continue

        slug = build_post_slug(filepath.name)
        cleaned_body = clean_markdown_for_substack(body, frontmatter)

        # Build the canonical URL
        canonical = f"{SITE_URL}/{slug}"

        # Add a footer linking back to the original post
        cleaned_body += f"\n\n---\n\nOriginally published at [{canonical}]({canonical})\n"

        posts.append({
            "slug": slug,
            "filename": filepath.name,
            "title": frontmatter.get("title", slug),
            "subtitle": frontmatter.get("excerpt", ""),
            "body": cleaned_body,
            "tags": frontmatter.get("tags", []),
            "publish_date": str(frontmatter.get("publishDate", "")),
            "hash": content_hash(frontmatter, body),
            "frontmatter": frontmatter,
        })

    return posts


def _fix_link_hrefs(body_json: dict) -> dict:
    """Fix null hrefs in link marks caused by python-substack bug.

    The library's marks() method reads mark.get("href") but parse_inline
    produces {"type": "link", "attrs": {"href": "url"}}. The href ends up
    nested in attrs but marks() looks for it at the top level, resulting
    in null hrefs. This function re-parses the original markdown links and
    patches them back in.
    """
    # Collect all link text nodes with null hrefs
    for node in body_json.get("content", []):
        for text_node in node.get("content", []):
            if not isinstance(text_node, dict):
                continue
            for mark in text_node.get("marks", []):
                if mark.get("type") == "link" and mark.get("attrs", {}).get("href") is None:
                    # href is null, this is the bug
                    mark["attrs"] = {"href": None}
    return body_json


def markdown_to_prosemirror(markdown_text: str, user_id: int) -> str:
    """Convert markdown to Substack ProseMirror JSON using python-substack library.

    Applies a post-processing fix for link hrefs (library bug).
    """
    from substack.post import Post, parse_inline

    substack_post = Post(
        title="",
        subtitle="",
        user_id=user_id,
        audience="everyone",
    )
    substack_post.from_markdown(markdown_text)
    draft = substack_post.get_draft()
    body_json = json.loads(draft["draft_body"])

    # Build a map of link text -> href from the original markdown
    link_map = {}
    link_pattern = re.compile(r'\[([^\]]+)\]\(([^)]+)\)')
    for match in link_pattern.finditer(markdown_text):
        link_map[match.group(1)] = match.group(2)

    # Fix null hrefs in the ProseMirror output
    for node in body_json.get("content", []):
        for text_node in node.get("content", []):
            if not isinstance(text_node, dict):
                continue
            for mark in text_node.get("marks", []):
                if mark.get("type") == "link":
                    href = mark.get("attrs", {}).get("href")
                    if href is None:
                        link_text = text_node.get("text", "")
                        if link_text in link_map:
                            mark["attrs"] = {"href": link_map[link_text]}

    return json.dumps(body_json)


class SubstackClient:
    """Direct Substack API client using requests with python-substack for markdown conversion."""

    def __init__(self, cookie_value: str, publication_url: str):
        self.session = requests.Session()
        self.session.headers.update({
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
        })
        sid_val = unquote(cookie_value)
        self.session.cookies.set("substack.sid", sid_val)
        self.base_url = "https://substack.com/api/v1"

        # Resolve publication
        resp = self.session.get(f"{self.base_url}/user/profile/self")
        if resp.status_code != 200 or not resp.text.strip().startswith("{"):
            print(f"Auth failed: HTTP {resp.status_code}, body: {resp.text[:500]}")
            raise RuntimeError(f"Substack auth failed (HTTP {resp.status_code}). Possible Cloudflare block or expired cookie.")
        profile = resp.json()
        self.user_id = profile["id"]

        # Extract subdomain from publication_url
        match = re.search(r"https://(.*?)\.substack\.com", publication_url.lower())
        target_subdomain = match.group(1) if match else None

        self.publication = None
        for pu in profile.get("publicationUsers", []):
            pub = pu.get("publication", {})
            if target_subdomain and pub.get("subdomain") == target_subdomain:
                self.publication = pub
                break
            if pu.get("is_primary") and not target_subdomain:
                self.publication = pub
                break

        if not self.publication:
            for pu in profile.get("publicationUsers", []):
                if pu.get("is_primary"):
                    self.publication = pu.get("publication", {})
                    break

        if not self.publication:
            raise RuntimeError("Could not find Substack publication")

        subdomain = self.publication["subdomain"]
        self.pub_base = f"https://{subdomain}.substack.com/api/v1"
        print(f"Authenticated as {profile['name']} (publication: {self.publication['name']}, subdomain: {subdomain})")

    def create_and_publish_post(self, post: dict) -> int:
        """Create a draft and publish it. Returns the draft ID."""
        draft_body = markdown_to_prosemirror(post["body"], self.user_id)

        draft_payload = {
            "draft_title": post["title"],
            "draft_subtitle": post["subtitle"],
            "draft_body": draft_body,
            "draft_bylines": [{"id": self.user_id, "is_guest": False}],
            "audience": "everyone",
            "type": "newsletter",
            "section_chosen": False,
            "editor_v2": True,
        }

        resp = self.session.post(f"{self.pub_base}/drafts", json=draft_payload)
        if resp.status_code != 200:
            raise RuntimeError(f"Failed to create draft: {resp.status_code} {resp.text[:500]}")

        draft = resp.json()
        draft_id = draft["id"]
        print(f"    Draft created: {draft_id}")

        publish_payload = {
            "draft_id": draft_id,
            "send": True,
            "share_automatically": False,
        }

        resp = self.session.post(f"{self.pub_base}/drafts/{draft_id}/publish", json=publish_payload)
        if resp.status_code != 200:
            print(f"    Warning: publish returned {resp.status_code}, trying alternative...")
            resp2 = self.session.post(f"{self.pub_base}/drafts/{draft_id}/prepublish")
            print(f"    Prepublish: {resp2.status_code}")
            resp3 = self.session.post(f"{self.pub_base}/drafts/{draft_id}/publish", json=publish_payload)
            print(f"    Publish: {resp3.status_code}")

        print(f"    Published!")
        return draft_id

    def update_post(self, draft_id: int, post: dict) -> int:
        """Update an existing published post in place. Returns the draft ID."""
        draft_body = markdown_to_prosemirror(post["body"], self.user_id)

        update_payload = {
            "draft_title": post["title"],
            "draft_subtitle": post["subtitle"],
            "draft_body": draft_body,
            "editor_v2": True,
        }

        resp = self.session.put(f"{self.pub_base}/drafts/{draft_id}", json=update_payload)
        if resp.status_code != 200:
            raise RuntimeError(f"Failed to update post {draft_id}: {resp.status_code} {resp.text[:500]}")

        # Re-publish to regenerate the rendered HTML
        resp2 = self.session.post(f"{self.pub_base}/drafts/{draft_id}/publish", json={
            "draft_id": draft_id,
            "send": False,
            "share_automatically": False,
        })
        if resp2.status_code != 200:
            print(f"    Warning: re-publish returned {resp2.status_code}")

        print(f"    Updated post {draft_id}")
        return draft_id


def main():
    parser = argparse.ArgumentParser(description="Sync blog posts to Substack")
    parser.add_argument("--post", help="Sync a specific post by slug (filename without .md)")
    parser.add_argument("--dry-run", action="store_true", help="Show what would happen without publishing")
    parser.add_argument("--force", action="store_true", help="Force re-sync all posts")
    parser.add_argument("--list", action="store_true", help="List all posts and their sync status")
    args = parser.parse_args()

    # Load state
    state = load_sync_state()

    # Get all posts
    print("Reading blog posts...")
    posts = get_all_posts()
    print(f"Found {len(posts)} posts\n")

    if args.list:
        for post in posts:
            synced = state["posts"].get(post["slug"], {})
            status = "SYNCED" if synced.get("hash") == post["hash"] else "PENDING"
            if synced.get("hash") and synced["hash"] != post["hash"]:
                status = "CHANGED"
            print(f"  [{status:7s}] {post['slug']}")
            print(f"           {post['title']}")
        return

    # Filter posts that need syncing
    if args.post:
        posts = [p for p in posts if p["slug"] == args.post]
        if not posts:
            print(f"Post '{args.post}' not found")
            sys.exit(1)

    posts_to_sync = []
    for post in posts:
        synced = state["posts"].get(post["slug"], {})
        if args.force or synced.get("hash") != post["hash"]:
            posts_to_sync.append(post)

    if not posts_to_sync:
        print("All posts are up to date. Nothing to sync.")
        return

    print(f"Posts to sync: {len(posts_to_sync)}")
    for p in posts_to_sync:
        synced = state["posts"].get(p["slug"], {})
        if synced:
            print(f"  UPDATE: {p['title']}")
        else:
            print(f"  NEW:    {p['title']}")
    print()

    if args.dry_run:
        print("Dry run complete. No changes made.")
        return

    # Connect to Substack
    substack_url = os.environ.get("SUBSTACK_URL")
    substack_cookie = os.environ.get("SUBSTACK_COOKIE")

    if not substack_url:
        print("ERROR: SUBSTACK_URL environment variable is required")
        print("  Example: export SUBSTACK_URL=https://chiprarau.substack.com")
        sys.exit(1)

    if not substack_cookie:
        print("ERROR: SUBSTACK_COOKIE environment variable is required")
        print("  Set it to your substack.sid cookie value from the browser")
        sys.exit(1)

    client = SubstackClient(substack_cookie, substack_url)

    # Sync each post
    for post in posts_to_sync:
        try:
            synced = state["posts"].get(post["slug"], {})
            existing_draft_id = synced.get("draft_id")

            if existing_draft_id:
                print(f"  UPDATE: {post['title']}")
                draft_id = client.update_post(existing_draft_id, post)
            else:
                print(f"  CREATE: {post['title']}")
                draft_id = client.create_and_publish_post(post)

            state["posts"][post["slug"]] = {
                "hash": post["hash"],
                "draft_id": draft_id,
                "title": post["title"],
                "synced_at": post["publish_date"],
            }
            save_sync_state(state)
        except Exception as e:
            print(f"  ERROR syncing {post['slug']}: {e}")
            import traceback
            traceback.print_exc()
            continue

    print(f"\nDone! Synced {len(posts_to_sync)} posts.")


if __name__ == "__main__":
    main()
