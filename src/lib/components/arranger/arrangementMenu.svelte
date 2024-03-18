<script lang="ts">
    import { instrumentBank } from "$lib/lab";
    import { Arrangement as Arrangement_ } from "$lib/lab/arranger";

    export let menuOptions: { arrangement: Arrangement_ };
    let arrangement = menuOptions.arrangement;
    let connectedInstruments: string[] = [];

    function connectInstrument() {
        const instrument = instrumentBank.getInstruments()[0];
        arrangement.connectInstrument(instrument);
        connectedInstruments = [...connectedInstruments, instrument.name]
    }
</script>

<div>
    <button on:click={connectInstrument}>Connect Instrument</button>
    <div>
        {#each connectedInstruments as inst}
            <h3>{inst}</h3>
        {/each}
    </div>
</div>

