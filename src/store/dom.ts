export function insertScriptIntoDom(src: string) {
    const s = document.createElement("script");
    s.src = src;
    s.async = true;
    document.body.appendChild(s);
    return new Promise((resolve, reject) => {
        s.addEventListener("load", () => {
            s.parentNode.removeChild(s);
            resolve();
        });
        s.addEventListener("error", e => {
            s.parentNode.removeChild(s);
            reject(e);
        });
    });
}
