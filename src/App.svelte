<script lang="ts">
  import { Router, Route } from "svelte-routing";
  import Main from "./lib/components/Main.svelte";
  import Lab from "./lib/components/Lab.svelte";
  export let url = "";
  let init = false;
</script>

<Router {url}>
  <Route path="/test">
    {#if init}
      <Lab />
    {:else}
      <button on:click={() => (init = true)}>Start</button>
    {/if}
  </Route>
  <Route path="/"><Main /></Route>
</Router>

<style>
  div {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
</style>
