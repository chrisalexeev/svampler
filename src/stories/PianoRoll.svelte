<script lang="ts">
  import { onMount } from "svelte";
  import { Note } from "$lib/lab/arranger";

  let canvas: HTMLCanvasElement;
  let container: HTMLDivElement;
  let ctx: CanvasRenderingContext2D;
  let notes = new Array<Note>(5).fill(new Note(0, 0, 0, 0)).map((_, i) => {
    const n = new Note(0, 0, 0, 0);
    n.value = i;
    n.start = i * 0.1;
    n.end = n.start + 0.1;
    return n;
  });
  let subdivision = 8;
  const padding = 2;
  let pitchHeight = 0;
  let mouseX = 0;
  let mouseY = 0;
  let offsetX = 0;
  let offsetY = 0;
  let clickX = 0;
  let clickY = 0;
  let mouseDown = false;
  let selectedNoteIndex: number | null = null;
  let moveType: number | null = null;

  function getNoteRect(note: Note) {
    const x = note.start * canvas.width;
    const y = note.value * pitchHeight + padding;
    const width = (note.end - note.start) * canvas.width;
    const height = pitchHeight;
    return { x, y, width, height };
  }

  function drawPianoRoll() {
    for (let i = 0; i < 127; i++) {
      const y = i * pitchHeight + padding;
      const height = pitchHeight - padding;
      // ctx.fillStyle = "black";
      ctx.strokeStyle = "white";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
  }

  function drawNotes() {
    notes.forEach((note) => {
      const { x, y, width, height } = getNoteRect(note);
      ctx.fillStyle = "yellow";
      ctx.beginPath();
      ctx.roundRect(x, y, width, height, 7);
      ctx.fill();
    });
  }

  function drawShit() {
    // ctx.fillStyle = "white";
    // ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawPianoRoll();
  }

  function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function handleMouseMove(e: MouseEvent) {
    mouseX = e.offsetX;
    mouseY = e.offsetY;
    !mouseDown && updateCursor();
    if (selectedNoteIndex === null) {
      return;
    }
    const selectedNote = notes[selectedNoteIndex];
    if (!selectedNote) {
      return;
    }
    if (mouseDown && selectedNote) {
      moveNote(selectedNoteIndex);
      render();
    }
  }

  function moveNote(idx: number) {
    const selectedNote = notes[idx];
    if (!selectedNote) {
      return;
    }
    const dx = (mouseX - clickX - offsetX) / canvas.width;
    const duration = selectedNote.duration;
    
    moveType = moveType ?? getMoveType(mouseX, mouseY, selectedNote);
    if (moveType === -1) {
      selectedNote.start = dx + clickX / canvas.width;

    } else if (moveType === 0) {
      selectedNote.start = dx + clickX / canvas.width;
      selectedNote.end = selectedNote.start + duration;
      selectedNote.value = Math.floor((mouseY - padding) / pitchHeight);
    } else if (moveType === 1) {
      // resize from the end
      selectedNote.end = mouseX / canvas.width;
    }
      
  }

  function getMoveType(x: number, y: number, note: Note) {
    const { x: noteX, y: noteY, width, height } = getNoteRect(note);
    const right = noteX + width;
    const bottom = noteY + height;
    if (mouseY <= noteY || mouseY >= bottom || mouseX <= noteX || mouseX >= right) {
      return null;
    }
    if (Math.abs(x - noteX) < 5) {
      return -1;
    }
    if (Math.abs(x - right) < 5) {
      return 1;
    }
    return 0;
  }

  function handleMouseDown(e: MouseEvent) {
    mouseDown = true;
    clickX = e.offsetX;
    clickY = e.offsetY;
    findSelectedNote();
  }

  function handleMouseUp(e: MouseEvent) {
    mouseDown = false;
    selectedNoteIndex = null;
    moveType = null;
  }

  const handleOnTouchUp = () => {
    mouseDown = false;
    selectedNoteIndex = null;
  };

  function handleOnTouchDown(e: TouchEvent) {
    mouseDown = true;
    clickX = e.touches[0].clientX;
    clickY = e.touches[0].clientY;
    findSelectedNote();
    if (selectedNoteIndex === null) {
      return;
    }
    e.preventDefault();
  }

  function handleOnTouchMove(e: TouchEvent) {
    mouseX = e.touches[0].clientX;
    mouseY = e.touches[0].clientY;
    if (selectedNoteIndex === null) {
      return;
    }
    const selectedNote = notes[selectedNoteIndex];
    if (!selectedNote) {
      return;
    }
    if (mouseDown && selectedNote) {
      moveNote(selectedNoteIndex);
      render();
      e.preventDefault();
    }
  }

  function updateCursor() {
    for (let i = 0; i < notes.length; i++) {
      const note = notes[i];
      moveType = getMoveType(mouseX, mouseY, note);
      // console.log(moveType);
      switch (moveType) {
        case -1:
          canvas.style.cursor = "ew-resize";
          break;
        case 0:
          canvas.style.cursor = "move";
          break;
        case 1:
          canvas.style.cursor = "ew-resize";
          break;
        default:
          canvas.style.cursor = "unset";
          break;
      }
      if (moveType !== null) {
        break;
      }
    }
  }

  function findSelectedNote() {
    for (let i = 0; i < notes.length; i++) {
      const note = notes[i];
      const { x, y, width, height } = getNoteRect(note);
      if (
        clickX >= x &&
        clickX <= x + width &&
        clickY >= y &&
        clickY <= y + height
      ) {
        selectedNoteIndex = i;
        offsetX = clickX - x;
        break;
      }
    }
  }

  function render() {
    clear();
    drawShit();
    drawNotes();
  }

  onMount(() => {
    ctx = canvas.getContext("2d")!;
    if (!ctx) {
      throw new Error("Failed to get canvas context");
    }
    pitchHeight = (canvas.height / 127) * 2;
    clear();
    drawShit();
    drawNotes();
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("touchstart", handleOnTouchDown);
    canvas.addEventListener("touchmove", handleOnTouchMove);
    canvas.addEventListener("touchend", handleOnTouchUp);
    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("touchstart", handleOnTouchDown);
      canvas.removeEventListener("touchmove", handleOnTouchMove);
      canvas.removeEventListener("touchend", handleOnTouchUp);
    };
  });
</script>

<div class="piano-roll" bind:this={container}>
  <canvas bind:this={canvas} width="1800" height="1200" />
</div>

<style>
  .piano-roll {
    width: calc(600px * 1.2);
    height: calc(400px * 1.2);
    background-color: #333;
    overflow: auto;
  }

  canvas {
    /* object-fit: contain; */
    display: block;
  }
</style>
