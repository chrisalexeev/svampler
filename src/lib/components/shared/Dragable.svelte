<script lang="ts">
    /**
     * There's probably a better way to do 
     * this whole component but ¯\_(ツ)_/¯
    */
    import { beforeUpdate, onDestroy, onMount } from "svelte";

    export let handles: (HTMLElement | null)[] = [];
    export let antiHandles: (HTMLElement | null)[] = [];
    let handles_: HTMLElement[] = [];
    let antiHandles_: HTMLElement[] = [];
    $: handles_ = handles.filter((h) => !!h) as HTMLElement[];
    $: antiHandles_ = antiHandles.filter((h) => !!h) as HTMLElement[];

    let handleHasEventListeners = false;
    let antiHandleHasEventListeners = false;
    let container: HTMLElement | null = null;
    let crt: Node | null = null;

    let offestX = 0;
    let offsetY = 0;
    let mouseX = 0;
    let mouseY = 0;
    let isMouseOverHandle = false;
    let isMouseOverAntiHandle = false;
    let draggable = true;
    $: draggable =
        !isMouseOverAntiHandle && (!handles_.length || isMouseOverHandle);

    function handleHandlerEnter() {
        isMouseOverHandle = true;
    }
    function handleHandlerExit() {
        isMouseOverHandle = false;
    }
    function handleAntiHandlerEnter() {
        isMouseOverAntiHandle = true;
    }
    function handleAntiHandlerExit() {
        isMouseOverAntiHandle = false;
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
        document.body.removeChild(crt!);
    }
    function handleDragStart(e: DragEvent) {
        crt = (e.target! as HTMLElement).cloneNode(true);
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
    function addAntiHandleListeners() {
        if (!antiHandles_.length) return;
        antiHandles_.forEach((handle) => {
            handle.addEventListener("mouseover", handleAntiHandlerEnter);
            handle.addEventListener("mouseleave", handleAntiHandlerExit);
            handle.style.cursor = "pointer";
        });
        antiHandleHasEventListeners = true;
    }
    function removeAntiHandleListeners() {
        if (!antiHandles_.length) return;
        antiHandles_.forEach((handle) => {
            handle.removeEventListener("mouseover", handleAntiHandlerEnter);
            handle.removeEventListener("mouseleave", handleAntiHandlerExit);
            handle.style.cursor = "pointer";
        });
        antiHandleHasEventListeners = false;
    }
    function addHandleListeners() {
        if (!handles_.length) return;
        handles_.forEach((handle) => {
            handle.addEventListener("mouseover", handleHandlerEnter);
            handle.addEventListener("mouseleave", handleHandlerExit);
            handle.style.cursor = "grab";
        });
        container!.style.cursor = "auto";
        handleHasEventListeners = true;
    }
    function removeHandleListeners() {
        if (!handles_.length) return;
        handles_.forEach((handle) => {
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
        if (handles_.length) addHandleListeners();
        if (antiHandles_.length) addAntiHandleListeners();
    });

    beforeUpdate(() => {
        if (!handleHasEventListeners) {
            removeHandleListeners();
            addHandleListeners();
        }
        if (!antiHandleHasEventListeners) {
            removeAntiHandleListeners();
            addAntiHandleListeners();
        }
    });

    onDestroy(() => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("touchmove", handleTouchMove);
        if (handleHasEventListeners) removeHandleListeners();
        if (antiHandles_.length) removeAntiHandleListeners();
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