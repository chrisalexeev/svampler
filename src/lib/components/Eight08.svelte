<script lang="ts">
    import { synth } from "../sampler";
</script>

<div>
    <button on:click={() => synth.play()}>C4</button>
</div>

<style>
    div {
        background-color: red;
    }
</style>