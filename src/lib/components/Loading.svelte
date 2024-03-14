<script lang="ts">
    import { onMount } from "svelte";

    let numDots = 3;

    onMount(() => {
        const interval = setInterval(() => {
            numDots = (numDots + 1) % 4;
        }, 500);
        return () => clearInterval(interval);
    });
</script>

<div>
    <span>Loading{new Array(numDots).fill(".").join("")}</span>
</div>

<style>
    div {
        overflow-x: visible;
        width: 0;
    }
</style>