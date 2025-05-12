const puppeteer = require("puppeteer");


/**
 * This function fetches upcoming contests from CodeChef using Puppeteer.
 * @returns {Promise<Array<{ title: string, startTime: string, duration: string, url: string }>>}
 */
async function fetchCodeChefContests() {
  const browser = await puppeteer.launch({ 
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-accelerated-2d-canvas', '--disable-gpu']
  });
  
  const page = await browser.newPage();
  
  try {
    page.setDefaultTimeout(60000);
    
    // Enable request interception for better performance
    await page.setRequestInterception(true);
    page.on('request', (request) => {
      // Block unnecessary resources to speed up loading
      const resourceType = request.resourceType();
      if (resourceType === 'image' || resourceType === 'font' || resourceType === 'media') {
        request.abort();
      } else {
        request.continue();
      }
    });
    
    // Set viewport to ensure consistent rendering
    await page.setViewport({ width: 1366, height: 768 });
    
    console.log("Navigating to CodeChef contests page...");
    await page.goto("https://www.codechef.com/contests", { 
      waitUntil: "networkidle2", // Wait until network is idle
      timeout: 60000 
    });
    
    console.log("Waiting for content to load...");
    
    // Wait for the React app to initialize
    await page.waitForSelector("#root div", { visible: true });
    
    // Sleep briefly to allow React to render
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Scroll more gradually and wait between scrolls
    await page.evaluate(async () => {
      await new Promise((resolve) => {
        const totalHeight = document.body.scrollHeight;
        let scrolled = 0;
        const distance = 100;
        const timer = setInterval(() => {
          window.scrollBy(0, distance);
          scrolled += distance;
          
          if (scrolled >= totalHeight) {
            clearInterval(timer);
            resolve();
          }
        }, 100);
      });
    });
    
    // Wait for contest tables to appear
    console.log("Looking for contest tables...");
    
    // Try different selectors since the page structure might have changed
    const possibleTableSelectors = [
      "table.MuiTable-root tbody tr",
      ".MuiTableBody-root tr",
      "div[role='table'] div[role='rowgroup'] div[role='row']",
      ".contest-table tbody tr"
    ];
    
    let selectedSelector = null;
    
    for (const selector of possibleTableSelectors) {
      console.log(`Trying selector: ${selector}`);
      const hasElements = await page.evaluate((sel) => {
        return document.querySelector(sel) !== null && document.querySelectorAll(sel).length > 0;
      }, selector);
      
      if (hasElements) {
        selectedSelector = selector;
        console.log(`Found elements with selector: ${selector}`);
        break;
      }
    }
    
    if (!selectedSelector) {
      console.log("Could not find contest elements with known selectors.");
      console.log("Taking screenshot for debugging...");
      await page.screenshot({ path: 'codechef-debug.png' });
      throw new Error("Contest elements not found");
    }
    
    // Extract contest details with the working selector
    const contests = await page.evaluate((selector) => {
      try {
        // Get all potential rows, fallback to empty array if selector fails
        const rows = Array.from(document.querySelectorAll(selector)).filter(row => row); // Remove null/undefined
        if (!rows.length) {
          console.warn('No rows found for selector:', selector);
          return [];
        }
    
        return rows.map((row, index) => {
          try {
            // Check if row has table cells (td), skip if not a valid row
            const cells = row.querySelectorAll('td');
            if (!cells.length) {
              console.warn(`Row ${index} has no <td> elements, skipping`);
              return null;
            }
    
            // Ensure we have enough columns, fallback gracefully if not
            if (cells.length < 4) {
              console.warn(`Row ${index} has fewer than 4 columns: ${cells.length}`);
              return {
                title: cells[1]?.innerText?.trim() || 'Unknown',
                startTime: cells[2]?.innerText?.trim().split('\n\n')[0] || 'Unknown',
                duration: 'Unknown', // Default since we can't trust indices
                url: 'https://www.codechef.com/contests' // Safe default
              };
            }
    
            // Extract data with fallbacks
            const titleCell = cells[1];
            const startTimeCell = cells[2];
            const durationCell = cells[3];
    
            return {
              title: titleCell?.innerText?.trim() || 'Unknown',
              startTime: startTimeCell?.innerText?.trim().split('\n\n')[0] || 'Unknown',
              duration: durationCell?.innerText?.trim() || 'Unknown',
              url: titleCell?.querySelector('a')?.getAttribute('href') 
                ? `https://www.codechef.com${titleCell.querySelector('a').getAttribute('href')}` 
                : 'https://www.codechef.com/contests'
            };
          } catch (rowError) {
            console.error(`Error processing row ${index}:`, rowError.message);
            return {
              title: 'Unknown',
              startTime: 'Unknown',
              duration: 'Unknown',
              url: 'https://www.codechef.com/contests'
            };
          }
        }).filter(contest => contest !== null); // Remove skipped rows
      } catch (error) {
        console.error('Failed to evaluate contests:', error.message);
        return []; // Return empty array on total failure
      }
    });
    
    console.log(`Successfully extracted ${contests.length} contests`);
    return contests;
  } catch (error) {
    console.error("Error fetching CodeChef contests:", error);
    return [];
  } finally {
    await browser.close();
  }
};

module.exports = { fetchCodeChefContests };