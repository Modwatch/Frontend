import { h } from "preact";
import { useState, useEffect } from "preact/hooks";
import { Link } from "wouter-preact";

import { searchModlists, getModlists } from "../store/pure";

import { PartialModlist } from "../types";

const styles = {
  th: {
    borderBottom: "1px solid",
    padding: "3px"
  },
  td: {
    padding: "3px"
  },
  modlistTable: { width: "100%", textAlign: "left" }
};

const gameMap = {
  skyrim: "Skyrim Classic",
  skyrimse: "Skryim SE",
  fallout4: "Fallout 4"
};

export default () => {
  const [modlists, setModlists] = useState([]);
  const [debounceFilter, setDebounceFilter] = useState(undefined);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    window.clearTimeout(debounceFilter);
    setDebounceFilter(window.setTimeout(async () => {
      if (!filter) {
        setModlists(prettifyModlists(await getModlists()));
      } else {
        setModlists(prettifyModlists(await searchModlists({ filter: filter })));
      }
    }, 300));
    return () => window.clearTimeout(debounceFilter);
  }, [filter]);

  return (
    <div>
      <form>
        <label for="modlists-search" class="sr-only">
          Search
        </label>
        <input
          type="text"
          placeholder="Search"
          id="modlists-search"
          value={filter}
          onInput={e => setFilter((e.target as HTMLInputElement).value)}
        />
        <button type="button" onClick={e => setFilter("")}>
          Clear
        </button>
      </form>
      <table style={styles.modlistTable}>
        <thead>
          <tr>
            <th style={styles.th}>Username</th>
            <th style={styles.th}>Game</th>
            <th style={styles.th} class="responsive-hide">
              Timestamp
            </th>
          </tr>
        </thead>
        {modlists.map(
          ({
            username,
            encodedUsername,
            game,
            displayTimestamp
          }) => (
            <tr>
              <td style={styles.td}>
                <Link href={`/u/${encodedUsername}`}>{username}</Link>
              </td>
              <td style={styles.td}>{gameMap[game]}</td>
              <td style={styles.td} class="responsive-hide">
                {displayTimestamp}
              </td>
            </tr>
          )
        )}
      </table>
    </div>
  );
}

const prettifyModlists = (modlists: PartialModlist[]): PartialModlist[] => (
  modlists.map(
    m => ({
      ...m,
      game: m.game || "skyrim",
      encodedUsername: encodeURIComponent(m.username),
      displayTimestamp: new Date(m.timestamp).toLocaleString()
    })
  )
);
