class Staff {
    constructor(note_name, octave, dom_id) {
        this.note_name = note_name;
        this.octave = octave;
        this.dom_id = dom_id;
    }

    updateNote(note_name, octave) {
        this.note_name = note_name;
        this.octave = octave;
        this.draw();
    }

    draw() {
        const VF = Vex.Flow;
        const div = document.getElementById(this.dom_id);

        // Clear the div to start fresh
        div.innerHTML = '';

        const noteObj = Tonal.Note.get(this.note_name + this.octave);
        const clef = (noteObj.oct < 4) ? "bass" : "treble";

        // Set up renderer and context again
        const renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);
        renderer.resize(360, 350);
        const context = renderer.getContext();
        context.setFont("Arial", 10, "").setBackgroundFillStyle("#eed");

        // Draw the stave
        const stave = new VF.Stave(10, 80, 400);
        stave.addClef(clef).setContext(context).draw();

        // Extract base note without accidental
        const baseNote = noteObj.pc[0].toLowerCase(); // e.g. "e" from "Eb"
        
        const singleNote = new VF.StaveNote({
            clef: clef,
            keys: [baseNote + "/" + noteObj.oct], // "e/4"
            duration: "w",
        });

        // Add accidental if needed
        if (noteObj.acc === '#') {
            singleNote.addModifier(new VF.Accidental('#'), 0);
        } else if (noteObj.acc === 'b') {
            singleNote.addModifier(new VF.Accidental('b'), 0);
        }

        // Create and format the voice
        const voice = new VF.Voice({ num_beats: 4, beat_value: 4 }).addTickables([singleNote]);
        new VF.Formatter().joinVoices([voice]).format([voice], 300);

        // Render the voice
        voice.draw(context, stave);
    }
}


class NotePicker {
    constructor(id, staffid, noteAnswer, octaveAnswer) {
        this.note_name = 'C'
        this.octave = '4'
        this.dom_id = id
        // console.log(this.note_name)
        document.getElementById(this.dom_id).innerHTML = this.make_core_html_with_id()
        this.bind_listeners()
        this.staff = new Staff(this.note_name, this.octave, staffid)
        this.staff.draw()

    }

    make_core_html_with_id() {
        var html = `
            <select id="${this.dom_id}_note">
                <option value="C">C</option>
                <option value="C#">C#</option>
                <option value="Db">Db</option>
                <option value="D">D</option>
                <option value="D#">D#</option>
                <option value="Eb">Eb</option>
                <option value="E">E</option>
                <option value="F">F</option>
                <option value="F#">F#</option>
                <option value="Gb">Gb</option>
                <option value="G">G</option>
                <option value="G#">G#</option>
                <option value="Ab">Ab</option>
                <option value="A">A</option>
                <option value="A#">A#</option>
                <option value="Bb">Bb</option>
                <option value="B">B</option>
            </select>
            <select id="${this.dom_id}_octave">
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4" selected>4</option>
                <option value="5">5</option>
                <option value="6">6</option>
            </select>
            <div id="${this.dom_id}_staff"></div>`;
        return html;
    }
    


    // Define the handler method
    handleNoteChange(event) {
        this.note_name = event.target.value; // Update the instance's note_name property
        this.staff.updateNote(this.note_name, this.octave)
        console.log(`Selected note: ${this.note_name}`);
        console.log(`Selected octave: ${this.octave}`);
    }

    handleOctaveChange(event) {
        this.octave = event.target.value; // Update the instance's octave property
        this.staff.updateNote(this.note_name, this.octave)
        console.log(`Selected note: ${this.note_name}`);
        console.log(`Selected octave: ${this.octave}`);
    }

    bind_listeners() {
        // Listener on note name
        const noteSelect = document.getElementById(`${this.dom_id}_note`);
        noteSelect.addEventListener('change', this.handleNoteChange.bind(this));

        // Listener on octave
        const octaveSelect = document.getElementById(`${this.dom_id}_octave`);
        octaveSelect.addEventListener('change', this.handleOctaveChange.bind(this));
    }


    check_note(){

    }

}



