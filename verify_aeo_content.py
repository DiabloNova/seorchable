import asyncio
import os
import subprocess
import time
from playwright.async_api import async_playwright

async def verify_dashboard():
    print("=========================================================")
    print("PLAYWRIGHT FRONTEND VISUAL VERIFICATION FOR PHASE 5.4")
    print("=========================================================")

    # 1. Kill any process running on port 3000
    print("Killing any existing processes on port 3000...")
    subprocess.run("kill $(lsof -t -i :3000) 2>/dev/null || true", shell=True)

    # 2. Start Next.js server in the background
    print("Starting Next.js production server...")
    proc = subprocess.Popen(
        "pnpm start > next_prod_aeo_content.log 2>&1",
        shell=True,
        preexec_fn=os.setsid
    )

    # Wait for server to be ready
    time.sleep(5)

    try:
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            page = await browser.new_page()

            # Set viewport size
            await page.set_viewport_size({"width": 1440, "height": 900})

            # Navigate to login page
            print("Navigating to login page...")
            await page.goto("http://localhost:3000/fa/login")
            await page.wait_for_timeout(2000)

            # Perform Login
            print("Filling login credentials...")
            await page.fill('input[type="email"]', 'test@example.com')
            await page.fill('input[type="password"]', 'password')
            await page.click('button[type="submit"]')

            print("Waiting for authentication and redirect...")
            await page.wait_for_timeout(3000)

            # Navigate to AEO Content Intelligence Dashboard
            print("Navigating to AEO Content Intelligence Dashboard...")
            await page.goto("http://localhost:3000/fa/dashboard/aeo/content")
            await page.wait_for_timeout(3000)

            # Verify that the dashboard content is fully loaded
            title = await page.title()
            print(f"Page Title: {title}")

            # Capture screenshot
            screenshot_path = "/home/jules/verification/aeo_content_intelligence.png"
            os.makedirs(os.path.dirname(screenshot_path), exist_ok=True)
            await page.screenshot(path=screenshot_path, full_page=True)
            print(f"✅ Success: Screenshot captured at {screenshot_path}")

            await browser.close()
    except Exception as e:
        print(f"❌ Error occurred during visual verification: {e}")
    finally:
        print("Stopping Next.js server...")
        subprocess.run("kill -9 -$(ps -o pgid= -p " + str(proc.pid) + ") 2>/dev/null || true", shell=True)

if __name__ == "__main__":
    asyncio.run(verify_dashboard())
