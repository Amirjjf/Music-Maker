// I have used some help and sueggstions from the AI in this code


const samples = []
let micRecorder;
let micStream;

samples.push({src: "audio/bass.mp3", name: "Bass"})
samples.push({src: "audio/bass2.mp3", name: "Bass-2"})
samples.push({src: "audio/bass3.mp3", name: "Bass-3"})
samples.push({src: "audio/drum.mp3", name: "Drum"})
samples.push({src: "audio/drum2.mp3", name: "Drum-2"})
samples.push({src: "audio/drum3.mp3", name: "Drum-3"})
samples.push({src: "audio/piano.mp3", name: "Piano"})
samples.push({src: "audio/silence.mp3", name: "Silence"})
samples.push({src: "audio/strange-beat.mp3", name: "Strange"})
samples.push({src: "audio/violin.mp3", name: "Violin"})
samples.push({src: "audio/violin2.mp3", name: "Violin-2"})


let sampleDurations = [];

samples.forEach((sample, index) => {
    let audioElement = new Audio(sample.src);
    audioElement.addEventListener("loadedmetadata", function() {
        sampleDurations[index] = audioElement.duration;
    });
});


// 2D array of tracks – so one track can have multiple samples in a row
let tracks = []
tracks.push([])
tracks.push([])
tracks.push([])
tracks.push([])


// Let's add these tracks to HTML page, so that user can see them
let tracksDiv = document.getElementById("tracks");

for(let i = 0; i < tracks.length; i++) {
    // Create a new div element for the track
    let trackDiv = document.createElement("div");
    trackDiv.setAttribute("id", "trackDiv" + i);
    trackDiv.setAttribute("class", "trackDiv");

    // Create a new div element for the track items
    let trackItemsContainer = document.createElement("div");
    trackItemsContainer.setAttribute("id", "trackItemsContainer" + i);
    trackItemsContainer.setAttribute("class", "trackItemsContainer");

    // Create a new h2 element for the track header
    let trackDivHeader = document.createElement("h2");
    trackDivHeader.innerText = "Track " + (i + 1);
    trackDivHeader.setAttribute("class", "trackHeader");
    
    // Create a new input element for volume control (New Part)
    let volumeInput = document.createElement("input");
    volumeInput.setAttribute("type", "range");
    volumeInput.setAttribute("class", "trackVolume");
    volumeInput.setAttribute("min", "0");
    volumeInput.setAttribute("max", "1");
    volumeInput.setAttribute("step", "0.1");
    volumeInput.setAttribute("value", "1");

    let runOnceButton = document.createElement("button");
    runOnceButton.innerHTML = '<i class="fa-solid fa-repeat"></i>';
    runOnceButton.setAttribute("class", "runOnceButton");
    runOnceButton.addEventListener("click", function() {
        this.classList.toggle("active");
    });


    // Create a new button element for deleting the track
    let deleteTrackButton = document.createElement("button");
    deleteTrackButton.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    deleteTrackButton.setAttribute("class", "deleteTrackButton");
    deleteTrackButton.addEventListener("click", function() {
        // Remove from UI
        trackDiv.remove();

        // Remove from tracks and audioElements arrays
        tracks.splice(i, 1);
        audioElements.splice(i, 1);
    });

    // Append the delete button to the track div
    trackDiv.appendChild(deleteTrackButton);
    trackDiv.appendChild(runOnceButton);

    // Append the elements to the track div
    trackDiv.appendChild(volumeInput);
    trackDiv.appendChild(trackDivHeader);
    trackDiv.appendChild(trackItemsContainer);


    // Append the track div to the main tracks div
    tracksDiv.appendChild(trackDiv);

    // Initialize SortableJS on inner container
    new Sortable(trackItemsContainer, {
        group: 'shared',
        animation: 1500,
        onAdd(evt) {
            const sampleNumber = evt.item.getAttribute('data-id');
            // Add the sample to the track
            addSampleToTrack(sampleNumber, i);
            // Remove the dragged element from the DOM
            evt.item.parentNode.removeChild(evt.item);
        },
    });
}



// Create a map to hold buttons for each category
const categoryMap = new Map();


let id = 0;
samples.forEach((sample, index) => {
    let newButton = document.createElement("button");
    newButton.setAttribute("data-id", id++);
    newButton.innerText = sample.name;
    newButton.className = "btn btn-dark btn-lg m-2";

    // Add a delete button to the sample
    let deleteSampleButton = document.createElement("button");
    deleteSampleButton.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    deleteSampleButton.setAttribute("class", "deleteSampleButton");
    deleteSampleButton.addEventListener("click", function() {
        // Remove the sample button from UI
        newButton.remove();
        
        // Remove the sample from samples array
        samples.splice(index, 1);
    });

    // Append the delete button to the newButton
    newButton.appendChild(deleteSampleButton);

    const category = sample.name.split("-")[0];
    if (!categoryMap.has(category)) {
        categoryMap.set(category, []);
    }
    categoryMap.get(category).push(newButton);
});


// Add category headers and buttons to addButtons
categoryMap.forEach((buttons, category) => {
    // Create a new div for holding each category
    let categoryContainer = document.createElement("div");
    categoryContainer.className = "categoryContainer"; 

    // Add category header
    const categoryHeader = document.createElement("h1");
    categoryHeader.innerText = category;
    categoryHeader.className = "category";  
    categoryContainer.appendChild(categoryHeader); 

    // Create a new div for holding buttons under this category
    let buttonsContainer = document.createElement("div");
    buttonsContainer.className = "buttonsContainer"; 

    buttons.forEach(button => buttonsContainer.appendChild(button));
    

    categoryContainer.appendChild(buttonsContainer);

  
    addButtons.appendChild(categoryContainer);

    // Initialize SortableJS on buttonsContainer
    new Sortable(buttonsContainer, {
        group: {
            name: 'shared',
            pull: 'clone',
            put: false
        },
        animation: 1500,
    });
});



new Sortable(addButtons, {
    group: {
        name: 'shared',
        pull: 'clone',  
        put: false  
    },   
    animation: 1500,

    onEnd(evt) {
        const sampleNumber = evt.item.getAttribute('data-id');
    },
});


// 2D array to hold Audio objects for each track
let audioElements = [];
for (let i = 0; i < tracks.length; i++) {
    audioElements.push([]);
}


// By pressing the sample button the sample is added to the tracks array and to the track div
function addSample(addButton) {
    const sampleNumber = addButton.dataset.id
    const trackNumber = document.querySelector("input[name='track']:checked").value

    //console.log("Sample number: " + sampleNumber)
    //console.log("Track number: " + trackNumber)

    tracks[trackNumber].push(samples[sampleNumber])

    let trackDiv = document.getElementById("trackDiv" + trackNumber)
    let newItem = document.createElement("div")
    newItem.innerText = samples[sampleNumber].name

    let audioElement = new Audio(samples[sampleNumber].src);
    audioElements[trackNumber].push(audioElement);

    let volumeInput = document.createElement("input");
    volumeInput.type = "range";
    volumeInput.min = "0";
    volumeInput.max = "1";
    volumeInput.step = "0.1";
    volumeInput.value = "1";
    volumeInput.addEventListener('input', function() {
        audioElement.volume = this.value;  // Use audioElement here
    });
    newItem.appendChild(volumeInput);

    trackDiv.appendChild(newItem)
}



const playButton = document.getElementById("play");
playButton.addEventListener("click", () => {
    if (audioContext.state === 'suspended') {
        audioContext.resume().then(() => {
            console.log("AudioContext resumed successfully");
        });
    }

    if (!mediaRecorder) {
        console.error("MediaRecorder not initialized");
        return;
    }
    mediaRecorder.start();
    console.log(mediaRecorder.state);
    playSong();
});



// Song is played so that each track is started simultaneously 
function playSong() {
    let i = 0;
    tracks.forEach((track) => {
        if(track.length > 0) {
            playTrack(track, i, audioElements[i]);
        }
        i++;
    })
}

// Track is looped – that means it is restarted each time its samples are playd through
function playTrack(track, trackNumber, audioElements) {
    console.log('Debug: audioElements array', audioElements); 

    let audio = audioElements.shift();  // Use and remove the first Audio element from the list
    connectAudioElementToStream(audio, audioContext, mediaStream); 
    audioElements.push(audio);  // Put it back at the end, making the list a circular queue

    let runOnceButton = document.querySelector(`#trackDiv${trackNumber} .runOnceButton`);
    let shouldRunOnce = runOnceButton.classList.contains("active");

    let i = 0;
    audio.addEventListener("ended", () => {
        if (shouldRunOnce && i === track.length - 1) {
            return;
        }
        i = ++i < track.length ? i : 0;
        audio.src = track[i].src;
        audio.play();
        //console.log("Starting: Track " + trackNumber + ", instrument " + track[i].name);
    }, true );


    // Set volume from corresponding input
    const volumeInput = document.querySelector(`input[type="range"][class="trackVolume"]:nth-child(${trackNumber + 1})`);
    if (volumeInput) {
        audio.volume = volumeInput.value;
    }

    audio.loop = false;
    audio.src = track[0].src;
    audio.play();
    //console.log("Starting: Track " + trackNumber + ", instrument " + track[i].name);
}

// There is a upload button that adds a sample to samples array and a sample button with an event listener
const uploadButton = document.getElementById("upload");
uploadButton.addEventListener("click", () => {
    const file = document.getElementById("input-sample").files[0];
    if (!file) return;

    let audioSrc = URL.createObjectURL(file);
    
    // Create a new Audio object to load the file and retrieve its duration
    let audioElement = new Audio(audioSrc);
    audioElement.addEventListener("loadedmetadata", function() {
        let duration = audioElement.duration;

        // Update longestSampleDuration if this sample is longer
        updateLongestSampleDuration(duration);

        // Create a new sample object with the duration
        let sample = { src: audioSrc, name: window.prompt("Give a name for the sample", "New Sample"), duration: duration };
        
        samples.push(sample);
        let newId = samples.length - 1; // Store the index for this new sample

        // Update sampleDurations array
        sampleDurations[newId] = duration;

        // Create a new sample button
        let newButton = document.createElement("button");
        newButton.setAttribute("data-id", newId);
        newButton.className = "btn btn-dark btn-lg m-2";

        // Create and append a delete button to the new sample button
        let deleteSampleButton = document.createElement("button");
        deleteSampleButton.innerHTML = '<i class="fa-solid fa-xmark"></i>';
        deleteSampleButton.setAttribute("class", "deleteSampleButton");
        deleteSampleButton.addEventListener("click", function() {
            // Remove the sample button from the UI
            newButton.remove();
            
            // Remove the sample from the samples array
            samples.splice(newId, 1);
            
        });

        // Append the delete button to the new sample button
        newButton.appendChild(deleteSampleButton);

        // Finally, set the text for the new sample button
        newButton.append(document.createTextNode(sample.name));

        // Add the new sample button to the UI
        addButtons.appendChild(newButton);
    });
});


// Volume control logic
document.querySelectorAll('.trackVolume').forEach((volumeInput, index) => {
    volumeInput.addEventListener('input', function() {
        const volume = this.value;
        audioElements[index].forEach(audio => {
            audio.volume = volume;
        });
    });
});


let audioContext = new (window.AudioContext || window.webkitAudioContext)(); 
let mediaStream;
let mediaRecorder = initializeMediaRecorder();

function initializeMediaRecorder() {
    mediaStream = audioContext.createMediaStreamDestination();
    if (typeof MediaRecorder === 'undefined' || !MediaRecorder.isTypeSupported('audio/webm')) {
        console.error('MediaRecorder is not supported on this browser.');
        return null;
        }

    let mediaRecorder = new MediaRecorder(mediaStream.stream);
    let audioChunks = [];

    mediaRecorder.ondataavailable = event => {
        audioChunks.push(event.data);
    };

    mediaRecorder.onstop = () => {
        let audioBlob = new Blob(audioChunks, {type: "audio/wav"});
        let audioUrl = URL.createObjectURL(audioBlob);
        createDownloadLink(audioUrl);  
    };

    return mediaRecorder;
}

// Function to create a download link
function createDownloadLink(audioUrl) {
    let downloadLink = document.createElement("a");
    downloadLink.href = audioUrl;
    downloadLink.download = "final_song.wav";
    downloadLink.innerHTML = "Download Song";
    
    // Append to the 'controls' div if it exists
    let controlsDiv = document.getElementById("download");
    if (controlsDiv) {
      controlsDiv.appendChild(downloadLink);
    } else {
      console.error("Controls div not found.");
    }
  }


// Function to connect Audio Element to Stream
function connectAudioElementToStream(audioElement, audioContext, mediaStream) {
    console.log('Debug: audioElement before createMediaElementSource', audioElement);
    if (!audioElement) {
        console.error("audioElement is null or undefined.");
        return;
    }
    if (!(audioElement instanceof HTMLMediaElement)) {
        console.error("The provided object is not an HTMLMediaElement.");
        return;
    }
    const source = audioContext.createMediaElementSource(audioElement);
    source.connect(mediaStream);
    source.connect(audioContext.destination);
}



function connectAudioElementToStream(audioElement, audioContext, mediaStream) {
    const source = audioContext.createMediaElementSource(audioElement);
    source.connect(mediaStream);
    source.connect(audioContext.destination);  // connect to output as well
}



function updateTrackLength(trackNumber) {
    // Assume `trackLengths` is an array storing the lengths of all tracks
    // Assume `trackDurations` is an array storing the duration of each sample
    let totalLength = tracks[trackNumber].reduce((acc, sample) => acc + trackDurations[sample.src], 0);
    trackLengths[trackNumber] = totalLength;
    console.log(`Track ${trackNumber} length: ${totalLength}`);
}

let longestSampleDuration = 34.951837;

function updateLongestSampleDuration(newDuration) {
    if (newDuration > longestSampleDuration) {
        longestSampleDuration = newDuration;
    }
    console.log("Longest Sample Duration:", longestSampleDuration); 
}



function addSampleToTrack(sampleNumber, trackNumber) {

    tracks[trackNumber].push(samples[sampleNumber]);

    console.log('Debug: Sample source', samples[sampleNumber].src); 
    let trackDiv = document.getElementById("trackDiv" + trackNumber);
    let newItem = document.createElement("div");
    let tracktext = document.createElement("h4");
    newItem.className = "sampleintrack";
    if (samples[sampleNumber]) {
        tracktext.innerText = samples[sampleNumber].name;

    } else {
        console.error(`Sample with index ${sampleNumber} not found`);
    }

    
    let duration = sampleDurations[sampleNumber]; 

    if (duration && longestSampleDuration) {
        let percentage = (duration / longestSampleDuration) * 100;
        newItem.style.setProperty('--hover-width', `${percentage}%`);
    }

    //console.log('Sample Number:', sampleNumber);
    //console.log('Samples Array:', samples);

    let audioElement = new Audio(samples[sampleNumber].src);
    audioElements[trackNumber].push(audioElement);

    let volumeInput = document.createElement("input");
    volumeInput.type = "range";
    volumeInput.min = "0";
    volumeInput.max = "1";
    volumeInput.step = "0.1";
    volumeInput.value = "1";
    volumeInput.addEventListener('input', function() {
        audioElement.volume = this.value;
    });

    let deleteButton = document.createElement("button");
    deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
    deleteButton.setAttribute("class", "deleteButton");
    deleteButton.addEventListener("click", function() {
        newItem.remove();
        
        // Remove from tracks array
        const index = tracks[trackNumber].indexOf(samples[sampleNumber]);
        if (index > -1) {
            tracks[trackNumber].splice(index, 1);
        }
        
        // Remove from audioElements array
        audioElements[trackNumber].splice(index, 1);
    });
    
    // Add Delete Button to newItem
    newItem.appendChild(deleteButton);

    newItem.appendChild(tracktext);
    
    newItem.appendChild(volumeInput);

    trackDiv.appendChild(newItem);

}



function stopAllTracks(audioElements) {
    audioElements.forEach(track => {
        track.forEach(audio => {
            audio.pause();
            audio.currentTime = 0;
        });
    });
}

// Attach an event listener to the "Stop" button
const stopButton = document.getElementById("stop");
stopButton.addEventListener("click", () => {
    mediaRecorder.stop();
    stopAllTracks(audioElements);
    reinitializeAudioElements();
});

function reinitializeAudioElements() {
    audioElements = [];
    for (let i = 0; i < tracks.length; i++) {
        audioElements.push([]);
    }
    // Re-populate audioElements based on tracks
    for (let i = 0; i < tracks.length; i++) {
        for (let j = 0; j < tracks[i].length; j++) {
            let audioElement = new Audio(tracks[i][j].src);
            audioElements[i].push(audioElement);
        }
    }
}




// Request access to the microphone
navigator.mediaDevices.getUserMedia({ audio: true })
  .then(stream => {
    micStream = stream;
  })
  .catch(err => {
    console.error('Microphone access denied:', err);
  });


  document.getElementById('startRecording').addEventListener('click', () => {
    let chunks = [];
    let micRecorder = new MediaRecorder(micStream);
  
    micRecorder.ondataavailable = e => chunks.push(e.data);
    micRecorder.onstop = e => {
      let blob = new Blob(chunks, { 'type': 'audio/wav; codecs=0' });
      addMicSample(blob);
    };
  
    micRecorder.start();
    
    document.getElementById('stopRecording').addEventListener('click', () => {
        if (micRecorder && micRecorder.state === 'recording') {
            micRecorder.stop();
        }
    });
    //setTimeout(() => micRecorder.stop(), 5000);
  });



  
  function addMicSample(blob) {
    // Create an object URL for the blob
    let audioSrc = URL.createObjectURL(blob);

    // Create a new sample object
    let newSample = { src: audioSrc, name: 'Mic Sample' };
    
    // Add new sample to samples array
    samples.push(newSample);

    // Update sampleDurations array
    let audioElement = new Audio(audioSrc);
    audioElement.addEventListener("loadedmetadata", function() {
        let duration = audioElement.duration;
        sampleDurations.push(duration);
    });

    // Create a new sample button
    let newId = samples.length - 1; // The index of the new sample
    let newButton = document.createElement("button");
    newButton.setAttribute("data-id", newId);
    newButton.className = "btn btn-dark btn-lg m-2";
    newButton.innerText = newSample.name;

    // Create and append a delete button to the new sample button
    let deleteSampleButton = document.createElement("button");
    deleteSampleButton.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    deleteSampleButton.setAttribute("class", "deleteSampleButton");
    deleteSampleButton.addEventListener("click", function() {
        // Remove the sample button from the UI
        newButton.remove();

        // Remove the sample from the samples array
        samples.splice(newId, 1);

    });

    
    // Append the delete button to the new sample button
    newButton.appendChild(deleteSampleButton);

    // Add the new sample button to the UI
    let addButtons = document.getElementById("addButtons"); // Assuming 'addButtons' is the ID where buttons should be added
    if(addButtons) {
        addButtons.appendChild(newButton);
    } else {
        console.error("Add buttons container not found.");
    }
}





