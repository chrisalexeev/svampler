<script lang="ts">
    import { beforeUpdate, onDestroy, onMount } from "svelte";

    export let handles: HTMLElement[] = [];
    let handleHasEventListeners = false;
    let container: HTMLElement | null = null;

    let offestX = 0;
    let offsetY = 0;
    let mouseX = 0;
    let mouseY = 0;
    let isMouseOverHandle = false;
    let draggable = true;
    $: draggable = !handles.length || isMouseOverHandle;

    function handleHandlerEnter() {
        isMouseOverHandle = true;
    }
    function handleHandlerExit() {
        isMouseOverHandle = false;
    }
    function getNewOffset(e: DragEvent) {
        const x = offestX + e.x - mouseX;
        const y = offsetY + e.y - mouseY;
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
        offestX = x;
        offsetY = y;
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
        if (!handles.length) return;
        handles.forEach((handle) => {
            handle.addEventListener("mouseover", handleHandlerEnter);
            handle.addEventListener("mouseleave", handleHandlerExit);
            handle.style.cursor = "grab";
        });
        container!.style.cursor = "auto";
        handleHasEventListeners = true;
    }
    function removeHandleListener() {
        if (!handles.length) return;
        handles.forEach((handle) => {
            handle.removeEventListener("mouseover", handleHandlerEnter);
            handle.removeEventListener("mouseleave", handleHandlerExit);
            handle.style.cursor = "auto";
        });
        container!.style.cursor = "grab";
        handleHasEventListeners = false;
    }

    onMount(() => {
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("touchmove", handleTouchMove);
        if (handles.length) addHandleListener();
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
