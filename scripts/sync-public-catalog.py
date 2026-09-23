#!/usr/bin/env python3
"""Build the offline demo catalog from Garvee's public New Arrivals page.

Public catalog fields stay public-source data. Sales velocity and fallback launch
age are deterministic demo metrics used only to exercise the prototype UI.
"""

from __future__ import annotations

import hashlib
import html
import json
import os
import re
import urllib.parse
import urllib.request
from datetime import date, datetime
from pathlib import Path


SOURCE_URL = "https://www.garvee.com/collections/new-arrivals?filter.v.availability=true"
SNAPSHOT_DATE = date(2026, 9, 23)
SITE_DIR = Path(__file__).resolve().parents[1]
ASSET_DIR = SITE_DIR / "assets" / "products"
CATALOG_FILE = SITE_DIR / "catalog.js"

CATEGORY_MAP = {
    "Agriculture & Forestry Equipment": "Agriculture & Forestry",
    "Air Conditioners & Accessories": "Air Conditioners",
    "Ride On Toys": "Toys & Games",
}

CATEGORY_ORDER = [
    "Agriculture & Forestry",
    "Lawn & Garden",
    "Home & Furniture",
    "Rugs",
    "Automotive",
    "Air Conditioners",
    "Restaurant & Food Service",
    "Toys & Games",
    "Sports & Outdoors",
]


def fetch(url: str) -> bytes:
    request = urllib.request.Request(
        url,
        headers={
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
            "AppleWebKit/537.36 Chrome/140 Safari/537.36"
        },
    )
    with urllib.request.urlopen(request, timeout=45) as response:
        return response.read()


def field(chunk: str, pattern: str, default: str = "") -> str:
    match = re.search(pattern, chunk)
    return match.group(1) if match else default


def stable_number(key: str, minimum: int, maximum: int) -> int:
    digest = hashlib.sha256(key.encode("utf-8")).digest()
    value = int.from_bytes(digest[:4], "big")
    return minimum + value % (maximum - minimum + 1)


def normalize_source(raw: bytes) -> str:
    source = html.unescape(raw.decode("utf-8", errors="replace"))
    return source.replace('\\"', '"').replace("\\u0026", "&")


def parse_products(source: str) -> list[dict]:
    starts = [
        match.start()
        for match in re.finditer(r'"id":"gid://shopify/Product/', source)
    ]
    products: list[dict] = []
    seen: set[str] = set()

    for index, start in enumerate(starts):
        end = starts[index + 1] if index + 1 < len(starts) else start + 30_000
        chunk = source[start:end]
        handle = field(chunk, r'"handle":"([^"]+)"')
        if not handle or handle in seen:
            continue
        seen.add(handle)

        if field(chunk, r'"availableForSale":(true|false)') != "true":
            continue

        source_category = field(chunk, r'CL#1_([^"]+)')
        category = CATEGORY_MAP.get(source_category, source_category)
        if category not in CATEGORY_ORDER:
            continue

        image_url = field(
            chunk, r'"featuredImage":\{"url":"([^"]+)"'
        )
        title = field(chunk, r'"title":"(.*?)","productType"').replace("\\", "")
        price = field(chunk, r'"price":\{"amount":"([^"]+)"')
        if not image_url or not title or not price:
            continue

        review_match = re.search(
            r'"reviews":\{"rating":([0-9.]+),"count":(\d+)\}', chunk
        )
        active_tag = field(chunk, r"Active-(\d{8})")
        added_days: int | None = None
        if active_tag:
            launched = datetime.strptime(active_tag, "%Y%m%d").date()
            difference = (SNAPSHOT_DATE - launched).days
            if 0 <= difference <= 90:
                added_days = difference

        products.append(
            {
                "id": handle,
                "handle": handle,
                "name": title,
                "url": f"https://www.garvee.com/products/{handle}",
                "sourceImage": image_url,
                "category": category,
                "subcategory": field(chunk, r'CL#2_([^"]+)') or category,
                "price": float(price),
                "compareAt": float(
                    field(
                        chunk,
                        r'"compareAtPrice":\{"amount":"([^"]+)"',
                        price,
                    )
                ),
                "rating": float(review_match.group(1)) if review_match else 0,
                "reviews": int(review_match.group(2)) if review_match else 0,
                "inventory": int(
                    field(chunk, r'"quantityAvailable":(\d+)', "1")
                ),
                "addedDays": added_days
                if added_days is not None
                else stable_number(handle + "age", 5, 88),
                "addedIsDemo": added_days is None,
                "sold30": stable_number(handle + "sales", 18, 245),
                "delivery": "Sep 26–29",
            }
        )

    return products


def select_balanced(products: list[dict], limit: int = 50) -> list[dict]:
    grouped = {
        category: sorted(
            [item for item in products if item["category"] == category],
            key=lambda item: (item["addedDays"], -item["reviews"]),
        )
        for category in CATEGORY_ORDER
    }
    selected: list[dict] = []
    cursor = 0
    while len(selected) < limit:
        added_this_round = False
        for category in CATEGORY_ORDER:
            items = grouped[category]
            if cursor < len(items):
                selected.append(items[cursor])
                added_this_round = True
                if len(selected) == limit:
                    break
        if not added_this_round:
            break
        cursor += 1
    for category in CATEGORY_ORDER:
        category_items = [item for item in selected if item["category"] == category]
        if category_items and all(item["addedDays"] > 30 for item in category_items):
            category_items[0]["addedDays"] = stable_number(category + "coverage", 7, 24)
            category_items[0]["addedIsDemo"] = True
    return selected


def image_request_url(url: str) -> str:
    separator = "&" if "?" in url else "?"
    return f"{url}{separator}width=720&format=webp&quality=82"


def download_images(products: list[dict]) -> None:
    ASSET_DIR.mkdir(parents=True, exist_ok=True)
    for index, product in enumerate(products, start=1):
        filename = f"product-{index:02d}.webp"
        destination = ASSET_DIR / filename
        destination.write_bytes(fetch(image_request_url(product["sourceImage"])))
        product["image"] = f"./assets/products/{filename}"
        product.pop("sourceImage", None)


def build_payload(products: list[dict]) -> dict:
    category_sales = {
        category: round(
            sum(
                product["sold30"] * product["price"]
                for product in products
                if product["category"] == category
            )
        )
        for category in CATEGORY_ORDER
    }
    return {
        "snapshotDate": SNAPSHOT_DATE.isoformat(),
        "sourceUrl": SOURCE_URL,
        "dataNote": (
            "Product names, images, prices, availability and visible review data "
            "come from Garvee's public page snapshot. Sales velocity, category "
            "revenue and fallback launch age are deterministic demo metrics."
        ),
        "categorySales": category_sales,
        "products": products,
    }


def main() -> None:
    parsed = parse_products(normalize_source(fetch(SOURCE_URL)))
    products = select_balanced(parsed)
    if len(products) < 50:
        raise RuntimeError(f"Expected 50 products, found {len(products)}")
    if os.environ.get("GARVEE_SKIP_IMAGE_DOWNLOAD") == "1":
        for index, product in enumerate(products, start=1):
            product["image"] = f"./assets/products/product-{index:02d}.webp"
            product.pop("sourceImage", None)
    else:
        download_images(products)
    payload = json.dumps(build_payload(products), ensure_ascii=False, indent=2)
    CATALOG_FILE.write_text(
        "window.GARVEE_DEMO_DATA = " + payload + ";\n", encoding="utf-8"
    )
    print(f"Wrote {len(products)} products to {CATALOG_FILE}")


if __name__ == "__main__":
    main()
