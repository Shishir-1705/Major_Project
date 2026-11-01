import os
import sys
import time
from playwright.sync_api import sync_playwright

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

OUTPUT_DIR = os.path.join(os.getcwd(), "reports", "screenshots", "methodology_visual")
os.makedirs(OUTPUT_DIR, exist_ok=True)

BASE_URL = "http://127.0.0.1:5173"

def capture_methodology():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1440, "height": 900})
        page = context.new_page()

        print("Navigating to /methodology...")
        page.goto(f"{BASE_URL}/methodology", wait_until="networkidle")
        time.sleep(2)

        p1 = os.path.join(OUTPUT_DIR, "methodology_desktop_viewport.png")
        page.screenshot(path=p1)
        print(f"Captured: {p1}")

        # Scroll down and capture middle and bottom
        scroll_el = page.locator("div.overflow-y-auto")
        if scroll_el.count() > 0:
            scroll_el.evaluate("el => el.scrollTop = 500")
            time.sleep(1)
            p2 = os.path.join(OUTPUT_DIR, "methodology_desktop_mid.png")
            page.screenshot(path=p2)
            print(f"Captured: {p2}")

            scroll_el.evaluate("el => el.scrollTop = 1200")
            time.sleep(1)
            p3 = os.path.join(OUTPUT_DIR, "methodology_desktop_bottom.png")
            page.screenshot(path=p3)
            print(f"Captured: {p3}")

        browser.close()

if __name__ == "__main__":
    capture_methodology()
