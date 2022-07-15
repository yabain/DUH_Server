const redisClient = require("../lib/redis")();
// const chromium = require("chrome-aws-lambda");
// const { addExtra } = require("puppeteer-extra");
// const StealthPlugin = require("puppeteer-extra-plugin-stealth");
// const puppeteerExtra = addExtra(chromium.puppeteer);
// puppeteerExtra.use(StealthPlugin());
const util = require("util");
const request = util.promisify(require("request"));

const getImg = async (page, uri) => {
  const img = await page.evaluate(async () => {
    const ogImg =
      document.querySelector('meta[property="og:image"]') ||
      document.querySelector('meta[name="og:image"]');
    if (ogImg != null && ogImg.content.length > 0) {
      return ogImg.content;
    }
    const imgRelLink = document.querySelector('link[rel="image_src"]');
    if (imgRelLink != null && imgRelLink.href.length > 0) {
      return imgRelLink.href;
    }
    const twitterImg =
      document.querySelector('meta[property="twitter:image"]') ||
      document.querySelector('meta[name="twitter:image"]');
    if (twitterImg != null && twitterImg.content.length > 0) {
      return twitterImg.content;
    }

    // We pick up the firs timage that has a good ratio for the width and height
    let images = Array.from(document.getElementsByTagName("img"));
    if (images.length > 0) {
      images = images.filter((image) => {
        let addImg = true;
        if (image.naturalWidth > image.naturalHeight) {
          if (image.naturalWidth / image.naturalHeight > 3) {
            addImg = false;
          }
        } else {
          if (image.naturalHeight / image.naturalWidth > 3) {
            addImg = false;
          }
        }
        if (image.naturalHeight <= 50 || image.naturalWidth <= 50) {
          addImg = false;
        }
        return addImg;
      });
      if (images.length > 0) {
        images.forEach((image) =>
          image.src.indexOf("//") === -1
            ? (image.src = `${new URL(uri).origin}/${src}`)
            : image.src
        );
        return images[0].src;
      }
    }
    return null;
  });
  return img;
};

const getTitle = async (page) => {
  const title = await page.evaluate(() => {
    const ogTitle =
      document.querySelector('meta[property="og:title"]') ||
      document.querySelector('meta[name="og:title"]') ||
      document.querySelector('meta[name="title"]');
    if (ogTitle != null && ogTitle.content.length > 0) {
      return ogTitle.content;
    }
    const twitterTitle =
      document.querySelector('meta[property="twitter:title"]') ||
      document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle != null && twitterTitle.content.length > 0) {
      return twitterTitle.content;
    }
    const docTitle = document.title;
    if (docTitle != null && docTitle.length > 0) {
      return docTitle;
    }

    // We pick the first h1 or h2 text
    const h1El = document.querySelector("h1");
    const h1 = h1El ? h1El.innerHTML : null;
    if (h1 != null && h1.length > 0) {
      return h1;
    }
    const h2El = document.querySelector("h2");
    const h2 = h2El ? h2El.innerHTML : null;
    if (h2 != null && h2.length > 0) {
      return h2;
    }
    return null;
  });
  return title;
};

const getDescription = async (page) => {
  const description = await page.evaluate(() => {
    const ogDescription =
      document.querySelector('meta[property="og:description"]') ||
      document.querySelector('meta[name="og:description"]');
    if (ogDescription != null && ogDescription.content.length > 0) {
      return ogDescription.content;
    }
    const twitterDescription =
      document.querySelector('meta[property="twitter:description"]') ||
      document.querySelector('meta[name="twitter:description"]');
    if (twitterDescription != null && twitterDescription.content.length > 0) {
      return twitterDescription.content;
    }
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription != null && metaDescription.content.length > 0) {
      return metaDescription.content;
    }

    // We take the first paragraph text
    let fstVisibleParagraph = "";
    const paragraphs = document.querySelectorAll("p");
    const firstParagraph = paragraphs && paragraphs[0];
    if (firstParagraph) {
      let child = firstParagraph.firstChild;
      const texts = [];
      while (child) {
        if (child.nodeType == 3) {
          if (child.data.trim()) {
            texts.push(child.data.trim());
          }
        } else if (
          child.offsetParent !== null &&
          child.childElementCount == 0
        ) {
          if (child.textContent.trim()) {
            texts.push(child.textContent.trim());
          }
        }
        child = child.nextSibling;
      }

      fstVisibleParagraph = texts.join(" ");
    }

    return fstVisibleParagraph;
  });
  return description;
};

const getDomainName = async (page, uri) => {
  const domainName = await page.evaluate(() => {
    const canonicalLink = document.querySelector("link[rel=canonical]");
    if (canonicalLink != null && canonicalLink.href.length > 0) {
      return canonicalLink.href;
    }
    const ogUrlMeta = document.querySelector('meta[property="og:url"]');
    if (ogUrlMeta != null && ogUrlMeta.content.length > 0) {
      return ogUrlMeta.content;
    }
    return null;
  });
  return domainName != null
    ? new URL(domainName).hostname.replace("www.", "")
    : new URL(uri).hostname.replace("www.", "");
};

module.exports = async (uri) => {
  // Get it from the cache if existing
  let metadataFromCache = (await redisClient.getAsync(uri).catch()) || "{}";
  try {
    // If it's good we return it
    metadataFromCache = JSON.parse(metadataFromCache);
    const goodData =
      metadataFromCache.title ||
      metadataFromCache.description ||
      metadataFromCache.domain ||
      metadataFromCache.img;
    if (goodData) {
      return metadataFromCache;
    }
  } catch (e) {}

  const browser = await puppeteerExtra.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath,
    headless: chromium.headless,
    ignoreHTTPSErrors: true,
  });

  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0);

  await page.goto(uri);
  await page.exposeFunction("request", request);
  await page.exposeFunction();

  const obj = {};
  obj.title = await getTitle(page);
  obj.description = await getDescription(page);
  obj.domain = await getDomainName(page, uri);
  obj.img = await getImg(page, uri);

  await browser.close();

  // Let's save it into the cache to expire in 10 days.
  await redisClient.setAsync(uri, JSON.stringify(obj)).catch();
  redisClient.expire(uri, 10 * 24 * 60 * 60);

  return obj;
};
