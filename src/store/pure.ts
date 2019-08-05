import { Modlist } from "@modwatch/types";
import { PartialModlist, User } from "../types";

const getJson = res => res.json();
const _e = encodeURIComponent;

export async function getModlists({
  limit = 10
}: {
  limit?: number;
} = {}): Promise<PartialModlist[]> {
  return await fetch(`${process.env.API_URL}/api/users/list/${limit}`).then(
    getJson
  );
}

export async function searchModlists({
  filter,
  limit = 10
}: {
  filter: string;
  limit?: number;
}): Promise<PartialModlist[]> {
  return await fetch(
    `${process.env.API_URL}/api/search/users/${_e(filter)}/${limit}`
  ).then(getJson);
}

export async function getModlist({
  username
}: {
  username: string;
}): Promise<Modlist> {
  return await fetch(
    `${process.env.API_URL}/api/user/${_e(username)}/all`
  ).then(getJson);
}

export async function getModlistFileType({
  username,
  filetype
}: {
  username: string;
  filetype: string;
}): Promise<Modlist> {
  return await fetch(
    `${process.env.API_URL}/api/user/${_e(username)}/file/${_e(filetype)}`
  ).then(getJson);
}

export async function deleteModlist({
  user,
  username
}: {
  user: User;
  username: string;
}): Promise<boolean> {
  if (user.scopes.indexOf("admin") === -1 && username !== user.username) {
    throw `${user.scopes.join(
      ","
    )} does not include admin, and ${username} does not equal ${user.username}`;
  }
  try {
    return (
      (await fetch(`${process.env.API_URL}/oauth/user/${_e(username)}/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`
        }
      })).status === 200
    );
  } catch (e) {
    return false;
  }
}

export async function verify(token: string): Promise<boolean> {
  return (
    (await fetch(`${process.env.API_URL}/oauth/verify?t=${Date.now()}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    })).status === 200
  );
}
