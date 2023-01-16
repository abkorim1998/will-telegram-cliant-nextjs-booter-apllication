export function scanUrl(htmltext) {
    try {
        var parser = new DOMParser();
        var doc = parser.parseFromString(htmltext, "text/html");

        var url = '';
        if (doc.querySelector('[class="middle"] button')) {
            const buttonAttr = doc.querySelector('[class="middle"] button').getAttribute('onclick');
            // get link from '' or ""
            var start = buttonAttr.indexOf("'");
            var end = buttonAttr.indexOf("'", start + 1);
            var got = buttonAttr.substring(start + 1, end);
            // check if url is valid
            if (got.includes('http')) {
                url = got;
            }
            // get link from '' or ""
            var start = buttonAttr.indexOf('"');
            var end = buttonAttr.indexOf('"', start + 1);
            var got = buttonAttr.substring(start + 1, end);
            // check if url is valid
            if (got.includes('http')) {
                url = got;
            }
        }

        if (doc.querySelector('[class="animatedbutton"] a')) {
            const href = doc.querySelector('[class="animatedbutton"] a').getAttribute('href');
            // if have javascript:window.open
            if (href.includes('javascript')) {
                // get link from '' or ""
                var start = href.indexOf("'");
                var end = href.indexOf("'", start + 1);
                var got = href.substring(start + 1, end);
                // check if url is valid
                if (got.includes('http')) {
                    url = got;
                }

                // get link from '' or ""
                var start = href.indexOf('"');
                var end = href.indexOf('"', start + 1);
                var got = href.substring(start + 1, end);
                // check if url is valid
                if (got.includes('http')) {
                    url = got;
                }
            }
        }

        return url;
    } catch (error) {
        return null;
    }
}