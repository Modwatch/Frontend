import "unfetch/polyfill";

export async function getModlist({username}) {
    return await fetch(`${process.env.API_URL}/api/user/${username}/all`).then(res => res.json());
}

export async function getModlistFileType({username, filetype}) {
    return await fetch(`${process.env.API_URL}/api/user/${username}/file/${filetype}`).then(res => res.json());
}

export async function deleteModlist({ user, username }) {
    if (
        user.scopes.indexOf("admin") === -1 &&
        username !== user.username
    ) {
        return await Promise.reject(
            `${user.scopes.join(
                ","
            )} does not include admin, and ${username} does not equal ${
            user.username
            }`
        );
    }
    try {
        return (await fetch(`${process.env.API_URL}/oauth/user/${username}/delete`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.token}`
            }
        })).status === 200;
    } catch(e) {
        return false;
    }
}