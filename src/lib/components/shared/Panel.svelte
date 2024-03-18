<script lang="ts">
    export let menuComponent: any = null;
    export let menuOptions: any = {};
</script>

<div class="container">
    <div class="content">
        <slot />
    </div>
    {#if menuComponent !== null}
        <div class="menu">
            <svelte:component this={menuComponent} {menuOptions} />
        </div>
    {/if}
</div>

<style>
    .container {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        height: 100%;
    }

    .content {
        flex: 1;
    }

    .menu {
        /* position: absolute;
        right: 0;
        top: 0; */
        width: 200px;
        height: 100%;
    }
</style>
