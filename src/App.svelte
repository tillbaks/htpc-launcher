<script>
  import { tick } from "svelte";
  import { readTextFile, BaseDirectory } from "@tauri-apps/api/fs";
  import { Command } from "@tauri-apps/api/shell";
  import Icon from "./Icon.svelte";
  import {
    focusVertical,
    focusHorizontal,
    getKeyboardFocusableElements,
  } from "./DirectionalFocus";

  let focusable = [];
  let currentFocus;

  let launchables = [];

  async function updateConfig() {
    let text = "[]";
    try {
      text = await readTextFile("htpc-launcher/config.json", {
        dir: BaseDirectory.Config,
      });
      const config = JSON.parse(text);
      launchables = config.launchables;
      await tick();

      focusable = getKeyboardFocusableElements();
      if (focusable.length > 0) {
        currentFocus = focusable.includes(document.activeElement)
          ? document.activeElement
          : focusable[0];
      }
    } catch (error) {
      console.error(error);
      // @TODO: Show error about configuring launchables
    }
  }

  updateConfig();

  function onKeyDown(event) {
    currentFocus = focusable.includes(document.activeElement)
      ? document.activeElement
      : focusable[0];

    //console.log({ focusable, currentFocus });

    switch (event.key) {
      case "ArrowUp": {
        focusVertical({ currentFocus, focusable, direction: "up" });
        break;
      }
      case "ArrowDown": {
        focusVertical({ currentFocus, focusable, direction: "down" });
        break;
      }
      case "ArrowLeft": {
        focusHorizontal({ currentFocus, focusable, direction: "left" });
        break;
      }
      case "ArrowRight": {
        focusHorizontal({ currentFocus, focusable, direction: "right" });
        break;
      }
    }
  }

  function launch({ cmd, args = [], cwd = undefined }) {
    const command = new Command(cmd, args, { cwd });
    command.spawn();
  }

  let currentTime;
  {
    function updateTime() {
      const d = new Date();
      currentTime =
        (d.getHours() < 10 ? "0" : "") +
        d.getHours() +
        ":" +
        (d.getMinutes() < 10 ? "0" : "") +
        d.getMinutes();
    }
    updateTime();
    setInterval(updateTime, 15000);
  }
</script>

<svelte:window on:keydown={onKeyDown} />

<main>
  <div class="top-bar">
    <div class="clock">
      {currentTime}
    </div>
  </div>
  <div class="buttons">
    {#each launchables.filter((l) => l.show) as launchable}
      <button on:click={() => launch(launchable)}>
        <Icon icon={launchable.icon} />
        <span>{launchable.name}</span>
      </button>
    {/each}
  </div>
</main>

<style>
  main {
    display: grid;
    grid-template-rows: auto 1fr;
    place-items: end center;
    height: 100%;
    color: hsl(0, 0%, 95%);

    background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
    background-size: 400% 400%;
    animation: gradient 60s linear infinite alternate;
  }

  @keyframes gradient {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }

  .top-bar {
    display: grid;
    grid-template-columns: 1fr auto;
    place-items: end;
    padding: 10vh;
    width: 100%;
  }

  .clock {
    font-weight: 900;
    font-size: 5rem;
    opacity: 0.3;
    line-height: 1;
  }

  .buttons {
    margin-bottom: 10vh;
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: 1fr;
    gap: 1rem;
  }
  .buttons > button {
    display: grid;
    place-items: center;
    margin: 0;
    padding: 3vh;
    outline: none;
    border: 0;
    border-radius: 0.5rem;
    font-size: 1.5rem;
    color: hsl(0, 0%, 95%);
    border: 1px solid rgba(255, 255, 255, 0);
    background-color: transparent;
    transition: transform 250ms ease-out, opacity 250ms;
    opacity: 0.7;
  }
  .buttons > button:focus {
    background-color: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.2);
    transform: scale(1.2);
    opacity: 1;
  }
  .buttons > button > span {
    margin-top: 1rem;
  }
</style>
