<script lang="ts">
    import { beforeUpdate, onDestroy, onMount } from "svelte";

    export let handle: HTMLElement | null = null;
    let handleHasEventListeners = false;
    let container: HTMLElement | null = null;

    let positionX = 0;
    let positionY = 0;
    let mouseX = 0;
    let mouseY = 0;
    let isMouseOverHandle = false;
    let draggable = true;
    $: draggable = !handle || isMouseOverHandle;

    function handleHandlerEnter() {
        isMouseOverHandle = true;
    }
    function handleHandlerExit() {
        isMouseOverHandle = false;
    }
    function getNewOffset(e: DragEvent) {
        const x = positionX + e.x - mouseX;
        const y = positionY + e.y - mouseY;
        return { x, y };
    }
    function drag(e: DragEvent) {
        const { x, y } = getNewOffset(e);
        (e.target! as HTMLElement).style.left = x + "px";
        (e.target! as HTMLElement).style.top = y + "px";
    }
    function handleDrag(e: DragEvent) {
        e.preventDefault();
        drag(e);
    }
    function handleDragEnd(e: DragEvent) {
        e.preventDefault();
        drag(e);
        const { x, y } = getNewOffset(e);
        positionX = x;
        positionY = y;
    }
    function handleDragStart(e: DragEvent) {
        let crt = (e.target! as HTMLElement).cloneNode(true);
        (crt as HTMLElement).style.backgroundColor = "red";
        (crt as HTMLElement).style.display = "none";
        document.body.appendChild(crt);
        e.dataTransfer!.setDragImage(crt as HTMLElement, 0, 0);
    }
    function handleMouseMove(e: MouseEvent) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    }
    function handleTouchMove(e: TouchEvent) {
        mouseX = e.touches[0].clientX;
        mouseY = e.touches[0].clientY;
    }

    function addHandleListener() {
        if (!handle) return;
        handle.addEventListener("mouseover", handleHandlerEnter);
        handle.addEventListener("mouseleave", handleHandlerExit);
        handle.style.cursor = "grab";
        container!.style.cursor = "auto";
        handleHasEventListeners = true;
    }
    function removeHandleListener() {
        if (!handle) return;
        handle.removeEventListener("mouseover", handleHandlerEnter);
        handle.removeEventListener("mouseleave", handleHandlerExit);
        handle.style.cursor = "auto";
        container!.style.cursor = "grab";
        handleHasEventListeners = false;
    }

    onMount(() => {
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("touchmove", handleTouchMove);
        if (handle) addHandleListener();
    });

    beforeUpdate(() => {
        
        if (handleHasEventListeners) return;
        removeHandleListener();
        addHandleListener();
    });

    onDestroy(() => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("touchmove", handleTouchMove);
        if (handleHasEventListeners) removeHandleListener();
    });
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
    {draggable}
    on:drag={handleDrag}
    on:dragstart={handleDragStart}
    on:dragend={handleDragEnd}
    bind:this={container}
>
    <slot />
</div>

<style>
    div {
        position: relative;
        cursor: grab;
    }
</style>
