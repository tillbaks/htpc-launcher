<script context="module">
  import * as mdi from "@mdi/js";
</script>

<script>
  export let icon = "";
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  xmlns:xlink="http://www.w3.org/1999/xlink"
  version="1.1"
  viewBox="0 0 24 24"><path d={mdi[icon] || ""} /></svg
>

<style>
  svg {
    width: var(--icon-size, 4rem);
    height: var(--icon-size, 4rem);
    fill: var(--icon-color, currentColor);
  }
</style>
