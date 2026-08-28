/* ==========================================================================
   UDBRS LANDING SITE INTERACTIVITY & GITHUB DYNAMIC RELEASE FETCHER
   ========================================================================== */

const GITHUB_OWNER = "shaswatxd";
const GITHUB_REPO = "udbrsuite-releases";
const DEFAULT_VERSION = "v1.4.39";
const DEFAULT_DOWNLOAD_URL = `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}/releases/latest`;

// Switch Preview Tabs in Hero Window
function switchPreviewTab(tabId) {
  const tabs = document.querySelectorAll('.preview-tab');
  const contents = document.querySelectorAll('.tab-content');

  tabs.forEach(t => t.classList.remove('active'));
  contents.forEach(c => c.classList.remove('active'));

  const activeContent = document.getElementById(`tab-${tabId}`);
  if (activeContent) {
    activeContent.classList.add('active');
  }

  // Set active state on clicked tab
  const clickedTab = Array.from(tabs).find(t => t.getAttribute('onclick')?.includes(tabId));
  if (clickedTab) {
    clickedTab.classList.add('active');
  }
}

// Toggle FAQ Accordion
function toggleFaq(button) {
  const item = button.parentElement;
  item.classList.toggle('open');
}

// Fetch Dynamic GitHub Releases Data & Stargazers
async function fetchGitHubReleaseData() {
  try {
    // 1. Fetch Repository Info (Stars)
    const repoRes = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}`);
    if (repoRes.ok) {
      const repoData = await repoRes.json();
      const starCount = repoData.stargazers_count;
      const navStar = document.getElementById('nav-star-count');
      if (navStar && starCount !== undefined) {
        navStar.textContent = `★ ${starCount} Stars`;
      }
    }

    // 2. Fetch Latest Release Data
    const releaseRes = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/releases/latest`);
    if (releaseRes.ok) {
      const release = await releaseRes.json();
      const tagName = release.tag_name || DEFAULT_VERSION;

      // Find Windows Executable or Zip Asset
      let downloadUrl = release.html_url || DEFAULT_DOWNLOAD_URL;
      let exeAsset = release.assets?.find(a => a.name.endsWith('.exe') || a.name.endsWith('.zip'));

      if (exeAsset) {
        downloadUrl = exeAsset.browser_download_url;
        const sizeMb = (exeAsset.size / (1024 * 1024)).toFixed(1);
        const dlSizeBox = document.getElementById('dl-size-box');
        if (dlSizeBox) dlSizeBox.textContent = `~${sizeMb} MB`;

        const heroMeta = document.getElementById('hero-download-meta');
        if (heroMeta) heroMeta.textContent = `~${sizeMb} MB • Auto Component Setup`;
      }

      // Update UI elements with latest dynamic version
      const heroVersion = document.getElementById('hero-version-text');
      if (heroVersion) heroVersion.textContent = `${tagName} Latest Stable`;

      const dlTagBox = document.getElementById('dl-tag-box');
      if (dlTagBox) dlTagBox.textContent = `${tagName} (Official Release)`;

      const primaryDlLink = document.getElementById('primary-dl-link');
      if (primaryDlLink) primaryDlLink.href = downloadUrl;

      const heroDlBtn = document.getElementById('hero-download-btn');
      if (heroDlBtn && exeAsset) heroDlBtn.href = downloadUrl;
    }
  } catch (err) {
    console.warn("Could not fetch dynamic GitHub release data:", err);
  }
}

// Initialize on DOM Load
document.addEventListener('DOMContentLoaded', () => {
  fetchGitHubReleaseData();
});
