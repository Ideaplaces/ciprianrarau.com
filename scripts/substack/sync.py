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
    SUBSTACK_URL         - Your publication URL (e.g., https://ciprianrarau.substack.com)
    SUBSTACK_COOKIE      - Preferred: connect.sid cookie value from browser (lasts months)
    SUBSTACK_EMAIL       - Alternative: email + password login
    SUBSTACK_PASSWORD    - Alternative: password (only if you set one in Substack settings)

Cookie auth (recommended):
    1. Log into substack.com in your browser
    2. DevTools (F12) > Application > Cookies > substack.com
    3. Copy the "connect.sid" value
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


def clean_markdown_for_substack(body: str, frontmatter: dict) -> str:
    """Transform blog markdown into Substack-compatible markdown.

    - Replace mermaid code blocks with image references (if diagram image exists)
    - Convert relative image paths to absolute URLs
    - Strip transcript field (already in frontmatter, not in body)
    - Add canonical link back to original post
    """

    # Replace mermaid code blocks with the post's diagram image (if it has one)
    image_path = frontmatter.get("image", "")
    if image_path:
        image_url = f"{SITE_URL}{image_path}"
        # Replace ```mermaid ... ``` blocks with the diagram image
        body = re.sub(
            r"```mermaid\n.*?```",
            f"![Diagram]({image_url})",
            body,
            flags=re.DOTALL,
        )
    else:
        # No diagram image, just remove mermaid blocks
        body = re.sub(
            r"```mermaid\n.*?```",
            "*[Diagram available on the original post]*",
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

        slug = build_post_slug(filepath.name)
        cleaned_body = clean_markdown_for_substack(body, frontmatter)

        # Build the canonical URL
        canonical = f"{SITE_URL}/{slug}"

        # Add a footer linking back to the original post
        cleaned_body += f"\n\n---\n\n*Originally published at [{SITE_URL}]({canonical})*\n"

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


def sync_post_to_substack(api, post: dict, existing_drafts: dict, dry_run: bool = False):
    """Create or update a single post on Substack."""
    from substack.post import Post

    title = post["title"]
    slug = post["slug"]

    action = "UPDATE" if slug in existing_drafts else "CREATE"
    print(f"  {action}: {title}")

    if dry_run:
        print(f"    (dry run, skipping)")
        return None

    user_id = api.get_user_id()

    # Build the Substack post
    substack_post = Post(
        title=title,
        subtitle=post["subtitle"],
        user_id=user_id,
        audience="everyone",
    )

    # Convert markdown body to Substack format
    substack_post.from_markdown(post["body"], api=api)

    if action == "CREATE":
        draft = api.post_draft(substack_post.get_draft())
        draft_id = draft.get("id")
        print(f"    Draft created: {draft_id}")

        # Publish immediately
        api.prepublish_draft(draft_id)
        api.publish_draft(draft_id)
        print(f"    Published!")
        return draft_id
    else:
        # Update existing draft/post
        draft_id = existing_drafts[slug]
        print(f"    Updating draft: {draft_id}")
        # For updates, we'd need to use the put endpoint
        # The python-substack library may need the draft object
        try:
            api.put_draft(draft_id, substack_post.get_draft())
            print(f"    Updated!")
        except Exception as e:
            print(f"    Update failed: {e}")
            print(f"    Attempting delete + recreate...")
            draft = api.post_draft(substack_post.get_draft())
            draft_id = draft.get("id")
            api.prepublish_draft(draft_id)
            api.publish_draft(draft_id)
            print(f"    Republished as {draft_id}")
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
    substack_email = os.environ.get("SUBSTACK_EMAIL")
    substack_password = os.environ.get("SUBSTACK_PASSWORD")
    substack_cookie = os.environ.get("SUBSTACK_COOKIE")

    if not substack_url:
        print("ERROR: SUBSTACK_URL environment variable is required")
        print("  Example: export SUBSTACK_URL=https://ciprianrarau.substack.com")
        sys.exit(1)

    try:
        from substack import Api
    except ImportError:
        print("ERROR: python-substack is not installed")
        print("  Run: pip install python-substack")
        sys.exit(1)

    # Authenticate
    if substack_cookie:
        # The library expects "substack.sid=VALUE" format
        cookies_str = f"substack.sid={substack_cookie}"
        api = Api(
            cookies_string=cookies_str,
            publication_url=substack_url,
        )
    elif substack_email and substack_password:
        api = Api(
            email=substack_email,
            password=substack_password,
            publication_url=substack_url,
        )
    else:
        print("ERROR: Set SUBSTACK_EMAIL + SUBSTACK_PASSWORD, or SUBSTACK_COOKIE")
        sys.exit(1)

    # Get existing posts to detect updates
    existing_drafts = {}
    # TODO: fetch existing posts from Substack and map by slug for update detection

    # Sync each post
    for post in posts_to_sync:
        try:
            draft_id = sync_post_to_substack(api, post, existing_drafts, args.dry_run)
            if draft_id:
                state["posts"][post["slug"]] = {
                    "hash": post["hash"],
                    "draft_id": draft_id,
                    "title": post["title"],
                    "synced_at": post["publish_date"],
                }
                save_sync_state(state)
        except Exception as e:
            print(f"  ERROR syncing {post['slug']}: {e}")
            continue

    print(f"\nDone! Synced {len(posts_to_sync)} posts.")


if __name__ == "__main__":
    main()
