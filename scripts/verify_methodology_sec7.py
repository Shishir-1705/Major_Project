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

        scroll_el = page.locator("div.overflow-y-auto")
        scroll_el.evaluate("el => el.scrollTop = 2200")
        time.sleep(1)
        p_sec7 = os.path.join(OUTPUT_DIR, "methodology_desktop_sec7.png")
        page.screenshot(path=p_sec7)
        print(f"Captured: {p_sec7}")

        browser.close()

if __name__ == "__main__":
    capture_methodology()
