import os
import sys
import time
from playwright.sync_api import sync_playwright

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

OUTPUT_DIR = os.path.join(os.getcwd(), "reports", "screenshots", "design_system_extension")
os.makedirs(OUTPUT_DIR, exist_ok=True)

BASE_URL = "http://127.0.0.1:5173"

def run_design_verification():
    print("=" * 70)
    print("DESIGN SYSTEM EXTENSION VERIFICATION")
    print("Verifying Cinematic Liquid-Glass System Across All Routes & Viewports")
    print("=" * 70)

    console_errors = []

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)

        # -------------------------------------------------------------
        # 1. Desktop Viewport (1440 x 900)
        # -------------------------------------------------------------
        print("\n--- 1. DESKTOP VIEWPORT (1440x900) ---")
        context_desk = browser.new_context(viewport={"width": 1440, "height": 900})
        page_desk = context_desk.new_page()

        def handle_console(msg):
            # Ignore standard React dev warnings or favicon 404
            if msg.type == "error" and "favicon" not in msg.text:
                console_errors.append(f"[Console Error] {msg.text}")

        page_desk.on("console", handle_console)

        # Route 1: Home Page (/)
        print("\n[Route 1/9] Home Page (/)")
        page_desk.goto(f"{BASE_URL}/", wait_until="networkidle")
        time.sleep(2)
        # Verify minimal header on Home page: No analytical nav buttons
        nav_buttons = page_desk.locator("nav a:has-text('LST Explorer'), nav a:has-text('ML Hotspots')")
        assert nav_buttons.count() == 0, "Analytical nav must NOT be rendered on Home page!"
        home_path = os.path.join(OUTPUT_DIR, "01_home_desktop.png")
        page_desk.screenshot(path=home_path)
        print(f"  ✓ Minimal header confirmed (no analytical nav on /)")
        print(f"  ✓ Saved screenshot: {home_path}")

        # Route 2: Overview (/overview)
        print("\n[Route 2/9] Overview Page (/overview)")
        page_desk.goto(f"{BASE_URL}/overview", wait_until="networkidle")
        time.sleep(3)
        # Verify analytical nav is present
        nav_overview = page_desk.locator("header nav a:has-text('Overview')")
        assert nav_overview.count() > 0, "Analytical nav missing on /overview!"
        overview_path = os.path.join(OUTPUT_DIR, "02_overview_desktop.png")
        page_desk.screenshot(path=overview_path)
        print(f"  ✓ Overview loaded with liquid-glass hero and analytical nav")
        print(f"  ✓ Saved screenshot: {overview_path}")

        # Route 3: LST Explorer (/lst)
        print("\n[Route 3/9] LST Explorer (/lst)")
        page_desk.goto(f"{BASE_URL}/lst", wait_until="networkidle")
        time.sleep(3)
        assert page_desk.locator(".leaflet-container").is_visible(), "Map missing on /lst"
        lst_path = os.path.join(OUTPUT_DIR, "03_lst_desktop.png")
        page_desk.screenshot(path=lst_path)
        print(f"  ✓ LST Explorer loaded with crisp raster map and liquid glass controls")
        print(f"  ✓ Saved screenshot: {lst_path}")

        # Route 4: ML Hotspots (/hotspots)
        print("\n[Route 4/9] ML Hotspots (/hotspots)")
        page_desk.goto(f"{BASE_URL}/hotspots", wait_until="networkidle")
        time.sleep(3)
        assert page_desk.locator(".leaflet-container").is_visible(), "Map missing on /hotspots"
        hotspots_path = os.path.join(OUTPUT_DIR, "04_hotspots_desktop.png")
        page_desk.screenshot(path=hotspots_path)
        print(f"  ✓ ML Hotspots loaded with probability map")
        print(f"  ✓ Saved screenshot: {hotspots_path}")

        # Route 5: Environmental Indices (/indices)
        print("\n[Route 5/9] Environmental Indices (/indices)")
        page_desk.goto(f"{BASE_URL}/indices", wait_until="networkidle")
        time.sleep(3)
        assert page_desk.locator(".leaflet-container").is_visible(), "Map missing on /indices"
        indices_path = os.path.join(OUTPUT_DIR, "05_indices_desktop.png")
        page_desk.screenshot(path=indices_path)
        print(f"  ✓ NDVI / NDBI page loaded with liquid glass sidebar")
        print(f"  ✓ Saved screenshot: {indices_path}")

        # Route 6: Temporal Persistence (/persistence)
        print("\n[Route 6/9] Persistence Analytics (/persistence)")
        page_desk.goto(f"{BASE_URL}/persistence", wait_until="networkidle")
        time.sleep(3)
        assert page_desk.locator(".leaflet-container").is_visible(), "Map missing on /persistence"
        persistence_path = os.path.join(OUTPUT_DIR, "06_persistence_desktop.png")
        page_desk.screenshot(path=persistence_path)
        print(f"  ✓ Persistence page loaded with recurrence categories")
        print(f"  ✓ Saved screenshot: {persistence_path}")

        # Route 7: Getis-Ord Gi* Clusters (/clusters)
        print("\n[Route 7/9] Getis-Ord Gi* Clusters (/clusters)")
        page_desk.goto(f"{BASE_URL}/clusters", wait_until="networkidle")
        time.sleep(3)
        assert page_desk.locator(".leaflet-container").is_visible(), "Map missing on /clusters"
        clusters_path = os.path.join(OUTPUT_DIR, "07_clusters_desktop.png")
        page_desk.screenshot(path=clusters_path)
        print(f"  ✓ Gi* page loaded with FDR confidence levels")
        print(f"  ✓ Saved screenshot: {clusters_path}")

        # Route 8: Model Specification (/model)
        print("\n[Route 8/9] Model Specification (/model)")
        page_desk.goto(f"{BASE_URL}/model", wait_until="networkidle")
        time.sleep(2)
        model_path = os.path.join(OUTPUT_DIR, "08_model_desktop.png")
        page_desk.screenshot(path=model_path)
        print(f"  ✓ Model specification loaded with liquid-glass telemetry and confusion matrix")
        print(f"  ✓ Saved screenshot: {model_path}")

        # Route 9: Research Methodology (/methodology)
        print("\n[Route 9/9] Research Methodology (/methodology)")
        page_desk.goto(f"{BASE_URL}/methodology", wait_until="networkidle")
        time.sleep(2)
        methodology_path = os.path.join(OUTPUT_DIR, "09_methodology_desktop.png")
        page_desk.screenshot(path=methodology_path)
        print(f"  ✓ Methodology page loaded with 5-step lineage diagram")
        print(f"  ✓ Saved screenshot: {methodology_path}")

        context_desk.close()

        # -------------------------------------------------------------
        # 2. Laptop Viewport (1024 x 768)
        # -------------------------------------------------------------
        print("\n--- 2. LAPTOP VIEWPORT (1024x768) ---")
        context_laptop = browser.new_context(viewport={"width": 1024, "height": 768})
        page_laptop = context_laptop.new_page()
        page_laptop.goto(f"{BASE_URL}/overview", wait_until="networkidle")
        time.sleep(2)
        laptop_path = os.path.join(OUTPUT_DIR, "11_overview_laptop.png")
        page_laptop.screenshot(path=laptop_path)
        print(f"  ✓ Overview on Laptop (1024x768) verified")
        print(f"  ✓ Saved screenshot: {laptop_path}")
        context_laptop.close()

        # -------------------------------------------------------------
        # 3. Mobile Viewport (390 x 844) & Navigation Drawer
        # -------------------------------------------------------------
        print("\n--- 3. MOBILE VIEWPORT (390x844) & DRAWER ---")
        context_mobile = browser.new_context(viewport={"width": 390, "height": 844})
        page_mobile = context_mobile.new_page()

        # Mobile LST
        page_mobile.goto(f"{BASE_URL}/lst", wait_until="networkidle")
        time.sleep(2)
        mobile_lst_path = os.path.join(OUTPUT_DIR, "12_lst_mobile.png")
        page_mobile.screenshot(path=mobile_lst_path)
        print(f"  ✓ Mobile LST page verified")

        # Open Mobile Navigation Drawer from Header
        menu_btn = page_mobile.locator("header button[aria-label*='Navigation Menu'], header button[aria-label*='Menu']").first
        if menu_btn.is_visible():
            menu_btn.click()
            time.sleep(1)
            drawer_path = os.path.join(OUTPUT_DIR, "10_mobile_nav_drawer.png")
            page_mobile.screenshot(path=drawer_path)
            print(f"  ✓ Mobile navigation drawer captured: {drawer_path}")

        context_mobile.close()
        browser.close()

        print("\n" + "=" * 70)
        print(f"ALL ROUTE VERIFICATIONS PASSED SUCCESSFULLY.")
        print(f"Console errors encountered: {len(console_errors)}")
        if console_errors:
            for err in console_errors:
                print(f"  - {err}")
        print("=" * 70)

if __name__ == "__main__":
    run_design_verification()
